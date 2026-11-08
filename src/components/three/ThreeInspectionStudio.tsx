import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { 
  RotateCw, 
  Layers, 
  Sun, 
  Maximize2, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  ShieldCheck, 
  Info,
  CheckCircle2,
  Sliders
} from 'lucide-react';
import { 
  createSmartphoneModel, 
  createCameraModel, 
  createWatchModel, 
  createChairModel, 
  createHeadphonesModel,
  ModelResult
} from './proceduralModels';

export type ModelType = 'phone' | 'camera' | 'watch' | 'chair' | 'headphones';

export interface ThreeInspectionStudioProps {
  initialModel?: ModelType;
  className?: string;
  isEmbedded?: boolean;
}

// Module-scope reusable math helpers to enforce Zero GC in render loop
const _vec3 = new THREE.Vector3();

export const ThreeInspectionStudio: React.FC<ThreeInspectionStudioProps> = ({
  initialModel = 'phone',
  className = '',
  isEmbedded = false,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // UI state (zero-occlusion collapsible bottom dock)
  const [selectedModel, setSelectedModel] = useState<ModelType>(initialModel);
  const [explodedFactor, setExplodedFactor] = useState<number>(0);
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(true);
  const [lightingPreset, setLightingPreset] = useState<'studio' | 'warm' | 'cool'>('studio');
  const [isControlsCollapsed, setIsControlsCollapsed] = useState<boolean>(false);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [modelMetadata, setModelMetadata] = useState<ModelResult | null>(null);

  // Mutable refs for Three.js lifecycle
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const currentModelRef = useRef<ModelResult | null>(null);
  const keyLightRef = useRef<THREE.DirectionalLight | null>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);

  // Target exploded factor for smooth exponential damping
  const targetExplodeRef = useRef<number>(0);
  const currentExplodeRef = useRef<number>(0);
  const isAutoRotateRef = useRef<boolean>(isAutoRotate);
  const isUserInteractingRef = useRef<boolean>(false);

  targetExplodeRef.current = explodedFactor;
  isAutoRotateRef.current = isAutoRotate;

  // Initialize Three.js scene once
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // (1) Detect software WebGL guard
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch (e) {
        return false;
      }
    })();

    // (2) Scene Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x090d16);
    scene.fog = new THREE.Fog(0x090d16, 12, 28);

    // (3) Camera Setup
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 1.8, 6.5);
    cameraRef.current = camera;

    // (4) Renderer Setup
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    rendererRef.current = renderer;
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // (5) Studio Environment Map via PMREMGenerator & RoomEnvironment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // (6) Studio 3-Point Lighting Rig
    const keyLight = new THREE.DirectionalLight(0xfff3e0, 2.2);
    keyLight.position.set(5, 8, 6);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);
    keyLightRef.current = keyLight;

    const fillLight = new THREE.DirectionalLight(0xa5c9ff, 1.0);
    fillLight.position.set(-6, 3, -4);
    scene.add(fillLight);

    const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0x090d16, 0.7);
    scene.add(hemiLight);
    hemiLightRef.current = hemiLight;

    // (7) Contact Shadow Grounding Plane (prevents floating in space)
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const shadowCtx = shadowCanvas.getContext('2d')!;
    const shadowGrad = shadowCtx.createRadialGradient(128, 128, 10, 128, 128, 120);
    shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.55)');
    shadowGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.2)');
    shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    shadowCtx.fillStyle = shadowGrad;
    shadowCtx.fillRect(0, 0, 256, 256);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(new THREE.PlaneGeometry(6, 6), shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -2.2;
    scene.add(shadowMesh);

    // Subtle studio floor grid
    const gridHelper = new THREE.GridHelper(14, 28, 0x1e293b, 0x0f172a);
    gridHelper.position.y = -2.21;
    scene.add(gridHelper);

    // (8) Orbit Controls with physical damping
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 2.5;
    controls.maxDistance = 14;
    controls.maxPolarAngle = Math.PI / 2 + 0.1; // prevent camera below floor
    controlsRef.current = controls;

    // (9) Animation Render Loop with exponential damping
    let animFrameId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Smooth exponential damping for exploded view separation
      currentExplodeRef.current = THREE.MathUtils.damp(
        currentExplodeRef.current,
        targetExplodeRef.current,
        8,
        delta
      );

      // Apply exploded offsets to parts
      if (currentModelRef.current) {
        const factor = currentExplodeRef.current;
        currentModelRef.current.explodedParts.forEach((part) => {
          _vec3.copy(part.originPos).addScaledVector(part.targetOffset, factor);
          part.mesh.position.copy(_vec3);
        });

        // Auto-rotation if enabled and user not dragging
        if (isAutoRotateRef.current && !isUserInteractingRef.current) {
          currentModelRef.current.group.rotation.y += delta * 0.45;
        }
      }

      controls.update();
      renderer.render(scene, camera);
    };

    controls.addEventListener('start', () => {
      isUserInteractingRef.current = true;
    });
    controls.addEventListener('end', () => {
      isUserInteractingRef.current = false;
    });

    animate();

    // Resize Observer for fluid responsiveness
    const resizeObserver = new ResizeObserver(() => {
      if (!container || !renderer || !camera) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
    resizeObserver.observe(container);

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animFrameId);
      resizeObserver.disconnect();
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Update Model when selectedModel changes
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Remove existing model
    if (currentModelRef.current) {
      scene.remove(currentModelRef.current.group);
      currentModelRef.current = null;
    }

    // Build new procedural model
    let modelData: ModelResult;
    switch (selectedModel) {
      case 'camera':
        modelData = createCameraModel();
        break;
      case 'watch':
        modelData = createWatchModel();
        break;
      case 'chair':
        modelData = createChairModel();
        break;
      case 'headphones':
        modelData = createHeadphonesModel();
        break;
      case 'phone':
      default:
        modelData = createSmartphoneModel();
        break;
    }

    modelData.group.position.set(0, 0, 0);
    scene.add(modelData.group);
    currentModelRef.current = modelData;
    setModelMetadata(modelData);

    // Reset exploded factor to 0 on model switch
    setExplodedFactor(0);
    setActiveHotspot(null);
  }, [selectedModel]);

  // Lighting Preset Switcher
  useEffect(() => {
    const key = keyLightRef.current;
    const hemi = hemiLightRef.current;
    if (!key || !hemi) return;

    if (lightingPreset === 'warm') {
      key.color.setHex(0xffd194);
      key.intensity = 2.4;
      hemi.color.setHex(0xffedd5);
      hemi.groundColor.setHex(0x1e1510);
    } else if (lightingPreset === 'cool') {
      key.color.setHex(0xbcd9ff);
      key.intensity = 2.0;
      hemi.color.setHex(0xdbeafe);
      hemi.groundColor.setHex(0x0c1424);
    } else {
      // studio
      key.color.setHex(0xfff3e0);
      key.intensity = 2.2;
      hemi.color.setHex(0xe0f2fe);
      hemi.groundColor.setHex(0x090d16);
    }
  }, [lightingPreset]);

  // Reset Camera View
  const handleResetCamera = () => {
    if (!cameraRef.current || !controlsRef.current) return;
    cameraRef.current.position.set(0, 1.8, 6.5);
    controlsRef.current.target.set(0, 0, 0);
    controlsRef.current.update();
  };

  const modelOptions = [
    { key: 'phone', label: 'Flagship Phone' },
    { key: 'camera', label: 'Vintage Camera' },
    { key: 'watch', label: 'Horology Watch' },
    { key: 'chair', label: 'Pellicle Chair' },
    { key: 'headphones', label: 'Studio Headphones' },
  ];

  return (
    <div className={`relative w-full overflow-hidden select-none bg-slate-950 ${className}`}>
      {/* 3D WebGL Canvas Mount Container */}
      <div ref={mountRef} className="w-full h-full min-h-[520px] lg:min-h-[640px]" />

      {/* Top Spec & Diagnostic Badge (Zero Occlusion Top-Left) */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none max-w-xs sm:max-w-md">
        <div className="p-3.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-800 text-white shadow-xl space-y-1.5 pointer-events-auto">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-blue-600/20 text-blue-400">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
              Studio 3D PBR Inspection
            </span>
          </div>

          <h2 className="text-sm sm:text-base font-extrabold text-white leading-tight">
            {modelMetadata?.name || 'Interactive Inspection'}
          </h2>

          <div className="space-y-1 pt-1 border-t border-slate-800/80">
            {modelMetadata?.specs.slice(0, 2).map((s, i) => (
              <div key={i} className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400">{s.label}:</span>
                <span className="font-semibold text-emerald-400">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top-Right Quick View Actions */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
        <button
          onClick={handleResetCamera}
          className="p-2 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors shadow-lg"
          title="Reset Camera View"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
        <button
          onClick={() => setIsAutoRotate(!isAutoRotate)}
          className={`p-2 rounded-xl backdrop-blur-md border transition-colors shadow-lg ${
            isAutoRotate
              ? 'bg-blue-600 text-white border-blue-500'
              : 'bg-slate-900/85 border-slate-800 text-slate-400 hover:text-white'
          }`}
          title={isAutoRotate ? 'Pause 360° Rotation' : 'Resume 360° Rotation'}
        >
          <RotateCw className="w-4 h-4" />
        </button>
      </div>

      {/* Central Viewport Guidance Helper */}
      <div className="absolute top-1/2 left-4 -translate-y-1/2 pointer-events-none hidden sm:block text-[11px] text-slate-500 font-mono rotate-[-90deg]">
        DRAG TO ORBIT · SCROLL TO ZOOM
      </div>

      {/* Ergonomic Bottom Control Dock (Zero Viewport Occlusion) */}
      <div
        className="absolute z-20 transition-all duration-300 ease-out"
        style={{
          bottom: isControlsCollapsed ? '-140px' : '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'min(920px, 94vw)',
        }}
      >
        {/* Collapse / Expand Tab */}
        <div className="flex justify-center mb-1">
          <button
            onClick={() => setIsControlsCollapsed(!isControlsCollapsed)}
            className="px-3.5 py-1 rounded-t-xl bg-slate-900/90 backdrop-blur-md border border-b-0 border-slate-800 text-[11px] font-semibold text-slate-300 hover:text-white flex items-center gap-1 shadow-md transition-colors"
          >
            {isControlsCollapsed ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                <span>Show 3D Controls</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                <span>Hide Controls</span>
              </>
            )}
          </button>
        </div>

        {/* Dock Surface */}
        <div className="p-4 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-800 shadow-2xl space-y-3.5 text-white">
          {/* Row 1: Model Selection Chips */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 hidden sm:inline">
              Subject:
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {modelOptions.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setSelectedModel(opt.key as ModelType)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedModel === opt.key
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-750 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Row 2: Exploded View Slider & Lighting Modes */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center pt-2 border-t border-slate-800/80">
            {/* Exploded View Slider */}
            <div className="sm:col-span-7 flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 shrink-0">
                <Layers className="w-3.5 h-3.5 text-blue-400" />
                Exploded View:
              </span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={explodedFactor}
                onChange={(e) => {
                  setExplodedFactor(parseFloat(e.target.value));
                  if (isAutoRotate) setIsAutoRotate(false);
                }}
                className="flex-1 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <span className="text-xs font-mono text-slate-400 tabular-nums w-10 text-right">
                {Math.round(explodedFactor * 100)}%
              </span>
            </div>

            {/* Lighting Studio Presets */}
            <div className="sm:col-span-5 flex items-center justify-between sm:justify-end gap-2">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                Rig:
              </span>
              <div className="inline-flex rounded-lg bg-slate-800/80 p-0.5 border border-slate-700">
                {(['studio', 'warm', 'cool'] as const).map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setLightingPreset(preset)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium capitalize transition-colors ${
                      lightingPreset === preset
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
