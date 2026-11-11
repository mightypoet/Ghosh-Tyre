import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('http') &&
    !supabaseUrl.includes('your-project-id') &&
    supabaseAnonKey !== 'your-supabase-anon-public-key'
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Uploads an image file to a Supabase Storage bucket ('product-images' or 'blog-images').
 * If Supabase is not configured or the bucket isn't created yet, falls back cleanly to a local Data URL
 * so the Admin user can still preview and save images without interruption.
 */
export async function uploadImageToSupabase(
  file: File,
  bucket: 'product-images' | 'blog-images'
): Promise<{ url: string; storedInSupabase: boolean; error?: string }> {
  if (supabase) {
    try {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const safeName = file.name
        .replace(/\.[^/.]+$/, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .slice(0, 40);
      const filePath = `${Date.now()}-${safeName}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (!uploadError) {
        const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
        if (data?.publicUrl) {
          return { url: data.publicUrl, storedInSupabase: true };
        }
      } else {
        console.warn(`Supabase storage upload warning (${bucket}):`, uploadError.message);
      }
    } catch (err) {
      console.warn('Supabase storage upload fallback:', err);
    }
  }

  // Clean fallback: convert File to Data URL
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve({
        url: typeof reader.result === 'string' ? reader.result : '',
        storedInSupabase: false,
      });
    };
    reader.readAsDataURL(file);
  });
}
