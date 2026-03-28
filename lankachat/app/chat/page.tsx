import { createAdminClient } from "@/lib/supabase/server";
import ChatWindow from "@/components/ChatWindow";

export const metadata = {
  title: "Chat � LankaChat",
  description: "Join public chat rooms or send private messages. Real-time chat, no sign-up required.",
};

export default async function ChatPage() {
  const supabase = await createAdminClient();
  const { data: rooms } = await supabase.from("rooms").select("*").order("created_at");
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem" }}>
      <ChatWindow rooms={rooms || []} />
    </div>
  );
}
