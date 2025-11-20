"use client";

// ProductsPage.tsx
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  PerspectiveCamera,
  OrthographicCamera,
} from "@react-three/drei";

import { useEffect, useState } from "react";
import { Model } from "../components/Model";
import { useModelConfig } from "../database/useModelConfig";
import { saveModelPosition, saveModelRotation } from "../database/updateModel";

function toVec3(value: unknown): [number, number, number] | null {
  if (!Array.isArray(value) || value.length !== 3) return null;
  const [x, y, z] = value;
  if (typeof x !== "number" || typeof y !== "number" || typeof z !== "number")
    return null;
  return [x, y, z];
}

export default function ProductsPage() {
  const [viewMode, setViewMode] = useState<"3d" | "2d">("3d");

  const chair = useModelConfig("chair");
  const table = useModelConfig("table");

  const [chairPos, setChairPos] = useState<[number, number, number] | null>( null, );
  const [chairRot, setChairRot] = useState<[number, number, number] | null>(null, );

  const [tablePos, setTablePos] = useState<[number, number, number] | null>( null,);
  const [tableRot, setTableRot] = useState<[number, number, number] | null>(null,);

 useEffect(() => {
    if (!chair) return;

    const p = toVec3(chair.position);
    const r = toVec3(chair.rotation);

    if (p) setChairPos(p);
    if (r) setChairRot(r);
}, [chair]);

  useEffect(() => {
    if (!table) return;
    const p = toVec3(table.position);
    const r = toVec3(table.rotation);
    if (p && tablePos === null) setTablePos(p);
    if (r && tableRot === null) setTableRot(r);
  }, [table, tablePos, tableRot]);

  const loaded = !!chairPos && !!chairRot && !!tablePos && !!tableRot;

  if (!loaded) return <p className="text-center py-20">Loading 3D…</p>;

  return (
    <div className="w-full text-center py-10">
      <h1 className="text-4xl font-bold mb-4">Our Products</h1>

      <button
        onClick={() => setViewMode(viewMode === "3d" ? "2d" : "3d")}
        className="px-4 py-2 bg-zinc-600 text-white rounded mb-10"
      >
        Switch to {viewMode === "3d" ? "2D" : "3D"}
      </button>

      <p
        style={{
          fontSize: "14px",
          color: "#6b7280",
          marginBottom: "12px",
          fontStyle: "italic",
        }}
      >
        Tip: Rotate the model using X, Y or Z keys.
      </p>

      <div className="flex justify-center gap-10 flex-wrap">
        {/* CHAIR */}
        <div className="w-[500px] h-[500px] bg-zinc-100 rounded-xl shadow p-2 flex flex-col">
          <Canvas shadows>
            {viewMode === "3d" ? (
              <PerspectiveCamera makeDefault position={[3, 2, 3]} />
            ) : (
              <OrthographicCamera makeDefault position={[0, 30, 0]} zoom={40} />
            )}

            <OrbitControls
              enablePan={viewMode === "3d"}
              enableRotate={viewMode === "3d"}
              target={[chairPos[0], chairPos[1] + 0.3, chairPos[2]]}
            />

            <directionalLight intensity={1.2} position={[5, 5, 5]} />
            <ambientLight intensity={0.4} />

            <Model
              path={chair.file}
              scale={chair.scale ?? 1}
              position={chairPos}
              rotation={chairRot}
              onChange={setChairPos}
              onRotate={setChairRot}
            />
          </Canvas>

          <button
            className="py-2 bg-zinc-500 text-white mt-3 rounded"
            onClick={() => saveModelPosition("chair", chairPos)}
          >
            Save Chair Position
          </button>

          <button
            className="w-full py-2 bg-zinc-500 text-white mt-3 rounded"
            onClick={() => saveModelRotation("chair", chairRot)}
          >
            Save Chair Rotation
          </button>
        </div>

        {/* TABLE */}
        <div className="w-[500px] h-[500px] bg-zinc-100 rounded-xl shadow p-2 flex flex-col">
          <Canvas shadows>
            {viewMode === "3d" ? (
              <PerspectiveCamera makeDefault position={[3, 2, 3]} />
            ) : (
              <OrthographicCamera makeDefault position={[0, 30, 0]} zoom={40} />
            )}

            <OrbitControls
              enablePan={viewMode === "3d"}
              enableRotate={viewMode === "3d"}
              target={[tablePos[0], tablePos[1] + 0.3, tablePos[2]]}
            />

            <directionalLight intensity={1.2} position={[5, 5, 5]} />
            <ambientLight intensity={0.4} />

            <Model
              path={table.file}
              scale={table.scale ?? 1}
              position={tablePos}
              rotation={tableRot}
              onChange={setTablePos}
              onRotate={setTableRot}
            />
          </Canvas>

          <button
            className="w-full py-2 bg-zinc-500 text-white mt-3 rounded"
            onClick={() => saveModelPosition("table", tablePos)}
          >
            Save Table Position
          </button>

          <button
            className="w-full py-2 bg-zinc-500 text-white mt-3 rounded"
            onClick={() => saveModelRotation("table", tableRot)}
          >
            Save Table Rotation
          </button>
        </div>
      </div>
    </div>
  );
}
