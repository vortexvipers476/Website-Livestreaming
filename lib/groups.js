import { db } from './firebase';
import { collection, addDoc, getDoc, doc, updateDoc, serverTimestamp, onSnapshot } from "firebase/firestore";

const GROUPS_COLLECTION = 'groups';

export const createGroup = async (groupData) => {
  const docRef = await addDoc(collection(db, GROUPS_COLLECTION), {
    ...groupData,
    createdAt: serverTimestamp(),
    viewers: 0,
    isPlaying: false,
    currentTime: 0
  });
  return docRef.id;
};

export const getGroup = async (id) => {
  const docRef = doc(db, GROUPS_COLLECTION, id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    return null;
  }
};

export const updateGroupState = async (id, state) => {
  const docRef = doc(db, GROUPS_COLLECTION, id);
  await updateDoc(docRef, state);
};

export const subscribeToGroup = (id, callback) => {
  const docRef = doc(db, GROUPS_COLLECTION, id);
  const unsubscribe = onSnapshot(docRef, (doc) => {
    if (doc.exists()) {
      callback({ id: doc.id, ...doc.data() });
    }
  });
  return unsubscribe;
};
