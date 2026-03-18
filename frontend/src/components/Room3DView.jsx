import React, { Suspense, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  ContactShadows,
  PerspectiveCamera,
  useTexture,
  Grid,
} from "@react-three/drei";

import Furniture3D from "./Furniture3D";
import * as THREE from "three";

// Floor component
function Floor({ width, depth, floorColor, floorTextureEnabled }) {
  const texture = useTexture("/textures/wood_floor.png", (texture) => {
    if (texture) {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(width * 2, depth * 2);
    }
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
      <planeGeometry args={[width, depth]} />
      <meshStandardMaterial
        color={floorColor}
        map={floorTextureEnabled ? texture : null}
        roughness={0.6}
        metalness={0.1}
      />
    </mesh>
  );
}

// Transparent Walls
function TransparentWall({
  position,
  width,
  height,
  thickness,
  color,
  rotation = [0, 0, 0],
}) {
  return (
    <mesh position={position} rotation={rotation} receiveShadow>
      <boxGeometry args={[width, height, thickness]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.12}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// Simple Lighting
function Lighting({ intensity = 1.8, ambientIntensity = 0.5 }) {
  return (
    <>
      <directionalLight
        position={[5, 10, 5]}
        intensity={intensity}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />
      <directionalLight
        position={[-3, 5, 3]}
        intensity={intensity * 0.3}
        castShadow
      />
      <ambientLight intensity={ambientIntensity} />
      <hemisphereLight args={["#ffffff", "#8b7355", 0.6]} />
    </>
  );
}

function Room({
  items,
  roomWidth,
  roomDepth,
  roomHeight = 3,
  updateItem,
  selectedId,
  setSelectedId,
  floorColor,
  wallColor,
  floorTextureEnabled,
  showGrid,
  lightIntensity,
  ambientIntensity,
}) {
  return (
    <>
      <Lighting
        intensity={lightIntensity}
        ambientIntensity={ambientIntensity}
      />

      <Floor
        width={roomWidth}
        depth={roomDepth}
        floorColor={floorColor}
        floorTextureEnabled={floorTextureEnabled}
      />

      {showGrid && (
        <Grid
          args={[roomWidth, roomDepth]}
          cellSize={0.5}
          cellThickness={0.3}
          cellColor="#a8a29e"
          sectionSize={2}
          sectionThickness={0.8}
          sectionColor="#78716c"
          position={[0, 0.01, 0]}
          fadeDistance={30}
          fadeStrength={1}
        />
      )}

      {/* Back wall */}
      <TransparentWall
        position={[0, roomHeight / 2, -roomDepth / 2]}
        width={roomWidth}
        height={roomHeight}
        thickness={0.15}
        color={wallColor}
      />

      {/* Left wall */}
      <TransparentWall
        position={[-roomWidth / 2, roomHeight / 2, 0]}
        width={roomDepth}
        height={roomHeight}
        thickness={0.15}
        color={wallColor}
        rotation={[0, Math.PI / 2, 0]}
      />

      {/* Right wall */}
      <TransparentWall
        position={[roomWidth / 2, roomHeight / 2, 0]}
        width={roomDepth}
        height={roomHeight}
        thickness={0.15}
        color={wallColor}
        rotation={[0, -Math.PI / 2, 0]}
      />

      {/* Window indicator */}
      <mesh position={[0, 1.5, -roomDepth / 2 + 0.08]}>
        <planeGeometry args={[2.2, 1.5]} />
        <meshBasicMaterial
          color="#9f8a7a"
          opacity={0.15}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Furniture */}
      {items.map((item) => (
        <Suspense key={item.id} fallback={null}>
          <Furniture3D
            item={item}
            updateItem={updateItem}
            isSelected={selectedId === item.id}
            onSelect={setSelectedId}
            roomWidth={roomWidth}
            roomDepth={roomDepth}
          />
        </Suspense>
      ))}

      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.25}
        scale={[roomWidth * 1.5, roomDepth * 1.5]}
        blur={2.5}
        far={5}
        color="#000000"
      />
    </>
  );
}

export default function Room3DView({
  items,
  roomWidth = 6,
  roomDepth = 6,
  updateItem,
  selectedId,
  setSelectedId,
}) {
  const controlsRef = useRef();
  const [isDragging, setIsDragging] = useState(false);

  // Temporary state for form inputs
  const [tempWidth, setTempWidth] = useState(roomWidth);
  const [tempDepth, setTempDepth] = useState(roomDepth);
  const [tempRoomShape, setTempRoomShape] = useState("Rectangle");
  const [tempWallColor, setTempWallColor] = useState("#B7A99A");
  const [tempFloorColor, setTempFloorColor] = useState("#9F7E69");
  const [tempShowGrid, setTempShowGrid] = useState(true);
  const [tempLightIntensity, setTempLightIntensity] = useState(1.8);
  const [tempAmbientIntensity, setTempAmbientIntensity] = useState(0.5);
  const [tempFloorTextureEnabled, setTempFloorTextureEnabled] = useState(true);

  // Applied state
  const [width, setWidth] = useState(roomWidth);
  const [depth, setDepth] = useState(roomDepth);
  const [roomShape, setRoomShape] = useState("Rectangle");
  const [wallColor, setWallColor] = useState("#B7A99A");
  const [floorColor, setFloorColor] = useState("#9F7E69");
  const [showGrid, setShowGrid] = useState(true);
  const [lightIntensity, setLightIntensity] = useState(1.8);
  const [ambientIntensity, setAmbientIntensity] = useState(0.5);
  const [floorTextureEnabled, setFloorTextureEnabled] = useState(true);

  const [activeColorPicker, setActiveColorPicker] = useState(null);

  const updateRoom = () => {
    setWidth(tempWidth);
    setDepth(tempDepth);
    setRoomShape(tempRoomShape);
    setWallColor(tempWallColor);
    setFloorColor(tempFloorColor);
    setShowGrid(tempShowGrid);
    setLightIntensity(tempLightIntensity);
    setAmbientIntensity(tempAmbientIntensity);
    setFloorTextureEnabled(tempFloorTextureEnabled);
    setActiveColorPicker(null);
  };

  const handleExportImage = async () => {
    try {
      const canvas = document.querySelector("canvas");
      if (!canvas) {
        alert("Could not capture image");
        return;
      }

      const link = document.createElement("a");
      link.download = `room_design_${new Date().getTime()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export image");
    }
  };

  const ColorInput = ({ label, color, setColor, colorKey }) => (
    <div className="flex items-center justify-between group relative">
      <span className="text-sm text-stone-600">{label}</span>
      <div className="flex items-center gap-2">
        <div
          className="w-6 h-6 rounded border border-stone-300 cursor-pointer group-hover:ring-2 group-hover:ring-amber-700 transition-all shadow-sm"
          style={{ backgroundColor: color }}
          onClick={() =>
            setActiveColorPicker(
              activeColorPicker === colorKey ? null : colorKey,
            )
          }
        ></div>
        <input
          type="text"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="w-20 px-2 py-1 border border-stone-200 rounded text-sm uppercase focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 bg-white/50"
          placeholder="#000000"
        />
      </div>

      {activeColorPicker === colorKey && (
        <div className="absolute right-0 top-8 z-20 bg-white rounded-lg shadow-xl p-2 border border-stone-200">
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-32 h-32 cursor-pointer"
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="flex h-full w-full bg-warm-50 rounded-lg overflow-hidden shadow-xl border border-stone-200">
      {/* 3D Canvas - Left Side */}
      <div className="flex-1 relative">
        <Canvas
          shadows
          gl={{
            antialias: true,
            preserveDrawingBuffer: true,
            powerPreference: "default",
          }}
          style={{ background: "#e8dfd5" }}
          camera={{ position: [5, 3, 6], fov: 45 }}
          onCreated={({ gl }) => {
            gl.setClearColor("#e8dfd5");
          }}
        >
          <PerspectiveCamera makeDefault position={[5, 3, 6]} fov={45} />

          <Room
            items={items}
            roomWidth={width}
            roomDepth={depth}
            updateItem={updateItem}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            floorColor={floorColor}
            wallColor={wallColor}
            floorTextureEnabled={floorTextureEnabled}
            showGrid={showGrid}
            lightIntensity={lightIntensity}
            ambientIntensity={ambientIntensity}
          />

          <OrbitControls
            ref={controlsRef}
            target={[0, 1, 0]}
            maxPolarAngle={Math.PI / 2.2}
            minDistance={3}
            maxDistance={15}
            enableDamping
            dampingFactor={0.05}
            enablePan={!isDragging}
            enableRotate={!isDragging}
            enableZoom={true}
          />
        </Canvas>

        {/* View indicator */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg px-3 py-2 text-sm text-stone-600 border border-stone-200">
          <span className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-amber-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"
              />
            </svg>
            Click furniture to select • Drag to move
          </span>
        </div>
      </div>

      {/* Right Sidebar - Room Settings */}
      <div className="w-80 bg-white border-l border-stone-200 flex flex-col overflow-y-auto">
        <div className="p-4 border-b border-stone-200 bg-gradient-to-r from-amber-50 to-stone-50">
          <h2 className="text-lg font-light text-stone-900">Room Settings</h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Adjust dimensions and colors
          </p>
        </div>

        <div className="p-4 border-b border-stone-200">
          <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-3">
            DIMENSIONS
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-stone-400 mb-1">
                Width (m)
              </label>
              <input
                type="number"
                value={tempWidth}
                onChange={(e) => setTempWidth(Number(e.target.value))}
                min="1"
                max="20"
                step="0.5"
                className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs text-stone-400 mb-1">
                Depth (m)
              </label>
              <input
                type="number"
                value={tempDepth}
                onChange={(e) => setTempDepth(Number(e.target.value))}
                min="1"
                max="20"
                step="0.5"
                className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-700/20 focus:border-amber-700 bg-white"
              />
            </div>
          </div>
        </div>

        <div className="p-4 border-b border-stone-200">
          <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-3">
            COLORS
          </label>

          <ColorInput
            label="Wall Color"
            color={tempWallColor}
            setColor={setTempWallColor}
            colorKey="wall"
          />

          <div className="mt-3">
            <ColorInput
              label="Floor Color"
              color={tempFloorColor}
              setColor={setTempFloorColor}
              colorKey="floor"
            />
          </div>
        </div>

        <div className="p-4 border-b border-stone-200">
          <label className="flex items-center justify-between cursor-pointer group">
            <span className="text-sm text-stone-600 group-hover:text-amber-700 transition-colors">
              Show Grid
            </span>
            <input
              type="checkbox"
              checked={tempShowGrid}
              onChange={(e) => setTempShowGrid(e.target.checked)}
              className="w-4 h-4 rounded border-stone-300 text-amber-700 focus:ring-amber-700/20"
            />
          </label>
          <label className="flex items-center justify-between mt-3 cursor-pointer group">
            <span className="text-sm text-stone-600 group-hover:text-amber-700 transition-colors">
              Floor Texture
            </span>
            <input
              type="checkbox"
              checked={tempFloorTextureEnabled}
              onChange={(e) => setTempFloorTextureEnabled(e.target.checked)}
              className="w-4 h-4 rounded border-stone-300 text-amber-700 focus:ring-amber-700/20"
            />
          </label>
        </div>

        <div className="p-4 border-b border-stone-200">
          <label className="block text-xs font-medium text-stone-500 uppercase tracking-wider mb-3">
            LIGHTING
          </label>

          <div className="mb-3">
            <div className="flex justify-between text-xs text-stone-500 mb-1">
              <span>Sun Intensity</span>
              <span className="bg-amber-100 px-2 py-0.5 rounded-full text-amber-700">
                {tempLightIntensity.toFixed(1)}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="3"
              step="0.1"
              value={tempLightIntensity}
              onChange={(e) =>
                setTempLightIntensity(parseFloat(e.target.value))
              }
              className="w-full accent-amber-700"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-stone-500 mb-1">
              <span>Ambient Light</span>
              <span className="bg-amber-100 px-2 py-0.5 rounded-full text-amber-700">
                {tempAmbientIntensity.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={tempAmbientIntensity}
              onChange={(e) =>
                setTempAmbientIntensity(parseFloat(e.target.value))
              }
              className="w-full accent-amber-700"
            />
          </div>
        </div>

        <div className="p-4 space-y-3">
          <button
            onClick={updateRoom}
            className="w-full bg-gradient-to-r from-amber-800 to-stone-800 hover:from-amber-900 hover:to-stone-900 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 shadow-lg shadow-amber-900/20 flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Update Room
          </button>

          <button
            onClick={handleExportImage}
            className="w-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 border border-stone-200"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Export as Image
          </button>
        </div>

        {selectedId && (
          <div className="p-4 bg-amber-50 border-t border-amber-100">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 bg-amber-700 rounded-full animate-pulse"></span>
              <p className="text-xs text-amber-700 font-medium">SELECTED</p>
            </div>
            <p className="text-sm text-stone-700 font-medium ml-4">
              {items.find((i) => i.id === selectedId)?.type}
            </p>
            <p className="text-xs text-stone-500 ml-4 mt-2">
              Click orange cube to rotate
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
