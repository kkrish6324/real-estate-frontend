import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import CrudTable from "@/components/admin/CrudTable";
import Modal from "@/components/admin/Modal";
import { Button } from "@/components/ui/button";
import { useAdminHeroSlides, imgUrl } from "@/hooks/useApi";
import { heroSlidesApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface HeroSlide { _id: string; title: string; subtitle?: string; image?: string; order: number; active: boolean; }
const empty = { title: "", subtitle: "", order: 0, active: true };

const AdminHeroSlides = () => {
  const { data: slides = [], isLoading } = useAdminHeroSlides();
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<HeroSlide | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>(empty);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const qc = useQueryClient();
  const { toast } = useToast();

  const openAdd = () => { setEditing(null); setForm(empty); setFile(null); setModal(true); };
  const openEdit = (s: HeroSlide) => { setEditing(s); setForm({ ...s }); setFile(null); setModal(true); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
      if (file) fd.append("image", file);
      if (editing) await heroSlidesApi.update(editing._id, fd);
      else await heroSlidesApi.create(fd);
      qc.invalidateQueries({ queryKey: ["admin-hero-slides"] });
      qc.invalidateQueries({ queryKey: ["heroSlides"] });
      toast({ title: editing ? "Updated" : "Created" });
      setModal(false);
    } catch (err: unknown) {
      toast({ title: "Error", description: err instanceof Error ? err.message : "Failed", variant: "destructive" });
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this slide?")) return;
    await heroSlidesApi.delete(id);
    qc.invalidateQueries({ queryKey: ["admin-hero-slides"] });
    qc.invalidateQueries({ queryKey: ["heroSlides"] });
    toast({ title: "Deleted" });
  };

  const f = (k: string, v: unknown) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <AdminLayout>
      <h1 className="font-display text-2xl font-bold text-foreground mb-6">Hero Slides</h1>
      <CrudTable
        title="All Hero Slides" data={slides} loading={isLoading}
        columns={[
          { key: "image", label: "Image", render: (s) => s.image ? <img src={imgUrl(s.image)} alt={s.title} className="w-16 h-10 object-cover rounded" /> : <div className="w-16 h-10 bg-muted rounded" /> },
          { key: "title", label: "Title", render: (s) => <div className="max-w-xs truncate font-medium">{s.title}</div> },
          { key: "subtitle", label: "Subtitle", render: (s) => <div className="max-w-xs truncate text-muted-foreground">{s.subtitle}</div> },
          { key: "order", label: "Order" },
          { key: "active", label: "Status", render: (s) => <span className={`text-xs px-2 py-1 rounded-full font-medium ${s.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{s.active ? "Active" : "Hidden"}</span> },
        ]}
        onAdd={openAdd} onEdit={openEdit} onDelete={handleDelete}
      />
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? "Edit Slide" : "Add Slide"}>
        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label htmlFor="slide-title" className="text-xs font-medium text-foreground mb-1 block">Title</label>
            <input id="slide-title" type="text" value={String(form.title ?? "")} onChange={(e) => f("title", e.target.value)} required className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <label htmlFor="slide-subtitle" className="text-xs font-medium text-foreground mb-1 block">Subtitle</label>
            <textarea id="slide-subtitle" value={String(form.subtitle ?? "")} onChange={(e) => f("subtitle", e.target.value)} rows={3} className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
          </div>
          <div>
            <label htmlFor="slide-order" className="text-xs font-medium text-foreground mb-1 block">Order</label>
            <input id="slide-order" type="number" value={String(form.order ?? 0)} onChange={(e) => f("order", e.target.value)} className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="sactive" checked={Boolean(form.active)} onChange={(e) => f("active", e.target.checked)} className="w-4 h-4" />
            <label htmlFor="sactive" className="text-sm text-foreground">Active</label>
          </div>
          <div>
            <label htmlFor="slide-image" className="text-xs font-medium text-foreground mb-1 block">Background Image</label>
            <input id="slide-image" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full text-sm text-muted-foreground" />
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

export default AdminHeroSlides;
