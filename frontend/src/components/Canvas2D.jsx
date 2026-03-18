import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Rect, Line, Text, Circle } from "react-konva";
import FurnitureItem from "./FurnitureItem";

const Canvas2D = ({
  items,
  updateItem,
  selectedId,
  setSelectedId,
  roomWidth,
  roomDepth,
}) => {
  const stageRef = useRef();
  const containerRef = useRef();
  const [scale, setScale] = useState(40);
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [showMeasurements, setShowMeasurements] = useState(true);
  
  // Grid settings
  const GRID_SIZE = 0.5;
  const MIN_SCALE = 20;
  const MAX_SCALE = 120;
  const PADDING = 40;

  // Update container size on resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setContainerSize({ width, height });
        
        // Auto-fit on initial load
        if (width > 0 && height > 0) {
          const scaleX = (width - PADDING * 2) / roomWidth;
          const scaleY = (height - PADDING * 2) / roomDepth;
          const newScale = Math.min(scaleX, scaleY, MAX_SCALE);
          setScale(Math.max(MIN_SCALE, newScale));
        }
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [roomWidth, roomDepth]);

  // Calculate canvas dimensions - centered in container
  const canvasWidth = Math.max(containerSize.width, roomWidth * scale + PADDING * 2);
  const canvasHeight = Math.max(containerSize.height, roomDepth * scale + PADDING * 2);
  
  // Center the room in canvas
  const roomX = (canvasWidth - roomWidth * scale) / 2;
  const roomY = (canvasHeight - roomDepth * scale) / 2;

  // Handle zoom with wheel
  const handleWheel = (e) => {
    e.evt.preventDefault();
    
    const scaleBy = 1.1;
    const newScale = e.evt.deltaY > 0 ? scale / scaleBy : scale * scaleBy;
    
    setScale(Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale)));
  };

  // Handle stage drag
  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (e) => {
    setIsDragging(false);
    setStagePos({ x: e.target.x(), y: e.target.y() });
  };

  // Zoom controls
  const zoomIn = () => setScale(s => Math.min(s * 1.2, MAX_SCALE));
  const zoomOut = () => setScale(s => Math.max(s / 1.2, MIN_SCALE));
  
  const resetView = () => {
    setStagePos({ x: 0, y: 0 });
    if (containerSize.width > 0 && containerSize.height > 0) {
      const scaleX = (containerSize.width - PADDING * 2) / roomWidth;
      const scaleY = (containerSize.height - PADDING * 2) / roomDepth;
      setScale(Math.min(scaleX, scaleY, MAX_SCALE));
    }
  };

  const centerView = () => {
    setStagePos({ x: 0, y: 0 });
  };

  // Draw grid lines
  const renderGrid = () => {
    if (!showGrid) return null;
    
    const lines = [];
    const cols = Math.ceil(roomWidth / GRID_SIZE);
    const rows = Math.ceil(roomDepth / GRID_SIZE);

    // Fine grid lines (0.5m)
    for (let i = 0; i <= cols; i++) {
      const x = roomX + i * GRID_SIZE * scale;
      lines.push(
        <Line
          key={`v-${i}`}
          points={[x, roomY, x, roomY + roomDepth * scale]}
          stroke="#e5e7eb"
          strokeWidth={0.5}
          dash={[2, 2]}
        />
      );
    }

    for (let i = 0; i <= rows; i++) {
      const y = roomY + i * GRID_SIZE * scale;
      lines.push(
        <Line
          key={`h-${i}`}
          points={[roomX, y, roomX + roomWidth * scale, y]}
          stroke="#e5e7eb"
          strokeWidth={0.5}
          dash={[2, 2]}
        />
      );
    }

    // Bold grid lines (1m)
    for (let i = 0; i <= roomWidth; i++) {
      const x = roomX + i * scale;
      lines.push(
        <Line
          key={`vm-${i}`}
          points={[x, roomY, x, roomY + roomDepth * scale]}
          stroke="#9ca3af"
          strokeWidth={1}
        />
      );
    }

    for (let i = 0; i <= roomDepth; i++) {
      const y = roomY + i * scale;
      lines.push(
        <Line
          key={`hm-${i}`}
          points={[roomX, y, roomX + roomWidth * scale, y]}
          stroke="#9ca3af"
          strokeWidth={1}
        />
      );
    }

    return lines;
  };

  // Draw measurement indicators
  const renderMeasurements = () => {
    if (!showMeasurements) return null;
    
    return (
      <>
        {/* Width measurement */}
        <Line
          points={[roomX, roomY - 20, roomX + roomWidth * scale, roomY - 20]}
          stroke="#6b7280"
          strokeWidth={1.5}
          dash={[4, 2]}
        />
        <Text
          x={roomX + (roomWidth * scale) / 2 - 30}
          y={roomY - 35}
          text={`${roomWidth.toFixed(1)}m`}
          fontSize={12}
          fill="#4b5563"
          fontStyle="bold"
          background="white"
          padding={2}
          cornerRadius={2}
        />
        
        {/* Depth measurement */}
        <Line
          points={[roomX - 20, roomY, roomX - 20, roomY + roomDepth * scale]}
          stroke="#6b7280"
          strokeWidth={1.5}
          dash={[4, 2]}
        />
        <Text
          x={roomX - 45}
          y={roomY + (roomDepth * scale) / 2 - 10}
          text={`${roomDepth.toFixed(1)}m`}
          fontSize={12}
          fill="#4b5563"
          fontStyle="bold"
          rotation={-90}
          background="white"
          padding={2}
          cornerRadius={2}
        />
      </>
    );
  };

  // Draw origin marker (0,0)
  const renderOrigin = () => {
    const originX = roomX + (roomWidth/2) * scale;
    const originY = roomY + (roomDepth/2) * scale;
    
    return (
      <>
        <Circle
          x={originX}
          y={originY}
          radius={5}
          fill="#ef4444"
        />
        <Circle
          x={originX}
          y={originY}
          radius={2}
          fill="white"
        />
        <Text
          x={originX + 8}
          y={originY - 15}
          text="0,0"
          fontSize={10}
          fill="#ef4444"
          fontStyle="bold"
        />
      </>
    );
  };

  return (
    <div ref={containerRef} className="h-full w-full">
      <div className="bg-white rounded-lg shadow-lg h-full flex flex-col">
        {/* Simple header */}
        <div className="p-3 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-700">2D Layout</h3>
          
          <div className="flex items-center gap-1">
            {/* View toggles */}
            <button
              onClick={() => setShowGrid(!showGrid)}
              className={`px-2 py-1 text-xs rounded ${
                showGrid ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setShowMeasurements(!showMeasurements)}
              className={`px-2 py-1 text-xs rounded ${
                showMeasurements ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Measure
            </button>

            {/* Zoom controls */}
            <div className="flex items-center ml-2 border-l border-gray-200 pl-2">
              <button
                onClick={zoomOut}
                className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                title="Zoom Out"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
              <span className="w-12 text-center text-xs text-gray-600">{Math.round(scale)}%</span>
              <button
                onClick={zoomIn}
                className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                title="Zoom In"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
              <button
                onClick={centerView}
                className="p-1 text-gray-600 hover:bg-gray-100 rounded ml-1"
                title="Center View"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Canvas container */}
        <div className="flex-1 p-2 overflow-hidden">
          <div className="relative w-full h-full bg-gray-50 rounded border border-gray-200">
            <Stage
              ref={stageRef}
              width={canvasWidth}
              height={canvasHeight}
              draggable
              x={stagePos.x}
              y={stagePos.y}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onWheel={handleWheel}
              onMouseDown={(e) => {
                if (e.target === e.target.getStage()) {
                  setSelectedId(null);
                }
              }}
              style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
            >
              <Layer>
                {/* Background */}
                <Rect
                  x={0}
                  y={0}
                  width={canvasWidth}
                  height={canvasHeight}
                  fill="#f9fafb"
                />

                {/* Grid */}
                {renderGrid()}

                {/* Room floor */}
                <Rect
                  x={roomX}
                  y={roomY}
                  width={roomWidth * scale}
                  height={roomDepth * scale}
                  fill="#f3f4f6"
                  stroke="#6b7280"
                  strokeWidth={1.5}
                />

                {/* Measurements */}
                {renderMeasurements()}

                {/* Origin marker */}
                {renderOrigin()}

                {/* Furniture items */}
                {items.map((item) => (
                  <FurnitureItem
                    key={item.id}
                    item={item}
                    roomX={roomX}
                    roomY={roomY}
                    scale={scale}
                    isSelected={selectedId === item.id}
                    onSelect={() => setSelectedId(item.id)}
                    onChange={(updates) => updateItem(item.id, updates)}
                    roomWidth={roomWidth}
                    roomDepth={roomDepth}
                  />
                ))}
              </Layer>
            </Stage>

            {/* Simple scale indicator */}
            <div className="absolute bottom-2 right-2 bg-white/90 px-2 py-1 rounded text-xs text-gray-600 border border-gray-200">
              {Math.round(scale)}% | {GRID_SIZE}m grid
            </div>
          </div>
        </div>

        {/* Simple status */}
        <div className="p-2 border-t border-gray-200 text-xs text-gray-500 flex justify-between">
          <span>{items.length} item{items.length !== 1 ? 's' : ''}</span>
          {selectedId && (
            <span className="text-blue-600">
              Selected: {items.find(i => i.id === selectedId)?.type}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Canvas2D;