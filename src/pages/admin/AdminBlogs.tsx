import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import CrudTable from "@/components/admin/CrudTable";
import Modal from "@/components/admin/Modal";
import { Button } from "@/components/ui/button";
import { useAdminBlogs, imgUrl } from "@/hooks/useApi";
import { blogsApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Blog { _id: string; title: string; category: string; image?: string; published: boolean; createdAt: string; content: string; excerpt?: string; }

const empty = { title: "", content: "", excerpt: "", category: "", published: true };

const AdminBlogs = () => {
  const { data: blogs = [], isLoading } = useAdminBlogs();
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Blog | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>(empty);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const qc = useQueryClient();
  const { toast } = useToast();

  const openAdd = () => { setEditing(null); setForm(empty); setFile(null); setModal(true); };
  const openEdit = (b: Blog) => { setEditing(b); setForm({ ...b }); setFile(null); setModal(true); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
      if (file) fd.append("image", file);
      if (editing) await blogsApi.update(editing._id, fd);
      else await blogsApi.create(fd);
      qc.invalidateQueries({ queryKey: ["admin-blogs"] });
      qc.invalidateQueries({ queryKey: ["blogs"] });
      toast({ title: editing ? "Blog updated" : "Blog created" });
      setModal(false);
    } catch (err: unknown) {
      toast({ title: "Error", description: err instanceof Error ? err.message : "Failed", variant: "destructive" });
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this blog post?")) return;
    await blogsApi.delete(id);
    qc.invalidateQueries({ queryKey: ["admin-blogs"] });
    qc.invalidateQueries({ queryKey: ["blogs"] });
    toast({ title: "Deleted" });
  };

  const f = (k: string, v: unknown) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <AdminLayout>
      <h1 className="font-display text-2xl font-bold text-foreground mb-6">Blog Posts</h1>
      <CrudTable
        title="All Blog Posts" data={blogs} loading={isLoading}
        columns={[
          { key: "image", label: "Image", render: (b) => b.image ? <img src={imgUrl(b.image)} alt={b.title} className="w-12 h-10 object-cover rounded" /> : <div className="w-12 h-10 bg-muted rounded" /> },
          { key: "title", label: "Title", render: (b) => <div className="max-w-xs truncate font-medium">{b.title}</div> },
          { key: "category", label: "Category" },
          { key: "published", label: "Status", render: (b) => <span className={`text-xs px-2 py-1 rounded-full font-medium ${b.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>{b.published ? "Published" : "Draft"}</span> },
          { key: "createdAt", label: "Date", render: (b) => new Date(b.createdAt).toLocaleDateString() },
        ]}
        onAdd={openAdd} onEdit={openEdit} onDelete={handleDelete}
      />
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? "Edit Blog Post" : "Add Blog Post"}>
        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label htmlFor="blog-title" className="text-xs font-medium text-foreground mb-1 block">Title</label>
            <input id="blog-title" type="text" value={String(form.title ?? "")} onChange={(e) => f("title", e.target.value)} required className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <label htmlFor="blog-category" className="text-xs font-medium text-foreground mb-1 block">Category</label>
            <input id="blog-category" type="text" value={String(form.category ?? "")} onChange={(e) => f("category", e.target.value)} required className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <label htmlFor="blog-excerpt" className="text-xs font-medium text-foreground mb-1 block">Excerpt</label>
            <input id="blog-excerpt" type="text" value={String(form.excerpt ?? "")} onChange={(e) => f("excerpt", e.target.value)} className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <label htmlFor="blog-content" className="text-xs font-medium text-foreground mb-1 block">Content</label>
            <textarea id="blog-content" value={String(form.content ?? "")} onChange={(e) => f("content", e.target.value)} rows={5} required className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="published" checked={Boolean(form.published)} onChange={(e) => f("published", e.target.checked)} className="w-4 h-4" />
            <label htmlFor="published" className="text-sm text-foreground">Published</label>
          </div>
          <div>
            <label htmlFor="blog-image" className="text-xs font-medium text-foreground mb-1 block">Cover Image</label>
            <input id="blog-image" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full text-sm text-muted-foreground" />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" className="flex-1" disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
            <Button type="button" variant="outline" onClick={() => setModal(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
};

export default AdminBlogs;
