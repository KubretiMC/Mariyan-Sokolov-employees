import React, { useRef } from "react";
import "./FileUpload.css";

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  loading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, loading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "text/csv") {
      onFileUpload(file);
    } else {
      alert("Please select a valid CSV file");
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type === "text/csv") {
      onFileUpload(file);
    } else {
      alert("Please drop a valid CSV file");
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className="file-upload-container">
      <div
        className="file-upload-area"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Processing file...</p>
          </div>
        ) : (
          <>
            <div className="upload-icon">📁</div>
            <p>Click to select or drag and drop your CSV file here</p>
            <p className="file-format">Supported format: CSV files only</p>
          </>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />
    </div>
  );
};

export default FileUpload;
