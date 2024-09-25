import { firestore } from "./firebase";
import {
  collection,
  addDoc,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  Timestamp,
  arrayUnion,
  setDoc,
} from "firebase/firestore";

const usersCollection = collection(firestore, "users");

// Get a user by their unique UID
export const getUser = async (uid: string) => {
  try {
    const user = await getDoc(doc(usersCollection, uid));
    return user.exists() ? user.data() : null;
  } catch (error) {
    console.error("Error getting user:", error);
    throw new Error("Failed to get user");
  }
};

// Create a new user document
export const createUser = async (uid: string, data: any) => {
  try {
    const userDocRef = doc(usersCollection, uid);
    await setDoc(userDocRef, data);
    return userDocRef;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user");
  }
};

// Update an existing user by UID
export const updateUser = async (uid: string, data: any) => {
  try {
    const userDocRef = doc(usersCollection, uid);
    await updateDoc(userDocRef, data);
    return userDocRef;
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("Failed to update user");
  }
};

// Delete a user by UID
export const deleteUser = async (uid: string) => {
  try {
    const userDocRef = doc(usersCollection, uid);
    await deleteDoc(userDocRef);
    return userDocRef;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Failed to delete user");
  }
};

// Get a user's data by their email
export const getUserDataByEmail = async (email: string) => {
  try {
    const userQuery = query(usersCollection, where("email", "==", email));
    const querySnapshot = await getDocs(userQuery);

    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data();
      console.log("User data:", userData);
      return userData;
    } else {
      console.log("No user found with this email.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw new Error("Failed to get user data by email");
  }
};

// Create a new chat for a specific user
export const createNewChat = async (uid: string, title: string) => {
  try {
    const userDocRef = doc(usersCollection, uid);

    const newChat = {
      content: "",
      title: title,
      timestamp: Timestamp.now(),
    };

    await updateDoc(userDocRef, {
      chats: arrayUnion(newChat),
    });

    return newChat;
  } catch (error) {
    console.error("Error creating new chat:", error);
    throw new Error("Failed to create new chat");
  }
};

// Fetch the previous chats for a user by UID
export const getPreviousChats = async (uid: string) => {
  try {
    const userDocRef = doc(usersCollection, uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const chats = userData?.chats || [];
      return chats;
    } else {
      console.log("User document not found.");
      return [];
    }
  } catch (error) {
    console.error("Error fetching previous chats:", error);
    throw new Error("Failed to get previous chats");
  }
};

// Fetch all chat messages for a specific chat ID
export const getChatMessages = async (uid: string, chatTitle: string) => {
  try {
    const userDocRef = doc(usersCollection, uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const chats = userDoc.data()?.chats || [];
      const chat = chats.find((c: any) => c.title === chatTitle);
      return chat ? chat.messages : [];
    } else {
      console.log("No user found.");
      return [];
    }
  } catch (error) {
    console.error("Error fetching chat messages:", error);
    throw new Error("Failed to get chat messages");
  }
};

// Add a new message to an existing chat
export const sendMessage = async (
  uid: string,
  chatTitle: string,
  message: string
) => {
  try {
    const userDocRef = doc(usersCollection, uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const chats = userData?.chats || [];

      const chatIndex = chats.findIndex(
        (chat: any) => chat.title === chatTitle
      );
      if (chatIndex !== -1) {
        chats[chatIndex].messages = chats[chatIndex].messages || [];
        chats[chatIndex].messages.push({
          content: message,
          timestamp: Timestamp.now(),
        });

        await updateDoc(userDocRef, {
          chats: chats,
        });

        return chats[chatIndex].messages;
      } else {
        throw new Error("Chat not found.");
      }
    } else {
      throw new Error("User not found.");
    }
  } catch (error) {
    console.error("Error sending message:", error);
    throw new Error("Failed to send message");
  }
};

// Update an existing chat for a specific user
export const updateChat = async (
  email: string,
  chatIndex: number,
  newContent: string
) => {
  try {
    const userQuery = query(usersCollection, where("email", "==", email));
    const querySnapshot = await getDocs(userQuery);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();
      const chats = userData.chats || [];

      if (chatIndex >= 0 && chatIndex < chats.length) {
        chats[chatIndex].content = newContent;
        chats[chatIndex].timestamp = Timestamp.now();

        await updateDoc(userDoc.ref, { chats: chats });
        return true;
      } else {
        throw new Error("Chat index out of bounds");
      }
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    console.error("Error updating chat:", error);
    throw new Error("Failed to update chat");
  }
};
