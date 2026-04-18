import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import CrudTable from "@/components/admin/CrudTable";
import Modal from "@/components/admin/Modal";
import { Button } from "@/components/ui/button";
import { useAdminTestimonials, imgUrl } from "@/hooks/useApi";
import { testimonialsApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Testimonial { _id: string; name: string; role: string; text: string; rating: number; avatar?: string; active: boolean; }
const empty = { name: "", role: "", text: "", rating: 5, active: true };

const AdminTestimonials = () => {
  const { data: testimonials = [], isLoading } = useAdminTestimonials();
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>(empty);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const qc = useQueryClient();
  const { toast } = useToast();

  const openAdd = () => { setEditing(null); setForm(empty); setFile(null); setModal(true); };
  const openEdit = (t: Testimonial) => { setEditing(t); setForm({ ...t }); setFile(null); setModal(true); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
      if (file) fd.append("avatar", file);
      if (editing) await testimonialsApi.update(editing._id, fd);
      else await testimonialsApi.create(fd);
      qc.invalidateQueries({ queryKey: ["admin-testimonials"] });
      qc.invalidateQueries({ queryKey: ["testimonials"] });
      toast({ title: editing ? "Updated" : "Created" });
      setModal(false);
    } catch (err: unknown) {
      toast({ title: "Error", description: err instanceof Error ? err.message : "Failed", variant: "destructive" });
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    await testimonialsApi.delete(id);
    qc.invalidateQueries({ queryKey: ["admin-testimonials"] });
    qc.invalidateQueries({ queryKey: ["testimonials"] });
    toast({ title: "Deleted" });
  };

  const f = (k: string, v: unknown) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <AdminLayout>
      <h1 className="font-display text-2xl font-bold text-foreground mb-6">Testimonials</h1>
      <CrudTable
        title="All Testimonials" data={testimonials} loading={isLoading}
        columns={[
          { key: "avatar", label: "Photo", render: (t) => t.avatar ? <img src={imgUrl(t.avatar)} alt={t.name} className="w-10 h-10 rounded-full object-cover" /> : <div className="w-10 h-10 rounded-full bg-muted" /> },
          { key: "name", label: "Name", render: (t) => <div><div className="font-medium">{t.name}</div><div className="text-xs text-muted-foreground">{t.role}</div></div> },
          { key: "text", label: "Review", render: (t) => <div className="max-w-xs truncate text-muted-foreground">{t.text}</div> },
          { key: "rating", label: "Rating", render: (t) => `${"★".repeat(t.rating)}` },
          { key: "active", label: "Status", render: (t) => <span className={`text-xs px-2 py-1 rounded-full font-medium ${t.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{t.active ? "Active" : "Hidden"}</span> },
        ]}
        onAdd={openAdd} onEdit={openEdit} onDelete={handleDelete}
      />
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? "Edit Testimonial" : "Add Testimonial"}>
        <form onSubmit={handleSave} className="space-y-3">
          {[["name","Name"],["role","Role e.g. Home Buyer"]].map(([k,l]) => (
            <div key={k}>
              <label htmlFor={`t-${k}`} className="text-xs font-medium text-foreground mb-1 block">{l}</label>
              <input id={`t-${k}`} type="text" value={String(form[k] ?? "")} onChange={(e) => f(k, e.target.value)} required className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
          ))}
          <div>
            <label htmlFor="t-text" className="text-xs font-medium text-foreground mb-1 block">Review Text</label>
            <textarea id="t-text" value={String(form.text ?? "")} onChange={(e) => f("text", e.target.value)} rows={4} required className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
          </div>
          <div>
            <label htmlFor="t-rating" className="text-xs font-medium text-foreground mb-1 block">Rating (1-5)</label>
            <input id="t-rating" type="number" min={1} max={5} value={String(form.rating ?? 5)} onChange={(e) => f("rating", e.target.value)} className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="tactive" checked={Boolean(form.active)} onChange={(e) => f("active", e.target.checked)} className="w-4 h-4" />
            <label htmlFor="tactive" className="text-sm text-foreground">Active</label>
          </div>
          <div>
            <label htmlFor="t-avatar" className="text-xs font-medium text-foreground mb-1 block">Avatar Photo</label>
            <input id="t-avatar" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full text-sm text-muted-foreground" />
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

export default AdminTestimonials;
