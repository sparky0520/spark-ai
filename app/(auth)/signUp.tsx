import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { signUp } from "../../lib/authentication";
import { createUser } from "../../lib/database";
import { useRouter } from "expo-router";
import { FirebaseError } from "firebase/app";

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    if (!email.trim() || !password.trim() || !name.trim()) {
      setError("Please fill in all fields.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }
    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setError("");

    try {
      const userCredential = await signUp(email, password);
      await createUser(userCredential.user.uid, { email, name });
      router.replace("/profileSetup");
    } catch (err) {
      if (err instanceof FirebaseError) {
        switch (err.code) {
          case "auth/email-already-in-use":
            setError("This email is already in use.");
            break;
          case "auth/invalid-email":
            setError("Invalid email address.");
            break;
          case "auth/weak-password":
            setError("Password is too weak.");
            break;
          default:
            setError("An error occurred during sign up. Please try again.");
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
      <Text className="text-3xl font-bold mb-6 text-center">
        Create Account
      </Text>
      <TextInput
        className="border border-gray-300 p-2 rounded-md mb-4"
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
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
        onPress={handleSignUp}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white text-center font-bold">Sign Up</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity className="mt-4" onPress={() => router.push("/signIn")}>
        <Text className="text-blue-500 text-center">
          Already have an account? Sign In
        </Text>
      </TouchableOpacity>
    </View>
  );
}
