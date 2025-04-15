import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { WebView } from "react-native-webview";

export default function TemplateDetail() {
  const { id } = useLocalSearchParams();
  const [template, setTemplate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [razorpayOrder, setRazorpayOrder] = useState<any>(null);
  const [showWebView, setShowWebView] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const token = await SecureStore.getItemAsync("jwt");

        const response = await fetch("https://medfam-oyag.onrender.com/templates", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const data = await response.json();

        if (data.success && Array.isArray(data.templates)) {
          const found = data.templates.find(
            (t: any) => t.tempname.toLowerCase() === id?.toString().toLowerCase()
          );

          if (found) {
            setTemplate(found);
          } else {
            Alert.alert("Not found", `No template found with name "${id}"`);
          }
        } else {
          Alert.alert("Error", data.message || "Failed to fetch templates");
        }
      } catch (error) {
        console.error("Error fetching templates:", error);
        Alert.alert("Error", "Failed to fetch templates.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTemplates();
  }, [id]);

  const total = template?.medicines?.reduce(
    (sum: number, m: any) => sum + m.price * m.quantity,
    0
  );

  const handlePayment = async () => {
    try {
      const token = await SecureStore.getItemAsync("jwt");
      if (!token) throw new Error("No token found");

      const response = await fetch("https://medfam-oyag.onrender.com/create-order", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartItems: template.medicines,
          totalPrice: total,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to create Razorpay order");

      setRazorpayOrder(data.order);
      setShowWebView(true);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#000" />;
  }

  if (!template) {
    return <Text style={{ padding: 20 }}>Template not found.</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>{template.tempname}</Text>

        <Text style={styles.text}><Text style={{ fontWeight: "bold" }}>Name: </Text>{template.Name}</Text>
        <Text style={styles.text}><Text style={{ fontWeight: "bold" }}>Address: </Text>{template.Address}</Text>
        <Text style={styles.text}><Text style={{ fontWeight: "bold" }}>Phone: </Text>{template.Phone}</Text>
        <Text style={styles.text}><Text style={{ fontWeight: "bold" }}>Email: </Text>{template.mail}</Text>

        <Text style={[styles.text, { fontWeight: "bold" }]}>Medicines:</Text>
        {template.medicines.map((m: any, index: number) => (
          <View key={index} style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
            <Text style={styles.text}>{index + 1}. {m.name} x{m.quantity}</Text>
            <Text style={styles.text}><Text style={{ fontWeight: "bold" }}>₹{m.price * m.quantity}</Text></Text>
          </View>
        ))}

        <Text style={[styles.text, { fontWeight: "bold", marginTop: 10, alignSelf: "flex-end" }]}>
          Total: ₹{total}
        </Text>

        <TouchableOpacity style={styles.buyButton} onPress={handlePayment}>
          <View style={styles.buttonContent}>
            <Text style={styles.buyButtonText}>Pay</Text>
            <Text style={styles.buyButtonText}> ₹{total}</Text>
            <Icon name="wallet" size={24} color="#fff" style={{ marginLeft: 8 }} />
          </View>
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
                        description: "Template Payment",
                        order_id: "${razorpayOrder.id}",
                        handler: function (response) {
                          window.ReactNativeWebView.postMessage("success");
                        },
                        modal: {
                          ondismiss: function () {
                            window.ReactNativeWebView.postMessage("cancel");
                          }
                        },
                        prefill: {
                          name: "User",
                          email: "user@example.com",
                          contact: "9999999999"
                        },
                        theme: {
                          color: "#00B894"
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
                router.replace('/'); // Navigate to home or thank you page
              } else if (event.nativeEvent.data === 'cancel') {
                Alert.alert('Cancelled', 'Payment Cancelled.');
                setShowWebView(false);
              }
            }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#DEDEBB",
    flex: 1,
    alignItems: "center",
  },
  formContainer: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 12,
    elevation: 6,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 12,
    alignSelf: "center",
    color: "#F79393",
  },
  text: {
    fontSize: 16,
    marginBottom: 6,
    color: "#333",
  },
  buyButton: {
    backgroundColor: "#00B894",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    alignSelf: "center",
    marginTop: 24,
    flexDirection: "row",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buyButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
