import { View, Text } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const signIn = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  return (
    <SafeAreaView>
      <Text>signIn</Text>
    </SafeAreaView>
  );
};

export default signIn;
