import React, { useState } from "react";
import "./UploadArea.css";
import logoIcon from "../../assets/logo.png";

export default function UploadArea({ onFileSelect }: { onFileSelect: (file: File) => void }) {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === "application/pdf") {
        onFileSelect(file);
      } else {
        alert("Please upload a PDF file.");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div 
      className={`upload-area ${isDragActive ? "upload-area--active" : ""}`}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
    >
      <label className="upload-area__label">
        <input
          type="file"
          id="file-upload"
          className="upload-area__input"
          accept=".pdf"
          onChange={handleChange}
        />
        <img src={logoIcon} alt="Mesh AI Logo" className="upload-area__icon" />
        <p className="upload-area__text">
          Drag'n'Drop or <span>Upload</span>
        </p>
      </label>
    </div>
  );
}