import { View, Text } from "react-native";
import React from "react";
import { auth } from "@/lib/firebase";

const home = () => {
  return (
    <View>
      <Text>{auth.currentUser?.email}</Text>
    </View>
  );
};

export default home;
