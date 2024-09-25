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
  ScrollView,
} from "react-native";
import { signUp } from "../../lib/authentication";
import { createUser } from "../../lib/database";
import { useRouter } from "expo-router";
import { FirebaseError } from "firebase/app";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    if (!email.trim() || !password.trim() || !name.trim()) {
      Alert.alert("Missing Information", "Please fill in all fields.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return false;
    }
    if (password.length < 8) {
      Alert.alert(
        "Weak Password",
        "Password must be at least 8 characters long."
      );
      return false;
    }
    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const userCredential = await signUp(email, password);
      await createUser(userCredential.user.uid, { email, name });

      router.replace("/profileSetup");
    } catch (err) {
      if (err instanceof FirebaseError) {
        switch (err.code) {
          case "auth/email-already-in-use":
            Alert.alert(
              "Email In Use",
              "This email is already registered. Please use a different email or try signing in."
            );
            break;
          case "auth/invalid-email":
            Alert.alert("Invalid Email", "Please enter a valid email address.");
            break;
          case "auth/weak-password":
            Alert.alert("Weak Password", "Please choose a stronger password.");
            break;
          default:
            Alert.alert(
              "Sign Up Error",
              "An error occurred during sign up. Please try again."
            );
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
        <View className="flex-1 p-6 justify-center">
          <Text className="text-3xl font-bold mb-8 text-center text-blue-600">
            Create Account
          </Text>
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-1">Name</Text>
            <TextInput
              className="border border-gray-300 p-3 rounded-md bg-gray-50"
              placeholder="Enter your full name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              textContentType="name"
              accessibilityLabel="Name input"
            />
          </View>
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-1">
              Email
            </Text>
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
                placeholder="Choose a strong password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                textContentType="newPassword"
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
            onPress={handleSignUp}
            disabled={isLoading}
            accessibilityLabel="Sign up button"
            accessibilityState={{ disabled: isLoading }}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-center font-bold text-lg">
                Create Account
              </Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            className="mt-4"
            onPress={() => router.push("/signIn")}
            accessibilityLabel="Sign in button"
          >
            <Text className="text-blue-600 text-center">
              Already have an account? Sign In
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
