import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE } from "@/lib/constants";
import { ProductUpdateSchema } from "@/lib/schemas";
import {
  deleteProductServer,
  getProductByIdServer,
  isSlugTakenServer,
  updateProductServer,
} from "@/lib/serverProducts";
import { getAdminSession } from "@/lib/serverAuth";

const hasAdminSession = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return false;
  const session = await getAdminSession();
  return Boolean(session);
};

export const GET = async (
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  const product = await getProductByIdServer(id);

  if (!product) {
    return NextResponse.json({ error: "Товар не найден" }, { status: 404 });
  }

  return NextResponse.json(product);
};

export const PUT = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Недостаточно прав" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = ProductUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Некорректные данные" },
      { status: 400 }
    );
  }

  if (parsed.data.slug) {
    const slugTaken = await isSlugTakenServer(parsed.data.slug, id);
    if (slugTaken) {
      return NextResponse.json(
        { error: "Слаг уже используется" },
        { status: 409 }
      );
    }
  }

  const updated = await updateProductServer(id, parsed.data);
  if (!updated) {
    return NextResponse.json({ error: "Товар не найден" }, { status: 404 });
  }

  return NextResponse.json(updated);
};

export const DELETE = async (
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Недостаточно прав" }, { status: 401 });
  }

  const deleted = await deleteProductServer(id);
  if (!deleted) {
    return NextResponse.json({ error: "Товар не найден" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
};
