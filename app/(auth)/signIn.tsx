import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { signIn } from "../../lib/authentication";
import { useRouter } from "expo-router";
import { FirebaseError } from "firebase/app";

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    return true;
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setError("");

    try {
      await signIn(email, password);
      router.replace("/home");
    } catch (err) {
      if (err instanceof FirebaseError) {
        switch (err.code) {
          case "auth/user-not-found":
          case "auth/wrong-password":
            setError("Invalid email or password.");
            break;
          case "auth/too-many-requests":
            setError("Too many failed attempts. Please try again later.");
            break;
          default:
            setError("An error occurred. Please try again.");
        }
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center p-6 bg-white">
      <Text className="text-3xl font-bold mb-6 text-center">Sign In</Text>
      <TextInput
        className="border border-gray-300 p-2 rounded-md mb-4"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        className="border border-gray-300 p-2 rounded-md mb-4"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error ? <Text className="text-red-500 mb-4">{error}</Text> : null}
      <TouchableOpacity
        className="bg-blue-500 p-3 rounded-md"
        onPress={handleSignIn}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white text-center font-bold">Sign In</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity className="mt-4" onPress={() => router.push("/signUp")}>
        <Text className="text-blue-500 text-center">Create Account</Text>
      </TouchableOpacity>
    </View>
  );
}
