"use client";

import { db } from "../database/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useEffect } from "react";

export default function TestPage() {

  useEffect(() => {
    async function load() {
      const ref = doc(db, "chair","chair");
      const snap = await getDoc(ref);
      console.log("DATA:", snap.data());
    }

    load();
  }, []);

  return <div className="p-10">Check console</div>;
}
