"use client";

import { useGLTF } from "@react-three/drei";
import { ThreeEvent, useThree } from "@react-three/fiber";
import { useState, useRef, useEffect } from "react";
import * as THREE from "three";


interface ModelProps {
  path: string;
  scale?: number;
  position: [number, number, number];
  rotation: [number, number, number];
  onChange?: (pos: [number, number, number]) => void;
  onRotate?: (rot: [number, number, number]) => void;
}

export function Model({
  path,
  scale = 1,
  position,
  rotation,
  onChange,
  onRotate,
}: ModelProps) {
  const gltf = useGLTF(path);
  const ref = useRef<THREE.Group>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  function handlePointerDown(e: ThreeEvent<PointerEvent>) {
    e.stopPropagation();
    setIsFocused(true);
    setIsDragging(true);
  }

  function handlePointerUp() {
    setIsDragging(false);
  }

  function handlePointerMove(e: ThreeEvent<PointerEvent>) {
    if (!isDragging || !onChange) return;
    e.stopPropagation();

    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -position[1]);
    const intersectionPoint = new THREE.Vector3();

    if (!e.ray.intersectPlane(plane, intersectionPoint)) return;

    const newPos: [number, number, number] = [
      intersectionPoint.x,
      position[1],
      intersectionPoint.z,
    ];

    onChange(newPos);
  }

  function handleWheel(e: React.WheelEvent) {
    if (!onRotate) return;

    const newRot: [number, number, number] = [
      rotation[0],
      rotation[1] + e.deltaY * 0.002,
      rotation[2],
    ];

    onRotate(newRot);
  }

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (!isFocused || !onRotate) return;

      const step = Math.PI / 12;

      if (e.key === "x" || e.key === "X")
        onRotate([rotation[0] + step, rotation[1], rotation[2]]);
      if (e.key === "y" || e.key === "Y")
        onRotate([rotation[0], rotation[1] + step, rotation[2]]);
      if (e.key === "z" || e.key === "Z")
        onRotate([rotation[0], rotation[1], rotation[2] + step]);
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [rotation, onRotate, isFocused]);

  return (
    <group
      ref={ref}
      scale={scale}
      position={position}
      rotation={rotation}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      onWheel={handleWheel}
    >
      <primitive object={gltf.scene} />
    </group>
  );
}
