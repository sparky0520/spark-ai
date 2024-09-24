import React, { useState } from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { signOut } from "../lib/authentication";
import { useRouter } from "expo-router";

export default function SignOutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
      router.replace("/signIn");
    } catch (error) {
      console.error("Error signing out:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableOpacity
      className="bg-red-500 p-2 rounded-md"
      onPress={handleSignOut}
      disabled={isLoading}
    >
      {isLoading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text className="text-white text-center font-bold">Sign Out</Text>
      )}
    </TouchableOpacity>
  );
}
