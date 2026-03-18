import React from "react";

const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  className = "",
}) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="text-sm font-medium text-stone-700 mb-1">
        {label} {required && <span className="text-amber-700">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full px-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-800/20 focus:border-amber-800 bg-white/50 transition-all ${className}`}
      />
    </div>
  );
};

export default InputField;