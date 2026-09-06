const THREE = require('three');

// Simulate mobile screen sizes
const screens = [
  { name: 'iPhone SE (small)', w: 375, h: 667 },
  { name: 'iPhone 13 / 14 / 15', w: 390, h: 844 },
  { name: 'Samsung Galaxy S20 / S22', w: 360, h: 800 },
  { name: 'Pixel 7', w: 412, h: 915 },
  { name: 'Small Android Phone', w: 360, h: 640 }
];

console.log('=== HERO SECTION 3D AVATAR & NAME POSITIONING VERIFICATION ===\n');

screens.forEach(({ name, w, h }) => {
  const aspect = w / h;
  const fov = 31;
  const camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 1000);
  camera.position.set(0, 1.35, 20.5);
  camera.updateMatrixWorld();
  camera.updateProjectionMatrix();

  // Mesh geometry: 7.6 x 7.6 plane centered at -0.2 with baseY = -0.7
  // Mesh world Y bounds:
  const meshCenterY = -0.2 - 0.7; // -0.9
  const meshTopY = meshCenterY + 3.8; // +2.9
  const headTopY = meshCenterY + 2.3; // Top of hair / head ≈ +1.4
  const foreheadY = meshCenterY + 1.8; // Forehead ≈ +0.9
  const eyesY = meshCenterY + 1.3; // Eyes ≈ +0.4
  const mouthY = meshCenterY + 0.8; // Mouth ≈ -0.1
  const chinY = meshCenterY + 0.4; // Chin ≈ -0.5

  // Project 3D points to 2D Screen Y (in pixels from top of screen: 0 = top, h = bottom)
  function projectToScreenY(worldY) {
    const v = new THREE.Vector3(0, worldY, 0);
    v.project(camera);
    // NDC y: +1 (top) to -1 (bottom) -> convert to pixels from top
    return ((1 - v.y) / 2) * h;
  }

  const screenHeadTop = projectToScreenY(headTopY);
  const screenForehead = projectToScreenY(foreheadY);
  const screenEyes = projectToScreenY(eyesY);
  const screenMouth = projectToScreenY(mouthY);

  // HTML Name Block: starts at pt-16 (64px) or pt-20 (80px), name text height ≈ 60-70px
  const htmlNameTop = 64; // pt-16
  const htmlNameBottom = htmlNameTop + 75; // "Hello! I'm KARTHICK PANDI" ends around 139px

  const gapBetweenNameAndHead = screenHeadTop - htmlNameBottom;

  console.log(`📱 ${name} (${w}x${h}):`);
  console.log(`   - HTML Name Block (Top of Head): ${htmlNameTop}px to ${htmlNameBottom}px from top`);
  console.log(`   - 3D Avatar Head Top:            ${Math.round(screenHeadTop)}px from top`);
  console.log(`   - 3D Avatar Forehead:            ${Math.round(screenForehead)}px from top`);
  console.log(`   - 3D Avatar Eyes:                ${Math.round(screenEyes)}px from top`);
  console.log(`   - 3D Avatar Mouth (Lip-Sync):    ${Math.round(screenMouth)}px from top`);
  console.log(`   - Clearance Gap (Name to Head):  ${Math.round(gapBetweenNameAndHead)}px`);
  
  if (gapBetweenNameAndHead > 50) {
    console.log(`   ✅ PASS: Perfect clearance. Name sits comfortably above top of head with zero face overlap.\n`);
  } else {
    console.log(`   ❌ FAIL: Clearance too small (${Math.round(gapBetweenNameAndHead)}px).\n`);
  }
});
