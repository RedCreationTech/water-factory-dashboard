import { useRef, useMemo, useState, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

/* ---------- Materials ---------- */
function useMaterials() {
  return useMemo(
    () => ({
      housing: new THREE.MeshStandardMaterial({
        color: '#7a8a9a',
        metalness: 0.8,
        roughness: 0.3,
        envMapIntensity: 1.0,
      }),
      impeller: new THREE.MeshStandardMaterial({
        color: '#c0d0e0',
        metalness: 0.95,
        roughness: 0.15,
        envMapIntensity: 1.2,
      }),
      motor: new THREE.MeshStandardMaterial({
        color: '#3a4a5a',
        metalness: 0.6,
        roughness: 0.5,
        envMapIntensity: 0.8,
      }),
      pipe: new THREE.MeshStandardMaterial({
        color: '#9aabbb',
        metalness: 0.75,
        roughness: 0.35,
        envMapIntensity: 0.9,
      }),
      flange: new THREE.MeshStandardMaterial({
        color: '#5a6a7a',
        metalness: 0.85,
        roughness: 0.3,
        envMapIntensity: 0.9,
      }),
      base: new THREE.MeshStandardMaterial({
        color: '#4a5568',
        metalness: 0.7,
        roughness: 0.5,
        envMapIntensity: 0.7,
      }),
      accent: new THREE.MeshBasicMaterial({
        color: '#00e5ff',
        transparent: true,
        opacity: 0.6,
      }),
      wireframe: new THREE.MeshBasicMaterial({
        color: '#00c8ff',
        wireframe: true,
        transparent: true,
        opacity: 0.15,
      }),
    }),
    []
  );
}

/* ---------- Impeller Blade Geometry ---------- */
function createBladeGeometry(): THREE.Shape {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.quadraticCurveTo(0.15, 0.08, 0.35, 0.12);
  shape.lineTo(0.38, 0.1);
  shape.quadraticCurveTo(0.2, 0.04, 0.05, -0.02);
  shape.lineTo(0, 0);
  return shape;
}

/* ---------- BlowerModel ---------- */
interface BlowerModelProps {
  showWireframe: boolean;
}

function BlowerModel({ showWireframe }: BlowerModelProps) {
  const impellerRef = useRef<THREE.Group>(null);
  const materials = useMaterials();

  // Rotation of the fan/impeller
  useFrame((_, delta) => {
    if (impellerRef.current) {
      impellerRef.current.rotation.z -= delta * 3.0;
    }
  });

  const bladeShape = useMemo(() => createBladeGeometry(), []);
  const bladeExtrudeSettings = useMemo(
    () => ({
      steps: 1,
      depth: 0.04,
      bevelEnabled: false,
    }),
    []
  );

  return (
    <group>
      {/* ---- Main housing cylinder (large) ---- */}
      <mesh position={[0, 0, 0]} material={materials.housing} castShadow>
        <cylinderGeometry args={[0.85, 0.85, 2.6, 32]} />
      </mesh>
      {showWireframe && (
        <mesh position={[0, 0, 0]} material={materials.wireframe}>
          <cylinderGeometry args={[0.86, 0.86, 2.61, 32]} />
        </mesh>
      )}

      {/* Housing end caps (flanges) */}
      <mesh position={[0, 1.3, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.flange}>
        <cylinderGeometry args={[0.92, 0.92, 0.12, 32]} />
      </mesh>
      <mesh position={[0, -1.3, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.flange}>
        <cylinderGeometry args={[0.92, 0.92, 0.12, 32]} />
      </mesh>

      {/* ---- Inlet volute (curved pipe on bottom) ---- */}
      <mesh position={[0, -1.65, 0]} material={materials.pipe} castShadow>
        <cylinderGeometry args={[0.42, 0.42, 0.7, 24]} />
      </mesh>
      {/* Inlet flange */}
      <mesh position={[0, -2.02, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.flange}>
        <cylinderGeometry args={[0.58, 0.58, 0.1, 24]} />
      </mesh>
      {/* Inlet label marker */}
      <mesh position={[0, -2.08, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.42, 0.58, 24]} />
        <meshBasicMaterial color="#00c8ff" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>

      {/* ---- Outlet diffuser (angled pipe on right) ---- */}
      <mesh
        position={[0.55, 0.7, 0]}
        rotation={[0, 0, -Math.PI / 5]}
        material={materials.pipe}
        castShadow
      >
        <cylinderGeometry args={[0.48, 0.52, 1.1, 24]} />
      </mesh>
      {showWireframe && (
        <mesh
          position={[0.55, 0.7, 0]}
          rotation={[0, 0, -Math.PI / 5]}
          material={materials.wireframe}
        >
          <cylinderGeometry args={[0.49, 0.53, 1.11, 24]} />
        </mesh>
      )}
      {/* Outlet flange */}
      <mesh
        position={[0.82, 1.38, 0]}
        rotation={[0, 0, -Math.PI / 5]}
        material={materials.flange}
      >
        <cylinderGeometry args={[0.62, 0.62, 0.1, 24]} />
      </mesh>
      {/* Outlet label marker */}
      <mesh
        position={[0.87, 1.47, 0]}
        rotation={[0, 0, -Math.PI / 5]}
      >
        <ringGeometry args={[0.52, 0.62, 24]} />
        <meshBasicMaterial color="#00c8ff" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>

      {/* ---- Motor housing (rectangular, attached to top) ---- */}
      <mesh position={[0, 1.75, 0]} material={materials.motor} castShadow>
        <boxGeometry args={[0.9, 0.7, 0.9]} />
      </mesh>
      {showWireframe && (
        <mesh position={[0, 1.75, 0]} material={materials.wireframe}>
          <boxGeometry args={[0.91, 0.71, 0.91]} />
        </mesh>
      )}

      {/* Motor cooling fins */}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh
          key={`fin-${i}`}
          position={[0, 1.45 + i * 0.08, 0.46]}
          material={materials.motor}
        >
          <boxGeometry args={[0.6, 0.04, 0.06]} />
        </mesh>
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh
          key={`fin-b-${i}`}
          position={[0, 1.45 + i * 0.08, -0.46]}
          material={materials.motor}
        >
          <boxGeometry args={[0.6, 0.04, 0.06]} />
        </mesh>
      ))}

      {/* ---- Coupling (connector between motor and blower) ---- */}
      <mesh position={[0, 1.38, 0]} material={materials.flange}>
        <cylinderGeometry args={[0.35, 0.38, 0.12, 16]} />
      </mesh>

      {/* ---- Impeller assembly ---- */}
      <group ref={impellerRef} position={[0, 1.28, 0]}>
        {/* Impeller hub */}
        <mesh material={materials.impeller}>
          <cylinderGeometry args={[0.18, 0.2, 0.2, 16]} />
        </mesh>
        {/* Impeller hub cap */}
        <mesh position={[0, 0.11, 0]} material={materials.impeller}>
          <cylinderGeometry args={[0.12, 0.18, 0.04, 16]} />
        </mesh>

        {/* 8 curved impeller blades */}
        {Array.from({ length: 8 }).map((_, i) => (
          <group key={i} rotation={[0, 0, (i * Math.PI) / 4]}>
            <mesh
              position={[0.2, 0, 0.02]}
              material={materials.impeller}
              castShadow
            >
              <extrudeGeometry args={[bladeShape, bladeExtrudeSettings]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ---- Base frame (I-beam style support structure) ---- */}
      {/* Main support beam */}
      <mesh position={[0, 0, 0.85]} material={materials.base} castShadow>
        <boxGeometry args={[1.6, 0.18, 0.5]} />
      </mesh>
      {/* Cross beam */}
      <mesh position={[0, -0.15, 0.85]} material={materials.base}>
        <boxGeometry args={[1.0, 0.12, 0.35]} />
      </mesh>
      {/* Support feet */}
      <mesh position={[-0.55, 0, 1.15]} material={materials.base}>
        <boxGeometry args={[0.22, 0.55, 0.16]} />
      </mesh>
      <mesh position={[0.55, 0, 1.15]} material={materials.base}>
        <boxGeometry args={[0.22, 0.55, 0.16]} />
      </mesh>
      {/* Front support foot */}
      <mesh position={[0, -0.1, 1.08]} material={materials.base}>
        <boxGeometry args={[0.8, 0.1, 0.12]} />
      </mesh>

      {/* ---- Cyan accent ring ---- */}
      <mesh position={[0, 0.6, 0.84]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.6, 0.66, 32]} />
        <meshBasicMaterial color="#00e5ff" transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>

      {/* ---- Glow ring around the body ---- */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.92, 0.012, 8, 64]} />
        <meshBasicMaterial color="#00c8ff" transparent opacity={0.25} />
      </mesh>

      {/* ---- Ground reflection plane ---- */}
      <mesh position={[0, -1.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5, 5]} />
        <meshBasicMaterial color="#060e18" transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

/* ---------- BlowerScene ---------- */
interface BlowerSceneProps {
  showWireframe: boolean;
}

function BlowerScene({ showWireframe }: BlowerSceneProps) {
  return (
    <>
      {/* Ambient light */}
      <ambientLight intensity={0.35} />

      {/* Key light (main directional) */}
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.5}
        color="#d0e8ff"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Fill light (cool blue from opposite side) */}
      <directionalLight position={[-4, 3, -3]} intensity={0.5} color="#00c8ff" />

      {/* Rim light (from behind/below for edge definition) */}
      <directionalLight position={[-2, -3, 4]} intensity={0.4} color="#4488ff" />

      {/* Studio point lights for metallic reflections */}
      <pointLight position={[3, 4, 4]} intensity={1.2} color="#e0f0ff" distance={12} />
      <pointLight position={[-3, 2, 4]} intensity={0.8} color="#00e5ff" distance={10} />
      <pointLight position={[0, 4, -3]} intensity={0.6} color="#88ccff" distance={10} />
      <pointLight position={[0, -2, 3]} intensity={0.4} color="#4488ff" distance={8} />

      {/* Top accent light */}
      <pointLight position={[0, 5, 0]} intensity={0.5} color="#ffffff" distance={8} />

      {/* Model */}
      <group position={[0, 0, 0]} rotation={[0, -0.4, 0]}>
        <BlowerModel showWireframe={showWireframe} />
      </group>
    </>
  );
}

/* ---------- Scanning Line Overlay ---------- */
function ScanningLine() {
  const lineRef = useRef<HTMLDivElement>(null);

  useFrame(() => {
    if (lineRef.current) {
      const elapsed = performance.now() / 1000;
      const y = ((Math.sin(elapsed * 1.5) + 1) / 2) * 100;
      lineRef.current.style.top = `${y}%`;
    }
  });

  return (
    <div
      ref={lineRef}
      className="absolute left-0 right-0 pointer-events-none"
      style={{
        height: '1px',
        background: 'linear-gradient(90deg, transparent, #00e5ff, transparent)',
        boxShadow: '0 0 8px #00e5ff, 0 0 16px #00c8ff40',
        zIndex: 5,
      }}
    />
  );
}

/* ---------- Digital Twin Labels ---------- */
interface LabelData {
  id: string;
  text: string;
  x: string;
  y: string;
  align: 'left' | 'right';
}

const twinLabels: LabelData[] = [
  { id: 'impeller', text: '叶轮', x: '48%', y: '35%', align: 'right' },
  { id: 'motor', text: '电机', x: '52%', y: '22%', align: 'left' },
  { id: 'inlet', text: '进口', x: '42%', y: '75%', align: 'right' },
  { id: 'outlet', text: '出口', x: '72%', y: '32%', align: 'left' },
];

function TwinLabel({ label }: { label: LabelData }) {
  return (
    <div
      className="absolute flex items-center gap-1"
      style={{
        left: label.align === 'left' ? label.x : undefined,
        right: label.align === 'right' ? `calc(100% - ${label.x})` : undefined,
        top: label.y,
        transform: 'translateY(-50%)',
        zIndex: 6,
      }}
    >
      {label.align === 'right' && (
        <>
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00e5ff]" />
          <div className="w-6 h-px bg-gradient-to-r from-[#00c8ff] to-transparent" />
        </>
      )}
      <span
        className="text-[10px] px-1.5 py-0.5 rounded border border-[#00c8ff40] bg-[#081828cc] text-cyan-300 whitespace-nowrap"
        style={{ fontFamily: 'PingFang SC, sans-serif' }}
      >
        {label.text}
      </span>
      {label.align === 'left' && (
        <>
          <div className="w-6 h-px bg-gradient-to-l from-[#00c8ff] to-transparent" />
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#00e5ff]" />
        </>
      )}
    </div>
  );
}

/* ---------- DeviceModel3D (Canvas wrapper) ---------- */
export default function DeviceModel3D() {
  const [showWireframe, setShowWireframe] = useState(false);

  const toggleWireframe = useCallback(() => {
    setShowWireframe((prev) => !prev);
  }, []);

  return (
    <div
      className="w-full h-[200px] rounded-md overflow-hidden relative"
      style={{ backgroundColor: '#060e18' }}
    >
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [3, 2.5, 4], fov: 40 }}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl }) => {
          gl.setClearColor('#060e18');
        }}
      >
        <BlowerScene showWireframe={showWireframe} />
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={2}
          maxDistance={7}
          autoRotate
          autoRotateSpeed={0.5}
          enableDamping
          dampingFactor={0.05}
        />
        <ScanningLine />
      </Canvas>

      {/* Digital twin overlay labels */}
      {twinLabels.map((label) => (
        <TwinLabel key={label.id} label={label} />
      ))}

      {/* Corner info badge */}
      <div
        className="absolute top-1.5 left-1.5 flex items-center gap-1 px-1.5 py-0.5 rounded border border-[#00c8ff30] bg-[#081828cc]"
        style={{ zIndex: 7 }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_4px_#00e5ff] animate-pulse" />
        <span className="text-[9px] text-cyan-300" style={{ fontFamily: 'PingFang SC, sans-serif' }}>
          数字孪生
        </span>
      </div>

      {/* Controls */}
      <div
        className="absolute bottom-1.5 right-1.5 flex gap-1"
        style={{ zIndex: 7 }}
      >
        <button
          onClick={toggleWireframe}
          className="px-1.5 py-0.5 rounded text-[9px] border border-[#00c8ff30] bg-[#081828cc] text-cyan-300 hover:bg-[#0a1e32cc] transition-colors cursor-pointer"
          type="button"
        >
          {showWireframe ? '实体' : '线框'}
        </button>
      </div>
    </div>
  );
}
