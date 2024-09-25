import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeWindStyleSheet } from "nativewind";
import Icon from "react-native-vector-icons/Feather";
import { getUserDataByEmail, updateChat } from "@/lib/database";
import { auth } from "@/lib/firebase";
import { useLocalSearchParams, useRouter } from "expo-router";

NativeWindStyleSheet.setOutput({
  default: "native",
});

interface Chat {
  content: string;
  timestamp: any; // Use the correct Timestamp type from your Firebase setup
  title: string;
}

const ChatScreen = () => {
  const { chatIndex } = useLocalSearchParams();
  const [chat, setChat] = useState<Chat | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchChat = async () => {
      const user = auth.currentUser;
      if (user && chatIndex) {
        const userData = await getUserDataByEmail(user.email as string);
        const selectedChat = userData?.chats[parseInt(chatIndex as string)];
        setChat(selectedChat);
      }
    };

    fetchChat();
  }, [chatIndex]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !chat) return;

    try {
      const user = auth.currentUser;
      if (user) {
        const updatedContent = chat.content + "\n" + newMessage; // Append new message
        await updateChat(
          user.email as string,
          parseInt(chatIndex as string),
          updatedContent
        );
        setChat((prevChat) => ({
          ...prevChat!,
          content: updatedContent,
        }));
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (!chat) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-900">
        <Text className="text-white text-lg">Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <View className="flex-1">
        <View className="flex-row gap-4 items-center p-4 bg-gray-800">
          <TouchableOpacity onPress={() => router.back()}>
            <Icon name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-bold">
            Chat: {chat.title}
          </Text>
        </View>

        <ScrollView className="flex-1 px-4 py-2">
          <Text className="text-white">{chat.content}</Text>
        </ScrollView>

        <View className="p-4 bg-gray-800">
          <View className="flex-row">
            <TextInput
              className="flex-1 bg-gray-700 text-white px-3 py-2 rounded-l-lg"
              placeholder="Enter your message"
              placeholderTextColor="#9ca3af"
              value={newMessage}
              onChangeText={setNewMessage}
            />
            <TouchableOpacity
              className="bg-blue-600 px-4 py-2 rounded-r-lg justify-center items-center"
              onPress={handleSendMessage}
            >
              <Icon name="send" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ChatScreen;
