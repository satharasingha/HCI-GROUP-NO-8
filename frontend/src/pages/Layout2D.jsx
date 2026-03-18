import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Canvas2D from "../components/Canvas2D";
import Room3DView from "../components/Room3DView";
import FurnitureSidebar from "../components/FurnitureSidebar";

const Layout2D = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewDesign = id === "new";

  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  // Set default to "2d" as requested
  const [viewMode, setViewMode] = useState("2d");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [designName, setDesignName] = useState("Living Room");
  const [designId, setDesignId] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const roomWidth = 6;
  const roomDepth = 6;

  const token = localStorage.getItem("token");

  // Redirect to login if no token
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  // LOAD DESIGN
  useEffect(() => {
    if (!id || isNewDesign) return;

    const loadDesign = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/designs/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error();

        const data = await res.json();
        setItems(data.items || []);
        setDesignName(data.name || "Living Room");
        setDesignId(data._id);
      } catch (err) {
        console.error(err);
        alert("Failed to load design");
        navigate("/my-designs");
      } finally {
        setLoading(false);
      }
    };

    loadDesign();
  }, [id, token, navigate, isNewDesign]);

  // SAFE UPDATE
  const updateItem = useCallback((id, updates) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  }, []);

  // ADD FURNITURE
  const addFurniture = (type) => {
    const newItem = {
      id: Date.now().toString(),
      type,
      x: 0,
      y: 0,
      width: 1,
      depth: 1,
      rotation: 0,
    };
    setItems((prev) => [...prev, newItem]);
  };

  // SAVE DESIGN
  const handleSave = async () => {
    if (!token) {
      alert("Please login to save designs");
      navigate("/login");
      return;
    }

    setSaving(true);
    try {
      // Capture thumbnail from canvas
      const canvas = document.querySelector(".konvajs-content canvas");
      const thumbnail = canvas?.toDataURL("image/png");

      const designData = {
        name: designName,
        room: { width: roomWidth, depth: roomDepth },
        items,
        thumbnail,
      };

      let response;
      if (designId) {
        // Update existing design
        response = await fetch(`http://localhost:5000/api/designs/${designId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(designData),
        });
      } else {
        // Create new design
        response = await fetch("http://localhost:5000/api/designs", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(designData),
        });
      }

      if (!response.ok) throw new Error();

      const data = await response.json();
      
      // Show success message
      alert("Design saved successfully!");
      
      // Redirect to My Designs page
      navigate("/designs");
    } catch (error) {
      console.error("Save failed:", error);
      alert("Failed to save design. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // SHARE
  const handleShare = async () => {
    if (!designId) return alert("Save first");

    try {
      const res = await fetch(`http://localhost:5000/api/designs/${designId}/share`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      await navigator.clipboard.writeText(data.link);
      alert("Share link copied!");
    } catch {
      alert("Share failed");
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-warm-50">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-3 border-amber-800/20 border-t-amber-800 mx-auto mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 bg-amber-800/10 rounded-full"></div>
            </div>
          </div>
          <p className="text-stone-500">Loading your design...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-warm-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-stone-200 px-4 py-3 shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between">
          {/* Left section - Logo and Design ID */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
              <img 
                src="/logo.png" 
                alt="RoomCraft" 
                className="w-8 h-8 object-contain"
              />
              <span className="text-lg font-light text-stone-900 hidden sm:inline">
                Room<span className="text-amber-800 font-normal">Craft</span>
              </span>
            </div>
            {designId && (
              <span className="px-2 py-1 bg-amber-50 text-amber-700 text-xs rounded-full border border-amber-200 hidden md:inline">
                ID: {designId.slice(-4)}
              </span>
            )}
          </div>

          {/* Center - View Toggle with Icons (centered on mobile/desktop) */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <div className="bg-stone-100 rounded-lg p-1 flex shadow-inner">
              <button
                onClick={() => setViewMode("2d")}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                  viewMode === "2d"
                    ? "bg-white text-amber-800 shadow-md"
                    : "text-stone-600 hover:text-stone-800"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span className="hidden sm:inline">2D</span>
              </button>
              <button
                onClick={() => setViewMode("3d")}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                  viewMode === "3d"
                    ? "bg-white text-amber-800 shadow-md"
                    : "text-stone-600 hover:text-stone-800"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                </svg>
                <span className="hidden sm:inline">3D</span>
              </button>
            </div>
          </div>

          {/* Right section - Actions */}
          <div className="flex items-center gap-2">
            {/* Design Name Input - hidden on mobile, visible on larger screens */}
            <input
              type="text"
              value={designName}
              onChange={(e) => setDesignName(e.target.value)}
              className="hidden md:block px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white/50 w-40 lg:w-48"
              placeholder="Design name"
            />

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-2">
              {/* Save Button */}
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-gradient-to-r from-amber-800 to-stone-800 hover:from-amber-900 hover:to-stone-900 disabled:from-amber-300 disabled:to-stone-300 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 shadow-lg shadow-amber-900/20"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span className="hidden lg:inline">Saving...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    <span className="hidden lg:inline">Save</span>
                  </>
                )}
              </button>

              {/* Share Button */}
              <button
                onClick={handleShare}
                disabled={!designId}
                className="bg-stone-100 hover:bg-stone-200 disabled:bg-stone-50 text-stone-600 disabled:text-stone-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 border border-stone-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span className="hidden lg:inline">Share</span>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-3 p-3 bg-white rounded-lg border border-stone-200 shadow-lg">
            <div className="space-y-3">
              {/* Design Name Input for Mobile */}
              <input
                type="text"
                value={designName}
                onChange={(e) => setDesignName(e.target.value)}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800"
                placeholder="Design name"
              />

              {/* Mobile Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 bg-gradient-to-r from-amber-800 to-stone-800 hover:from-amber-900 hover:to-stone-900 disabled:from-amber-300 disabled:to-stone-300 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                      </svg>
                      Save
                    </>
                  )}
                </button>
                <button
                  onClick={handleShare}
                  disabled={!designId}
                  className="flex-1 bg-stone-100 hover:bg-stone-200 disabled:bg-stone-50 text-stone-600 disabled:text-stone-400 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 border border-stone-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Share
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        <FurnitureSidebar addFurniture={addFurniture} items={items} selectedId={selectedId} />

        <div className="flex-1 p-4 overflow-auto">
          {viewMode === "2d" ? (
            <Canvas2D
              items={items}
              updateItem={updateItem}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              roomWidth={roomWidth}
              roomDepth={roomDepth}
            />
          ) : (
            <Room3DView
              items={items}
              updateItem={updateItem}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              roomWidth={roomWidth}
              roomDepth={roomDepth}
            />
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="bg-white/90 backdrop-blur-sm border-t border-stone-200 px-4 py-2 text-sm text-stone-600 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-4">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-5V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
            <span className="hidden sm:inline">Room:</span> 6m × 6m
          </span>
          <span className="w-1 h-1 bg-stone-300 rounded-full"></span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            Items: {items.length}
          </span>
        </div>
        {selectedId && (
          <div className="flex items-center text-amber-700 bg-amber-50 px-3 py-1 rounded-full text-xs">
            <span className="w-2 h-2 bg-amber-700 rounded-full mr-2 animate-pulse"></span>
            Selected: {items.find((i) => i.id === selectedId)?.type}
          </div>
        )}
      </div>
    </div>
  );
};

export default Layout2D;