import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PointerLockControls, KeyboardControls, useKeyboardControls, useGLTF, Sky, Stars, Html } from '@react-three/drei'
import { Suspense, useEffect, useMemo, useRef, useState, forwardRef } from 'react'
import * as THREE from 'three'
import './App.css'

// Preload GLTF models
useGLTF.preload('/landscape.glb')
useGLTF.preload('/indian_temples.glb')
useGLTF.preload('/muqarnas_-_pillar.glb')

const Landscape = forwardRef((props, ref) => {
  const gltf = useGLTF('/landscape.glb')
  const scene = useMemo(() => {
    const cloned = gltf.scene.clone(true)
    // Scale landscape UP - make it big (5x bigger)
    cloned.scale.setScalar(5)
    return cloned
  }, [gltf])
  
  useEffect(() => {
    scene.traverse((obj) => {
      if ('castShadow' in obj) obj.castShadow = true
      if ('receiveShadow' in obj) obj.receiveShadow = true
    })
    scene.updateMatrixWorld(true)
    if (ref && typeof ref !== 'function') {
      ref.current = scene
      // Store bounding box for bounds checking
      const box = new THREE.Box3().setFromObject(scene)
      ref.current.boundingBox = box
    } else if (ref && typeof ref === 'function') {
      ref(scene)
    }
  }, [scene, ref])
  
  return <primitive object={scene} />
})
Landscape.displayName = 'Landscape'

function TempleWithPillar({ deity, x, z, landscapeRef, onInteract }) {
  const templeGltf = useGLTF('/indian_temples.glb')
  const pillarGltf = useGLTF('/muqarnas_-_pillar.glb')
  const templeGroup = useRef()
  const pillarGroup = useRef()
  const { camera, raycaster } = useThree()
  const [, getKeys] = useKeyboardControls()
  const [templeY, setTempleY] = useState(null)
  const [pillarY, setPillarY] = useState(null)
  
  // Place pillar to the side of temple - use useMemo to keep angle stable (not recalculating on every render)
  const pillarAngle = useMemo(() => Math.random() * Math.PI * 2, []) // Only calculate once
  const pillarOffsetX = useMemo(() => Math.cos(pillarAngle) * 40, [pillarAngle])
  const pillarOffsetZ = useMemo(() => Math.sin(pillarAngle) * 40, [pillarAngle])
  const pillarX = useMemo(() => x + pillarOffsetX, [x, pillarOffsetX])
  const pillarZ = useMemo(() => z + pillarOffsetZ, [z, pillarOffsetZ])

  const [position, setPosition] = useState({ x, z })
  const [pillarPosition, setPillarPosition] = useState({ x: pillarX, z: pillarZ })
  
  // Clone and scale temple scene - 6x larger
  const templeScene = useMemo(() => {
    const cloned = templeGltf.scene.clone(true)
    cloned.traverse((obj) => {
      if ('castShadow' in obj) obj.castShadow = true
      if ('receiveShadow' in obj) obj.receiveShadow = true
    })

    // Scale temple to be 6x larger - very visible
    const originalBox = new THREE.Box3().setFromObject(cloned)
    const size = originalBox.getSize(new THREE.Vector3())
    const targetHeight = 120 // 2x larger than before (was 60, now 120)
    const scale = targetHeight / size.y
    cloned.scale.setScalar(scale)
    
    // Reset position to origin first
    cloned.position.set(0, 0, 0)
    cloned.updateMatrixWorld(true)

    // Calculate bounding box after scaling and adjust so base sits at y=0
    const scaledBox = new THREE.Box3().setFromObject(cloned)
    const baseY = scaledBox.min.y
    cloned.position.y = -baseY
    cloned.updateMatrixWorld(true)

    // Verify: recalculate box to confirm base is at 0
    const finalBox = new THREE.Box3().setFromObject(cloned)
    if (Math.abs(finalBox.min.y) > 0.01) {
      cloned.position.y -= finalBox.min.y
      cloned.updateMatrixWorld(true)
    }

    return cloned
  }, [templeGltf])
  
  // Clone and scale pillar scene - visible size
  const pillarScene = useMemo(() => {
    const cloned = pillarGltf.scene.clone(true)
    cloned.traverse((obj) => {
      if ('castShadow' in obj) obj.castShadow = true
      if ('receiveShadow' in obj) obj.receiveShadow = true
    })
    
    // Make pillars visible - about 1/3 of temple height (temples are 60, so pillars are 20)
    const originalBox = new THREE.Box3().setFromObject(cloned)
    const size = originalBox.getSize(new THREE.Vector3())
    const targetHeight = 20 // Visible pillar height
    const scale = targetHeight / size.y
    cloned.scale.setScalar(scale)
    
    // Reset position to origin first
    cloned.position.set(0, 0, 0)
    cloned.updateMatrixWorld(true)

    // Calculate bounding box after scaling and adjust so base sits at y=0
    const scaledBox = new THREE.Box3().setFromObject(cloned)
    const baseY = scaledBox.min.y
    cloned.position.y = -baseY
    cloned.updateMatrixWorld(true)

    // Verify: recalculate box to confirm base is at 0
    const finalBox = new THREE.Box3().setFromObject(cloned)
    if (Math.abs(finalBox.min.y) > 0.01) {
      cloned.position.y -= finalBox.min.y
      cloned.updateMatrixWorld(true)
    }
    
    return cloned
  }, [pillarGltf])
  
  // Raycast to find Y positions on landscape surface
  useEffect(() => {
    if (!landscapeRef.current || !templeScene || !pillarScene) return
    
    const checkHeights = () => {
      if (!landscapeRef.current || !landscapeRef.current.boundingBox) {
        setTimeout(checkHeights, 200)
        return
      }
      
      const bounds = landscapeRef.current.boundingBox
      const margin = 30
      
      // Clamp temple position
      const clampedX = Math.max(bounds.min.x + margin, Math.min(bounds.max.x - margin, x))
      const clampedZ = Math.max(bounds.min.z + margin, Math.min(bounds.max.z - margin, z))
      
      // Clamp pillar position
      const clampedPillarX = Math.max(bounds.min.x + margin, Math.min(bounds.max.x - margin, pillarX))
      const clampedPillarZ = Math.max(bounds.min.z + margin, Math.min(bounds.max.z - margin, pillarZ))

      setPosition({ x: clampedX, z: clampedZ })
      // Update pillar position only once to keep it stable
      setPillarPosition(prev => {
        if (prev.x === clampedPillarX && prev.z === clampedPillarZ) return prev
        return { x: clampedPillarX, z: clampedPillarZ }
      })
      
      // Raycast for temple and pillar - find exact surface (start from very high above landscape)
      const rayStartHeight = Math.max(bounds.max.y + 2000, 5000)
      const offsets = [[0, 0], [5, 0], [-5, 0], [0, 5], [0, -5], [5, 5], [-5, -5]]
      
      // Raycast for temple - find exact surface
      raycaster.set(new THREE.Vector3(clampedX, rayStartHeight, clampedZ), new THREE.Vector3(0, -1, 0))
      raycaster.far = 20000
      raycaster.near = 0
      raycaster.linePrecision = 0.1
      let templeIntersects = raycaster.intersectObject(landscapeRef.current, true)
      if (templeIntersects.length > 0) {
        // Get the first valid intersection point (closest surface)
        const surfaceY = templeIntersects[0].point.y
        console.log(`Temple ${deity.name} at (${clampedX.toFixed(1)}, ${clampedZ.toFixed(1)}): surface Y = ${surfaceY.toFixed(1)}`)
        // Ensure temple base sits exactly on surface (temple base is at y=0 in local space)
        setTempleY(surfaceY)
      } else {
        // Fallback: try multiple raycast attempts at nearby positions
        console.warn(`Temple ${deity.name}: Raycast failed at (${clampedX.toFixed(1)}, ${clampedZ.toFixed(1)}), trying alternative positions...`)
        
        let foundSurface = false
        for (const [offsetX, offsetZ] of offsets) {
          raycaster.set(new THREE.Vector3(clampedX + offsetX, rayStartHeight, clampedZ + offsetZ), new THREE.Vector3(0, -1, 0))
          templeIntersects = raycaster.intersectObject(landscapeRef.current, true)
          if (templeIntersects.length > 0) {
            setTempleY(templeIntersects[0].point.y)
            foundSurface = true
            console.log(`Temple ${deity.name}: Found surface using offset (${offsetX}, ${offsetZ})`)
            break
          }
        }
        
        if (!foundSurface) {
          setTempleY(bounds.min.y)
          console.warn(`Temple ${deity.name}: All raycast attempts failed, using bounds.min.y = ${bounds.min.y}`)
        }
      }
      
      // Raycast for pillar - find exact surface
      raycaster.set(new THREE.Vector3(clampedPillarX, rayStartHeight, clampedPillarZ), new THREE.Vector3(0, -1, 0))
      let pillarIntersects = raycaster.intersectObject(landscapeRef.current, true)
      if (pillarIntersects.length > 0) {
        const surfaceY = pillarIntersects[0].point.y
        setPillarY(surfaceY)
      } else {
        // Try alternative positions for pillar if raycast fails
        let foundSurface = false
        for (const [offsetX, offsetZ] of offsets) {
          raycaster.set(new THREE.Vector3(clampedPillarX + offsetX, rayStartHeight, clampedPillarZ + offsetZ), new THREE.Vector3(0, -1, 0))
          pillarIntersects = raycaster.intersectObject(landscapeRef.current, true)
          if (pillarIntersects.length > 0) {
            setPillarY(pillarIntersects[0].point.y)
            foundSurface = true
            break
          }
        }
        if (!foundSurface) {
          setPillarY(bounds.min.y)
        }
      }
    }
    
    // Initial check with delay to ensure everything is loaded
    const timer = setTimeout(checkHeights, 800)
    
    // Also check periodically to handle any landscape updates
    const interval = setInterval(checkHeights, 2000)
    
    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [x, z, pillarX, pillarZ, raycaster, landscapeRef, templeScene, pillarScene, pillarOffsetX, pillarOffsetZ])
  
  // Interaction detection - works with both temple and pillar
  const interactedRef = useRef(false)
  
  useFrame(() => {
    if ((!pillarGroup.current && !templeGroup.current) || !camera) return
    
    const { interact } = getKeys()
    
    // Check distance to both pillar and temple
    let minDistance = Infinity
    if (pillarGroup.current) {
      const pillarWorldPos = new THREE.Vector3()
      pillarGroup.current.getWorldPosition(pillarWorldPos)
      const pillarDist = camera.position.distanceTo(pillarWorldPos)
      minDistance = Math.min(minDistance, pillarDist)
    }
    if (templeGroup.current) {
      const templeWorldPos = new THREE.Vector3()
      templeGroup.current.getWorldPosition(templeWorldPos)
      const templeDist = camera.position.distanceTo(templeWorldPos)
      minDistance = Math.min(minDistance, templeDist)
    }
    
    // Increased interaction range for large temples (80 units)
    if (interact && !interactedRef.current && minDistance < 80) {
      interactedRef.current = true
      console.log('Interacting with deity:', deity.name, deity)
      onInteract(deity) // The toggle logic is handled in App component
    } else if (!interact) {
      // Reset when key is released
      interactedRef.current = false
    }
  })
  
  // Don't render until we have valid Y positions
  if (templeY === null || pillarY === null) {
    return null
  }

  return (
    <group>
      {/* Temple - positioned at surface height */}
      <group ref={templeGroup} position={[position.x, templeY, position.z]}>
        <primitive object={templeScene} />
      </group>
      
      {/* Pillar - positioned at surface height */}
      <group ref={pillarGroup} position={[pillarPosition.x, pillarY, pillarPosition.z]}>
        <primitive object={pillarScene} />
      </group>
    </group>
  )
}

function TemplesAndPillars({ landscapeRef, onInteract }) {
  const [deities, setDeities] = useState([])
  
  useEffect(() => {
    fetch('/rig_deities.json')
      .then(res => res.json())
      .then(data => {
        const loadedDeities = data.Rigvedic_Deities || []
        console.log('Loaded deities:', loadedDeities.length)
        console.log('Deity names:', loadedDeities.map(d => d.name).join(', '))
        setDeities(loadedDeities)
      })
      .catch(err => console.error('Failed to load deities:', err))
  }, [])
  
  const bounds = landscapeRef?.current?.boundingBox
  
  // Distribute temples all over the landscape instead of in a circle
  const positions = useMemo(() => {
    if (deities.length === 0 || !bounds) return []
    
    const margin = 30 // Margin from edges
    const minX = bounds.min.x + margin
    const maxX = bounds.max.x - margin
    const minZ = bounds.min.z + margin
    const maxZ = bounds.max.z - margin
    
    // Calculate grid-like distribution across the landscape
    const cols = Math.ceil(Math.sqrt(deities.length))
    const rows = Math.ceil(deities.length / cols)
    
    return deities.map((deity, index) => {
      // Calculate grid position
      const col = index % cols
      const row = Math.floor(index / cols)
      
      // Spread evenly across available space
      const x = minX + (col / (cols - 1 || 1)) * (maxX - minX)
      const z = minZ + (row / (rows - 1 || 1)) * (maxZ - minZ)
      
      // Add some random variation for more natural distribution
      const randomOffsetX = (Math.random() - 0.5) * ((maxX - minX) / cols * 0.4)
      const randomOffsetZ = (Math.random() - 0.5) * ((maxZ - minZ) / rows * 0.4)
      
      return { 
        deity, 
        x: x + randomOffsetX, 
        z: z + randomOffsetZ, 
        index 
      }
    })
  }, [deities, bounds])
  
  if (deities.length === 0) {
    return null
  }
  
  return (
    <>
      {positions.map(({ deity, x, z, index }) => (
        <TempleWithPillar
          key={index}
          deity={deity}
          x={x}
          z={z}
          landscapeRef={landscapeRef}
          onInteract={onInteract}
        />
      ))}
    </>
  )
}

function PlayerControls({ speed = 15, sprintMultiplier = 2, landscapeRef }) {
  const { camera, raycaster } = useThree()
  const [, getKeys] = useKeyboardControls()
  const velocity = useRef(new THREE.Vector3())
  const minHeight = 20.0 // Camera height above ground (taller person-like perspective)
  const boundsMargin = 2
  const initialised = useRef(false)
  const lastSurfaceY = useRef(null)

  useFrame((_, delta) => {
    // Initialize camera position on landscape surface (first frame only)
    if (!initialised.current) {
      if (!landscapeRef?.current || !landscapeRef.current.boundingBox) return
      if (!raycaster) return

      const bounds = landscapeRef.current.boundingBox
      const centerX = (bounds.min.x + bounds.max.x) / 2
      const centerZ = (bounds.min.z + bounds.max.z) / 2

      // Set horizontal position
      camera.position.x = centerX
      camera.position.z = centerZ

      // Raycast to find ground level
      raycaster.set(new THREE.Vector3(centerX, 2000, centerZ), new THREE.Vector3(0, -1, 0))
      raycaster.far = 5000
      raycaster.near = 0
      const intersects = raycaster.intersectObject(landscapeRef.current, true)
      
      if (intersects.length > 0) {
        const groundY = intersects[0].point.y
        camera.position.y = groundY + minHeight
        lastSurfaceY.current = groundY
        camera.rotation.set(0, 0, 0)
        initialised.current = true
      } else {
        // Fallback: use bounds minimum Y
        const groundY = bounds.min.y
        camera.position.y = groundY + minHeight
        lastSurfaceY.current = groundY
        camera.rotation.set(0, 0, 0)
        initialised.current = true
      }
      return
    }

    // Movement logic
    const { forward, backward, left, right, sprint } = getKeys()
    const moveSpeed = (sprint ? sprintMultiplier : 1) * speed

    // Compute movement in camera local space
    const direction = new THREE.Vector3()
    if (forward) direction.z -= 1   // Forward moves in -Z direction
    if (backward) direction.z += 1  // Backward moves in +Z direction
    if (left) direction.x -= 1      // Left moves in -X direction
    if (right) direction.x += 1     // Right moves in +X direction
    
    if (direction.lengthSq() > 0) {
      direction.normalize()

      // Convert local movement to world space based on camera rotation
      // Get camera's forward direction (negative Z in camera space)
      const cameraDirection = new THREE.Vector3(0, 0, -1)
      cameraDirection.applyQuaternion(camera.quaternion)
      cameraDirection.y = 0 // Keep movement on horizontal plane
      cameraDirection.normalize()

      // Get camera's right direction
      const cameraRight = new THREE.Vector3(1, 0, 0)
      cameraRight.applyQuaternion(camera.quaternion)
      cameraRight.y = 0
      cameraRight.normalize()

      // Calculate final movement direction
      // Note: direction.z is -1 for forward, +1 for backward
      // cameraDirection already points where camera is looking
      // So we need to multiply by -direction.z to get correct movement
      const move = new THREE.Vector3()
      move.addScaledVector(cameraDirection, -direction.z) // Forward/backward (negate because direction.z is inverted)
      move.addScaledVector(cameraRight, direction.x)      // Left/right
      
      if (move.lengthSq() > 0) {
        move.normalize()
    velocity.current.copy(move.multiplyScalar(moveSpeed * delta))
    camera.position.add(velocity.current)
      }
    }

    // Clamp movement within landscape bounds
    if (landscapeRef?.current?.boundingBox) {
      const bounds = landscapeRef.current.boundingBox
      if (camera.position.x < bounds.min.x + boundsMargin) camera.position.x = bounds.min.x + boundsMargin
      if (camera.position.x > bounds.max.x - boundsMargin) camera.position.x = bounds.max.x - boundsMargin
      if (camera.position.z < bounds.min.z + boundsMargin) camera.position.z = bounds.min.z + boundsMargin
      if (camera.position.z > bounds.max.z - boundsMargin) camera.position.z = bounds.max.z - boundsMargin
    }

    // Keep camera at proper height above landscape surface while moving
    if (landscapeRef?.current && raycaster && initialised.current) {
      // Raycast from above current position to find ground
      raycaster.set(new THREE.Vector3(camera.position.x, camera.position.y + 500, camera.position.z), new THREE.Vector3(0, -1, 0))
      raycaster.far = 5000
      raycaster.near = 0
      const intersects = raycaster.intersectObject(landscapeRef.current, true)
      if (intersects.length > 0) {
        const groundY = intersects[0].point.y
        const targetY = groundY + minHeight
        lastSurfaceY.current = groundY
        // Always keep at correct height above surface
        camera.position.y = targetY
      } else if (lastSurfaceY.current !== null) {
        // Fallback: use last known surface Y
        camera.position.y = lastSurfaceY.current + minHeight
      }
    }
  })

  return null
}

function ConstellationLines({ radius = 500 }) {
  const group = useRef()
  const [segments, setSegments] = useState([])

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        // Create zodiac constellations (simplified representation)
        const zodiacConstellations = []
        const numConstellations = 12
        const baseAngle = 0
        
        for (let i = 0; i < numConstellations; i++) {
          const angle1 = (baseAngle + (i * 2 * Math.PI / numConstellations)) % (2 * Math.PI)
          const angle2 = (baseAngle + ((i + 0.5) * 2 * Math.PI / numConstellations)) % (2 * Math.PI)
          const angle3 = (baseAngle + ((i + 1) * 2 * Math.PI / numConstellations)) % (2 * Math.PI)
          
          // Create triangle pattern for each zodiac sign
          const elev = 0.8 + Math.random() * 0.15
          const x1 = Math.cos(angle1) * Math.sqrt(1 - elev * elev)
          const z1 = Math.sin(angle1) * Math.sqrt(1 - elev * elev)
          const x2 = Math.cos(angle2) * Math.sqrt(1 - (elev - 0.05) * (elev - 0.05))
          const z2 = Math.sin(angle2) * Math.sqrt(1 - (elev - 0.05) * (elev - 0.05))
          const x3 = Math.cos(angle3) * Math.sqrt(1 - elev * elev)
          const z3 = Math.sin(angle3) * Math.sqrt(1 - elev * elev)
          
          zodiacConstellations.push([
            new THREE.Vector3(x1, elev, z1).normalize().multiplyScalar(radius),
            new THREE.Vector3(x2, elev - 0.05, z2).normalize().multiplyScalar(radius),
          ])
          zodiacConstellations.push([
            new THREE.Vector3(x2, elev - 0.05, z2).normalize().multiplyScalar(radius),
            new THREE.Vector3(x3, elev, z3).normalize().multiplyScalar(radius),
          ])
          zodiacConstellations.push([
            new THREE.Vector3(x1, elev, z1).normalize().multiplyScalar(radius),
            new THREE.Vector3(x3, elev, z3).normalize().multiplyScalar(radius),
          ])
        }
        
        if (!cancelled) setSegments(zodiacConstellations)
      } catch {
        // Ignore errors
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [radius])

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.01
  })

  return (
    <group ref={group}>
      {segments.map((pair, i) => (
        <line key={i}>
          <bufferGeometry attach="geometry">
            <bufferAttribute
              attachObject={["attributes", "position"]}
              count={2}
              itemSize={3}
              array={new Float32Array([pair[0].x, pair[0].y, pair[0].z, pair[1].x, pair[1].y, pair[1].z])}
            />
          </bufferGeometry>
          <lineBasicMaterial attach="material" color="#88aaff" transparent opacity={0.6} />
        </line>
      ))}
    </group>
  )
}

function RotatingSky({ isNight }) {
  const group = useRef()
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.005
  })
  return (
    <group ref={group}>
      {isNight ? (
        <>
          <Stars radius={500} depth={80} count={15000} factor={4.5} saturation={0} fade speed={1} />
          <ConstellationLines radius={500} />
          <ambientLight intensity={0.2} />
          <directionalLight position={[50, 100, 25]} intensity={0.3} castShadow shadow-mapSize={[2048, 2048]} />
        </>
      ) : (
        <>
          <Sky distance={450000} sunPosition={[100, 20, 100]} inclination={0.49} azimuth={0.25} mieCoefficient={0.005} rayleigh={1} turbidity={2} />
          <hemisphereLight intensity={0.6} groundColor={0x444466} color={0xffffff} />
          <directionalLight position={[50, 100, 25]} intensity={1.2} castShadow shadow-mapSize={[2048, 2048]} />
        </>
      )}
    </group>
  )
}

function DeityInfoPanel({ deity, onClose }) {
  if (!deity) return null
  
  return (
    <div className="deity-info-panel" style={{ 
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 1000,
      background: 'rgba(0, 0, 0, 0.95)', 
      color: '#fff', 
      padding: '25px', 
      borderRadius: '12px', 
      maxWidth: '600px',
      width: '90vw',
      maxHeight: '85vh',
      overflowY: 'auto',
      fontFamily: 'system-ui, sans-serif',
      boxShadow: '0 8px 32px rgba(0,0,0,0.7)',
      border: '3px solid rgba(255, 215, 0, 0.3)'
    }}>
      <button 
        onClick={onClose}
        style={{ 
          float: 'right', 
          background: '#d32f2f', 
          border: 'none', 
          color: '#fff', 
          padding: '10px 15px', 
          cursor: 'pointer',
          borderRadius: '6px',
          fontSize: '20px',
          fontWeight: 'bold',
          lineHeight: 1,
          marginBottom: '10px'
        }}
      >
        ×
      </button>
      <h2 style={{ marginTop: 0, color: '#ffd700', fontSize: '28px', marginBottom: '20px', textAlign: 'center' }}>{deity.name || 'Unknown Deity'}</h2>
      <div style={{ marginBottom: '15px', fontSize: '16px' }}>
        <strong style={{ color: '#ffd700' }}>Category:</strong> <span style={{ color: '#fff' }}>{typeof deity.category === 'string' ? deity.category : (typeof deity.category === 'object' ? JSON.stringify(deity.category) : String(deity.category || 'N/A'))}</span>
      </div>
      <div style={{ marginBottom: '15px', fontSize: '16px' }}>
        <strong style={{ color: '#ffd700' }}>Domain:</strong> <span style={{ color: '#fff' }}>{typeof deity.domain === 'string' ? deity.domain : (typeof deity.domain === 'object' ? JSON.stringify(deity.domain) : String(deity.domain || 'N/A'))}</span>
      </div>
      {deity.epithets && deity.epithets.length > 0 && (
        <div style={{ marginBottom: '15px', fontSize: '16px' }}>
          <strong style={{ color: '#ffd700' }}>Epithets:</strong> <span style={{ color: '#fff' }}>{deity.epithets.join(', ')}</span>
        </div>
      )}
      {deity.symbolism && (
        <div style={{ marginBottom: '15px', fontSize: '16px' }}>
          <strong style={{ color: '#ffd700' }}>Symbolism:</strong> <span style={{ color: '#fff' }}>{typeof deity.symbolism === 'string' ? deity.symbolism : (Array.isArray(deity.symbolism) ? deity.symbolism.join(', ') : JSON.stringify(deity.symbolism))}</span>
        </div>
      )}
      {deity.scriptural_presence && (
        <div style={{ marginBottom: '15px', fontSize: '16px', lineHeight: '1.6' }}>
          <strong style={{ color: '#ffd700' }}>Scriptural Presence:</strong> <span style={{ color: '#fff' }}>{typeof deity.scriptural_presence === 'string' ? deity.scriptural_presence : (Array.isArray(deity.scriptural_presence) ? deity.scriptural_presence.join(', ') : JSON.stringify(deity.scriptural_presence))}</span>
        </div>
      )}
      {deity.lore && (
        <div style={{ marginBottom: '15px', fontSize: '16px', lineHeight: '1.6' }}>
          <strong style={{ color: '#ffd700' }}>Lore:</strong> <span style={{ color: '#fff' }}>{typeof deity.lore === 'string' ? deity.lore : (Array.isArray(deity.lore) ? deity.lore.join(', ') : JSON.stringify(deity.lore))}</span>
        </div>
      )}
      {deity.historical_evolution && (
        <div style={{ marginBottom: '15px', fontSize: '16px', lineHeight: '1.6' }}>
          <strong style={{ color: '#ffd700' }}>Historical Evolution:</strong> <span style={{ color: '#fff' }}>{typeof deity.historical_evolution === 'string' ? deity.historical_evolution : (Array.isArray(deity.historical_evolution) ? deity.historical_evolution.join(', ') : JSON.stringify(deity.historical_evolution))}</span>
        </div>
      )}
      {deity.elements && (
        <div style={{ marginBottom: '15px', fontSize: '16px' }}>
          <strong style={{ color: '#ffd700' }}>Elements:</strong> <span style={{ color: '#fff' }}>{typeof deity.elements === 'string' ? deity.elements : (Array.isArray(deity.elements) ? deity.elements.join(', ') : (typeof deity.elements === 'object' && deity.elements !== null ? JSON.stringify(deity.elements) : String(deity.elements)))}</span>
        </div>
      )}
      {deity.colors && (
        <div style={{ marginBottom: '15px', fontSize: '16px' }}>
          <strong style={{ color: '#ffd700' }}>Colors:</strong> <span style={{ color: '#fff' }}>{typeof deity.colors === 'string' ? deity.colors : (Array.isArray(deity.colors) ? deity.colors.join(', ') : (typeof deity.colors === 'object' && deity.colors !== null ? JSON.stringify(deity.colors) : String(deity.colors)))}</span>
        </div>
      )}
      {deity.associated_animals && (
        <div style={{ marginBottom: '15px', fontSize: '16px' }}>
          <strong style={{ color: '#ffd700' }}>Associated Animals:</strong> <span style={{ color: '#fff' }}>{typeof deity.associated_animals === 'string' ? deity.associated_animals : (Array.isArray(deity.associated_animals) ? deity.associated_animals.join(', ') : (typeof deity.associated_animals === 'object' && deity.associated_animals !== null ? JSON.stringify(deity.associated_animals) : String(deity.associated_animals)))}</span>
        </div>
      )}
    </div>
  )
}

function App() {
  const [isNight, setIsNight] = useState(false)
  const [selectedDeity, setSelectedDeity] = useState(null)
  const landscapeRef = useRef()

  // Automatic cyclical night/day mode (changes every 60 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setIsNight(prev => !prev)
    }, 60000) // 60 seconds = 1 minute cycle
    
    return () => clearInterval(interval)
  }, [])

  // Handle global E key press to close deity panel
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.code === 'KeyE' && selectedDeity) {
        setSelectedDeity(null)
      }
    }
    
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [selectedDeity])

  const map = useMemo(
    () => [
      { name: 'forward', keys: ['KeyW', 'ArrowUp'] },
      { name: 'backward', keys: ['KeyS', 'ArrowDown'] },
      { name: 'left', keys: ['KeyA', 'ArrowLeft'] },
      { name: 'right', keys: ['KeyD', 'ArrowRight'] },
      { name: 'sprint', keys: ['ShiftLeft', 'ShiftRight'] },
      { name: 'interact', keys: ['KeyE'] },
    ],
    []
  )

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <KeyboardControls map={map}>
        <Canvas shadows camera={{ position: [0, 20, 0], fov: 60 }}>
          <color attach="background" args={[isNight ? '#05070c' : '#87CEEB']} />
          <RotatingSky isNight={isNight} />

          <Suspense fallback={null}>
            <Landscape ref={landscapeRef} />
            <TemplesAndPillars 
              landscapeRef={landscapeRef} 
              onInteract={(deity) => {
                // Toggle: if same deity is already selected, close it; otherwise open new one
                setSelectedDeity(prev => {
                  if (prev && prev.name === deity?.name) {
                    return null // Close panel if same deity
                  }
                  return deity // Open new deity
                })
              }} 
            />
          </Suspense>

          <PlayerControls landscapeRef={landscapeRef} />
          <PointerLockControls selector="#enter" />
        </Canvas>
      </KeyboardControls>

      <div style={{ position: 'absolute', top: 12, left: 12, padding: '8px 10px', background: 'rgba(0,0,0,0.45)', color: '#fff', borderRadius: 8, fontFamily: 'system-ui, sans-serif', lineHeight: 1.35 }}>
        <div><strong>Controls</strong></div>
        <div>Click "Enter View" to lock the mouse</div>
        <div>W/A/S/D to move, Shift to sprint</div>
        <div>Press E near a pillar to interact</div>
        <div>
          <label>
            <input type="checkbox" checked={isNight} onChange={(e) => setIsNight(e.target.checked)} /> Night mode (Auto: cycles every 60s)
          </label>
        </div>
      </div>

      <button id="enter" style={{ position: 'absolute', bottom: 16, left: 16, padding: '8px 12px', borderRadius: 6, border: 'none', background: '#2563eb', color: '#fff', cursor: 'pointer' }}>
        Enter View
      </button>

      {/* Deity Info Panel - rendered as overlay on screen */}
      {selectedDeity && (
        <DeityInfoPanel deity={selectedDeity} onClose={() => setSelectedDeity(null)} />
      )}
    </div>
  )
}

export default App
