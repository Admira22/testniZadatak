import { doc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { setDoc } from "firebase/firestore";

export async function saveModelPosition(id: string, pos: [number, number, number]) {
  const ref = doc(db, "models", id);

  await setDoc(ref, { position: pos }, { merge: true });
}

export async function saveModelRotation(id: string, rot: [number, number, number]) {
  const ref = doc(db, "models", id);

  await setDoc(ref, { rotation: rot }, { merge: true });
}
