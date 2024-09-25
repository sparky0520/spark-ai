import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, ScrollView } from "react-native";
import { getUserDataByEmail, updateUser } from "../../lib/database";
import { auth } from "../../lib/firebase"; // Assuming you have Firebase Auth setup
import { useAuthState } from "../../lib/firebase";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  const { user, loading } = useAuthState();
  const [userData, setUserData] = useState<any>(null);
  const [editableData, setEditableData] = useState({
    name: "",
    bio: "",
    ageGroup: "",
    nationality: "",
    socialLinks: [{ platform: "", link: "" }],
  });

  // Fetch user data by email
  useEffect(() => {
    if (user?.email) {
      const fetchUserData = async () => {
        const data = await getUserDataByEmail(user.email as string);
        setUserData(data);
        setEditableData({
          name: data?.name || "",
          bio: data?.bio || "",
          ageGroup: data?.content_type?.age_group || "",
          nationality: data?.content_type?.nationality || "",
          socialLinks: data?.social_media_links || [{ platform: "", link: "" }],
        });
      };
      fetchUserData();
    }
  }, [user]);

  // Handle input changes for editable fields
  const handleInputChange = (key: string, value: string) => {
    setEditableData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleSocialLinkChange = (
    index: number,
    key: string,
    value: string
  ) => {
    const updatedLinks = [...editableData.socialLinks];
    updatedLinks[index][key] = value;
    setEditableData((prevState) => ({
      ...prevState,
      socialLinks: updatedLinks,
    }));
  };

  // Update user data in Firebase
  const handleSave = async () => {
    if (user?.uid) {
      await updateUser(user.uid, {
        name: editableData.name,
        bio: editableData.bio,
        content_type: {
          age_group: editableData.ageGroup,
          nationality: editableData.nationality,
        },
        social_media_links: editableData.socialLinks,
      });
      alert("Profile updated successfully!");
    }
  };

  if (!userData) {
    return (
      <SafeAreaView
        style={{
          backgroundColor: "#121212",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#FFFFFF" }}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-900">
      <ScrollView
        contentContainerStyle={{ padding: 20, backgroundColor: "#121212" }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            marginBottom: 10,
            color: "#FFFFFF",
          }}
        >
          Profile
        </Text>

        <Text style={{ color: "#FFFFFF" }}>Name:</Text>
        <TextInput
          value={editableData.name}
          onChangeText={(text) => handleInputChange("name", text)}
          style={{
            borderWidth: 1,
            borderColor: "#333333",
            backgroundColor: "#1E1E1E",
            padding: 10,
            marginBottom: 10,
            color: "#FFFFFF",
          }}
        />

        <Text style={{ color: "#FFFFFF" }}>Bio:</Text>
        <TextInput
          value={editableData.bio}
          onChangeText={(text) => handleInputChange("bio", text)}
          style={{
            borderWidth: 1,
            borderColor: "#333333",
            backgroundColor: "#1E1E1E",
            padding: 10,
            marginBottom: 10,
            color: "#FFFFFF",
          }}
        />

        <Text style={{ color: "#FFFFFF" }}>Age Group:</Text>
        <TextInput
          value={editableData.ageGroup}
          onChangeText={(text) => handleInputChange("ageGroup", text)}
          style={{
            borderWidth: 1,
            borderColor: "#333333",
            backgroundColor: "#1E1E1E",
            padding: 10,
            marginBottom: 10,
            color: "#FFFFFF",
          }}
        />

        <Text style={{ color: "#FFFFFF" }}>Nationality:</Text>
        <TextInput
          value={editableData.nationality}
          onChangeText={(text) => handleInputChange("nationality", text)}
          style={{
            borderWidth: 1,
            borderColor: "#333333",
            backgroundColor: "#1E1E1E",
            padding: 10,
            marginBottom: 10,
            color: "#FFFFFF",
          }}
        />

        <Text style={{ color: "#FFFFFF" }}>Social Media Links:</Text>
        {editableData.socialLinks.map((link, index) => (
          <View key={index} style={{ marginBottom: 10 }}>
            <Text style={{ color: "#FFFFFF" }}>Platform:</Text>
            <TextInput
              value={link.platform}
              onChangeText={(text) =>
                handleSocialLinkChange(index, "platform", text)
              }
              style={{
                borderWidth: 1,
                borderColor: "#333333",
                backgroundColor: "#1E1E1E",
                padding: 10,
                marginBottom: 5,
                color: "#FFFFFF",
              }}
            />

            <Text style={{ color: "#FFFFFF" }}>Link:</Text>
            <TextInput
              value={link.link}
              onChangeText={(text) =>
                handleSocialLinkChange(index, "link", text)
              }
              style={{
                borderWidth: 1,
                borderColor: "#333333",
                backgroundColor: "#1E1E1E",
                padding: 10,
                marginBottom: 5,
                color: "#FFFFFF",
              }}
            />
          </View>
        ))}

        <Button title="Save" onPress={handleSave} color="#007BFF" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
