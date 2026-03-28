import PostEditor from "../PostEditor";
import Link from "next/link";

export const metadata = { title: "New Post | LankaChat Admin" };

export default function NewPostPage() {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
        <Link href="/admin/blog" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}>← Blog</Link>
        <h1 style={{ fontWeight: 900, fontSize: "2rem" }}>New Post</h1>
      </div>
      <div className="card" style={{ padding: "2rem" }}>
        <PostEditor mode="new" />
      </div>
    </div>
  );
}
