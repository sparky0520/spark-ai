import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeWindStyleSheet } from "nativewind";
import Icon from "react-native-vector-icons/Feather";
import { auth } from "@/lib/firebase";
import {
  getUserDataByEmail,
  createNewChat,
  getPreviousChats,
} from "@/lib/database";
import { router } from "expo-router";
import { Timestamp } from "firebase/firestore";

NativeWindStyleSheet.setOutput({
  default: "native",
});

interface UserData {
  name: string;
  email: string;
}

interface Chat {
  content: string;
  timestamp: Timestamp;
  title: string;
}

const Home = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [newChatTitle, setNewChatTitle] = useState("");
  const [previousChats, setPreviousChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const fetchedUserData = await getUserDataByEmail(
            user.email as string
          );
          setUserData(fetchedUserData as UserData);

          const fetchedChats = await getPreviousChats(user.uid);
          setPreviousChats(fetchedChats);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        Alert.alert("Error", "Failed to load user data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      console.log("Signing out");
      router.push("/signIn");
    } catch (error) {
      console.error("Error signing out:", error);
      Alert.alert("Error", "Failed to sign out. Please try again.");
    }
  };

  const handleProfileClick = () => {
    router.push("/profile");
  };

  const handleNewChat = async () => {
    if (!newChatTitle.trim()) {
      Alert.alert("Error", "Please enter a chat title");
      return;
    }

    try {
      const user = auth.currentUser;
      if (user) {
        const newChat = await createNewChat(user.uid, newChatTitle);
        setPreviousChats([newChat, ...previousChats]); // Add new chat to the beginning
        setNewChatTitle(""); // Clear the input after chat creation
      }
    } catch (error) {
      console.error("Error creating new chat:", error);
      Alert.alert("Error", "Failed to create new chat. Please try again.");
    }
  };

  const handleChatClick = (chatTitle: string, timestamp: string) => {
    router.push(`/chats/${chatTitle}`);
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-900">
        <Text className="text-white text-lg">Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row justify-between items-center p-4 bg-gray-800">
          <TouchableOpacity onPress={handleProfileClick}>
            <Icon name="user" size={24} color="#fff" />
          </TouchableOpacity>
          <Text className="text-white text-lg font-bold">
            Welcome, {userData?.name}
          </Text>
          <TouchableOpacity onPress={handleSignOut}>
            <Icon name="log-out" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Previous Chats */}
        <ScrollView className="flex-1 px-4 py-2">
          <Text className="text-white text-xl font-bold mb-2">
            Previous Chats
          </Text>
          {previousChats.length > 0 ? (
            previousChats.reverse().map((chat, index) => (
              <TouchableOpacity
                key={index}
                className="flex-row items-center bg-gray-800 p-3 rounded-lg mb-2"
                onPress={() =>
                  handleChatClick(
                    chat.title,
                    chat.timestamp.toDate().toISOString()
                  )
                }
              >
                <Icon name="message-square" size={20} color="#9ca3af" />
                <View className="ml-2">
                  <Text className="text-white">{chat.title}</Text>
                  <Text className="text-gray-400 text-xs">
                    {new Date(chat.timestamp.toDate()).toLocaleString()}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text className="text-gray-400">No previous chats available.</Text>
          )}
        </ScrollView>

        {/* New Chat Bar */}
        <View className="p-4 bg-gray-800">
          <View className="flex-row">
            <TextInput
              className="flex-1 bg-gray-700 text-white px-3 py-2 rounded-l-lg"
              placeholder="Enter new chat title"
              placeholderTextColor="#9ca3af"
              value={newChatTitle}
              onChangeText={setNewChatTitle}
            />
            <TouchableOpacity
              className="bg-blue-600 px-4 py-2 rounded-r-lg justify-center items-center"
              onPress={handleNewChat}
            >
              <Text className="text-white font-bold">New Chat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Home;
