import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { 
  X, 
  Camera, 
  RotateCw, 
  Maximize2, 
  Minimize2, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle,
  Move,
  Check,
  SwitchCamera,
  Layers
} from 'lucide-react';
import { ModelType } from '../three/ThreeInspectionStudio';
import { 
  createSmartphoneModel, 
  createCameraModel, 
  createWatchModel, 
  createChairModel, 
  createHeadphonesModel,
  ModelResult 
} from '../three/proceduralModels';

interface ARViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  modelType: ModelType;
  productTitle: string;
}

export const ARViewerModal: React.FC<ARViewerModalProps> = ({
  isOpen,
  onClose,
  modelType,
  productTitle,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasMountRef = useRef<HTMLDivElement>(null);

  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isWebXRSupported, setIsWebXRSupported] = useState<boolean>(false);
  const [scale, setScale] = useState<number>(1.0);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [showPlacementGuide, setShowPlacementGuide] = useState<boolean>(true);

  // Three.js mutable state
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const shadowMeshRef = useRef<THREE.Mesh | null>(null);

  // Position & rotation state for dragging
  const posRef = useRef<{ x: number; y: number; z: number }>({ x: 0, y: -0.8, z: -3.5 });
  const rotYRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const lastPointerRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // (1) Check WebXR support
  useEffect(() => {
    if (typeof navigator !== 'undefined' && 'xr' in navigator) {
      (navigator as any).xr?.isSessionSupported?.('immersive-ar')
        .then((supported: boolean) => {
          setIsWebXRSupported(supported);
        })
        .catch(() => setIsWebXRSupported(false));
    }
  }, []);

  // (2) Camera stream management
  useEffect(() => {
    if (!isOpen) return;

    let mediaStream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        setErrorMessage('');
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: false,
        });

        mediaStream = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setHasCameraPermission(true);
      } catch (err: any) {
        console.warn('Camera access denied or unavailable:', err);
        setHasCameraPermission(false);
        setErrorMessage(
          'Camera access was denied or not available. Displaying simulated physical studio pass-through.'
        );
      }
    };

    startCamera();

    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen, facingMode]);

  // (3) Three.js transparent overlay setup
  useEffect(() => {
    if (!isOpen || !canvasMountRef.current) return;

    const container = canvasMountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // Natural lighting rig matching room environment
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    const sunLight = new THREE.DirectionalLight(0xfff8ee, 2.0);
    sunLight.position.set(2, 6, 3);
    const bounceLight = new THREE.DirectionalLight(0xcfe2ff, 0.6);
    bounceLight.position.set(-3, -2, -2);
    scene.add(ambientLight, sunLight, bounceLight);

    // Build the 3D model
    let modelResult: ModelResult;
    switch (modelType) {
      case 'camera':
        modelResult = createCameraModel();
        break;
      case 'watch':
        modelResult = createWatchModel();
        break;
      case 'chair':
        modelResult = createChairModel();
        break;
      case 'headphones':
        modelResult = createHeadphonesModel();
        break;
      case 'phone':
      default:
        modelResult = createSmartphoneModel();
        break;
    }

    const modelGroup = new THREE.Group();
    modelGroup.add(modelResult.group);
    modelGroup.position.set(posRef.current.x, posRef.current.y, posRef.current.z);
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    // Contact Ground Shadow Plane for physical grounding
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const ctx = shadowCanvas.getContext('2d')!;
    const grad = ctx.createRadialGradient(128, 128, 10, 128, 128, 120);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0.65)');
    grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.25)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.5, 3.5), shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.set(posRef.current.x, posRef.current.y - 1.2, posRef.current.z);
    scene.add(shadowMesh);
    shadowMeshRef.current = shadowMesh;

    // Animation Loop
    let animId = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (modelGroupRef.current) {
        modelGroupRef.current.position.set(posRef.current.x, posRef.current.y, posRef.current.z);
        modelGroupRef.current.rotation.y = rotYRef.current;
        modelGroupRef.current.scale.set(scale, scale, scale);

        if (shadowMeshRef.current) {
          shadowMeshRef.current.position.set(posRef.current.x, posRef.current.y - 1.2 * scale, posRef.current.z);
          shadowMeshRef.current.scale.set(scale, scale, scale);
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isOpen, modelType, scale]);

  if (!isOpen) return null;

  // Pointer interactions for dragging and rotating in physical space
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    lastPointerRef.current = { x: e.clientX, y: e.clientY };
    if (showPlacementGuide) setShowPlacementGuide(false);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastPointerRef.current.x;
    const dy = e.clientY - lastPointerRef.current.y;

    if (e.shiftKey || e.buttons === 2) {
      // Rotate
      rotYRef.current += dx * 0.01;
    } else {
      // Translate in camera plane
      posRef.current.x += dx * 0.005;
      posRef.current.y -= dy * 0.005;
    }

    lastPointerRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  // Capture photo combining video and 3D canvas
  const handleCapturePhoto = () => {
    const video = videoRef.current;
    const canvas = rendererRef.current?.domElement;
    if (!video || !canvas) return;

    const snapCanvas = document.createElement('canvas');
    snapCanvas.width = canvas.width;
    snapCanvas.height = canvas.height;
    const ctx = snapCanvas.getContext('2d');
    if (!ctx) return;

    // Draw camera video feed
    ctx.drawImage(video, 0, 0, snapCanvas.width, snapCanvas.height);
    // Draw 3D model canvas on top
    ctx.drawImage(canvas, 0, 0);

    const dataUrl = snapCanvas.toDataURL('image/jpeg', 0.95);
    setCapturedPhoto(dataUrl);
  };

  // Trigger Native WebXR Session if supported
  const handleLaunchWebXR = async () => {
    try {
      const xr = (navigator as any).xr;
      if (xr) {
        const session = await xr.requestSession('immersive-ar', {
          requiredFeatures: ['hit-test'],
          optionalFeatures: ['dom-overlay'],
          domOverlay: { root: document.body },
        });
        session.addEventListener('end', () => {
          // Native AR ended
        });
      }
    } catch (e) {
      console.warn('WebXR launch failed, continuing with Camera pass-through:', e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black select-none">
      {/* Background Live Camera Video Feed */}
      <video
        ref={videoRef}
        playsInline
        autoPlay
        muted
        className="absolute inset-0 w-full h-full object-cover z-0"
      />

      {/* Simulated physical room backdrop if camera is blocked/denied */}
      {hasCameraPermission === false && (
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 flex items-center justify-center">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />
        </div>
      )}

      {/* Transparent 3D Overlay Canvas */}
      <div
        ref={canvasMountRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="absolute inset-0 w-full h-full z-10 cursor-grab active:cursor-grabbing touch-none"
      />

      {/* AR Surface Reticle Helper */}
      {showPlacementGuide && (
        <div className="absolute inset-0 pointer-events-none z-15 flex flex-col items-center justify-center">
          <div className="w-48 h-48 rounded-full border-2 border-dashed border-white/60 animate-spin [animation-duration:12s] flex items-center justify-center">
            <div className="w-32 h-32 rounded-full border border-blue-400/80 bg-blue-500/10 flex items-center justify-center">
              <Move className="w-6 h-6 text-white/90 animate-bounce" />
            </div>
          </div>
          <p className="mt-4 px-4 py-2 rounded-xl bg-black/75 backdrop-blur-md text-xs font-semibold text-white shadow-lg">
            Drag to position · Shift-drag to rotate in your room
          </p>
        </div>
      )}

      {/* Top Header Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between gap-3 pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-800 text-white shadow-xl flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <div>
              <span className="text-xs font-bold block leading-tight">
                AR Environment Projector
              </span>
              <span className="text-[10px] text-slate-400 truncate max-w-[160px] sm:max-w-xs block">
                {productTitle}
              </span>
            </div>
          </div>

          {isWebXRSupported && (
            <button
              onClick={handleLaunchWebXR}
              className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md hover:bg-blue-700 pointer-events-auto"
            >
              Native WebXR AR
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Flip camera */}
          <button
            onClick={() => setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'))}
            className="p-2.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-800 text-white hover:bg-slate-800 shadow-xl"
            title="Switch Camera"
          >
            <SwitchCamera className="w-4 h-4" />
          </button>

          {/* Close AR */}
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-800 text-white hover:bg-slate-800 shadow-xl"
            title="Exit AR View"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Captured Photo Preview Modal */}
      {capturedPhoto && (
        <div className="absolute inset-0 z-30 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-400" />
                AR Room Snapshot Saved
              </span>
              <button onClick={() => setCapturedPhoto(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <img src={capturedPhoto} alt="AR Snapshot" className="w-full rounded-xl object-cover" />

            <div className="flex items-center justify-end gap-2">
              <a
                href={capturedPhoto}
                download={`ReSell_AR_Snapshot_${Date.now()}.jpg`}
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
              >
                Download Photo
              </a>
              <button
                onClick={() => setCapturedPhoto(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 rounded-xl"
              >
                Back to AR
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Floating AR Controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-lg p-4 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-slate-800 text-white shadow-2xl space-y-3">
        {/* Scale Controls */}
        <div className="flex items-center justify-between gap-3 text-xs">
          <span className="text-slate-400 font-semibold whitespace-nowrap">Physical Scale:</span>
          <div className="flex items-center gap-2 flex-1">
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.05"
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <span className="font-mono text-slate-300 tabular-nums w-10 text-right">
              {Math.round(scale * 100)}%
            </span>
          </div>

          <button
            onClick={() => setScale(1.0)}
            className={`px-2 py-1 rounded-md text-[11px] font-bold ${
              scale === 1.0 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            1:1 True Scale
          </button>
        </div>

        {/* Action Buttons: Rotate & Snapshot */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
          <button
            onClick={() => {
              rotYRef.current += Math.PI / 4;
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1.5"
          >
            <RotateCw className="w-3.5 h-3.5 text-blue-400" />
            <span>Turn 45°</span>
          </button>

          <button
            onClick={() => {
              posRef.current = { x: 0, y: -0.8, z: -3.5 };
              rotYRef.current = 0;
              setScale(1.0);
            }}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-xs font-semibold text-slate-300 transition-colors"
          >
            Re-Center
          </button>

          <button
            onClick={handleCapturePhoto}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-xs font-bold text-white shadow-lg transition-all flex items-center gap-1.5"
          >
            <Camera className="w-4 h-4" />
            <span>Snap Photo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
