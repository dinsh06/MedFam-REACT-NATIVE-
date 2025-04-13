import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

const TemplateCard = ({ item }: { item: any }) => {
  const router = useRouter();

  return (
    <TouchableOpacity onPress={() => router.push({ pathname: "/template", params: { id: item.tempname } })}>
      <View style={styles.cardContainer}>
        <Icon name="file-account" size={20} color="white" />
        <View style={styles.center}>
          <Text style={styles.name}>{item.tempname}</Text>
          <View style={styles.ratingRow}>
            {/* You can place stars or other rating icons here */}
          </View>
        </View>

        <View style={styles.right}>
          <View style={styles.videoIcon}>
            <Icon name="eye" size={20} color="#dedebb" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default TemplateCard;

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: "row",
    borderRadius: 20,
    padding: wp("4%"),
    alignItems: "center",
    width: wp("90%"),
    marginVertical: hp("1%"),
    backgroundColor: "#4ed2f0",
    marginRight: wp("2%"),
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  center: {
    flex: 1,
    marginLeft: wp("4%"),
  },
  name: {
    fontSize: wp("4.5%"),
    fontWeight: "bold",
    color: "#fff",
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: hp("0.5%"),
  },
  reviewText: {
    marginLeft: 5,
    fontSize: wp("3.2%"),
    color: "#eee",
  },
  right: {
    alignItems: "center",
    justifyContent: "center",
  },
  videoIcon: {
    backgroundColor: "#00B894",
    width: wp("10%"),
    height: wp("10%"),
    borderRadius: wp("5%"),
    justifyContent: "center",
    alignItems: "center",
  },
});
