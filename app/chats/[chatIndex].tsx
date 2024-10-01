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
import { run } from "@/lib/genkit"; // Correctly import the Gemini function

NativeWindStyleSheet.setOutput({
  default: "native",
});

const ChatScreen = () => {
  const { chatIndex } = useLocalSearchParams();
  const [chat, setChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false); // Loading state for message generation
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
      setLoading(true); // Show loading indicator
      const user = auth.currentUser;
      if (user) {
        const userMessage = {
          role: "user",
          prompt: newMessage,
        };

        // Add user message to chat
        let updatedMessages = [...chat.messages, userMessage];

        // Get response from Gemini
        const geminiResponse = await run(newMessage);

        if (!geminiResponse) {
          throw new Error("Gemini response is empty");
        }

        const assistantMessage = {
          role: "assistant",
          prompt: geminiResponse,
        };

        // Add assistant message to chat
        updatedMessages = [...updatedMessages, assistantMessage];

        // Update chat in the database
        await updateChat(user.email as string, parseInt(chatIndex as string), {
          messages: updatedMessages,
        });

        // Update local state
        setChat((prevChat) => ({
          ...prevChat!,
          messages: updatedMessages,
        }));
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setLoading(false); // Hide loading indicator
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
          {chat.messages && chat.messages.length > 0 ? (
            chat.messages.map((message, index) => (
              <View
                key={index}
                className={`mb-2 ${
                  message.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <Text
                  className={`px-3 py-2 rounded-lg ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-white"
                  }`}
                >
                  {message.prompt}
                </Text>
              </View>
            ))
          ) : (
            <Text className="text-white text-center">No messages yet</Text>
          )}
        </ScrollView>

        <View className="p-4 bg-gray-800">
          <View className="flex-row">
            <TextInput
              className="flex-1 bg-gray-700 text-white px-3 py-2 rounded-l-lg"
              placeholder="Enter your message"
              placeholderTextColor="#9ca3af"
              value={newMessage}
              onChangeText={setNewMessage}
              editable={!loading} // Disable input while loading
            />
            <TouchableOpacity
              className="bg-blue-600 px-4 py-2 rounded-r-lg justify-center items-center"
              onPress={handleSendMessage}
              disabled={loading} // Disable button while loading
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
