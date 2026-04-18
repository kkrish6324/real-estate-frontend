import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import CrudTable from "@/components/admin/CrudTable";
import Modal from "@/components/admin/Modal";
import { Button } from "@/components/ui/button";
import { useAdminAgents, imgUrl } from "@/hooks/useApi";
import { agentsApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface Agent { _id: string; name: string; role: string; image?: string; phone?: string; email?: string; bio?: string; active: boolean; }

const empty = { name: "", role: "", phone: "", email: "", bio: "", active: true };

const AdminAgents = () => {
  const { data: agents = [], isLoading } = useAdminAgents();
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Agent | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>(empty);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const qc = useQueryClient();
  const { toast } = useToast();

  const openAdd = () => { setEditing(null); setForm(empty); setFile(null); setModal(true); };
  const openEdit = (a: Agent) => { setEditing(a); setForm({ ...a }); setFile(null); setModal(true); };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
      if (file) fd.append("image", file);
      if (editing) await agentsApi.update(editing._id, fd);
      else await agentsApi.create(fd);
      qc.invalidateQueries({ queryKey: ["admin-agents"] });
      qc.invalidateQueries({ queryKey: ["agents"] });
      toast({ title: editing ? "Agent updated" : "Agent created" });
      setModal(false);
    } catch (err: unknown) {
      toast({ title: "Error", description: err instanceof Error ? err.message : "Failed", variant: "destructive" });
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this agent?")) return;
    await agentsApi.delete(id);
    qc.invalidateQueries({ queryKey: ["admin-agents"] });
    qc.invalidateQueries({ queryKey: ["agents"] });
    toast({ title: "Deleted" });
  };

  const f = (k: string, v: unknown) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <AdminLayout>
      <h1 className="font-display text-2xl font-bold text-foreground mb-6">Agents</h1>
      <CrudTable
        title="All Agents" data={agents} loading={isLoading}
        columns={[
          { key: "image", label: "Photo", render: (a) => a.image ? <img src={imgUrl(a.image)} alt={a.name} className="w-10 h-10 rounded-full object-cover" /> : <div className="w-10 h-10 rounded-full bg-muted" /> },
          { key: "name", label: "Name", render: (a) => <div><div className="font-medium">{a.name}</div><div className="text-xs text-muted-foreground">{a.role}</div></div> },
          { key: "email", label: "Email" },
          { key: "phone", label: "Phone" },
          { key: "active", label: "Status", render: (a) => <span className={`text-xs px-2 py-1 rounded-full font-medium ${a.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{a.active ? "Active" : "Inactive"}</span> },
        ]}
        onAdd={openAdd} onEdit={openEdit} onDelete={handleDelete}
      />
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? "Edit Agent" : "Add Agent"}>
        <form onSubmit={handleSave} className="space-y-3">
          {[["name","Name"],["role","Role"],["phone","Phone"],["email","Email"],["bio","Bio"]].map(([k,l]) => (
            <div key={k}>
              <label htmlFor={`agent-${k}`} className="text-xs font-medium text-foreground mb-1 block">{l}</label>
              {k === "bio"
                ? <textarea id={`agent-${k}`} value={String(form[k] ?? "")} onChange={(e) => f(k, e.target.value)} rows={3} className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
                : <input id={`agent-${k}`} type="text" value={String(form[k] ?? "")} onChange={(e) => f(k, e.target.value)} className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/20" required={k === "name" || k === "role"} />
              }
            </div>
          ))}
          <div className="flex items-center gap-2">
            <input type="checkbox" id="active" checked={Boolean(form.active)} onChange={(e) => f("active", e.target.checked)} className="w-4 h-4" />
            <label htmlFor="active" className="text-sm text-foreground">Active</label>
          </div>
          <div>
            <label htmlFor="agent-photo" className="text-xs font-medium text-foreground mb-1 block">Photo</label>
            <input id="agent-photo" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full text-sm text-muted-foreground" />
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

export default AdminAgents;
