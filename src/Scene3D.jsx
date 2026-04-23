import { useMemo } from "react";
import { OrbitControls, Grid, Center } from "@react-three/drei";

export function Scene3D({ vals }) {
    const points = useMemo(() => {
        const coords = [];
        for (let i = 0; i < vals.length - 2; i += 3) {
            // Mnożymy przez 6 dla lepszej skali na siatce
            coords.push(vals[i] * 6, vals[i + 1] * 6, vals[i + 2] * 6);
        }
        return new Float32Array(coords);
    }, [vals]);

    return (
        <>
            <ambientLight intensity={1.5} />
            <pointLight position={[10, 10, 10]} />

            {/* Osie: Czerwona (X), Zielona (Y), Niebieska (Z) */}
            <axesHelper args={[7]} />

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
                        size={0.15}
                        sizeAttenuation={true}
                        transparent
                        opacity={0.8}
                    />
                </points>
            </Center>

            <Grid
                infiniteGrid
                fadeDistance={30}
                sectionSize={1}
                cellSize={0.5}
                sectionColor="#cbd5e1"
                cellColor="#f1f5f9"
            />
            <OrbitControls makeDefault />
        </>
    );
}