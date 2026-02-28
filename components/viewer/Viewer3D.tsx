'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function BoxMesh() {
  // dimensioni in "unità" coerenti: 80x80x150mm => 0.08,0.08,0.15 (metri)
  return (
    <mesh>
      <boxGeometry args={[0.08, 0.15, 0.08]} />
      <meshStandardMaterial />
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