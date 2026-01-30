import { NextResponse } from "next/server";
import { SUPABASE_STORAGE_BUCKET } from "@/lib/constants";
import { getAdminSession } from "@/lib/serverAuth";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/server";

const ensureBucket = async (bucketName: string) => {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.storage.getBucket(bucketName);

  if (error && error.message.toLowerCase().includes("not found")) {
    const { error: createError } = await supabase.storage.createBucket(
      bucketName,
      { public: true }
    );
    if (createError) {
      throw new Error(createError.message);
    }
    return { created: true };
  }

  if (error) {
    throw new Error(error.message);
  }

  return { created: false, isPublic: data.public };
};

const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const POST = async (request: Request) => {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Недостаточно прав" }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase не настроен" },
      { status: 400 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file");
  const isFileLike =
    file &&
    typeof file === "object" &&
    "arrayBuffer" in file &&
    "type" in file;

  if (!isFileLike) {
    return NextResponse.json({ error: "Файл не найден" }, { status: 400 });
  }

  const uploadFile = file as File;

  if (!ALLOWED_TYPES.includes(uploadFile.type)) {
    return NextResponse.json(
      { error: "Неподдерживаемый формат" },
      { status: 400 }
    );
  }

  if (uploadFile.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: "Файл слишком большой (до 5MB)" },
      { status: 400 }
    );
  }

  const ext = uploadFile.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const safeExt = ext === "jpeg" ? "jpg" : ext;
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const path = `products/${id}.${safeExt}`;

  try {
    await ensureBucket(SUPABASE_STORAGE_BUCKET);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Ошибка bucket";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  const supabase = getSupabaseAdmin();
  const buffer = new Uint8Array(await uploadFile.arrayBuffer());
  const { error } = await supabase.storage
    .from(SUPABASE_STORAGE_BUCKET)
    .upload(path, buffer, {
      cacheControl: "3600",
      upsert: false,
      contentType: uploadFile.type,
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data } = supabase.storage
    .from(SUPABASE_STORAGE_BUCKET)
    .getPublicUrl(path);

  return NextResponse.json({ url: data.publicUrl });
};
