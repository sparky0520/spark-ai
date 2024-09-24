import { firestore } from "./firebase";
import {
  collection,
  addDoc,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

const usersCollection = collection(firestore, "users");

export const getUser = async (uid: string) => {
  const user = await getDoc(doc(usersCollection, uid));
  return user.data();
};

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
