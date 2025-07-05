import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { uploadPhoto } from '@/lib/amplify-storage';

interface PhotoUploadProps {
  year: number;
  onUploadComplete: () => void;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({ year, onUploadComplete }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState({
    caption: '',
    uploader: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      await uploadPhoto(selectedFile, year, metadata);
      setSelectedFile(null);
      setMetadata({ caption: '', uploader: '', date: new Date().toISOString().split('T')[0] });
      onUploadComplete();
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Upload Photo</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Select Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="w-full p-2 border rounded-lg"
          />
        </div>

        {selectedFile && (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">Caption</label>
              <input
                type="text"
                value={metadata.caption}
                onChange={(e) => setMetadata(prev => ({ ...prev, caption: e.target.value }))}
                className="w-full p-2 border rounded-lg"
                placeholder="Photo caption..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Uploader Name</label>
              <input
                type="text"
                value={metadata.uploader}
                onChange={(e) => setMetadata(prev => ({ ...prev, uploader: e.target.value }))}
                className="w-full p-2 border rounded-lg"
                placeholder="Your name..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Date</label>
              <input
                type="date"
                value={metadata.date}
                onChange={(e) => setMetadata(prev => ({ ...prev, date: e.target.value }))}
                className="w-full p-2 border rounded-lg"
              />
            </div>

            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isUploading ? (
                'Uploading...'
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload Photo
                </>
              )}
            </button>
          </>
        )}
      </div>
    </div>
  );
};