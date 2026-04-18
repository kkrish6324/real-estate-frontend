import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import CrudTable from "@/components/admin/CrudTable";
import Modal from "@/components/admin/Modal";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/useApi";
import { categoriesApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Category { _id: string; label: string; type: string; icon: string; count: number; active: boolean; }
const empty = { label: "", type: "", icon: "Home", count: 0, active: true };
const icons = ["Home", "Building2", "Landmark", "Factory", "MapPin", "Star"];

const AdminCategories = () => {
  const { data: categories = [], isLoading } = useCategories();
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>(empty);
  const [saving, setSaving] = useState(false);
  const qc = useQueryClient();
  const { toast } = useToast();

  const openAdd = () => { setEditing(null); setForm(empty); setModal(true); };
  const openEdit = (c: Category) => { setEditing(c); setForm({ ...c }); setModal(true); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editing) await categoriesApi.update(editing._id, form);
      else await categoriesApi.create(form);
      qc.invalidateQueries({ queryKey: ["categories"] });
      toast({ title: editing ? "Updated" : "Created" });
      setModal(false);
    } catch (err: unknown) {
      toast({ title: "Error", description: err instanceof Error ? err.message : "Failed", variant: "destructive" });
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    await categoriesApi.delete(id);
    qc.invalidateQueries({ queryKey: ["categories"] });
    toast({ title: "Deleted" });
  };

  const f = (k: string, v: unknown) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <AdminLayout>
      <h1 className="font-display text-2xl font-bold text-foreground mb-6">Categories</h1>
      <CrudTable
        title="Property Categories" data={categories} loading={isLoading}
        columns={[
          { key: "label", label: "Label" },
          { key: "type", label: "Type" },
          { key: "icon", label: "Icon" },
          { key: "count", label: "Count" },
          { key: "active", label: "Status", render: (c) => <span className={`text-xs px-2 py-1 rounded-full font-medium ${c.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{c.active ? "Active" : "Hidden"}</span> },
        ]}
        onAdd={openAdd} onEdit={openEdit} onDelete={handleDelete}
      />
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? "Edit Category" : "Add Category"}>
        <form onSubmit={handleSave} className="space-y-3">
          <div>
            <label htmlFor="cat-label" className="text-xs font-medium text-foreground mb-1 block">Label</label>
            <input id="cat-label" type="text" value={String(form.label ?? "")} onChange={(e) => f("label", e.target.value)} required className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <label htmlFor="cat-type" className="text-xs font-medium text-foreground mb-1 block">Type (slug)</label>
            <input id="cat-type" type="text" value={String(form.type ?? "")} onChange={(e) => f("type", e.target.value)} required className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div>
            <label htmlFor="cat-icon" className="text-xs font-medium text-foreground mb-1 block">Icon</label>
            <select id="cat-icon" value={String(form.icon ?? "Home")} onChange={(e) => f("icon", e.target.value)} className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground outline-none">
              {icons.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="cat-count" className="text-xs font-medium text-foreground mb-1 block">Listing Count</label>
            <input id="cat-count" type="number" value={String(form.count ?? 0)} onChange={(e) => f("count", e.target.value)} className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/20" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="cactive" checked={Boolean(form.active)} onChange={(e) => f("active", e.target.checked)} className="w-4 h-4" />
            <label htmlFor="cactive" className="text-sm text-foreground">Active</label>
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

export default AdminCategories;
