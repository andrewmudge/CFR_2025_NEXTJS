// S3 utility functions for photo gallery
export interface PhotoMetadata {
  id: string;
  url: string;
  caption: string;
  uploader: string;
  date: string;
  year: number;
}

export const uploadPhoto = async (file: File, year: string, metadata: Omit<PhotoMetadata, 'url'>) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('year', year);
  formData.append('metadata', JSON.stringify(metadata));

  const response = await fetch('/api/photos/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Upload failed');
  }

  return response.json();
};

export const fetchPhotos = async (year: string): Promise<PhotoMetadata[]> => {
  const response = await fetch(`/api/photos/list?year=${year}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch photos');
  }

  return response.json();
};