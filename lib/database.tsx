import { firestore } from "./firebase";
import {
  collection,
  addDoc,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

const usersCollection = collection(firestore, "users");
const chatsCollection = collection(firestore, "chats");

export const getUser = async (uid: string) => {
  const user = await getDoc(doc(usersCollection, uid));
  return user.data();
};

// Users CRUD
export const createUser = async (uid: string, data: any) => {
  const user = await addDoc(usersCollection, data);
  return user;
};

export const updateUser = async (uid: string, data: any) => {
  const user = await updateDoc(doc(usersCollection, uid), data);
  return user;
};

export const deleteUser = async (uid: string) => {
  const user = await deleteDoc(doc(usersCollection, uid));
  return user;
};

// Chats CRUD
export const getChats = async (uid: string) => {
  const chats = await getDocs(query(chatsCollection, where("uid", "==", uid)));
  return chats.docs.map((doc) => doc.data());
};

export const createChat = async (data: any) => {
  const chat = await addDoc(chatsCollection, data);
  return chat;
};

export const updateChat = async (id: string, data: any) => {
  const chat = await updateDoc(doc(chatsCollection, id), data);
  return chat;
};

export const deleteChat = async (id: string) => {
  const chat = await deleteDoc(doc(chatsCollection, id));
  return chat;
};
