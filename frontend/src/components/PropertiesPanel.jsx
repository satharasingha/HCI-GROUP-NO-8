import React from "react";

const PropertiesPanel = ({ selectedId, deleteSelected }) => {

  return (
    <div className="w-72 bg-white border-l p-5">

      <h2 className="text-xs font-semibold text-gray-500 mb-6">
        PROPERTIES
      </h2>

      {!selectedId ? (
        <p className="text-gray-400 text-sm">
          No item selected
        </p>
      ) : (
        <button
          onClick={deleteSelected}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Delete Selected
        </button>
      )}

    </div>
  );
};

export default PropertiesPanel;