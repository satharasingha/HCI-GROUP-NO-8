import React, { useState } from "react";
import {
  Sofa,
  Armchair,
  BedDouble,
  Table,
  Lamp,
  Book,
  Flower2,
  Square,
  Search,
  X,
} from "lucide-react";

const furnitureCategories = {
  Seating: ["Sofa", "Loveseat", "Armchair"],
  Tables: ["Coffee Table", "Dining Table"],
  Storage: ["Bookshelf", "Cabinet"],
  Decor: ["Plant", "Lamp", "Rug", "Mirror"],
  Beds: ["Bed"],
};

const furnitureIcons = {
  Sofa: Sofa,
  Loveseat: Armchair,
  Armchair: Armchair,

  "Coffee Table": Table,
  "Dining Table": Table,

  Bookshelf: Book,
  Cabinet: Square,

  Plant: Flower2,
  Lamp: Lamp,
  Rug: Square,
  Mirror: Square,

  Bed: BedDouble,
};

const FurnitureSidebar = ({ addFurniture, items = [], selectedId }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [draggedItem, setDraggedItem] = useState(null);

  const allFurniture = Object.values(furnitureCategories).flat();

  const filteredFurniture =
    selectedCategory === "All"
      ? allFurniture
      : furnitureCategories[selectedCategory] || [];

  const searchedFurniture = filteredFurniture.filter((item) =>
    item.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.setData("text/plain", item);
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleDragEnd = () => setDraggedItem(null);

  const handleDrop = (e) => {
    e.preventDefault();
    const item = e.dataTransfer.getData("text/plain");
    if (item) {
      addFurniture(item);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const clearSearch = () => setSearchTerm("");

  return (
    <div
      className="w-full lg:w-80 bg-white border-r border-stone-200 h-full flex flex-col shadow-sm"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {/* Header */}
      <div className="p-4 border-b border-stone-200 bg-gradient-to-r from-amber-50 to-stone-50">
        <h2 className="text-lg font-light text-stone-900">
          Furniture <span className="text-amber-800 font-normal">Library</span>
        </h2>
        <p className="text-xs text-stone-500 mt-0.5 flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-amber-700 rounded-full"></span>
          Drag & drop to add • Click to place
        </p>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-stone-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Search furniture..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-sm border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white/50"
          />

          <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-stone-400" />

          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="p-3 border-b border-stone-200 overflow-x-auto scrollbar-hide">
        <div className="flex gap-1.5">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              selectedCategory === "All"
                ? "bg-amber-800 text-white shadow-md"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            All Items
          </button>

          {Object.keys(furnitureCategories).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                selectedCategory === category
                  ? "bg-amber-800 text-white shadow-md"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Furniture grid */}
      <div className="flex-1 overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-stone-300 scrollbar-track-stone-100">
        {searchedFurniture.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-3 opacity-20">🪑</div>
            <p className="text-stone-400 text-sm">No furniture found</p>
            <p className="text-xs text-stone-300 mt-1">Try a different search</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {searchedFurniture.map((item) => {
              const Icon = furnitureIcons[item] || Square;

              return (
                <div
                  key={item}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                  onDragEnd={handleDragEnd}
                  onClick={() => addFurniture(item)}
                  className={`p-3 border-2 rounded-xl cursor-grab active:cursor-grabbing transition-all duration-200 ${
                    draggedItem === item
                      ? "opacity-50 border-amber-800 bg-amber-50 shadow-lg rotate-3 scale-105"
                      : "border-stone-200 hover:border-amber-800 hover:bg-amber-50/30 hover:shadow-md"
                  }`}
                >
                  {/* ICON */}
                  <div className="flex justify-center mb-2">
                    <Icon 
                      size={28} 
                      className={`${
                        draggedItem === item 
                          ? "text-amber-800" 
                          : "text-stone-700 group-hover:text-amber-800"
                      }`} 
                    />
                  </div>

                  <div className="text-xs font-medium text-center text-stone-600 truncate">
                    {item}
                  </div>
                  
                  {/* Drag indicator */}
                  <div className="flex justify-center mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] text-amber-600">⋯</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-stone-200 bg-gradient-to-r from-stone-50 to-amber-50/30">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-stone-500">Items in room:</span>
            <span className="font-medium text-stone-900 bg-white px-2 py-0.5 rounded-full border border-stone-200">
              {items.length}
            </span>
          </div>
          
          {/* Drop zone indicator */}
          <div className="flex items-center gap-1 text-stone-400">
            <span className="w-2 h-2 bg-amber-700/50 rounded-full animate-pulse"></span>
            <span className="text-[10px]">Drop anywhere</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FurnitureSidebar;