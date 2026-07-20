import React, { useState, useRef } from 'react';
import { Upload, X, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { DocumentUpload } from '../types';

interface DocumentUploaderProps {
  label: string;
  gujaratiLabel: string;
  document: DocumentUpload | null;
  onUpload: (doc: DocumentUpload | null) => void;
  required?: boolean;
}

export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  label,
  gujaratiLabel,
  document,
  onUpload,
  required = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('ફાઇલનું કદ 5MB થી ઓછું હોવું જોઈએ. (File size must be less than 5MB.)');
      setTimeout(() => setError(null), 5000);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const sizeStr = (file.size / 1024).toFixed(1) + ' KB';
      onUpload({
        fileName: file.name,
        fileSize: sizeStr,
        fileType: file.type,
        dataUrl,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpload(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isImage = document && document.fileType.startsWith('image/');

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-baseline">
        <label className="block text-sm font-medium text-slate-800">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <span className="text-xs text-emerald-600 font-medium font-sans">
          {gujaratiLabel}
        </span>
      </div>

      {error && (
        <div className="text-[11px] font-semibold text-rose-600 bg-rose-50 border border-rose-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5 animate-pulse">
          <AlertTriangle className="h-3.5 w-3.5 text-rose-500 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        accept="image/png, image/jpeg, image/jpg, application/pdf"
        className="hidden"
      />

      {!document ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center min-h-[140px] ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50/50'
              : 'border-slate-300 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50'
          }`}
        >
          <Upload
            className={`h-8 w-8 mb-2 transition-transform duration-200 ${
              isDragging ? 'text-indigo-500 scale-110' : 'text-slate-400'
            }`}
          />
          <p className="text-xs font-semibold text-slate-700">
            ખેંચો અને અહીં છોડો અથવા ક્લિક કરો
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Drag & drop files here or click to browse
          </p>
          <p className="text-[10px] text-slate-400 mt-2 font-mono">
            JPG, PNG, PDF • Max 100KB
          </p>
        </div>
      ) : (
        <div className="relative border border-slate-200 rounded-xl p-3 bg-white shadow-xs flex items-center justify-between group">
          <div className="flex items-center space-x-3 overflow-hidden">
            {isImage ? (
              <img
                src={document.dataUrl}
                alt={document.fileName}
                referrerPolicy="no-referrer"
                className="h-14 w-14 rounded-lg object-cover border border-slate-200 bg-slate-100 flex-shrink-0"
              />
            ) : (
              <div className="h-14 w-14 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500 flex-shrink-0">
                <FileText className="h-7 w-7" />
              </div>
            )}
            <div className="overflow-hidden">
              <p className="text-xs font-medium text-slate-800 truncate pr-4">
                {document.fileName}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-[10px] text-slate-500 font-mono">
                  {document.fileSize}
                </span>
                <span className="inline-flex items-center text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md font-sans">
                  <CheckCircle className="h-3 w-3 mr-1" /> અપલોડ કરેલ (Uploaded)
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={removeFile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors duration-200"
            title="Remove document"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>
      )}
    </div>
  );
};
