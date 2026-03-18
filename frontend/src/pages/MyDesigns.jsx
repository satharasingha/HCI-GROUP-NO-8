import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function MyDesigns() {
  const navigate = useNavigate();
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const menuRef = useRef(null);

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
    loadDesigns();

    // Close menu when clicking outside
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenu(null);
        setDeleteConfirm(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadDesigns = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/designs/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setDesigns(data);
    } catch (error) {
      console.error("Failed to load designs:", error);
    } finally {
      setLoading(false);
    }
  };

  const createNewDesign = () => {
    navigate("/designer/new");
  };

  const openDesign = (designId) => {
    navigate(`/designer/${designId}`);
  };

  const handleDelete = async (designId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/designs/${designId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete");

      // Remove from local state
      setDesigns(designs.filter((d) => d._id !== designId));
      setActiveMenu(null);
      setDeleteConfirm(null);
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete design");
    }
  };

  const handleExport = async (design) => {
    try {
      if (design.thumbnail) {
        const link = document.createElement("a");
        link.download = `${design.name.replace(/\s+/g, "_")}_${new Date().getTime()}.png`;
        link.href = design.thumbnail;
        link.click();
      } else {
        const canvas = document.createElement("canvas");
        canvas.width = 800;
        canvas.height = 600;
        const ctx = canvas.getContext("2d");

        // Background with warm gradient
        const gradient = ctx.createLinearGradient(0, 0, 800, 600);
        gradient.addColorStop(0, "#faf7f2");
        gradient.addColorStop(1, "#f5efe8");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Title with warm colors
        ctx.fillStyle = "#5c4f42";
        ctx.font = "bold 32px system-ui, -apple-system, sans-serif";
        ctx.fillText(design.name, 50, 80);

        // Details
        ctx.fillStyle = "#8b7f72";
        ctx.font = "18px system-ui, -apple-system, sans-serif";
        ctx.fillText(
          `Dimensions: ${design.room.width}m x ${design.room.depth}m`,
          50,
          140,
        );
        ctx.fillText(`Items: ${design.items?.length || 0}`, 50, 180);
        ctx.fillText(
          `Created: ${new Date(design.createdAt).toLocaleDateString()}`,
          50,
          220,
        );

        // Room preview with warm colors
        ctx.fillStyle = "#e8dfd5";
        ctx.fillRect(50, 280, 300, 200);
        ctx.strokeStyle = "#c4b5a5";
        ctx.lineWidth = 2;
        ctx.strokeRect(50, 280, 300, 200);

        ctx.fillStyle = "#8b7f72";
        ctx.font = "14px system-ui, -apple-system, sans-serif";
        ctx.fillText("Room Preview", 160, 390);

        // Add decorative element
        ctx.fillStyle = "#b08968";
        ctx.globalAlpha = 0.1;
        ctx.fillRect(400, 280, 350, 200);
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#8b7f72";
        ctx.font = "italic 16px system-ui, -apple-system, sans-serif";
        ctx.fillText("RoomCraft Design", 450, 380);

        // Convert to PNG and download
        canvas.toBlob((blob) => {
          const link = document.createElement("a");
          link.download = `${design.name.replace(/\s+/g, "_")}_${new Date().getTime()}.png`;
          link.href = URL.createObjectURL(blob);
          link.click();
        });
      }

      setActiveMenu(null);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export design");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .replace(/ /g, "");
  };

  const toggleMenu = (e, designId) => {
    e.stopPropagation();
    setActiveMenu(activeMenu === designId ? null : designId);
    setDeleteConfirm(null);
  };

  return (
    <div className="min-h-screen bg-warm-50 pt-24">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Title and New Design Button */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-light text-stone-900">
              My Designs
            </h2>
            <p className="text-sm text-stone-500 mt-1">
              Manage your furniture design projects
            </p>
          </div>
          <button
            onClick={createNewDesign}
            className="bg-gradient-to-r from-amber-800 to-stone-800 hover:from-amber-900 hover:to-stone-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 shadow-lg shadow-amber-900/20"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Design
          </button>
        </div>

        {/* Stats Bar */}
        <div className="bg-white rounded-xl shadow-sm p-5 mb-8 flex flex-wrap items-center gap-6 text-sm border border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-amber-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <div>
              <span className="text-xs text-stone-500">Total Designs</span>
              <p className="font-semibold text-stone-900 text-lg">
                {designs.length}
              </p>
            </div>
          </div>
          <div className="w-px h-10 bg-stone-200"></div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-stone-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <span className="text-xs text-stone-500">Last Updated</span>
              <p className="font-medium text-stone-800">
                {new Date()
                  .toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                  .replace(/ /g, "")}
              </p>
            </div>
          </div>
        </div>

        {/* Designs Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-3 border-amber-800/20 border-t-amber-800"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 bg-amber-800/10 rounded-full"></div>
              </div>
            </div>
          </div>
        ) : designs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-stone-100">
            <div className="text-7xl mb-4 opacity-50">🪑</div>
            <h3 className="text-2xl font-light text-stone-900 mb-2">
              No designs yet
            </h3>
            <p className="text-stone-500 mb-6">
              Start your first furniture design project
            </p>
            <button
              onClick={createNewDesign}
              className="bg-gradient-to-r from-amber-800 to-stone-800 hover:from-amber-900 hover:to-stone-900 text-white px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 inline-flex items-center gap-2 shadow-lg shadow-amber-900/20"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create New Design
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* New Design Card */}
            <button
              onClick={createNewDesign}
              className="bg-white rounded-xl border-2 border-dashed border-stone-300 hover:border-amber-800 hover:bg-amber-50/30 transition-all p-6 flex flex-col items-center justify-center min-h-[320px] group"
            >
              <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-amber-100 transition-colors">
                <svg
                  className="w-8 h-8 text-stone-400 group-hover:text-amber-800"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <h3 className="font-medium text-stone-700 group-hover:text-amber-800">
                Start New Design
              </h3>
              <p className="text-xs text-stone-400 mt-2">
                Blank canvas • Create something beautiful
              </p>
            </button>

            {/* Existing Designs */}
            {designs.map((design) => (
              <div
                key={design._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden relative group/card border border-stone-100"
              >
                {/* Three Dots Menu */}
                <div className="absolute top-2 right-2 z-20">
                  <button
                    onClick={(e) => toggleMenu(e, design._id)}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white shadow-md transition-all opacity-0 group-hover/card:opacity-100"
                  >
                    <svg
                      className="w-4 h-4 text-stone-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {activeMenu === design._id && (
                    <div
                      className="absolute right-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-stone-200 py-1 z-30"
                      ref={menuRef}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openDesign(design._id);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-stone-700 hover:bg-amber-50 flex items-center gap-3"
                      >
                        <svg
                          className="w-4 h-4 text-stone-500"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        View Design
                      </button>

                      <div className="border-t border-stone-100 my-1"></div>

                      {deleteConfirm === design._id ? (
                        <>
                          <div className="px-4 py-2 text-xs text-stone-400 bg-stone-50">
                            Are you sure?
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(design._id);
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm text-amber-700 hover:bg-amber-50 flex items-center gap-3"
                          >
                            <svg
                              className="w-4 h-4"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Yes, Delete
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirm(null);
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm text-stone-600 hover:bg-stone-50 flex items-center gap-3"
                          >
                            <svg
                              className="w-4 h-4"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirm(design._id);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-amber-700 hover:bg-amber-50 flex items-center gap-3"
                        >
                          <svg
                            className="w-4 h-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Delete Design
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Clickable area for opening design */}
                <div
                  onClick={() => openDesign(design._id)}
                  className="cursor-pointer"
                >
                  {/* Thumbnail */}
                  <div className="h-44 bg-gradient-to-br from-amber-50 to-stone-50 relative overflow-hidden">
                    {design.thumbnail ? (
                      <img
                        src={design.thumbnail}
                        alt={design.name}
                        className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-6xl opacity-10">🪑</span>
                      </div>
                    )}

                    {/* Preview badge */}
                    <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm text-stone-700 text-xs px-2 py-1 rounded-full shadow-sm border border-stone-200">
                      {design.items?.length || 0} items
                    </div>

                    {/* Room dimensions badge */}
                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-stone-600 text-xs px-2 py-1 rounded-full shadow-sm border border-stone-200">
                      {design.room.width}m × {design.room.depth}m
                    </div>
                  </div>

                  {/* Design Info */}
                  <div className="p-4">
                    <h3 className="font-medium text-stone-900 mb-1 truncate">
                      {design.name}
                    </h3>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-500 flex items-center gap-1">
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        {formatDate(design.updatedAt || design.createdAt)}
                      </span>
                      <span className="text-amber-700 font-medium">Edit →</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
