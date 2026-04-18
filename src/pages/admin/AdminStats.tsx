import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import CrudTable from "@/components/admin/CrudTable";
import Modal from "@/components/admin/Modal";
import { Button } from "@/components/ui/button";
import { useStats } from "@/hooks/useApi";
import { statsApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Stat { _id: string; label: string; value: string; suffix: string; order: number; }
const empty = { label: "", value: "", suffix: "", order: 0 };

const AdminStats = () => {
  const { data: stats = [], isLoading } = useStats();
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Stat | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>(empty);
  const [saving, setSaving] = useState(false);
  const qc = useQueryClient();
  const { toast } = useToast();

  const openAdd = () => { setEditing(null); setForm(empty); setModal(true); };
  const openEdit = (s: Stat) => { setEditing(s); setForm({ ...s }); setModal(true); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      if (editing) await statsApi.update(editing._id, form);
      else await statsApi.create(form);
      qc.invalidateQueries({ queryKey: ["stats"] });
      toast({ title: editing ? "Updated" : "Created" });
      setModal(false);
    } catch (err: unknown) {
      toast({ title: "Error", description: err instanceof Error ? err.message : "Failed", variant: "destructive" });
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete?")) return;
    await statsApi.delete(id);
    qc.invalidateQueries({ queryKey: ["stats"] });
    toast({ title: "Deleted" });
  };

  const f = (k: string, v: unknown) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <AdminLayout>
      <h1 className="font-display text-2xl font-bold text-foreground mb-6">Stats</h1>
      <CrudTable
        title="Homepage Stats" data={stats} loading={isLoading}
        columns={[
          { key: "value", label: "Value", render: (s) => <span className="font-bold text-primary">{s.value}{s.suffix}</span> },
          { key: "label", label: "Label" },
          { key: "order", label: "Order" },
        ]}
        onAdd={openAdd} onEdit={openEdit} onDelete={handleDelete}
      />
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? "Edit Stat" : "Add Stat"}>
        <form onSubmit={handleSave} className="space-y-3">
          {[["label","Label e.g. Happy Users"],["value","Value e.g. 210"],["suffix","Suffix e.g. K or +"],["order","Display Order"]].map(([k,l]) => (
            <div key={k}>
              <label htmlFor={`stat-${k}`} className="text-xs font-medium text-foreground mb-1 block">{l}</label>
              <input id={`stat-${k}`} type="text" value={String(form[k] ?? "")} onChange={(e) => f(k, e.target.value)} required={k !== "suffix"} className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
          ))}
          <div className="flex gap-3 pt-2">
            <Button type="submit" className="flex-1" disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
            <Button type="button" variant="outline" onClick={() => setModal(false)}>Cancel</Button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
};

export default AdminStats;
