import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCaJCenRIZXsuBGoIt0muekQTokvSVCp40",
  authDomain: "pantry-tracker-cc1c0.firebaseapp.com",
  projectId: "pantry-tracker-cc1c0",
  storageBucket: "pantry-tracker-cc1c0.appspot.com",
  messagingSenderId: "606123512345",
  appId: "1:606123512345:web:ce4b1c2ec07cd560a6359e",
  measurementId: "G-8G8G8G8G8G",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Firestore operations
export const pantryCollection = collection(db, "pantryItems");

export const addPantryItem = async (item: any) => {
  await addDoc(pantryCollection, item);
};

export const getPantryItems = async () => {
  const querySnapshot = await getDocs(pantryCollection);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const updatePantryItem = async (id: string, updatedItem: any) => {
  const pantryItemDoc = doc(db, "pantryItems", id);
  await updateDoc(pantryItemDoc, updatedItem);
};

export const deletePantryItem = async (id: string) => {
  const pantryItemDoc = doc(db, "pantryItems", id);
  await deleteDoc(pantryItemDoc);
};
