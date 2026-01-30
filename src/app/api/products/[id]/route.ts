import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE } from "@/lib/constants";
import { ProductUpdateSchema } from "@/lib/schemas";
import { getStore } from "@/lib/store";

const hasAdminSession = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return false;
  const store = getStore();
  return Boolean(store.sessions[token]);
};

export const GET = async (
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  const store = getStore();
  const product = store.products.find((item) => item.id === id);

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

  const store = getStore();
  const index = store.products.findIndex((item) => item.id === id);

  if (index === -1) {
    return NextResponse.json({ error: "Товар не найден" }, { status: 404 });
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
    const slugExists = store.products.find(
      (item) => item.slug === parsed.data.slug && item.id !== id
    );

    if (slugExists) {
      return NextResponse.json(
        { error: "Слаг уже используется" },
        { status: 409 }
      );
    }
  }

  const updated = {
    ...store.products[index],
    ...parsed.data,
    updatedAt: new Date().toISOString(),
  };

  store.products[index] = updated;

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

  const store = getStore();
  const index = store.products.findIndex((item) => item.id === id);

  if (index === -1) {
    return NextResponse.json({ error: "Товар не найден" }, { status: 404 });
  }

  store.products.splice(index, 1);

  return NextResponse.json({ ok: true });
};
