import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/hooks/useApi";
import { settingsApi, authApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const AdminSettings = () => {
  const { data: settings, isLoading } = useSettings();
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const qc = useQueryClient();

  // New admin form
  const [newAdmin, setNewAdmin] = useState({ name: "", email: "", password: "" });
  const [addingAdmin, setAddingAdmin] = useState(false);

  // Change password form
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [changingPw, setChangingPw] = useState(false);
  useEffect(() => {
    if (settings) setForm({ ...settings });
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      await settingsApi.update(form);
      qc.invalidateQueries({ queryKey: ["settings"] });
      toast({ title: "Settings saved" });
    } catch (err: unknown) {
      toast({ title: "Error", description: err instanceof Error ? err.message : "Failed", variant: "destructive" });
    } finally { setSaving(false); }
  };

  const f = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newAdmin.password.length < 8) {
      toast({ title: "Error", description: "Password must be at least 8 characters", variant: "destructive" });
      return;
    }
    setAddingAdmin(true);
    try {
      await authApi.register(newAdmin);
      toast({ title: "Admin created", description: `${newAdmin.name} can now log in` });
      setNewAdmin({ name: "", email: "", password: "" });
    } catch (err: unknown) {
      toast({ title: "Error", description: err instanceof Error ? err.message : "Failed", variant: "destructive" });
    } finally { setAddingAdmin(false); }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
      return;
    }
    setChangingPw(true);
    try {
      await authApi.changePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast({ title: "Password changed successfully" });
      setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: unknown) {
      toast({ title: "Error", description: err instanceof Error ? err.message : "Failed", variant: "destructive" });
    } finally { setChangingPw(false); }
  };

  const fields = [
    { section: "General", items: [["siteName","Site Name"],["tagline","Tagline"],["aboutText","About Text (textarea)"]] },
    { section: "Contact", items: [["address","Address"],["phone","Phone"],["email","Email"]] },
    { section: "Homepage CTA", items: [["ctaTitle","CTA Title"],["ctaSubtitle","CTA Subtitle"]] },
    { section: "Social Media", items: [["socialFacebook","Facebook URL"],["socialTwitter","Twitter URL"],["socialInstagram","Instagram URL"],["socialLinkedin","LinkedIn URL"]] },
    { section: "Footer", items: [["footerText","Footer Description (textarea)"]] },
  ];

  if (isLoading) return <AdminLayout><div className="text-muted-foreground">Loading...</div></AdminLayout>;

  return (
    <AdminLayout>
      <h1 className="font-display text-2xl font-bold text-foreground mb-6">Site Settings</h1>
      <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
        {fields.map(({ section, items }) => (
          <div key={section} className="bg-card rounded-xl border border-border p-6">
            <h2 className="font-display font-semibold text-foreground mb-4">{section}</h2>
            <div className="space-y-4">
              {items.map(([k, l]) => (
                <div key={k}>
                  <label htmlFor={`setting-${k}`} className="text-xs font-medium text-foreground mb-1 block">{l.replace(" (textarea)", "")}</label>
                  {l.includes("textarea") ? (
                    <textarea id={`setting-${k}`} value={form[k] || ""} onChange={(e) => f(k, e.target.value)} rows={4} className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/20 resize-none" />
                  ) : (
                    <input id={`setting-${k}`} type="text" value={form[k] || ""} onChange={(e) => f(k, e.target.value)} className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/20" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        <Button type="submit" size="lg" disabled={saving}>{saving ? "Saving..." : "Save Settings"}</Button>
      </form>

      {/* Add New Admin */}
      <div className="max-w-2xl mt-8">
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="font-display font-semibold text-foreground mb-1">Add New Admin</h2>
          <p className="text-sm text-muted-foreground mb-4">Create another admin account that can access this panel.</p>
          <form onSubmit={handleAddAdmin} className="space-y-3">
            <div>
              <label htmlFor="new-admin-name" className="text-xs font-medium text-foreground mb-1 block">Full Name</label>
              <input id="new-admin-name" type="text" value={newAdmin.name} onChange={(e) => setNewAdmin((p) => ({ ...p, name: e.target.value }))} required placeholder="Admin Name" className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label htmlFor="new-admin-email" className="text-xs font-medium text-foreground mb-1 block">Email</label>
              <input id="new-admin-email" type="email" value={newAdmin.email} onChange={(e) => setNewAdmin((p) => ({ ...p, email: e.target.value }))} required placeholder="admin@example.com" className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label htmlFor="new-admin-password" className="text-xs font-medium text-foreground mb-1 block">Password (min. 8 characters)</label>
              <input id="new-admin-password" type="password" value={newAdmin.password} onChange={(e) => setNewAdmin((p) => ({ ...p, password: e.target.value }))} required placeholder="••••••••" className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <Button type="submit" disabled={addingAdmin}>{addingAdmin ? "Creating..." : "Create Admin"}</Button>
          </form>
        </div>
      </div>

      {/* Change Password */}
      <div className="max-w-2xl mt-6 mb-8">
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="font-display font-semibold text-foreground mb-1">Change Your Password</h2>
          <p className="text-sm text-muted-foreground mb-4">Update your own admin account password.</p>
          <form onSubmit={handleChangePassword} className="space-y-3">
            <div>
              <label htmlFor="current-pw" className="text-xs font-medium text-foreground mb-1 block">Current Password</label>
              <input id="current-pw" type="password" value={pwForm.currentPassword} onChange={(e) => setPwForm((p) => ({ ...p, currentPassword: e.target.value }))} required placeholder="••••••••" className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label htmlFor="new-pw" className="text-xs font-medium text-foreground mb-1 block">New Password</label>
              <input id="new-pw" type="password" value={pwForm.newPassword} onChange={(e) => setPwForm((p) => ({ ...p, newPassword: e.target.value }))} required placeholder="Min. 6 characters" className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label htmlFor="confirm-pw" className="text-xs font-medium text-foreground mb-1 block">Confirm New Password</label>
              <input id="confirm-pw" type="password" value={pwForm.confirmPassword} onChange={(e) => setPwForm((p) => ({ ...p, confirmPassword: e.target.value }))} required placeholder="Re-enter new password" className={`w-full border rounded-lg px-3 py-2 text-sm bg-background text-foreground outline-none focus:ring-2 transition ${pwForm.confirmPassword && pwForm.newPassword !== pwForm.confirmPassword ? "border-destructive focus:ring-destructive/20" : "border-border focus:ring-primary/20"}`} />
              {pwForm.confirmPassword && pwForm.newPassword !== pwForm.confirmPassword && (
                <p className="text-xs text-destructive mt-1">Passwords do not match</p>
              )}
            </div>
            <Button type="submit" disabled={changingPw}>{changingPw ? "Changing..." : "Change Password"}</Button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
