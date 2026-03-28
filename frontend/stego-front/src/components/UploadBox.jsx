import React, { useState } from "react";

export default function UploadBox({ setFile, setPreview, resetForm }) {
  const [dragActive, setDragActive] = useState(false);

  // 📂 File select
  const handleChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setFile(file);
      setPreview(URL.createObjectURL(file));

      // 🔥 Reset message & password
      resetForm && resetForm();
    }
  };

  // 📦 Drag over
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  // 📦 Drag leave
  const handleDragLeave = () => {
    setDragActive(false);
  };

  // 📦 Drop file
  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);

    const dropped = e.dataTransfer.files[0];

    if (dropped) {
      setFile(dropped);
      setPreview(URL.createObjectURL(dropped));

      // 🔥 Reset message & password
      resetForm && resetForm();
    }
  };

  return (
    <div className="mb-4">
      {/* 🔥 DROP AREA */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`w-full p-6 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all duration-300
          ${
            dragActive
              ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-[1.02]"
              : "border-gray-300 dark:border-gray-600 hover:border-blue-400"
          }`}
      >
        {/* 🔥 HIDDEN INPUT */}
        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
          id="fileUpload"
          className="hidden"
        />

        {/* 🔥 CLICKABLE AREA */}
        <label htmlFor="fileUpload" className="cursor-pointer block">
          {/* ICON */}
          <div className="text-3xl mb-2">📁</div>

          {/* TEXT */}
          <p className="text-gray-700 dark:text-gray-300 font-medium">
            Click to upload or drag & drop
          </p>

          <p className="text-sm text-gray-400 mt-1">PNG, JPG, JPEG supported</p>
        </label>
      </div>
    </div>
  );
}
