import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PointerLockControls, KeyboardControls, useKeyboardControls, useGLTF, Sky, Stars, Html } from '@react-three/drei'
import { Suspense, useEffect, useMemo, useRef, useState, forwardRef } from 'react'
import * as THREE from 'three'
import './Landscape.css'

// Preload GLTF models
useGLTF.preload('/landscape.glb')
useGLTF.preload('/indian_temples.glb')
useGLTF.preload('/muqarnas_-_pillar.glb')

interface Deity {
  name: string;
  category?: string | object;
  domain?: string | object;
  epithets?: string[];
  symbolism?: string | string[] | object;
  scriptural_presence?: string | string[] | object;
  lore?: string | string[] | object;
  historical_evolution?: string | string[] | object;
  elements?: string | string[] | object;
  colors?: string | string[] | object;
  associated_animals?: string | string[] | object;
}

interface LandscapeRef {
  current: THREE.Object3D | null;
  boundingBox?: THREE.Box3;
}

const Landscape = forwardRef<THREE.Object3D>((props, ref) => {
  const gltf = useGLTF('/landscape.glb')
  const scene = useMemo(() => {
    const cloned = gltf.scene.clone(true)
    cloned.scale.setScalar(5)
    return cloned
  }, [gltf])
  
  useEffect(() => {
    scene.traverse((obj) => {
      if ('castShadow' in obj) (obj as THREE.Mesh).castShadow = true
      if ('receiveShadow' in obj) (obj as THREE.Mesh).receiveShadow = true
    })
    scene.updateMatrixWorld(true)
    if (ref) {
      if (typeof ref === 'function') {
        ref(scene)
      } else {
        ref.current = scene
        const box = new THREE.Box3().setFromObject(scene)
        ;(scene as any).boundingBox = box
      }
    }
  }, [scene, ref])
  
  return <primitive object={scene} />
})
Landscape.displayName = 'Landscape'

function TempleWithPillar({ deity, x, z, landscapeRef, onInteract }: { 
  deity: Deity; 
  x: number; 
  z: number; 
  landscapeRef: React.MutableRefObject<LandscapeRef>; 
  onInteract: (deity: Deity) => void;
}) {
  const templeGltf = useGLTF('/indian_temples.glb')
  const pillarGltf = useGLTF('/muqarnas_-_pillar.glb')
  const templeGroup = useRef<THREE.Group>(null)
  const pillarGroup = useRef<THREE.Group>(null)
  const { camera, raycaster } = useThree()
  const [, getKeys] = useKeyboardControls<{ interact: boolean }>()
  const [templeY, setTempleY] = useState<number | null>(null)
  const [pillarY, setPillarY] = useState<number | null>(null)
  
  const pillarAngle = useMemo(() => Math.random() * Math.PI * 2, [])
  const pillarOffsetX = useMemo(() => Math.cos(pillarAngle) * 40, [pillarAngle])
  const pillarOffsetZ = useMemo(() => Math.sin(pillarAngle) * 40, [pillarAngle])
  const pillarX = useMemo(() => x + pillarOffsetX, [x, pillarOffsetX])
  const pillarZ = useMemo(() => z + pillarOffsetZ, [z, pillarOffsetZ])

  const [position, setPosition] = useState({ x, z })
  const [pillarPosition, setPillarPosition] = useState({ x: pillarX, z: pillarZ })
  
  const templeScene = useMemo(() => {
    const cloned = templeGltf.scene.clone(true)
    cloned.traverse((obj) => {
      if ('castShadow' in obj) (obj as THREE.Mesh).castShadow = true
      if ('receiveShadow' in obj) (obj as THREE.Mesh).receiveShadow = true
    })

    const originalBox = new THREE.Box3().setFromObject(cloned)
    const size = originalBox.getSize(new THREE.Vector3())
    const targetHeight = 120
    const scale = targetHeight / size.y
    cloned.scale.setScalar(scale)
    
    cloned.position.set(0, 0, 0)
    cloned.updateMatrixWorld(true)

    const scaledBox = new THREE.Box3().setFromObject(cloned)
    const baseY = scaledBox.min.y
    cloned.position.y = -baseY
    cloned.updateMatrixWorld(true)

    const finalBox = new THREE.Box3().setFromObject(cloned)
    if (Math.abs(finalBox.min.y) > 0.01) {
      cloned.position.y -= finalBox.min.y
      cloned.updateMatrixWorld(true)
    }

    return cloned
  }, [templeGltf])
  
  const pillarScene = useMemo(() => {
    const cloned = pillarGltf.scene.clone(true)
    cloned.traverse((obj) => {
      if ('castShadow' in obj) (obj as THREE.Mesh).castShadow = true
      if ('receiveShadow' in obj) (obj as THREE.Mesh).receiveShadow = true
    })
    
    const originalBox = new THREE.Box3().setFromObject(cloned)
    const size = originalBox.getSize(new THREE.Vector3())
    const targetHeight = 20
    const scale = targetHeight / size.y
    cloned.scale.setScalar(scale)
    
    cloned.position.set(0, 0, 0)
    cloned.updateMatrixWorld(true)

    const scaledBox = new THREE.Box3().setFromObject(cloned)
    const baseY = scaledBox.min.y
    cloned.position.y = -baseY
    cloned.updateMatrixWorld(true)

    const finalBox = new THREE.Box3().setFromObject(cloned)
    if (Math.abs(finalBox.min.y) > 0.01) {
      cloned.position.y -= finalBox.min.y
      cloned.updateMatrixWorld(true)
    }
    
    return cloned
  }, [pillarGltf])
  
  useEffect(() => {
    if (!landscapeRef.current?.current || !templeScene || !pillarScene) return
    
    const checkHeights = () => {
      const landscapeObj = landscapeRef.current?.current
      if (!landscapeObj || !(landscapeObj as any).boundingBox) {
        setTimeout(checkHeights, 200)
        return
      }
      
      const bounds = (landscapeObj as any).boundingBox!
      const margin = 30
      
      const clampedX = Math.max(bounds.min.x + margin, Math.min(bounds.max.x - margin, x))
      const clampedZ = Math.max(bounds.min.z + margin, Math.min(bounds.max.z - margin, z))
      
      const clampedPillarX = Math.max(bounds.min.x + margin, Math.min(bounds.max.x - margin, pillarX))
      const clampedPillarZ = Math.max(bounds.min.z + margin, Math.min(bounds.max.z - margin, pillarZ))

      setPosition({ x: clampedX, z: clampedZ })
      setPillarPosition(prev => {
        if (prev.x === clampedPillarX && prev.z === clampedPillarZ) return prev
        return { x: clampedPillarX, z: clampedPillarZ }
      })
      
      const rayStartHeight = Math.max(bounds.max.y + 2000, 5000)
      const offsets = [[0, 0], [5, 0], [-5, 0], [0, 5], [0, -5], [5, 5], [-5, -5]]
      
      raycaster.set(new THREE.Vector3(clampedX, rayStartHeight, clampedZ), new THREE.Vector3(0, -1, 0))
      raycaster.far = 20000
      raycaster.near = 0
      let templeIntersects = raycaster.intersectObject(landscapeObj, true)
      if (templeIntersects.length > 0) {
        const surfaceY = templeIntersects[0].point.y
        setTempleY(surfaceY)
      } else {
        let foundSurface = false
        for (const [offsetX, offsetZ] of offsets) {
          raycaster.set(new THREE.Vector3(clampedX + offsetX, rayStartHeight, clampedZ + offsetZ), new THREE.Vector3(0, -1, 0))
          templeIntersects = raycaster.intersectObject(landscapeObj, true)
          if (templeIntersects.length > 0) {
            setTempleY(templeIntersects[0].point.y)
            foundSurface = true
            break
          }
        }
        
        if (!foundSurface) {
          setTempleY(bounds.min.y)
        }
      }
      
      raycaster.set(new THREE.Vector3(clampedPillarX, rayStartHeight, clampedPillarZ), new THREE.Vector3(0, -1, 0))
      let pillarIntersects = raycaster.intersectObject(landscapeObj, true)
      if (pillarIntersects.length > 0) {
        const surfaceY = pillarIntersects[0].point.y
        setPillarY(surfaceY)
      } else {
        let foundSurface = false
        for (const [offsetX, offsetZ] of offsets) {
          raycaster.set(new THREE.Vector3(clampedPillarX + offsetX, rayStartHeight, clampedPillarZ + offsetZ), new THREE.Vector3(0, -1, 0))
          pillarIntersects = raycaster.intersectObject(landscapeObj, true)
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
    
    const timer = setTimeout(checkHeights, 800)
    const interval = setInterval(checkHeights, 2000)
    
    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [x, z, pillarX, pillarZ, raycaster, landscapeRef, templeScene, pillarScene])
  
  const interactedRef = useRef(false)
  
  useFrame(() => {
    if ((!pillarGroup.current && !templeGroup.current) || !camera) return
    
    const { interact } = getKeys()
    
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
    
    if (interact && !interactedRef.current && minDistance < 80) {
      interactedRef.current = true
      onInteract(deity)
    } else if (!interact) {
      interactedRef.current = false
    }
  })
  
  if (templeY === null || pillarY === null) {
    return null
  }

  return (
    <group>
      <group ref={templeGroup} position={[position.x, templeY, position.z]}>
        <primitive object={templeScene} />
      </group>
      
      <group ref={pillarGroup} position={[pillarPosition.x, pillarY, pillarPosition.z]}>
        <primitive object={pillarScene} />
      </group>
    </group>
  )
}

function TemplesAndPillars({ landscapeRef, onInteract }: { 
  landscapeRef: React.MutableRefObject<LandscapeRef>; 
  onInteract: (deity: Deity) => void;
}) {
  const [deities, setDeities] = useState<Deity[]>([])
  
  useEffect(() => {
    fetch('/rig_deities.json')
      .then(res => res.json())
      .then((data: { Rigvedic_Deities?: Deity[] }) => {
        const loadedDeities = data.Rigvedic_Deities || []
        setDeities(loadedDeities)
      })
      .catch(err => console.error('Failed to load deities:', err))
  }, [])
  
  const landscapeObj = landscapeRef?.current?.current
  const bounds = landscapeObj ? (landscapeObj as any).boundingBox : undefined
  
  const positions = useMemo(() => {
    if (deities.length === 0 || !bounds) return []
    
    const margin = 30
    const minX = bounds.min.x + margin
    const maxX = bounds.max.x - margin
    const minZ = bounds.min.z + margin
    const maxZ = bounds.max.z - margin
    
    const cols = Math.ceil(Math.sqrt(deities.length))
    const rows = Math.ceil(deities.length / cols)
    
    return deities.map((deity, index) => {
      const col = index % cols
      const row = Math.floor(index / cols)
      
      const x = minX + (col / (cols - 1 || 1)) * (maxX - minX)
      const z = minZ + (row / (rows - 1 || 1)) * (maxZ - minZ)
      
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

function PlayerControls({ speed = 15, sprintMultiplier = 2, landscapeRef }: { 
  speed?: number; 
  sprintMultiplier?: number; 
  landscapeRef: React.MutableRefObject<LandscapeRef>;
}) {
  const { camera, raycaster } = useThree()
  const [, getKeys] = useKeyboardControls<{ forward: boolean; backward: boolean; left: boolean; right: boolean; sprint: boolean }>()
  const velocity = useRef(new THREE.Vector3())
  const minHeight = 20.0
  const boundsMargin = 2
  const initialised = useRef(false)
  const lastSurfaceY = useRef<number | null>(null)

  useFrame((_, delta) => {
    if (!initialised.current) {
      const landscapeObj = landscapeRef?.current?.current
      if (!landscapeObj || !(landscapeObj as any).boundingBox) return
      if (!raycaster) return

      const bounds = (landscapeObj as any).boundingBox!
      const centerX = (bounds.min.x + bounds.max.x) / 2
      const centerZ = (bounds.min.z + bounds.max.z) / 2

      camera.position.x = centerX
      camera.position.z = centerZ

      raycaster.set(new THREE.Vector3(centerX, 2000, centerZ), new THREE.Vector3(0, -1, 0))
      raycaster.far = 5000
      raycaster.near = 0
      const intersects = raycaster.intersectObject(landscapeObj, true)
      
      if (intersects.length > 0) {
        const groundY = intersects[0].point.y
        camera.position.y = groundY + minHeight
        lastSurfaceY.current = groundY
        camera.rotation.set(0, 0, 0)
        initialised.current = true
      } else {
        const groundY = bounds.min.y
        camera.position.y = groundY + minHeight
        lastSurfaceY.current = groundY
        camera.rotation.set(0, 0, 0)
        initialised.current = true
      }
      return
    }

    const { forward, backward, left, right, sprint } = getKeys()
    const moveSpeed = (sprint ? sprintMultiplier : 1) * speed

    const direction = new THREE.Vector3()
    if (forward) direction.z -= 1
    if (backward) direction.z += 1
    if (left) direction.x -= 1
    if (right) direction.x += 1
    
    if (direction.lengthSq() > 0) {
      direction.normalize()

      const cameraDirection = new THREE.Vector3(0, 0, -1)
      cameraDirection.applyQuaternion(camera.quaternion)
      cameraDirection.y = 0
      cameraDirection.normalize()

      const cameraRight = new THREE.Vector3(1, 0, 0)
      cameraRight.applyQuaternion(camera.quaternion)
      cameraRight.y = 0
      cameraRight.normalize()

      const move = new THREE.Vector3()
      move.addScaledVector(cameraDirection, -direction.z)
      move.addScaledVector(cameraRight, direction.x)
      
      if (move.lengthSq() > 0) {
        move.normalize()
        velocity.current.copy(move.multiplyScalar(moveSpeed * delta))
        camera.position.add(velocity.current)
      }
    }

    const landscapeObj = landscapeRef?.current?.current
    if (landscapeObj && (landscapeObj as any).boundingBox) {
      const bounds = (landscapeObj as any).boundingBox!
      if (camera.position.x < bounds.min.x + boundsMargin) camera.position.x = bounds.min.x + boundsMargin
      if (camera.position.x > bounds.max.x - boundsMargin) camera.position.x = bounds.max.x - boundsMargin
      if (camera.position.z < bounds.min.z + boundsMargin) camera.position.z = bounds.min.z + boundsMargin
      if (camera.position.z > bounds.max.z - boundsMargin) camera.position.z = bounds.max.z - boundsMargin
    }

    if (landscapeObj && raycaster && initialised.current) {
      raycaster.set(new THREE.Vector3(camera.position.x, camera.position.y + 500, camera.position.z), new THREE.Vector3(0, -1, 0))
      raycaster.far = 5000
      raycaster.near = 0
      const intersects = raycaster.intersectObject(landscapeObj, true)
      if (intersects.length > 0) {
        const groundY = intersects[0].point.y
        const targetY = groundY + minHeight
        lastSurfaceY.current = groundY
        camera.position.y = targetY
      } else if (lastSurfaceY.current !== null) {
        camera.position.y = lastSurfaceY.current + minHeight
      }
    }
  })

  return null
}

function ConstellationLines({ radius = 500 }: { radius?: number }) {
  const group = useRef<THREE.Group>(null)
  const [segments, setSegments] = useState<Array<[THREE.Vector3, THREE.Vector3]>>([])

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const zodiacConstellations: Array<[THREE.Vector3, THREE.Vector3]> = []
        const numConstellations = 12
        const baseAngle = 0
        
        for (let i = 0; i < numConstellations; i++) {
          const angle1 = (baseAngle + (i * 2 * Math.PI / numConstellations)) % (2 * Math.PI)
          const angle2 = (baseAngle + ((i + 0.5) * 2 * Math.PI / numConstellations)) % (2 * Math.PI)
          const angle3 = (baseAngle + ((i + 1) * 2 * Math.PI / numConstellations)) % (2 * Math.PI)
          
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
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={2}
              itemSize={3}
              array={new Float32Array([pair[0].x, pair[0].y, pair[0].z, pair[1].x, pair[1].y, pair[1].z])}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#88aaff" transparent opacity={0.6} />
        </line>
      ))}
    </group>
  )
}

function RotatingSky({ isNight }: { isNight: boolean }) {
  const group = useRef<THREE.Group>(null)
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

function DeityInfoPanel({ deity, onClose }: { deity: Deity | null; onClose: () => void }) {
  if (!deity) return null
  
  const formatValue = (value: string | string[] | object | undefined): string => {
    if (!value) return 'N/A'
    if (typeof value === 'string') return value
    if (Array.isArray(value)) return value.join(', ')
    return JSON.stringify(value)
  }
  
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
        <strong style={{ color: '#ffd700' }}>Category:</strong> <span style={{ color: '#fff' }}>{formatValue(deity.category)}</span>
      </div>
      <div style={{ marginBottom: '15px', fontSize: '16px' }}>
        <strong style={{ color: '#ffd700' }}>Domain:</strong> <span style={{ color: '#fff' }}>{formatValue(deity.domain)}</span>
      </div>
      {deity.epithets && deity.epithets.length > 0 && (
        <div style={{ marginBottom: '15px', fontSize: '16px' }}>
          <strong style={{ color: '#ffd700' }}>Epithets:</strong> <span style={{ color: '#fff' }}>{deity.epithets.join(', ')}</span>
        </div>
      )}
      {deity.symbolism && (
        <div style={{ marginBottom: '15px', fontSize: '16px' }}>
          <strong style={{ color: '#ffd700' }}>Symbolism:</strong> <span style={{ color: '#fff' }}>{formatValue(deity.symbolism)}</span>
        </div>
      )}
      {deity.scriptural_presence && (
        <div style={{ marginBottom: '15px', fontSize: '16px', lineHeight: '1.6' }}>
          <strong style={{ color: '#ffd700' }}>Scriptural Presence:</strong> <span style={{ color: '#fff' }}>{formatValue(deity.scriptural_presence)}</span>
        </div>
      )}
      {deity.lore && (
        <div style={{ marginBottom: '15px', fontSize: '16px', lineHeight: '1.6' }}>
          <strong style={{ color: '#ffd700' }}>Lore:</strong> <span style={{ color: '#fff' }}>{formatValue(deity.lore)}</span>
        </div>
      )}
      {deity.historical_evolution && (
        <div style={{ marginBottom: '15px', fontSize: '16px', lineHeight: '1.6' }}>
          <strong style={{ color: '#ffd700' }}>Historical Evolution:</strong> <span style={{ color: '#fff' }}>{formatValue(deity.historical_evolution)}</span>
        </div>
      )}
      {deity.elements && (
        <div style={{ marginBottom: '15px', fontSize: '16px' }}>
          <strong style={{ color: '#ffd700' }}>Elements:</strong> <span style={{ color: '#fff' }}>{formatValue(deity.elements)}</span>
        </div>
      )}
      {deity.colors && (
        <div style={{ marginBottom: '15px', fontSize: '16px' }}>
          <strong style={{ color: '#ffd700' }}>Colors:</strong> <span style={{ color: '#fff' }}>{formatValue(deity.colors)}</span>
        </div>
      )}
      {deity.associated_animals && (
        <div style={{ marginBottom: '15px', fontSize: '16px' }}>
          <strong style={{ color: '#ffd700' }}>Associated Animals:</strong> <span style={{ color: '#fff' }}>{formatValue(deity.associated_animals)}</span>
        </div>
      )}
    </div>
  )
}

const LandscapePage: React.FC = () => {
  const [isNight, setIsNight] = useState(false)
  const [selectedDeity, setSelectedDeity] = useState<Deity | null>(null)
  const landscapeRef = useRef<LandscapeRef>({ current: null })

  useEffect(() => {
    const interval = setInterval(() => {
      setIsNight(prev => !prev)
    }, 60000)
    
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
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
    <div className="min-h-screen bg-transparent relative">
      {/* Video overlay for better text readability */}
      <div className="fixed inset-0 bg-gradient-to-br from-vedic-deep/48 via-vedic-deep/48 to-vedic-deep/94 -z-[9] pointer-events-none" />
      
      <div style={{ width: '100vw', height: '100vh', position: 'relative', zIndex: 10 }}>
        <KeyboardControls map={map}>
          <Canvas shadows camera={{ position: [0, 20, 0], fov: 60 }}>
            <color attach="background" args={[isNight ? '#05070c' : '#87CEEB']} />
            <RotatingSky isNight={isNight} />

            <Suspense fallback={null}>
              <Landscape ref={(ref) => { if (ref) { landscapeRef.current.current = ref; (ref as any).boundingBox = new THREE.Box3().setFromObject(ref) } }} />
              <TemplesAndPillars 
                landscapeRef={landscapeRef} 
                onInteract={(deity) => {
                  setSelectedDeity(prev => {
                    if (prev && prev.name === deity?.name) {
                      return null
                    }
                    return deity
                  })
                }} 
              />
            </Suspense>

            <PlayerControls landscapeRef={landscapeRef} />
            <PointerLockControls selector="#enter" />
          </Canvas>
        </KeyboardControls>

        <div style={{ position: 'absolute', top: 12, left: 12, padding: '8px 10px', background: 'rgba(0,0,0,0.45)', color: '#fff', borderRadius: 8, fontFamily: 'system-ui, sans-serif', lineHeight: 1.35, zIndex: 100 }}>
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

        <button id="enter" style={{ position: 'absolute', bottom: 16, left: 16, padding: '8px 12px', borderRadius: 6, border: 'none', background: '#2563eb', color: '#fff', cursor: 'pointer', zIndex: 100 }}>
          Enter View
        </button>

        {selectedDeity && (
          <DeityInfoPanel deity={selectedDeity} onClose={() => setSelectedDeity(null)} />
        )}
      </div>
    </div>
  )
}

export default LandscapePage

