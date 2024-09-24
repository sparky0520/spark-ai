import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import React from "react";
import { router } from "expo-router";

const index = () => {
  return (
    <SafeAreaView className="flex-1 items-center justify-around bg-black">
      <Text className="text-white text-9xl font-bold mb-9">Spark AI</Text>
      <TouchableOpacity onPress={() => router.push("/signIn")}>
        <Image source={require("../assets/images/logo.png")} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default index;
