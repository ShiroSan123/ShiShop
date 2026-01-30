import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_SESSION_COOKIE } from "@/lib/constants";
import { ProductInputSchema, ProductQuerySchema } from "@/lib/schemas";
import { getStore } from "@/lib/store";
import {
  createProductServer,
  isSlugTakenServer,
  listProductsServer,
} from "@/lib/serverProducts";

const hasAdminSession = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return false;
  const store = getStore();
  return Boolean(store.sessions[token]);
};

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const rawQuery = Object.fromEntries(searchParams.entries());
  const parsed = ProductQuerySchema.safeParse(rawQuery);
  const query = parsed.success ? parsed.data : {};

  const products = await listProductsServer(query);

  return NextResponse.json(products);
};

export const POST = async (request: Request) => {
  if (!(await hasAdminSession())) {
    return NextResponse.json({ error: "Недостаточно прав" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = ProductInputSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Некорректные данные" },
      { status: 400 }
    );
  }

  const slugTaken = await isSlugTakenServer(parsed.data.slug);

  if (slugTaken) {
    return NextResponse.json(
      { error: "Слаг уже используется" },
      { status: 409 }
    );
  }

  const created = await createProductServer(parsed.data);

  return NextResponse.json(created, { status: 201 });
};
