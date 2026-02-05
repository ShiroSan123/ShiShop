import { getSupabaseClient, SUPABASE_STORAGE_BUCKET } from './client';

const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const createFileId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const uploadProductImage = async (file) => {
  if (!file) {
    throw new Error('Файл не найден');
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Неподдерживаемый формат');
  }

  if (file.size > MAX_SIZE_BYTES) {
    throw new Error('Файл слишком большой (до 5MB)');
  }

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg';
  const safeExt = ext === 'jpeg' ? 'jpg' : ext;
  const path = `products/${createFileId()}.${safeExt}`;
  const supabase = getSupabaseClient();

  const { error } = await supabase.storage
    .from(SUPABASE_STORAGE_BUCKET)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage
    .from(SUPABASE_STORAGE_BUCKET)
    .getPublicUrl(path);

  return data.publicUrl;
};
