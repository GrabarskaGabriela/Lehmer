import { useMemo } from 'react';
import { OrbitControls, Grid, Center } from '@react-three/drei';

export function Scene3D({ vals }) {
  const SCALE = 6;

  const points = useMemo(() => {
    if (!vals || vals.length < 3) return new Float32Array(0);

    const coords = [];
    for (let i = 0; i < vals.length - 2; i += 3) {
      coords.push(vals[i] * SCALE, vals[i + 1] * SCALE, vals[i + 2] * SCALE);
    }
    return new Float32Array(coords);
  }, [vals, SCALE]);

  if (!vals || vals.length === 0) return null;

  return (
    <>
      <ambientLight intensity={1.5} />
      <pointLight position={[10, 10, 10]} />
      <axesHelper args={[SCALE + 1]} />

      <Center top position={[0, 0, 0]}>
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={points.length / 3}
              array={points}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            color="#2563eb"
            size={0.08}
            sizeAttenuation={true}
            transparent
            opacity={0.8}
          />
        </points>

        <mesh position={[SCALE / 2, SCALE / 2, SCALE / 2]}>
          <boxGeometry args={[SCALE, SCALE, SCALE]} />
          <meshBasicMaterial color="#64748b" wireframe transparent opacity={0.2} />
        </mesh>
      </Center>

      <Grid
        infiniteGrid
        fadeDistance={30}
        sectionSize={SCALE}
        cellSize={1}
        sectionColor="#cbd5e1"
        cellColor="#f1f5f9"
      />
      <OrbitControls makeDefault />
    </>
  );
}
