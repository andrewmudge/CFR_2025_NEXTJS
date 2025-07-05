import { uploadData, getUrl, list, remove } from 'aws-amplify/storage';

export interface PhotoMetadata {
  caption: string;
  uploader: string;
  date: string;
  year: number;
}

export interface Photo {
  id: string;
  url: string;
  caption: string;
  uploader: string;
  date: string;
  year: number;
}

// Upload photo to S3
export const uploadPhoto = async (
  file: File,
  year: number,
  metadata: Omit<PhotoMetadata, 'year'>
): Promise<string> => {
  const fileExtension = file.name.split('.').pop();
  const photoId = crypto.randomUUID();
  const key = `photos/${year}/${photoId}.${fileExtension}`;

  const result = await uploadData({
    key,
    data: file,
    options: {
      accessLevel: 'guest',
      metadata: {
        caption: metadata.caption,
        uploader: metadata.uploader,
        date: metadata.date,
        year: year.toString(),
        originalName: file.name
      }
    }
  }).result;

  return result.key;
};

// List photos for a specific year
export const listPhotos = async (year: number): Promise<Photo[]> => {
  const result = await list({
    prefix: `photos/${year}/`,
    options: {
      accessLevel: 'guest',
      listAll: true
    }
  });

  const photos: Photo[] = [];
  
  for (const item of result.items) {
    if (item.key && item.key.includes('.')) {
      const photoId = item.key.split('/').pop()?.split('.')[0] || '';
      
      // Get download URL
      const urlResult = await getUrl({
        key: item.key,
        options: {
          accessLevel: 'guest'
        }
      });
      
      const url = urlResult.url.toString();
      
      photos.push({
        id: photoId,
        url,
        caption: '', // Metadata not available in list operation
        uploader: '',
        date: '',
        year
      });
    }
  }

  return photos;
};

// Delete photo
export const deletePhoto = async (key: string): Promise<void> => {
  await remove({ key });
};