import { NextResponse } from "next/server";
import { SUPABASE_STORAGE_BUCKET } from "@/lib/constants";
import { getAdminSession } from "@/lib/serverAuth";
import { getSupabaseAdmin, isSupabaseConfigured } from "@/lib/supabase/server";

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

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Файл не найден" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: "Неподдерживаемый формат" },
      { status: 400 }
    );
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json(
      { error: "Файл слишком большой (до 5MB)" },
      { status: 400 }
    );
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const safeExt = ext === "jpeg" ? "jpg" : ext;
  const id =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const path = `products/${id}.${safeExt}`;

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.storage
    .from(SUPABASE_STORAGE_BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data } = supabase.storage
    .from(SUPABASE_STORAGE_BUCKET)
    .getPublicUrl(path);

  return NextResponse.json({ url: data.publicUrl });
};
