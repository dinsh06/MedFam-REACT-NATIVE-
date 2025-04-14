import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { WebView } from 'react-native-webview';
import { useRouter } from 'expo-router';
import { Picker } from '@react-native-picker/picker';

interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}

interface AddressWithFormatted extends Address {
  formattedAddress: string;
}

const CheckoutPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<AddressWithFormatted[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<AddressWithFormatted | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [razorpayOrder, setRazorpayOrder] = useState<any>(null);
  const [showWebView, setShowWebView] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchCheckoutData = async () => {
      try {
        const token = await SecureStore.getItemAsync('jwt');
        if (!token) {
          router.replace('/login');
          return;
        }

        const cartResponse = await fetch('https://medfam-oyag.onrender.com/cart', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const addressResponse = await fetch('https://medfam-oyag.onrender.com/user/address', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!cartResponse.ok || !addressResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const cartData = await cartResponse.json();
        const addressData = await addressResponse.json();

        setCartItems(cartData.cart);
        setAddresses(addressData.addresses);
      } catch (error: any) {
        setError(error.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchCheckoutData();
  }, []);

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      Alert.alert('Select an address first');
      return;
    }

    try {
      const token = await SecureStore.getItemAsync('jwt');
      if (!token) throw new Error('No token');

      setLoading(true);

      const response = await fetch('https://medfam-oyag.onrender.com/create-order', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartItems,
          totalPrice,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to create order');

      setRazorpayOrder(data.order);
      setLoading(false);
      setShowWebView(true);
    } catch (err: any) {
      setLoading(false);
      Alert.alert('Error', err.message || 'Order failed');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text>Loading Checkout...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Checkout</Text>

          {cartItems.map((item) => (
            <View style={styles.itemContainer} key={item._id}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDetail}>Quantity: {item.quantity}</Text>
              <Text style={styles.itemDetail}>Price: ₹{item.price}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.bottomContainer}>
          <Text style={styles.sectionTitle}>Shipping Address</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedAddress?.formattedAddress}
              onValueChange={(itemValue) => {
                const selected = addresses.find((addr) => addr.formattedAddress === itemValue);
                setSelectedAddress(selected);
              }}
              style={styles.picker}
            >
              {addresses.map((addr) => (
                <Picker.Item
                  key={addr.formattedAddress}
                  label={addr.formattedAddress}
                  value={addr.formattedAddress}
                />
              ))}
            </Picker>
          </View>

          <Text style={styles.sectionTitle}>Total: ₹{totalPrice.toFixed(2)}</Text>

          <TouchableOpacity onPress={handlePlaceOrder} style={styles.buttonContainer}>
            <Text style={styles.buttonText}>Place Order</Text>
          </TouchableOpacity>
        </View>

        {showWebView && razorpayOrder && (
          <View style={{ flex: 1, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
            <WebView
              originWhitelist={['*']}
              javaScriptEnabled
              domStorageEnabled
              startInLoadingState
              source={{
                html: `
                <!DOCTYPE html>
                <html>
                  <head>
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
                    <style>
                      html, body {
                        height: 100%;
                        margin: 0;
                        padding: 0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        background: white;
                      }
                    </style>
                  </head>
                  <body>
                    <script>
                      setTimeout(function() {
                        var options = {
                          key: "rzp_test_RTT67mmolf8Qca",
                          amount: "${razorpayOrder.amount}",
                          currency: "INR",
                          name: "MedFam",
                          description: "Order Payment",
                          order_id: "${razorpayOrder.id}",
                          handler: function (response) {
                            window.ReactNativeWebView.postMessage("success");
                          },
                          external: true,
                          modal: {
                            ondismiss: function () {
                              window.ReactNativeWebView.postMessage("cancel");
                            }
                          },
                          prefill: {
                            name: "Dinesh",
                            email: "dineshwaran236@gmail.com",
                            contact: "8681040528"
                          },
                          theme: {
                            color: "#3399cc"
                          }
                        };
                        var rzp = new Razorpay(options);
                        rzp.open();
                      }, 300);
                    </script>
                  </body>
                </html>
              `,
              }}
              onMessage={(event) => {
                if (event.nativeEvent.data === 'success') {
                  Alert.alert('Success', 'Payment Successful!');
                  setShowWebView(false);
                  router.replace('/');
                } else if (event.nativeEvent.data === 'cancel') {
                  Alert.alert('Cancelled', 'Payment Cancelled.');
                  setShowWebView(false);
                }
              }}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#DEDEBB',
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 0,
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F79393',
    textAlign: 'center',
    marginBottom: 16,
  },
  itemContainer: {
    backgroundColor: '#00B894',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  itemDetail: {
    fontSize: 14,
    color: '#444',
  },
  bottomContainer: {
    backgroundColor: '#f4a261',
    padding: 15,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginTop: 'auto',
  },
  pickerWrapper: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    marginBottom: 8,
  },
  buttonContainer: {
    backgroundColor: '#00B894',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CheckoutPage;
