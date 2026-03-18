import React, { useRef, useEffect, useState } from "react";
import { useGLTF, Html, Billboard, useAnimations } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

// Fixed model paths with proper formatting
const models = {
  Sofa: "/models/sofa.glb",
  Table: "/models/table.glb",
  Bed: "/models/bed.glb",
  Plant: "/models/plant.glb",
  Bookshelf: "/models/book_shelf.glb",
  "Dining Table": "/models/dining_table.glb",
  "Coffee Table": "/models/coffee_table.glb",
  Loveseat: "/models/love_seat.glb",
  Rug: "/models/rug/glb",
  Tv: "/models/led_tv.glb",
  Armchair: "/models/arm_chair.glb",
  Cabinet: "/models/cabinet.glb",
  Mirror: "/models/mirror.glb",
  "Table Lamp": "/models/table_lamp.glb",
  "Floor Lamp": "/models/floor_lamp.glb",
  
};

// Fallback colors for different furniture types
const getFurnitureColor = (type) => {
  const colors = {
    Sofa: "#8B4513",
    Loveseat: "#8B4513",
    Armchair: "#8B4513",
    Table: "#A0522D",
    "Dining Table": "#8B4513",
    "Coffee Table": "#CD853F",
    Bed: "#4682B4",
    Plant: "#228B22",
    Bookshelf: "#8B5A2B",
    Cabinet: "#8B5A2B",
    Mirror: "#C0C0C0",
    "Table Lamp": "#FFD700",
    "Floor Lamp": "#FFD700",
    Ottoman: "#8B4513",
    Desk: "#8B5A2B",
    Wardrobe: "#8B5A2B",
    "Side Table": "#A0522D"
  };
  return colors[type] || "#808080";
};

// Loading skeleton component
function LoadingSkeleton() {
  return (
    <group>
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[0.8, 0.6, 0.8]} />
        <meshStandardMaterial color="#cccccc" emissive="#333333" />
      </mesh>
      <Billboard position={[0, 0.8, 0]}>
        <Html center>
          <div className="bg-black/70 text-white px-3 py-1.5 rounded-full text-xs animate-pulse">
            Loading...
          </div>
        </Html>
      </Billboard>
    </group>
  );
}

// Error component for failed loads
function ErrorFallback({ type, color }) {
  return (
    <group>
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 0.6, 0.8]} />
        <meshStandardMaterial color={color} emissive="#440000" />
      </mesh>
      <mesh position={[0, 0.6, 0.4]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.4, 0.05, 0.05]} />
        <meshStandardMaterial color="#ff0000" />
      </mesh>
      <Billboard position={[0, 0.9, 0]}>
        <Html center>
          <div className="bg-red-500/80 text-white px-2 py-1 rounded text-xs">
            {type}
          </div>
        </Html>
      </Billboard>
    </group>
  );
}

export default function Furniture3D({
  item,
  updateItem,
  isSelected,
  onSelect,
  roomWidth,
  roomDepth
}) {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [modelScale, setModelScale] = useState(1);
  
  // Get the model path with fallback
  const modelPath = models[item.type] || models.Sofa;
  
  // Load model with error handling
  let gltf;
  try {
    gltf = useGLTF(modelPath, true);
  } catch (error) {
    console.warn(`Failed to load model for ${item.type}:`, error);
    setLoadError(true);
    setIsLoading(false);
  }

  // Clone and setup model when loaded
  useEffect(() => {
    if (!gltf?.scene || loadError) {
      setIsLoading(false);
      return;
    }

    try {
      const clone = gltf.scene.clone(true);

      // Enable shadows and optimize materials
      clone.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          
          // Enhance materials for better appearance
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(mat => {
                mat.roughness = 0.4;
                mat.metalness = 0.1;
                mat.envMapIntensity = 1.5;
                if (mat.map) mat.map.anisotropy = 16;
              });
            } else {
              child.material.roughness = 0.4;
              child.material.metalness = 0.1;
              child.material.envMapIntensity = 1.5;
              if (child.material.map) child.material.map.anisotropy = 16;
            }
          }
        }
      });

      // Calculate bounding box for proper scaling
      const box = new THREE.Box3().setFromObject(clone);
      const size = new THREE.Vector3();
      box.getSize(size);

      // Determine scale based on item dimensions or default
      const targetWidth = item.width || 1;
      const targetDepth = item.depth || 0.8;
      const targetHeight = 0.8; // Average height

      // Scale to fit within target dimensions while maintaining aspect ratio
      const scaleX = targetWidth / size.x;
      const scaleY = targetHeight / size.y;
      const scaleZ = targetDepth / size.z;
      
      // Use the smallest scale to ensure it fits in all dimensions
      const scale = Math.min(scaleX, scaleY, scaleZ) * 0.9; // Slightly smaller for margins
      
      setModelScale(scale);
      clone.scale.setScalar(scale);

      // Center the model
      const scaledBox = new THREE.Box3().setFromObject(clone);
      const center = new THREE.Vector3();
      scaledBox.getCenter(center);
      const min = scaledBox.min.clone();

      clone.position.x -= center.x;
      clone.position.z -= center.z;
      clone.position.y -= min.y;

      // Clear existing children
      while (groupRef.current?.children.length > 0) {
        groupRef.current.remove(groupRef.current.children[0]);
      }

      // Add new model
      groupRef.current?.add(clone);
      setIsLoading(false);
      setLoadError(false);
    } catch (error) {
      console.error("Error processing model:", error);
      setLoadError(true);
      setIsLoading(false);
    }
  }, [gltf, item.type, item.width, item.depth, loadError]);

  // Handle pointer events for dragging
  const onPointerDown = (e) => {
    e.stopPropagation();
    setDragging(true);
    onSelect(item.id);
    document.body.style.cursor = 'grabbing';
  };

  const onPointerUp = () => {
    setDragging(false);
    document.body.style.cursor = 'default';
  };

  const onPointerMove = (e) => {
    if (!dragging) return;

    // Calculate new position with bounds
    const newX = e.point.x;
    const newZ = e.point.z;

    // Dynamic margin based on item size
    const margin = Math.max(item.width || 0.8, item.depth || 0.8) / 2 + 0.2;

    const boundedX = Math.max(
      -roomWidth / 2 + margin,
      Math.min(roomWidth / 2 - margin, newX)
    );

    const boundedZ = Math.max(
      -roomDepth / 2 + margin,
      Math.min(roomDepth / 2 - margin, newZ)
    );

    // Grid snapping (0.5m grid)
    const gridSize = 0.5;
    const snapX = Math.round(boundedX / gridSize) * gridSize;
    const snapZ = Math.round(boundedZ / gridSize) * gridSize;

    updateItem(item.id, {
      x: snapX,
      y: snapZ
    });
  };

  // Get color for fallback
  const fallbackColor = getFurnitureColor(item.type);

  return (
    <group
      ref={groupRef}
      position={[item.x || 0, 0, item.y || 0]}
      rotation={[0, (item.rotation || 0) * Math.PI / 180, 0]}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerMove={onPointerMove}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Selection/hover indicator */}
      {(hovered || isSelected) && (
        <>
          {/* Ground ring */}
          <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.9, 1.2, 32]} />
            <meshBasicMaterial
              color={isSelected ? "#22c55e" : "#ffffff"}
              transparent
              opacity={0.4}
            />
          </mesh>
          
          {/* Corner markers for selected items */}
          {isSelected && (
            <>
              {[
                [-0.5, 0, -0.5],
                [0.5, 0, -0.5],
                [-0.5, 0, 0.5],
                [0.5, 0, 0.5]
              ].map((pos, i) => (
                <mesh key={i} position={[pos[0] * (item.width || 1), 0.1, pos[2] * (item.depth || 1)]}>
                  <sphereGeometry args={[0.05, 8, 8]} />
                  <meshStandardMaterial color="#22c55e" emissive="#22c55e" />
                </mesh>
              ))}
            </>
          )}
        </>
      )}

      {/* Show loading skeleton or error fallback */}
      {isLoading && !loadError && <LoadingSkeleton />}
      
      {loadError && (
        <ErrorFallback type={item.type} color={fallbackColor} />
      )}

      {/* Position indicator while dragging */}
      {dragging && (
        <Billboard position={[0, 1.5, 0]}>
          <Html center>
            <div className="bg-black/80 text-white px-4 py-2 rounded-lg shadow-lg text-sm whitespace-nowrap backdrop-blur-sm">
              <div className="font-medium">{item.type}</div>
              <div className="text-xs text-gray-300">
                📍 ({item.x?.toFixed(2)}m, {item.y?.toFixed(2)}m)
              </div>
            </div>
          </Html>
        </Billboard>
      )}

      {/* Type label on hover */}
      {hovered && !dragging && !isSelected && (
        <Billboard position={[0, 1.2, 0]}>
          <Html center>
            <div className="bg-black/60 text-white px-2 py-1 rounded text-xs backdrop-blur-sm">
              {item.type}
            </div>
          </Html>
        </Billboard>
      )}

      {/* Size indicator (for debugging) */}
      {process.env.NODE_ENV === 'development' && isSelected && (
        <Billboard position={[0, 0.5, 0]}>
          <Html center>
            <div className="bg-blue-500/80 text-white px-2 py-0.5 rounded text-[10px]">
              {item.width?.toFixed(2)}m x {item.depth?.toFixed(2)}m
            </div>
          </Html>
        </Billboard>
      )}
    </group>
  );
}

// Preload all models with error handling
Object.entries(models).forEach(([name, path]) => {
  try {
    useGLTF.preload(path);
    console.log(`Preloaded: ${name}`);
  } catch (e) {
    console.warn(`Could not preload ${name}: ${path}`);
  }
});

// Add cleanup for memory management
export const clearModelCache = () => {
  useGLTF.clear();
};