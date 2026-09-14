import { supabase, isSupabaseConfigured } from './supabase';

export async function uploadCivicImage(
  file: Blob | File,
  bucket: 'issue-images' | 'resolution-images' = 'issue-images'
): Promise<string> {
  // If Supabase is connected, upload to Supabase Storage Bucket
  if (isSupabaseConfigured) {
    try {
      const fileExt = file.type.includes('webp') ? 'webp' : 'jpg';
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `${bucket}/${fileName}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) {
        console.warn('Supabase storage upload error, falling back to local URL:', error.message);
        return URL.createObjectURL(file);
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return publicUrlData.publicUrl;
    } catch (err) {
      console.warn('Storage upload exception:', err);
      return URL.createObjectURL(file);
    }
  }

  // Demo Mode: Convert to persistent Base64 Data URL or Object URL
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.onerror = () => {
      resolve(URL.createObjectURL(file));
    };
    reader.readAsDataURL(file);
  });
}
