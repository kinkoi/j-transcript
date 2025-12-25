
import React, { useRef } from 'react';

interface AudioUploaderProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

const AudioUploader: React.FC<AudioUploaderProps> = ({ onFileSelect, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'audio/wav') {
      onFileSelect(file);
    } else if (file) {
      alert("Please upload a .wav file");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === 'audio/wav') {
      onFileSelect(file);
    } else if (file) {
      alert("Please upload a .wav file");
    }
  };

  return (
    <div 
      className={`relative group border-2 border-dashed rounded-2xl p-12 transition-all duration-300 flex flex-col items-center justify-center cursor-pointer
        ${isLoading ? 'border-indigo-200 bg-indigo-50/30' : 'border-slate-300 hover:border-indigo-500 hover:bg-indigo-50/50'}`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={() => !isLoading && fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        className="hidden" 
        accept=".wav" 
        ref={fileInputRef} 
        onChange={handleChange}
        disabled={isLoading}
      />
      
      <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      </div>
      
      <h3 className="text-xl font-semibold text-slate-800 mb-2">Upload Japanese Audio</h3>
      <p className="text-slate-500 text-center max-w-xs">
        {isLoading ? 'Processing your file...' : 'Drag and drop your .wav file here or click to browse'}
      </p>
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[1px] rounded-2xl">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-2"></div>
            <span className="text-sm font-medium text-indigo-600">AI Transcription in progress...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioUploader;
