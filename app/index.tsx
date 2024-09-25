import React, { useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";

const Index = () => {
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, navigate to home
        router.replace("/home");
      } else {
        // User is signed out, show the welcome screen
        setLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handlePress = () => {
    router.push("/signIn");
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-black">
        <ActivityIndicator size="large" color="#ffffff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 items-center justify-around bg-black">
      <Text className="text-white text-9xl font-bold mb-9">Spark AI</Text>
      <TouchableOpacity onPress={handlePress}>
        <Image source={require("../assets/images/logo.png")} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Index;
