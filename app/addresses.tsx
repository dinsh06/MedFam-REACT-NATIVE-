import * as React from "react";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";

interface Address {
  id: string;
  name: string;
  phone: string;
  pincode: string;
  housenumber: string;
  buildingname: string;
  roadname: string;
  area: string;
  locality: string;
}

