import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { signIn } from "../../lib/authentication";
import { useRouter } from "expo-router";
import { FirebaseError } from "firebase/app";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Missing Information", "Please fill in all fields.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return false;
    }
    return true;
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await signIn(email, password);
      router.replace("/home");
    } catch (err) {
      if (err instanceof FirebaseError) {
        switch (err.code) {
          case "auth/user-not-found":
          case "auth/wrong-password":
            Alert.alert("Authentication Failed", "Invalid email or password.");
            break;
          case "auth/too-many-requests":
            Alert.alert(
              "Too Many Attempts",
              "Too many failed attempts. Please try again later."
            );
            break;
          default:
            Alert.alert("Error", "An error occurred. Please try again.");
        }
      } else {
        Alert.alert(
          "Unexpected Error",
          "An unexpected error occurred. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-center p-6"
      >
        <Text className="text-3xl font-bold mb-8 text-center text-blue-600">
          Welcome Back
        </Text>
        <View className="mb-4">
          <Text className="text-sm font-medium text-gray-700 mb-1">Email</Text>
          <TextInput
            className="border border-gray-300 p-3 rounded-md bg-gray-50"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            accessibilityLabel="Email input"
          />
        </View>
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-1">
            Password
          </Text>
          <View className="relative">
            <TextInput
              className="border border-gray-300 p-3 rounded-md bg-gray-50 pr-10"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              textContentType="password"
              accessibilityLabel="Password input"
            />
            <TouchableOpacity
              className="absolute right-3 top-3"
              onPress={() => setShowPassword(!showPassword)}
              accessibilityLabel={
                showPassword ? "Hide password" : "Show password"
              }
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={24}
                color="gray"
              />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          className={`p-3 rounded-md ${
            isLoading ? "bg-blue-400" : "bg-blue-600"
          }`}
          onPress={handleSignIn}
          disabled={isLoading}
          accessibilityLabel="Sign in button"
          accessibilityState={{ disabled: isLoading }}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center font-bold text-lg">
              Sign In
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          className="mt-4"
          onPress={() => router.push("/signUp")}
          accessibilityLabel="Create account button"
        >
          <Text className="text-blue-600 text-center">
            Don't have an account? Create one
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
