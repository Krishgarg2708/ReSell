import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Center, Float } from '@react-three/drei';
import * as THREE from 'three';
import { 
  createSmartphoneModel, 
  createCameraModel, 
  createWatchModel, 
  createChairModel, 
  createHeadphonesModel,
  ModelResult 
} from './proceduralModels';
import { ModelType } from './ThreeInspectionStudio';

interface ModelRendererProps {
  modelType: ModelType;
  explodedFactor: number;
  autoRotate: boolean;
  materialColor?: number;
  onMetadata?: (meta: ModelResult) => void;
}

const _vec3 = new THREE.Vector3();

// Child component that manages the procedural Three.js model inside R3F Canvas
const ModelRenderer: React.FC<ModelRendererProps> = ({
  modelType,
  explodedFactor,
  autoRotate,
  materialColor,
  onMetadata,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const currentExplodeRef = useRef<number>(0);

  const modelData = useMemo(() => {
    let result: ModelResult;
    switch (modelType) {
      case 'camera':
        result = createCameraModel();
        break;
      case 'watch':
        result = createWatchModel();
        break;
      case 'chair':
        result = createChairModel();
        break;
      case 'headphones':
        result = createHeadphonesModel();
        break;
      case 'phone':
      default:
        result = createSmartphoneModel(materialColor);
        break;
    }
    return result;
  }, [modelType, materialColor]);

  useEffect(() => {
    if (onMetadata) {
      onMetadata(modelData);
    }
  }, [modelData, onMetadata]);

  useFrame((_, delta) => {
    // Smooth exponential damping for exploded view
    currentExplodeRef.current = THREE.MathUtils.damp(
      currentExplodeRef.current,
      explodedFactor,
      8,
      delta
    );

    const factor = currentExplodeRef.current;
    modelData.explodedParts.forEach((part) => {
      _vec3.copy(part.originPos).addScaledVector(part.targetOffset, factor);
      part.mesh.position.copy(_vec3);
    });

    // Auto-rotate if enabled and not currently exploded
    if (autoRotate && groupRef.current && factor < 0.05) {
      groupRef.current.rotation.y += delta * 0.4;
    }
  });

  return (
    <Center top>
      <group ref={groupRef}>
        <primitive object={modelData.group} />
      </group>
    </Center>
  );
};

export interface ProductViewerProps {
  modelType?: ModelType;
  className?: string;
  height?: string | number;
  autoRotate?: boolean;
  allowExplode?: boolean;
  showShadows?: boolean;
  onOpenAR?: () => void;
}

/**
 * Reusable 3D Product Viewer built with Three.js & React-Three-Fiber.
 * Features studio PBR environment, soft contact shadows, orbit controls,
 * and zero-occlusion layout.
 */
export const ProductViewer: React.FC<ProductViewerProps> = ({
  modelType = 'phone',
  className = '',
  height = '460px',
  autoRotate: initialAutoRotate = true,
  allowExplode = true,
  showShadows = true,
  onOpenAR,
}) => {
  const [exploded, setExploded] = useState(0);
  const [isRotating, setIsRotating] = useState(initialAutoRotate);
  const [activeMetadata, setActiveMetadata] = useState<ModelResult | null>(null);

  const containerHeight = typeof height === 'number' ? `${height}px` : height;

  return (
    <div 
      style={{ height: containerHeight }}
      className={`relative w-full bg-slate-950 rounded-2xl overflow-hidden select-none ${className}`}
    >
      {/* React-Three-Fiber Canvas */}
      <Canvas
        camera={{ position: [0, 1.5, 5.5], fov: 45 }}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        className="w-full h-full"
      >
        {/* Studio Lighting Rig */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.8}
          color="#fff4e6"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <directionalLight position={[-5, 4, -4]} intensity={0.8} color="#cce3ff" />
        <hemisphereLight args={['#e0f2fe', '#090d16', 0.6]} />

        {/* 3D Model Instance */}
        <ModelRenderer
          modelType={modelType}
          explodedFactor={exploded}
          autoRotate={isRotating}
          onMetadata={setActiveMetadata}
        />

        {/* Ground Soft Contact Shadows */}
        {showShadows && (
          <ContactShadows
            position={[0, -0.05, 0]}
            opacity={0.65}
            scale={8}
            blur={2.4}
            far={4}
            color="#000000"
          />
        )}

        {/* Orbit Controls with physical damping */}
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.05}
          minDistance={2.2}
          maxDistance={11}
          maxPolarAngle={Math.PI / 2 + 0.05}
        />
      </Canvas>

      {/* Top Spec Overlay Badge */}
      <div className="absolute top-3.5 left-3.5 z-10 pointer-events-none">
        <div className="px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-800 text-white shadow-lg pointer-events-auto flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-xs font-bold">R3F Studio PBR</span>
          {activeMetadata && (
            <span className="text-[11px] text-slate-400">· {activeMetadata.name}</span>
          )}
        </div>
      </div>

      {/* Bottom Floating Control Strip */}
      <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 z-10 w-[92%] max-w-lg p-2.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-800 text-white shadow-xl flex items-center justify-between gap-3 text-xs">
        {/* Exploded View Slider */}
        {allowExplode && (
          <div className="flex-1 flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-semibold whitespace-nowrap">
              Explode:
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={exploded}
              onChange={(e) => {
                setExploded(parseFloat(e.target.value));
                if (isRotating) setIsRotating(false);
              }}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <span className="text-[11px] font-mono text-slate-400 w-8 text-right">
              {Math.round(exploded * 100)}%
            </span>
          </div>
        )}

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Auto rotate toggle */}
          <button
            onClick={() => setIsRotating(!isRotating)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
              isRotating
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            360° {isRotating ? 'On' : 'Off'}
          </button>

          {/* AR Trigger Button */}
          {onOpenAR && (
            <button
              onClick={onOpenAR}
              className="px-3 py-1 rounded-lg text-[11px] font-bold text-white bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 transition-all flex items-center gap-1 shadow-xs"
            >
              <span>View in AR</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Export as both ProductViewer and 3DProductViewer for flexible imports
export const ThreeDProductViewer = ProductViewer;
export default ProductViewer;
