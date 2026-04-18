import { Building2, Users, FileText, MessageSquare } from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminProperties, useAdminAgents, useAdminBlogs, useAdminInquiries } from "@/hooks/useApi";
import { formatINRShort } from "@/lib/utils";

const StatCard = ({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: number; color: string }) => (
  <div className="bg-card rounded-xl border border-border p-6 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <div className="font-display text-2xl font-bold text-foreground">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const { data: properties } = useAdminProperties();
  const { data: agents } = useAdminAgents();
  const { data: blogs } = useAdminBlogs();
  const { data: inquiries } = useAdminInquiries();

  const newInquiries = inquiries?.filter((i: { status: string }) => i.status === "new").length || 0;

  return (
    <AdminLayout>
      <h1 className="font-display text-2xl font-bold text-foreground mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Building2} label="Total Properties" value={properties?.length || 0} color="bg-blue-500" />
        <StatCard icon={Users} label="Agents" value={agents?.length || 0} color="bg-green-500" />
        <StatCard icon={FileText} label="Blog Posts" value={blogs?.length || 0} color="bg-purple-500" />
        <StatCard icon={MessageSquare} label="New Inquiries" value={newInquiries} color="bg-orange-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Inquiries */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="font-display font-semibold text-foreground mb-4">Recent Inquiries</h2>
          {inquiries?.slice(0, 5).map((inq: { _id: string; name: string; email: string; status: string; createdAt: string }) => (
            <div key={inq._id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
              <div>
                <div className="text-sm font-medium text-foreground">{inq.name}</div>
                <div className="text-xs text-muted-foreground">{inq.email}</div>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                inq.status === "new" ? "bg-orange-100 text-orange-700" :
                inq.status === "read" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
              }`}>{inq.status}</span>
            </div>
          )) || <p className="text-sm text-muted-foreground">No inquiries yet</p>}
        </div>

        {/* Recent Properties */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="font-display font-semibold text-foreground mb-4">Recent Properties</h2>
          {properties?.slice(0, 5).map((p: { _id: string; title: string; location: string; price: number; status: string }) => (
            <div key={p._id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
              <div>
                <div className="text-sm font-medium text-foreground">{p.title}</div>
                <div className="text-xs text-muted-foreground">{p.location}</div>
              </div>
              <div className="text-sm font-semibold text-primary">{formatINRShort(p.price)}</div>
            </div>
          )) || <p className="text-sm text-muted-foreground">No properties yet</p>}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
