import { createAdminClient, createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createAdminClient();
  const { data, error } = await supabase.from("rooms").select("*").order("created_at");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: "Supabase environment variables are missing" }, { status: 500 });
    }
    const body = await req.json().catch(() => ({}));
    const name = (body.name ?? "").trim();
    const description = (body.description ?? "").trim();
    if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });

    const service = createServiceRoleClient();
    const { data, error } = await service.from("rooms").insert({ name, description: description || null }).select().single();
    if (error) {
      const status = error.code === "23505" ? 409 : 500; // 23505 = unique_violation
      const message = error.code === "23505" ? "Room name already exists" : error.message;
      return NextResponse.json({ error: message }, { status });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "Supabase environment variables are missing" }, { status: 500 });
  }
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
  const service = createServiceRoleClient();
  const { error } = await service.from("rooms").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
