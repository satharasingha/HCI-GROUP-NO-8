import React, { useRef, useEffect } from "react";
import { Rect, Text, Transformer, Group, Circle } from "react-konva";

const FurnitureItem = ({
  item,
  roomX,
  roomY,
  scale,
  isSelected,
  onSelect,
  onChange,
  roomWidth,
  roomDepth
}) => {
  const shapeRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  // Calculate pixel positions
  const x = roomX + (item.x + roomWidth/2) * scale;
  const y = roomY + (item.y + roomDepth/2) * scale;
  const width = (item.width || 1) * scale;
  const height = (item.depth || 1) * scale;

  // Get color based on furniture type
  const getFurnitureColor = (type) => {
    const colors = {
      Sofa: "#8B4513",
      Table: "#A0522D",
      Bed: "#4682B4",
      Plant: "#228B22",
      Bookshelf: "#8B5A2B",
      "Dining Table": "#8B4513",
      "Coffee Table": "#CD853F",
      Loveseat: "#8B4513"
    };
    return colors[type] || "#808080";
  };

  // Get icon based on furniture type
  const getFurnitureIcon = (type) => {
    const icons = {
      Sofa: "🛋️",
      Table: "🍽️",
      Bed: "🛏️",
      Plant: "🌿",
      Bookshelf: "📚",
      "Dining Table": "🍽️",
      "Coffee Table": "☕",
      Loveseat: "🪑"
    };
    return icons[type] || "🪑";
  };

  const handleDragEnd = (e) => {
    // Convert pixel coordinates back to meters (centered on room)
    const newX = (e.target.x() - roomX) / scale - roomWidth/2;
    const newY = (e.target.y() - roomY) / scale - roomDepth/2;

    // Snap to grid
    const gridSize = 0.5;
    const snappedX = Math.round(newX / gridSize) * gridSize;
    const snappedY = Math.round(newY / gridSize) * gridSize;

    // Validate within room bounds
    const margin = (item.width || 1) / 2;
    const boundedX = Math.max(-roomWidth/2 + margin, Math.min(roomWidth/2 - margin, snappedX));
    const boundedY = Math.max(-roomDepth/2 + margin, Math.min(roomDepth/2 - margin, snappedY));

    onChange({
      x: boundedX,
      y: boundedY
    });
  };

  const handleTransformEnd = () => {
    const node = shapeRef.current;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    node.scaleX(1);
    node.scaleY(1);

    // Calculate new position (centered)
    const newX = (node.x() - roomX) / scale - roomWidth/2;
    const newY = (node.y() - roomY) / scale - roomDepth/2;

    onChange({
      x: newX,
      y: newY,
      width: Math.max(0.5, (node.width() * scaleX) / scale),
      depth: Math.max(0.5, (node.height() * scaleY) / scale),
      rotation: node.rotation()
    });
  };

  return (
    <>
      <Group>
        {/* Shadow effect */}
        <Rect
          x={x + 2}
          y={y + 2}
          width={width}
          height={height}
          fill="rgba(0,0,0,0.1)"
          cornerRadius={4}
          rotation={item.rotation || 0}
        />
        
        {/* Main furniture rectangle */}
        <Rect
          ref={shapeRef}
          x={x}
          y={y}
          width={width}
          height={height}
          fill={getFurnitureColor(item.type)}
          stroke={isSelected ? "#4CAF50" : "#333"}
          strokeWidth={isSelected ? 3 : 1}
          cornerRadius={4}
          shadowColor={isSelected ? "#4CAF50" : "rgba(0,0,0,0.3)"}
          shadowBlur={isSelected ? 10 : 5}
          shadowOffset={{ x: 2, y: 2 }}
          shadowOpacity={0.3}
          draggable
          rotation={item.rotation || 0}
          onClick={onSelect}
          onTap={onSelect}
          onDragEnd={handleDragEnd}
          onTransformEnd={handleTransformEnd}
        />

        {/* Icon or label */}
        <Text
          x={x + width/2 - 8}
          y={y + height/2 - 8}
          text={getFurnitureIcon(item.type)}
          fontSize={16}
          align="center"
          verticalAlign="middle"
          rotation={item.rotation || 0}
        />

        {/* Size indicator */}
        <Text
          x={x + 5}
          y={y + height - 15}
          text={`${(item.width || 1).toFixed(1)}x${(item.depth || 1).toFixed(1)}m`}
          fontSize={8}
          fill="white"
          opacity={0.8}
          rotation={item.rotation || 0}
        />

        {/* Rotation handle indicator */}
        {isSelected && (
          <Circle
            x={x + width/2}
            y={y - 10}
            radius={4}
            fill="#4CAF50"
            stroke="white"
            strokeWidth={1}
          />
        )}
      </Group>

      {/* Transformer for selected items */}
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            const minWidth = 0.5 * scale;
            const minHeight = 0.5 * scale;
            
            if (newBox.width < minWidth || newBox.height < minHeight) {
              return oldBox;
            }
            return newBox;
          }}
          rotateEnabled={true}
          resizeEnabled={true}
          anchorSize={8}
          anchorCornerRadius={4}
          anchorFill="#4CAF50"
          anchorStroke="#fff"
          borderStroke="#4CAF50"
          borderStrokeWidth={2}
        />
      )}
    </>
  );
};

export default FurnitureItem;