import { createServiceRoleClient } from "@/lib/supabase/server";
import PostEditor from "../PostEditor";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = { title: "Edit Post - LankaChat Admin" };

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createServiceRoleClient();
  const { data: post } = await supabase.from("posts").select("*").eq("id", id).single();

  if (!post) {
    redirect("/admin/blog");
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
        <Link href="/admin/blog" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}>← Blog</Link>
        <h1 style={{ fontWeight: 900, fontSize: "2rem" }}>Edit Post</h1>
      </div>
      <div className="card" style={{ padding: "2rem" }}>
        <PostEditor initialData={post} mode="edit" />
      </div>
    </div>
  );
}
