"use client";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../database/firebaseConfig";
export function useModelConfig(name: string) {
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    setConfig(null); 

    async function load() {
      const ref = doc(db, "models", name);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        console.warn("Model not found:", name);
        return;
      }

      const data = snap.data();

      function normalizeVector(v: any): [number, number, number] {
        if (Array.isArray(v) && v.length === 3) {
          return [
            Number(v[0]),
            Number(v[1]),
            Number(v[2])
          ];
        }

        if (v && typeof v === "object") {
          const sorted = Object.keys(v)
            .filter((k) => !isNaN(Number(k)))
            .sort((a, b) => Number(a) - Number(b))
            .map((k) => Number(v[k]));

          if (sorted.length === 3) {
            return [sorted[0], sorted[1], sorted[2]];
          }
        }

        return [0, 0, 0];
      }

      setConfig({
        file: data.file ?? "",
        scale: data.scale ?? 1,
        position: normalizeVector(data.position),
        rotation: normalizeVector(data.rotation),
      });
    }

    load();
  }, [name]);

  return config;
}
