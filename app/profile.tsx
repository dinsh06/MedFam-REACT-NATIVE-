import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import {Link} from 'expo-router';
import { useNavigation } from '@react-navigation/native';

export default function Profile(){
  return(
    <View>
      <Text>
        <Link href="/addresses"> addresses page</Link>
      </Text>
    </View>
  );
}