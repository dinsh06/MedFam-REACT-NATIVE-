import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";

export default function HomeGrid({ handleCall }: { handleCall: () => void }) {
  const router = useRouter();

  return (
    <View style={styles.boxContainer}>
      <View style={styles.grid}>
        {/* First Row */}
        <View style={styles.row}>
          <View style={styles.cell}>
            <TouchableOpacity onPress={handleCall} style={styles.emergencyButton}>
              <View style={styles.iconRow}>
                <Icon name="ambulance" size={40} color="red" />
                <Icon name="phone" size={40} color="red" />
              </View>
              <Text style={styles.iconLabel}>Emergency Call</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dividerVertical} />

          <View style={styles.cell}>
            <TouchableOpacity onPress={() => router.push("/medfamplus")} style={{ alignItems: "center" }}>
              <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                <Icon name="account-star" size={40} color="lightblue" />
                <Icon name="shield-plus" size={40} color="gold" style={{ marginLeft: 5 }} />
              </View>
              <Text style={styles.iconLabel}>MedFam +</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dividerVertical} />

          <View style={styles.cell}>
            <TouchableOpacity onPress={() => router.push("/products")}>
              <Icon name="pill" size={40} color="green" />
              <Text style={styles.iconLabel}>Medicine</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.dividerHorizontal} />

        {/* Second Row */}
        <View style={styles.row}>
          <View style={styles.cell}>
            <Icon name="account-plus-outline" size={40} color="black" />
            <Text style={styles.iconLabel}>Add User</Text>
          </View>

          <View style={styles.dividerVertical} />

          <TouchableOpacity style={styles.cell} onPress={() => router.push("/templates")}>
            <Icon name="account-group-outline" size={40} color="black" />
            <Text style={styles.iconLabel}>Templates</Text>
          </TouchableOpacity>

          <View style={styles.dividerVertical} />

          <View style={styles.cell}>
            <Icon name="account-minus-outline" size={40} color="black" />
            <Text style={styles.iconLabel}>Remove User</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const dividerColor = "f4a261";

const styles = StyleSheet.create({
  boxContainer: {
    backgroundColor: "#f4a261",
    padding: wp("5%"),
    borderRadius: 10,
    width: wp("87.5%"),
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  grid: {
    width: wp("80%"),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  cell: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: hp("10%"),
    backgroundColor: "#F79393",
    borderRadius: 10,
    marginHorizontal: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
  },
  dividerVertical: {
    width: 3,
    height: "70%",
    backgroundColor: dividerColor,
    borderRadius: 50,
    marginHorizontal: 2,
  },
  dividerHorizontal: {
    height: 3,
    width: "100%",
    backgroundColor: dividerColor,
    marginVertical: 5,
    borderRadius: 50,
  },
  iconLabel: {
    fontSize: wp("3%"),
    color: "black",
    textAlign: "center",
    marginTop: hp("0.5%"),
  },
  emergencyButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
});
