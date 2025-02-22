import React, { useState } from 'react';

//Create a File Upload Component to upload a dataset (CSV or JSON).
interface FileUploadProps {
  onFileUpload: (content: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);

      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        onFileUpload(content);
      };
      reader.readAsText(uploadedFile);
    }
  };

  return (
    <div>
      <input type="file" accept=".csv,.json" onChange={handleFileChange} />
    </div>
  );
};

export default FileUpload;