import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { updateUser } from "../../lib/database";
import { auth } from "../../lib/firebase";
import { useRouter } from "expo-router";

export default function ProfileSetupScreen() {
  const [bio, setBio] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [nationality, setNationality] = useState("");
  const [socialMediaPlatform, setSocialMediaPlatform] = useState("");
  const [socialMediaLink, setSocialMediaLink] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    if (!bio.trim() || !ageGroup.trim() || !nationality.trim()) {
      setError("Please fill in all required fields.");
      return false;
    }
    return true;
  };

  const handleProfileSetup = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setError("");

    try {
      const user = auth.currentUser;
      if (user) {
        await updateUser(user.uid, {
          bio,
          content_type: {
            age_group: ageGroup,
            nationality,
          },
          social_media_links:
            socialMediaPlatform && socialMediaLink
              ? [
                  {
                    platform: socialMediaPlatform,
                    link: socialMediaLink,
                  },
                ]
              : [],
        });
        router.replace("/home");
      } else {
        setError("User not found. Please sign in again.");
      }
    } catch (err) {
      setError("Failed to update profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-6">
        <Text className="text-3xl font-bold mb-6 text-center">
          Profile Setup
        </Text>
        <TextInput
          className="border border-gray-300 p-2 rounded-md mb-4"
          placeholder="Bio"
          value={bio}
          onChangeText={setBio}
          multiline
        />
        <TextInput
          className="border border-gray-300 p-2 rounded-md mb-4"
          placeholder="Age Group"
          value={ageGroup}
          onChangeText={setAgeGroup}
        />
        <TextInput
          className="border border-gray-300 p-2 rounded-md mb-4"
          placeholder="Nationality"
          value={nationality}
          onChangeText={setNationality}
        />
        <TextInput
          className="border border-gray-300 p-2 rounded-md mb-4"
          placeholder="Social Media Platform (Optional)"
          value={socialMediaPlatform}
          onChangeText={setSocialMediaPlatform}
        />
        <TextInput
          className="border border-gray-300 p-2 rounded-md mb-4"
          placeholder="Social Media Link (Optional)"
          value={socialMediaLink}
          onChangeText={setSocialMediaLink}
        />
        {error ? <Text className="text-red-500 mb-4">{error}</Text> : null}
        <TouchableOpacity
          className="bg-blue-500 p-3 rounded-md"
          onPress={handleProfileSetup}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-center font-bold">
              Complete Profile Setup
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
