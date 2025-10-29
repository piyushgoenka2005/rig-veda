import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// GLB Model Component - Use this once you export your Blender animation
export const GLBBook: React.FC<{ 
  isOpen: boolean; 
  isHovered: boolean;
  position?: [number, number, number];
  scale?: number;
  onClick?: () => void;
}> = ({ isOpen, isHovered, position = [0, 0, 0], scale = 1, onClick }) => {
  const bookRef = useRef<THREE.Group>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  
  // Load your Blender model
  const { scene, animations } = useGLTF('/simple-animated-book/book_animation.glb');
  
  // Set up animations when model loads
  useEffect(() => {
    if (scene && animations && animations.length > 0) {
      const mixer = new THREE.AnimationMixer(scene);
      mixerRef.current = mixer;
      
      // Play the book opening animation
      const action = mixer.clipAction(animations[0]);
      action.setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = true;
      
      if (isOpen) {
        action.play();
      } else {
        action.reset();
      }
    }
  }, [scene, animations, isOpen]);

  // Animation loop
  useFrame((state, delta) => {
    if (bookRef.current) {
      // Update animation mixer
      if (mixerRef.current) {
        mixerRef.current.update(delta);
      }
      
      // Hover effects
      const targetY = isHovered ? 0.3 : 0;
      bookRef.current.position.y = THREE.MathUtils.lerp(
        bookRef.current.position.y, 
        targetY, 
        0.08
      );
      
      // Gentle floating animation
      bookRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.03;
    }
  });

  // Clone the scene to avoid conflicts
  const clonedScene = scene.clone();

  return (
    <group 
      ref={bookRef} 
      position={position} 
      scale={scale}
      onClick={onClick}
    >
      <primitive object={clonedScene} />
      
      {/* Glow effect */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.5, 16, 16]} />
        <meshBasicMaterial 
          color="#D4AF37" 
          transparent 
          opacity={isHovered ? 0.15 : 0} 
        />
      </mesh>
    </group>
  );
};

// Preload the GLB model
useGLTF.preload('/simple-animated-book/book_animation.glb');
