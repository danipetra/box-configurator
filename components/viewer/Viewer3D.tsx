'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { MeshStandardMaterial } from 'three';
import { useBoxTextures } from './useBoxTextures';
import { useMemo, useEffect } from 'react';

function BoxMesh() {
  const textures = useBoxTextures();

  // materials: array in right, left, top, bottom, front, back order if textures exist, otherwise null
  const mats = useMemo(() => {
  if (!textures) return null;
    return [
      new MeshStandardMaterial({ map: textures.right }),
      new MeshStandardMaterial({ map: textures.left }),
      new MeshStandardMaterial({ map: textures.top }),
      new MeshStandardMaterial({ map: textures.bottom }),
      new MeshStandardMaterial({ map: textures.front }),
      new MeshStandardMaterial({ map: textures.back }),
    ];
  }, [textures]);

  useEffect(() => {
    return () => { mats?.forEach(m => m.dispose()); };
  }, [mats]);

  return (
    <mesh>
      <boxGeometry args={[0.08, 0.15, 0.08]} />
      {mats ? (
        mats.map((m, i) => <primitive key={i} object={m} attach={`material-${i}`} />)
      ) : (
        <meshStandardMaterial />
      )}
    </mesh>
  );
}

export default function Viewer3D() {
  return (
    <div className="h-full w-full">
      <Canvas camera={{ position: [0.25, 0.2, 0.25], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 2, 2]} intensity={1} />
        <BoxMesh />
        <OrbitControls enableDamping />
      </Canvas>
    </div>
  );
}