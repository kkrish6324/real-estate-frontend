import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import CrudTable from "@/components/admin/CrudTable";
import Modal from "@/components/admin/Modal";
import { Button } from "@/components/ui/button";
import { useAdminProperties, imgUrl } from "@/hooks/useApi";
import { propertiesApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { formatINR, formatINRShort, parseINRShort } from "@/lib/utils";
import { X } from "lucide-react";

interface Property {
  _id: string; title: string; location: string; price: number;
  type: string; area: number; status: string; featured: boolean;
  bedrooms?: number; bathrooms?: number; description: string;
  amenities: string[]; images: string[];
}

const empty = {
  title: "", description: "", price: "", priceInput: "", location: "",
  type: "residential", area: "", bedrooms: "", bathrooms: "",
  amenities: "", status: "available", featured: false,
};

const AdminProperties = () => {
  const { data: properties = [], isLoading } = useAdminProperties();
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Property | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>(empty);
  const [files, setFiles] = useState<FileList | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const qc = useQueryClient();
  const { toast } = useToast();

  const openAdd = () => {
    setEditing(null); setForm(empty); setFiles(null);
    setExistingImages([]); setNewPreviews([]); setModal(true);
  };

  const openEdit = (p: Property) => {
    setEditing(p);
    setForm({
      title: p.title, description: p.description, price: p.price,
      priceInput: formatINRShort(p.price).replace("₹", ""),
      location: p.location, type: p.type, area: String(p.area),
      bedrooms: String(p.bedrooms || ""), bathrooms: String(p.bathrooms || ""),
      amenities: p.amenities?.join(", ") || "", status: p.status, featured: p.featured,
    });
    setExistingImages(p.images || []);
    setFiles(null); setNewPreviews([]); setModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files;
    setFiles(selected);
    if (selected) {
      const previews = Array.from(selected).map((f) => URL.createObjectURL(f));
      setNewPreviews(previews);
    } else {
      setNewPreviews([]);
    }
  };

  const removeExistingImage = (idx: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    try {
      const fd = new FormData();
      // Append scalar fields only (skip images array from form)
      const scalarFields = ["title", "description", "price", "location", "type", "area", "bedrooms", "bathrooms", "amenities", "status"];
      scalarFields.forEach((k) => fd.append(k, String(form[k] ?? "")));
      fd.append("featured", form.featured ? "true" : "false");

      // Existing images to keep
      existingImages.forEach((img) => fd.append("existingImages", img));

      // New files
      if (files) Array.from(files).forEach((f) => fd.append("images", f));

      if (editing) await propertiesApi.update(editing._id, fd);
      else await propertiesApi.create(fd);

      qc.invalidateQueries({ queryKey: ["admin-properties"] });
      qc.invalidateQueries({ queryKey: ["properties"] });
      toast({ title: editing ? "Property updated" : "Property created" });
      setModal(false);
    } catch (err: unknown) {
      toast({ title: "Error", description: err instanceof Error ? err.message : "Failed", variant: "destructive" });
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this property?")) return;
    await propertiesApi.delete(id);
    qc.invalidateQueries({ queryKey: ["admin-properties"] });
    qc.invalidateQueries({ queryKey: ["properties"] });
    toast({ title: "Deleted" });
  };

  const f = (k: string, v: unknown) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <AdminLayout>
      <h1 className="font-display text-2xl font-bold text-foreground mb-6">Properties</h1>
      <CrudTable
        title="All Properties" data={properties} loading={isLoading}
        columns={[
          {
            key: "images", label: "Image",
            render: (p) => p.images?.[0]
              ? <img src={imgUrl(p.images[0])} alt={p.title} className="w-12 h-10 object-cover rounded" />
              : <div className="w-12 h-10 bg-muted rounded" />,
          },
          {
            key: "title", label: "Title",
            render: (p) => <div><div className="font-medium">{p.title}</div><div className="text-xs text-muted-foreground">{p.location}</div></div>,
          },
          { key: "price", label: "Price", render: (p) => formatINRShort(p.price) },
          { key: "type", label: "Type", render: (p) => <span className="capitalize">{p.type}</span> },
          {
            key: "status", label: "Status",
            render: (p) => <span className={`text-xs px-2 py-1 rounded-full font-medium ${p.status === "available" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{p.status}</span>,
          },
        ]}
        onAdd={openAdd} onEdit={openEdit} onDelete={handleDelete}
      />
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? "Edit Property" : "Add Property"}>
        <form onSubmit={handleSave} className="space-y-3">
          {([["title","Title","text"],["location","Location","text"],["area","Area (sq ft)","number"],["bedrooms","Bedrooms","number"],["bathrooms","Bathrooms","number"]] as [string,string,string][]).map(([k,l,t]) => (
            <div key={k}>
              <label className="text-xs font-medium text-foreground mb-1 block">{l}</label>
              <input
                type={t} value={String(form[k] ?? "")}
                onChange={(e) => f(k, e.target.value)}
                title={l} placeholder={l}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/20"
                required={["title","location","area"].includes(k)}
              />
            </div>
          ))}
          {/* Smart price input */}
          <div>
            <label className="text-xs font-medium text-foreground mb-1 block">Price</label>
            <input
              type="text"
              value={String(form.priceInput ?? "")}
              onChange={(e) => {
                const raw = e.target.value;
                f("priceInput", raw);
                const parsed = parseINRShort(raw);
                if (parsed > 0) f("price", parsed);
              }}
              title="Price"
              placeholder="e.g. 45L, 2.5Cr, 8000000"
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/20"
              required
            />
            {Number(form.price) > 0 && (
              <p className="text-xs text-primary mt-1">
                = {formatINRShort(Number(form.price))} &nbsp;({formatINR(Number(form.price))})
              </p>
            )}
          </div>
          <div>
            <label className="text-xs font-medium text-foreground mb-1 block">Description</label>
            <textarea
              value={String(form.description ?? "")} onChange={(e) => f("description", e.target.value)}
              rows={3} title="Description" placeholder="Description"
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              required
            />
          </div>
          <div>
            <label className="text-xs font-medium text-foreground mb-1 block">Amenities (comma separated)</label>
            <input
              type="text" value={String(form.amenities ?? "")} onChange={(e) => f("amenities", e.target.value)}
              title="Amenities" placeholder="e.g. Parking, Pool, Gym"
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-foreground mb-1 block">Type</label>
              <select value={String(form.type)} onChange={(e) => f("type", e.target.value)} title="Property Type" className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground outline-none">
                {["residential","commercial","land","industrial"].map((t) => <option key={t} value={t} className="capitalize">{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-foreground mb-1 block">Status</label>
              <select value={String(form.status)} onChange={(e) => f("status", e.target.value)} title="Property Status" className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background text-foreground outline-none">
                {["available","sold","rented"].map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="featured" checked={Boolean(form.featured)} onChange={(e) => f("featured", e.target.checked)} className="w-4 h-4" />
            <label htmlFor="featured" className="text-sm text-foreground">Featured Property</label>
          </div>

          {/* Existing images preview */}
          {existingImages.length > 0 && (
            <div>
              <label className="text-xs font-medium text-foreground mb-2 block">Current Images ({existingImages.length})</label>
              <div className="flex flex-wrap gap-2">
                {existingImages.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img src={imgUrl(img)} alt={`Image ${idx + 1}`} className="w-16 h-16 object-cover rounded-lg border border-border" />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(idx)}
                      className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove image"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New image previews */}
          {newPreviews.length > 0 && (
            <div>
              <label className="text-xs font-medium text-foreground mb-2 block">New Images to Upload ({newPreviews.length})</label>
              <div className="flex flex-wrap gap-2">
                {newPreviews.map((src, idx) => (
                  <img key={idx} src={src} alt={`New ${idx + 1}`} className="w-16 h-16 object-cover rounded-lg border-2 border-primary/40" />
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-foreground mb-1 block">
              {editing ? "Add More Images" : "Upload Images"}
            </label>
            <input
              type="file" multiple accept="image/*"
              onChange={handleFileChange}
              title="Upload images"
              className="w-full text-sm text-muted-foreground file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-primary/10 file:text-primary cursor-pointer"
            />
            <p className="text-xs text-muted-foreground mt-1">Max 10 images, 5MB each (JPEG, PNG, WebP)</p>
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

export default AdminProperties;
