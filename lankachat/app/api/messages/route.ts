import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const roomId = searchParams.get("room_id");
  const sender = searchParams.get("sender");
  const receiver = searchParams.get("receiver");
  const supabase = await createAdminClient();
  let query = supabase.from("messages").select("*").order("created_at", { ascending: true }).limit(100);
  if (roomId) query = query.eq("room_id", roomId).is("receiver_username", null);
  if (sender && receiver) {
    query = query.or(`and(sender_username.eq.${sender},receiver_username.eq.${receiver}),and(sender_username.eq.${receiver},receiver_username.eq.${sender})`);
  }
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { sender_username, content, room_id, receiver_username } = body;
  if (!sender_username || !content) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  const supabase = await createAdminClient();
  const { data, error } = await supabase.from("messages").insert({ sender_username, content, room_id: room_id || null, receiver_username: receiver_username || null }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
