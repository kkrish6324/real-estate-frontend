import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import Modal from "@/components/admin/Modal";
import { useAdminInquiries } from "@/hooks/useApi";
import { inquiriesApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Eye } from "lucide-react";

interface Inquiry { _id: string; name: string; email: string; phone?: string; message: string; status: string; createdAt: string; property?: { title: string; location: string }; }

const AdminInquiries = () => {
  const { data: inquiries = [], isLoading } = useAdminInquiries();
  const [viewing, setViewing] = useState<Inquiry | null>(null);
  const qc = useQueryClient();
  const { toast } = useToast();

  const handleStatus = async (id: string, status: string) => {
    await inquiriesApi.update(id, { status });
    qc.invalidateQueries({ queryKey: ["admin-inquiries"] });
    toast({ title: "Status updated" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this inquiry?")) return;
    await inquiriesApi.delete(id);
    qc.invalidateQueries({ queryKey: ["admin-inquiries"] });
    toast({ title: "Deleted" });
  };

  return (
    <AdminLayout>
      <h1 className="font-display text-2xl font-bold text-foreground mb-6">Inquiries</h1>
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border">
          <h2 className="font-display font-semibold text-foreground">All Inquiries ({inquiries.length})</h2>
        </div>
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground text-sm">Loading...</div>
        ) : inquiries.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">No inquiries yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  {["Name","Email","Property","Status","Date","Actions"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-muted-foreground font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {inquiries.map((inq: Inquiry) => (
                  <tr key={inq._id} className="border-t border-border hover:bg-muted/50">
                    <td className="px-4 py-3 font-medium text-foreground">{inq.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{inq.email}</td>
                    <td className="px-4 py-3 text-muted-foreground">{inq.property?.title || "—"}</td>
                    <td className="px-4 py-3">
                      <select aria-label="Update inquiry status" value={inq.status} onChange={(e) => handleStatus(inq._id, e.target.value)} className={`text-xs px-2 py-1 rounded-full font-medium border-0 outline-none cursor-pointer ${inq.status === "new" ? "bg-orange-100 text-orange-700" : inq.status === "read" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>
                        <option value="new">New</option>
                        <option value="read">Read</option>
                        <option value="replied">Replied</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(inq.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost" onClick={() => setViewing(inq)}><Eye className="w-4 h-4" /></Button>
                        <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" onClick={() => handleDelete(inq._id)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={!!viewing} onClose={() => setViewing(null)} title="Inquiry Details">
        {viewing && (
          <div className="space-y-3 text-sm">
            <div><span className="font-medium text-foreground">Name:</span> <span className="text-muted-foreground">{viewing.name}</span></div>
            <div><span className="font-medium text-foreground">Email:</span> <span className="text-muted-foreground">{viewing.email}</span></div>
            {viewing.phone && <div><span className="font-medium text-foreground">Phone:</span> <span className="text-muted-foreground">{viewing.phone}</span></div>}
            {viewing.property && <div><span className="font-medium text-foreground">Property:</span> <span className="text-muted-foreground">{viewing.property.title} — {viewing.property.location}</span></div>}
            <div><span className="font-medium text-foreground">Message:</span><p className="text-muted-foreground mt-1 leading-relaxed">{viewing.message}</p></div>
            <div><span className="font-medium text-foreground">Date:</span> <span className="text-muted-foreground">{new Date(viewing.createdAt).toLocaleString()}</span></div>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
};

export default AdminInquiries;
