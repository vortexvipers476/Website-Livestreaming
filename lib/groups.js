import { db } from './firebase';
import { collection, addDoc, getDoc, doc, updateDoc, serverTimestamp, onSnapshot } from "firebase/firestore";

const GROUPS_COLLECTION = 'groups';

export const createGroup = async (groupData) => {
  try {
    console.log("Creating group with data:", groupData);
    const docRef = await addDoc(collection(db, GROUPS_COLLECTION), {
      ...groupData,
      createdAt: serverTimestamp(),
      viewers: 0,
      isPlaying: false,
      currentTime: 0
    });
    console.log("Group created with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error in createGroup:", error);
    throw error;
  }
};

export const getGroup = async (id) => {
  try {
    console.log("Getting group with ID:", id);
    const docRef = doc(db, GROUPS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Group found:", docSnap.data());
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log("Group not found");
      return null;
    }
  } catch (error) {
    console.error("Error in getGroup:", error);
    throw error;
  }
};

export const updateGroupState = async (id, state) => {
  try {
    console.log("Updating group state:", id, state);
    const docRef = doc(db, GROUPS_COLLECTION, id);
    await updateDoc(docRef, state);
    console.log("Group state updated successfully");
  } catch (error) {
    console.error("Error in updateGroupState:", error);
    throw error;
  }
};

export const subscribeToGroup = (id, callback) => {
  console.log("Subscribing to group:", id);
  const docRef = doc(db, GROUPS_COLLECTION, id);
  const unsubscribe = onSnapshot(docRef, (doc) => {
    if (doc.exists()) {
      console.log("Group updated:", doc.data());
      callback({ id: doc.id, ...doc.data() });
    } else {
      console.log("Group not found in subscription");
    }
  }, (error) => {
    console.error("Subscription error:", error);
  });
  return unsubscribe;
};
