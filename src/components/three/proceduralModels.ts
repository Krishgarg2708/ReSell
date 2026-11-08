import * as THREE from 'three';

export interface ExplodedPart {
  mesh: THREE.Object3D;
  originPos: THREE.Vector3;
  targetOffset: THREE.Vector3;
}

export interface ModelResult {
  group: THREE.Group;
  explodedParts: ExplodedPart[];
  name: string;
  category: string;
  specs: { label: string; value: string }[];
}

/**
 * Creates procedural texture for camera vulcanite leather or grip
 */
function createLeatherTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#1e1e1e';
  ctx.fillRect(0, 0, 256, 256);

  // Perlin/noise stipples for leather pebble texture
  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * 256;
    const y = Math.random() * 256;
    const r = Math.random() * 1.5 + 0.5;
    const val = Math.floor(Math.random() * 30 + 15);
    ctx.fillStyle = `rgb(${val}, ${val}, ${val})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * Creates procedural brushed watch dial texture
 */
function createWatchDialTexture(dialColor: string = '#04432a'): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Radial sunburst gradient
  const grad = ctx.createRadialGradient(256, 256, 10, 256, 256, 256);
  grad.addColorStop(0, '#0a6c45');
  grad.addColorStop(0.7, dialColor);
  grad.addColorStop(1, '#021e12');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(256, 256, 250, 0, Math.PI * 2);
  ctx.fill();

  // Draw hour markers
  ctx.strokeStyle = '#e6c670';
  ctx.lineWidth = 4;
  for (let i = 0; i < 12; i++) {
    const angle = (i * Math.PI) / 6;
    const x1 = 256 + Math.cos(angle) * 190;
    const y1 = 256 + Math.sin(angle) * 190;
    const x2 = 256 + Math.cos(angle) * 230;
    const y2 = 256 + Math.sin(angle) * 230;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * 1. FLAGSHIP SMARTPHONE (Titanium Chassis & Triple Camera System)
 */
export function createSmartphoneModel(materialColor: number = 0x2e3033): ModelResult {
  const group = new THREE.Group();
  group.name = 'SmartphoneModel';
  const explodedParts: ExplodedPart[] = [];

  // PBR Materials
  const titaniumMat = new THREE.MeshStandardMaterial({
    color: materialColor,
    metalness: 0.92,
    roughness: 0.22,
  });

  const screenMat = new THREE.MeshPhysicalMaterial({
    color: 0x050508,
    metalness: 0.1,
    roughness: 0.04,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
  });

  const backGlassMat = new THREE.MeshPhysicalMaterial({
    color: materialColor,
    metalness: 0.4,
    roughness: 0.28,
    clearcoat: 0.9,
  });

  const lensGlassMat = new THREE.MeshPhysicalMaterial({
    color: 0x010811,
    metalness: 0.8,
    roughness: 0.05,
    transmission: 0.4,
    transparent: true,
  });

  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xd4d8db,
    metalness: 0.98,
    roughness: 0.1,
  });

  // (1) Main Perimeter Frame
  const frameGeo = new THREE.BoxGeometry(2.4, 5.0, 0.25);
  const frameMesh = new THREE.Mesh(frameGeo, titaniumMat);
  frameMesh.castShadow = true;
  frameMesh.receiveShadow = true;
  group.add(frameMesh);
  explodedParts.push({
    mesh: frameMesh,
    originPos: frameMesh.position.clone(),
    targetOffset: new THREE.Vector3(0, 0, 0),
  });

  // (2) Front OLED Screen Plate (moves +Z on explode)
  const screenGeo = new THREE.BoxGeometry(2.28, 4.88, 0.02);
  const screenMesh = new THREE.Mesh(screenGeo, screenMat);
  screenMesh.position.set(0, 0, 0.135);
  group.add(screenMesh);
  explodedParts.push({
    mesh: screenMesh,
    originPos: screenMesh.position.clone(),
    targetOffset: new THREE.Vector3(0, 0, 1.2),
  });

  // (3) Dynamic Island sensor pill
  const pillGeo = new THREE.CapsuleGeometry(0.04, 0.28, 8, 16);
  pillGeo.rotateZ(Math.PI / 2);
  const pillMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
  const pillMesh = new THREE.Mesh(pillGeo, pillMat);
  pillMesh.position.set(0, 2.15, 0.147);
  group.add(pillMesh);
  explodedParts.push({
    mesh: pillMesh,
    originPos: pillMesh.position.clone(),
    targetOffset: new THREE.Vector3(0, 0, 1.35),
  });

  // (4) Rear Matte Glass Plate (moves -Z on explode)
  const backGeo = new THREE.BoxGeometry(2.32, 4.92, 0.02);
  const backMesh = new THREE.Mesh(backGeo, backGlassMat);
  backMesh.position.set(0, 0, -0.135);
  backMesh.castShadow = true;
  group.add(backMesh);
  explodedParts.push({
    mesh: backMesh,
    originPos: backMesh.position.clone(),
    targetOffset: new THREE.Vector3(0, 0, -1.2),
  });

  // (5) Camera Island Plateau (moves -Z further)
  const islandGeo = new THREE.BoxGeometry(1.05, 1.15, 0.06);
  const islandMesh = new THREE.Mesh(islandGeo, titaniumMat);
  islandMesh.position.set(-0.55, 1.75, -0.17);
  group.add(islandMesh);
  explodedParts.push({
    mesh: islandMesh,
    originPos: islandMesh.position.clone(),
    targetOffset: new THREE.Vector3(-0.4, 0.3, -1.8),
  });

  // 3 Camera Lenses with Bezels
  const lensPositions = [
    [-0.75, 2.05, -0.21],
    [-0.75, 1.45, -0.21],
    [-0.32, 1.75, -0.21],
  ];

  lensPositions.forEach(([x, y, z], i) => {
    // Outer metallic ring
    const ringGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.05, 24);
    ringGeo.rotateX(Math.PI / 2);
    const ringMesh = new THREE.Mesh(ringGeo, chromeMat);
    ringMesh.position.set(x, y, z);
    group.add(ringMesh);

    // Inner Glass Optic
    const glassGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.06, 24);
    glassGeo.rotateX(Math.PI / 2);
    const glassMesh = new THREE.Mesh(glassGeo, lensGlassMat);
    glassMesh.position.set(x, y, z - 0.01);
    group.add(glassMesh);

    explodedParts.push({
      mesh: ringMesh,
      originPos: ringMesh.position.clone(),
      targetOffset: new THREE.Vector3(-0.4, 0.3, -2.2 - i * 0.15),
    });
    explodedParts.push({
      mesh: glassMesh,
      originPos: glassMesh.position.clone(),
      targetOffset: new THREE.Vector3(-0.4, 0.3, -2.25 - i * 0.15),
    });
  });

  // Side buttons
  const volBtnGeo = new THREE.BoxGeometry(0.04, 0.45, 0.05);
  const vol1 = new THREE.Mesh(volBtnGeo, chromeMat);
  vol1.position.set(-1.22, 1.2, 0);
  const vol2 = new THREE.Mesh(volBtnGeo, chromeMat);
  vol2.position.set(-1.22, 0.6, 0);
  const pwr = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.65, 0.05), chromeMat);
  pwr.position.set(1.22, 0.9, 0);
  group.add(vol1, vol2, pwr);

  return {
    group,
    explodedParts,
    name: 'Pro Flagship Smartphone',
    category: 'Smartphones & Mobile',
    specs: [
      { label: 'Display Condition', value: '100% Scratch-Free Grade A' },
      { label: 'Frame Material', value: 'Grade 5 Brushed Titanium' },
      { label: 'Camera Array', value: 'Triple 48MP Sapphire Elements' },
      { label: 'Structural Integrity', value: 'Zero Frame Warp / Sealed IP68' },
    ],
  };
}

/**
 * 2. VINTAGE RANGEFINDER CAMERA (Leica M Style)
 */
export function createCameraModel(): ModelResult {
  const group = new THREE.Group();
  group.name = 'CameraModel';
  const explodedParts: ExplodedPart[] = [];

  const silverMat = new THREE.MeshStandardMaterial({
    color: 0xd8dede,
    metalness: 0.94,
    roughness: 0.22,
  });

  const blackMetalMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a1c,
    metalness: 0.88,
    roughness: 0.35,
  });

  const leatherTexture = createLeatherTexture();
  const leatherMat = new THREE.MeshStandardMaterial({
    map: leatherTexture,
    color: 0x222222,
    roughness: 0.85,
    metalness: 0.05,
  });

  const opticGlassMat = new THREE.MeshPhysicalMaterial({
    color: 0x051a2e,
    metalness: 0.6,
    roughness: 0.02,
    transmission: 0.6,
    transparent: true,
  });

  // (1) Central Body Core with Leather Wrap
  const bodyGeo = new THREE.BoxGeometry(3.6, 2.1, 1.2);
  const bodyMesh = new THREE.Mesh(bodyGeo, leatherMat);
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  group.add(bodyMesh);
  explodedParts.push({
    mesh: bodyMesh,
    originPos: bodyMesh.position.clone(),
    targetOffset: new THREE.Vector3(0, 0, 0),
  });

  // (2) Top Plate (Silver Anodized Alloy)
  const topPlateGeo = new THREE.BoxGeometry(3.64, 0.35, 1.24);
  const topPlateMesh = new THREE.Mesh(topPlateGeo, silverMat);
  topPlateMesh.position.set(0, 1.22, 0);
  topPlateMesh.castShadow = true;
  group.add(topPlateMesh);
  explodedParts.push({
    mesh: topPlateMesh,
    originPos: topPlateMesh.position.clone(),
    targetOffset: new THREE.Vector3(0, 1.2, 0),
  });

  // (3) Bottom Base Plate
  const bottomPlateGeo = new THREE.BoxGeometry(3.64, 0.2, 1.24);
  const bottomPlateMesh = new THREE.Mesh(bottomPlateGeo, silverMat);
  bottomPlateMesh.position.set(0, -1.15, 0);
  group.add(bottomPlateMesh);
  explodedParts.push({
    mesh: bottomPlateMesh,
    originPos: bottomPlateMesh.position.clone(),
    targetOffset: new THREE.Vector3(0, -0.8, 0),
  });

  // (4) Primary Lens Barrel (Forward +Z)
  const barrelGroup = new THREE.Group();
  barrelGroup.position.set(-0.2, 0, 0.6);

  // Stepped cylinder tiers
  const mountRing = new THREE.Mesh(
    new THREE.CylinderGeometry(0.85, 0.85, 0.3, 32).rotateX(Math.PI / 2),
    silverMat
  );
  mountRing.position.set(0, 0, 0.15);

  const apertureRing = new THREE.Mesh(
    new THREE.CylinderGeometry(0.8, 0.8, 0.45, 32).rotateX(Math.PI / 2),
    blackMetalMat
  );
  apertureRing.position.set(0, 0, 0.52);

  const focusBarrel = new THREE.Mesh(
    new THREE.CylinderGeometry(0.75, 0.75, 0.5, 32).rotateX(Math.PI / 2),
    silverMat
  );
  focusBarrel.position.set(0, 0, 0.98);

  const frontLensElement = new THREE.Mesh(
    new THREE.SphereGeometry(0.68, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2),
    opticGlassMat
  );
  frontLensElement.rotation.x = -Math.PI / 2;
  frontLensElement.position.set(0, 0, 1.15);

  barrelGroup.add(mountRing, apertureRing, focusBarrel, frontLensElement);
  group.add(barrelGroup);

  explodedParts.push({
    mesh: barrelGroup,
    originPos: barrelGroup.position.clone(),
    targetOffset: new THREE.Vector3(0, 0, 1.8),
  });

  // Viewfinder Window & Rangefinder prism
  const vfGeo = new THREE.BoxGeometry(0.4, 0.22, 0.15);
  const vfMesh = new THREE.Mesh(vfGeo, opticGlassMat);
  vfMesh.position.set(1.2, 1.24, 0.58);
  group.add(vfMesh);

  // Shutter release button & Dials on Top Plate
  const shutterBtn = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.18, 0.2, 24),
    silverMat
  );
  shutterBtn.position.set(-1.1, 1.48, 0.15);

  const dial1 = new THREE.Mesh(
    new THREE.CylinderGeometry(0.28, 0.28, 0.15, 24),
    silverMat
  );
  dial1.position.set(-0.4, 1.45, 0);

  const dial2 = new THREE.Mesh(
    new THREE.CylinderGeometry(0.35, 0.35, 0.18, 24),
    blackMetalMat
  );
  dial2.position.set(0.6, 1.46, 0);

  group.add(shutterBtn, dial1, dial2);
  explodedParts.push({
    mesh: shutterBtn,
    originPos: shutterBtn.position.clone(),
    targetOffset: new THREE.Vector3(-0.2, 1.7, 0),
  });
  explodedParts.push({
    mesh: dial1,
    originPos: dial1.position.clone(),
    targetOffset: new THREE.Vector3(0, 1.6, 0),
  });
  explodedParts.push({
    mesh: dial2,
    originPos: dial2.position.clone(),
    targetOffset: new THREE.Vector3(0.2, 1.65, 0),
  });

  return {
    group,
    explodedParts,
    name: 'Vintage Rangefinder 35mm Camera',
    category: 'DSLR & Optics',
    specs: [
      { label: 'Optical Condition', value: 'Zero Dust, Fungus or Haze' },
      { label: 'Shutter Mechanism', value: 'Clockwork Spring Tested Accurate' },
      { label: 'Rangefinder Alignment', value: 'Calibrated at Infinity' },
      { label: 'Finish Authenticity', value: 'Original Vulcanite Wrap Intact' },
    ],
  };
}

/**
 * 3. LUXURY AUTOMATIC HOROLOGY WATCH
 */
export function createWatchModel(): ModelResult {
  const group = new THREE.Group();
  group.name = 'WatchModel';
  const explodedParts: ExplodedPart[] = [];

  const steelMat = new THREE.MeshStandardMaterial({
    color: 0xdedede,
    metalness: 0.96,
    roughness: 0.16,
  });

  const goldAccentMat = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    metalness: 0.95,
    roughness: 0.2,
  });

  const dialTexture = createWatchDialTexture('#053b24');
  const dialMat = new THREE.MeshStandardMaterial({
    map: dialTexture,
    roughness: 0.3,
    metalness: 0.4,
  });

  const sapphireMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.1,
    roughness: 0.02,
    transmission: 0.92,
    transparent: true,
    opacity: 0.85,
    clearcoat: 1.0,
  });

  // (1) Main 40mm Watch Case
  const caseGeo = new THREE.CylinderGeometry(1.6, 1.6, 0.5, 48);
  const caseMesh = new THREE.Mesh(caseGeo, steelMat);
  caseMesh.castShadow = true;
  group.add(caseMesh);
  explodedParts.push({
    mesh: caseMesh,
    originPos: caseMesh.position.clone(),
    targetOffset: new THREE.Vector3(0, 0, 0),
  });

  // (2) Rotating Compass Bezel (moves +Y)
  const bezelGeo = new THREE.TorusGeometry(1.58, 0.14, 16, 48);
  bezelGeo.rotateX(Math.PI / 2);
  const bezelMesh = new THREE.Mesh(bezelGeo, goldAccentMat);
  bezelMesh.position.set(0, 0.25, 0);
  group.add(bezelMesh);
  explodedParts.push({
    mesh: bezelMesh,
    originPos: bezelMesh.position.clone(),
    targetOffset: new THREE.Vector3(0, 0.7, 0),
  });

  // (3) Sapphire Crystal Dome (moves +Y higher)
  const crystalGeo = new THREE.CylinderGeometry(1.5, 1.5, 0.06, 48);
  const crystalMesh = new THREE.Mesh(crystalGeo, sapphireMat);
  crystalMesh.position.set(0, 0.3, 0);
  group.add(crystalMesh);
  explodedParts.push({
    mesh: crystalMesh,
    originPos: crystalMesh.position.clone(),
    targetOffset: new THREE.Vector3(0, 1.4, 0),
  });

  // (4) Watch Dial Face (moves +Y slightly)
  const dialGeo = new THREE.CircleGeometry(1.46, 48);
  dialGeo.rotateX(-Math.PI / 2);
  const dialMesh = new THREE.Mesh(dialGeo, dialMat);
  dialMesh.position.set(0, 0.22, 0);
  group.add(dialMesh);
  explodedParts.push({
    mesh: dialMesh,
    originPos: dialMesh.position.clone(),
    targetOffset: new THREE.Vector3(0, 0.35, 0),
  });

  // Clock Hands (Hour, Minute, Seconds)
  const handsGroup = new THREE.Group();
  handsGroup.position.set(0, 0.23, 0);

  const hrHand = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.02, 0.8), goldAccentMat);
  hrHand.position.set(0, 0, -0.35);
  hrHand.rotation.y = 0.6;

  const minHand = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.02, 1.2), goldAccentMat);
  minHand.position.set(0, 0.01, -0.5);
  minHand.rotation.y = -1.2;

  const secHand = new THREE.Mesh(
    new THREE.BoxGeometry(0.02, 0.02, 1.3),
    new THREE.MeshBasicMaterial({ color: 0xd63031 })
  );
  secHand.position.set(0, 0.02, -0.55);
  secHand.rotation.y = 2.1;

  handsGroup.add(hrHand, minHand, secHand);
  group.add(handsGroup);

  explodedParts.push({
    mesh: handsGroup,
    originPos: handsGroup.position.clone(),
    targetOffset: new THREE.Vector3(0, 0.9, 0),
  });

  // (5) Exhibition Caseback & Winding Rotor (moves -Y)
  const rotorGeo = new THREE.CylinderGeometry(1.3, 1.3, 0.1, 32);
  const rotorMesh = new THREE.Mesh(rotorGeo, goldAccentMat);
  rotorMesh.position.set(0, -0.28, 0);
  group.add(rotorMesh);
  explodedParts.push({
    mesh: rotorMesh,
    originPos: rotorMesh.position.clone(),
    targetOffset: new THREE.Vector3(0, -1.1, 0),
  });

  // Winding Crown on 3 o'clock side
  const crownGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.25, 24);
  crownGeo.rotateZ(Math.PI / 2);
  const crownMesh = new THREE.Mesh(crownGeo, goldAccentMat);
  crownMesh.position.set(1.75, 0, 0);
  group.add(crownMesh);

  // Stainless Steel 3-Link Bracelet Straps
  const linkGeo = new THREE.BoxGeometry(1.6, 0.15, 0.4);
  for (let i = 0; i < 4; i++) {
    // Top strap links
    const linkTop = new THREE.Mesh(linkGeo, steelMat);
    linkTop.position.set(0, -0.1 - i * 0.1, 1.8 + i * 0.45);
    linkTop.rotation.x = -0.25 * (i + 1);

    // Bottom strap links
    const linkBtm = new THREE.Mesh(linkGeo, steelMat);
    linkBtm.position.set(0, -0.1 - i * 0.1, -1.8 - i * 0.45);
    linkBtm.rotation.x = 0.25 * (i + 1);

    group.add(linkTop, linkBtm);
  }

  return {
    group,
    explodedParts,
    name: 'Automatic Mechanical Chronometer',
    category: 'Luxury Timepieces',
    specs: [
      { label: 'Movement Caliber', value: '28,800 bph High-Beat Escapement' },
      { label: 'Sapphire Crystal', value: 'Mohs 9 Hardness Anti-Reflective' },
      { label: 'Caseback', value: 'Exhibition Skeleton Rotor Display' },
      { label: 'Water Rating', value: '100m Pressure Verified' },
    ],
  };
}

/**
 * 4. ERGONOMIC WORKSTATION CHAIR (Herman Miller Aeron Style)
 */
export function createChairModel(): ModelResult {
  const group = new THREE.Group();
  group.name = 'ChairModel';
  const explodedParts: ExplodedPart[] = [];

  const frameMat = new THREE.MeshStandardMaterial({
    color: 0x222428,
    metalness: 0.7,
    roughness: 0.35,
  });

  const meshPellicleMat = new THREE.MeshStandardMaterial({
    color: 0x30343a,
    metalness: 0.2,
    roughness: 0.75,
    wireframe: false,
  });

  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xcccccc,
    metalness: 0.95,
    roughness: 0.15,
  });

  // (1) 5-Star Caster Base (ground level)
  const baseCenter = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.2, 24), frameMat);
  baseCenter.position.set(0, -1.8, 0);
  group.add(baseCenter);

  // 5 Star Legs
  for (let i = 0; i < 5; i++) {
    const angle = (i * Math.PI * 2) / 5;
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.12, 1.4), frameMat);
    leg.position.set(Math.cos(angle) * 0.7, -1.82, Math.sin(angle) * 0.7);
    leg.rotation.y = -angle + Math.PI / 2;

    // Caster wheel
    const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.08, 16).rotateZ(Math.PI / 2), frameMat);
    wheel.position.set(Math.cos(angle) * 1.35, -1.95, Math.sin(angle) * 1.35);
    group.add(leg, wheel);
  }

  // (2) Pneumatic Gas Lift Cylinder (moves -Y slightly on explode)
  const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 1.2, 24), chromeMat);
  cylinder.position.set(0, -1.15, 0);
  group.add(cylinder);
  explodedParts.push({
    mesh: cylinder,
    originPos: cylinder.position.clone(),
    targetOffset: new THREE.Vector3(0, -0.6, 0),
  });

  // (3) Seat Pan Assembly (moves +Y slightly on explode)
  const seatFrame = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.2, 2.1), frameMat);
  seatFrame.position.set(0, -0.4, 0);
  const seatMesh = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.08, 1.8), meshPellicleMat);
  seatMesh.position.set(0, -0.32, 0);
  group.add(seatFrame, seatMesh);
  explodedParts.push({
    mesh: seatFrame,
    originPos: seatFrame.position.clone(),
    targetOffset: new THREE.Vector3(0, 0.3, 0),
  });
  explodedParts.push({
    mesh: seatMesh,
    originPos: seatMesh.position.clone(),
    targetOffset: new THREE.Vector3(0, 0.45, 0),
  });

  // (4) Ergonomic Backrest with Spine & Sacral Support (moves +Z +Y)
  const spine = new THREE.Mesh(new THREE.BoxGeometry(0.25, 2.2, 0.2), frameMat);
  spine.position.set(0, 0.8, -0.95);
  spine.rotation.x = -0.15;

  const backFrame = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.0, 0.15), frameMat);
  backFrame.position.set(0, 0.8, -0.85);
  backFrame.rotation.x = -0.15;

  const backMesh = new THREE.Mesh(new THREE.BoxGeometry(1.9, 1.7, 0.05), meshPellicleMat);
  backMesh.position.set(0, 0.8, -0.78);
  backMesh.rotation.x = -0.15;

  // PostureFit lumbar pad
  const lumbar = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.45, 0.12), frameMat);
  lumbar.position.set(0, 0.4, -0.7);

  group.add(spine, backFrame, backMesh, lumbar);

  explodedParts.push({
    mesh: backFrame,
    originPos: backFrame.position.clone(),
    targetOffset: new THREE.Vector3(0, 0.8, -1.2),
  });
  explodedParts.push({
    mesh: backMesh,
    originPos: backMesh.position.clone(),
    targetOffset: new THREE.Vector3(0, 0.85, -1.0),
  });
  explodedParts.push({
    mesh: lumbar,
    originPos: lumbar.position.clone(),
    targetOffset: new THREE.Vector3(0, 0.5, -0.5),
  });

  // (5) 3D Adjustable Armrests
  const armL = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.08, 0.8), frameMat);
  armL.position.set(-1.25, 0.3, 0);
  const armPostL = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.8, 16), chromeMat);
  armPostL.position.set(-1.25, -0.1, 0);

  const armR = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.08, 0.8), frameMat);
  armR.position.set(1.25, 0.3, 0);
  const armPostR = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.8, 16), chromeMat);
  armPostR.position.set(1.25, -0.1, 0);

  group.add(armL, armPostL, armR, armPostR);

  explodedParts.push({
    mesh: armL,
    originPos: armL.position.clone(),
    targetOffset: new THREE.Vector3(-0.8, 0, 0),
  });
  explodedParts.push({
    mesh: armR,
    originPos: armR.position.clone(),
    targetOffset: new THREE.Vector3(0.8, 0, 0),
  });

  return {
    group,
    explodedParts,
    name: 'Ergonomic Pellicle Task Chair',
    category: 'Designer Furniture',
    specs: [
      { label: 'Mesh Tension', value: 'Pellicle 8Z Zero Sag Certified' },
      { label: 'Tilt Limiter', value: 'Forward / Backward Tension Calibrated' },
      { label: 'Gas Lift Piston', value: 'Class 4 Heavy-Duty Nitrogen' },
      { label: 'Armrest Range', value: 'Fully Articulated 3D Pivot' },
    ],
  };
}

/**
 * 5. AUDIOPHILE NOISE-CANCELLING HEADPHONES
 */
export function createHeadphonesModel(): ModelResult {
  const group = new THREE.Group();
  group.name = 'HeadphonesModel';
  const explodedParts: ExplodedPart[] = [];

  const matteBlackMat = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    metalness: 0.3,
    roughness: 0.4,
  });

  const leatherPadsMat = new THREE.MeshStandardMaterial({
    color: 0x0c0c0e,
    metalness: 0.1,
    roughness: 0.8,
  });

  const brushedSteelMat = new THREE.MeshStandardMaterial({
    color: 0xbabec4,
    metalness: 0.95,
    roughness: 0.2,
  });

  // (1) Headband Arch (Torus segment)
  const archGeo = new THREE.TorusGeometry(1.5, 0.14, 16, 48, Math.PI);
  const archMesh = new THREE.Mesh(archGeo, matteBlackMat);
  archMesh.position.set(0, 0.4, 0);
  group.add(archMesh);
  explodedParts.push({
    mesh: archMesh,
    originPos: archMesh.position.clone(),
    targetOffset: new THREE.Vector3(0, 0.8, 0),
  });

  // Top Leather Cushion
  const cushionGeo = new THREE.TorusGeometry(1.42, 0.18, 16, 32, Math.PI * 0.7);
  const cushionMesh = new THREE.Mesh(cushionGeo, leatherPadsMat);
  cushionMesh.position.set(0, 0.4, 0);
  cushionMesh.rotation.z = Math.PI * 0.15;
  group.add(cushionMesh);

  // Left & Right Earcups
  const createEarCup = (isLeft: boolean) => {
    const cupGroup = new THREE.Group();
    const xMult = isLeft ? -1 : 1;
    cupGroup.position.set(xMult * 1.5, 0.2, 0);

    // Yoke bracket
    const yoke = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.7, 16),
      brushedSteelMat
    );
    yoke.position.set(0, 0.2, 0);

    // Outer acoustic dome
    const outerCup = new THREE.Mesh(
      new THREE.CylinderGeometry(0.85, 0.8, 0.45, 32).rotateZ(Math.PI / 2),
      matteBlackMat
    );
    outerCup.position.set(xMult * 0.15, -0.3, 0);

    // Memory foam earpad cushion
    const earpad = new THREE.Mesh(
      new THREE.TorusGeometry(0.68, 0.26, 16, 32).rotateY(Math.PI / 2),
      leatherPadsMat
    );
    earpad.position.set(xMult * -0.15, -0.3, 0);

    cupGroup.add(yoke, outerCup, earpad);
    group.add(cupGroup);

    explodedParts.push({
      mesh: cupGroup,
      originPos: cupGroup.position.clone(),
      targetOffset: new THREE.Vector3(xMult * 1.5, 0, 0),
    });
  };

  createEarCup(true);
  createEarCup(false);

  return {
    group,
    explodedParts,
    name: 'Wireless Audiophile Studio Headphones',
    category: 'Electronics & Audio',
    specs: [
      { label: 'ANC Drivers', value: '40mm Custom Liquid Crystal Diaphragms' },
      { label: 'Earpad Condition', value: 'Sanitized Memory Foam Zero Cracking' },
      { label: 'Headband Slider', value: 'Stepped Stainless Steel Click Lock' },
      { label: 'Battery Capacity', value: '30h Continuous Playback Tested' },
    ],
  };
}
