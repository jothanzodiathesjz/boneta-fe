import React, { useState, ChangeEvent } from 'react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      onFileSelect(file);
    }
  };

  return (
    <div className="flex flex-col items-center border border-gray-300 p-4 rounded-lg w-72 mx-auto bg-white">
      <input
        type="file"
        onChange={handleFileChange}
        className="mb-4 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
      {selectedFile && (
        <div className="text-sm text-gray-600">
          <p>Selected file: {selectedFile.name}</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
