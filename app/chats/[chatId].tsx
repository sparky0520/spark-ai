// screens/ChatScreen.tsx
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
import { getChatMessages, sendMessage } from "@/lib/database";
import { auth } from "@/lib/firebase";
import { useRouter } from "expo-router";

NativeWindStyleSheet.setOutput({
  default: "native",
});

const ChatScreen = ({ chatId }) => {
  console.log(chatId);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const chatMessages = await getChatMessages(
          auth.currentUser?.uid,
          chatId
        );
        setMessages(chatMessages);
      } catch (error) {
        console.error("Error fetching chat messages:", error);
      }
    };

    fetchMessages();
  }, [chatId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const user = auth.currentUser;
      if (user) {
        await sendMessage(user.uid, chatId, newMessage);
        setMessages([...messages, { content: newMessage, senderId: user.uid }]);
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <View className="flex-1">
        <View className="flex-row gap-4 items-center p-4 bg-gray-800">
          <TouchableOpacity onPress={() => router.back()}>
            <Icon name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-bold">Chat: {chatId}</Text>
        </View>

        <ScrollView className="flex-1 px-4 py-2">
          {messages.map((message, index) => (
            <View
              key={index}
              className={`${
                message.senderId === auth.currentUser?.uid
                  ? "self-end bg-blue-600"
                  : "self-start bg-gray-800"
              } p-3 rounded-lg mb-2 max-w-xs`}
            >
              <Text className="text-white">{message.content}</Text>
            </View>
          ))}
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
