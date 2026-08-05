import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  adminStats,
  adminVehicles,
  adminPosts,
  adminOrders,
  adminInquiries,
  adminSubscribers,
  adminSaveVehicle,
  adminSavePost,
  adminDelete,
  adminSetOrderStatus,
  adminSetInquiryStatus,
  adminChangePassword,
} from "@/lib/admin.functions";
import { formatPrice } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Car,
  ShoppingBag,
  MessageSquare,
  FileText,
  Mail,
  Lock,
  LayoutDashboard,
  Plus,
  Trash2,
  Edit,
  RefreshCw,
  ArrowLeft,
  Upload,
  X,
  Image as ImageIcon,
  ShieldCheck,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin Portal | Bank Seized Cars" }],
  }),
  component: AdminPage,
});

function AdminPage() {
  // Authentication disabled for development access
  const admin = { id: "00000000-0000-0000-0000-000000000000", username: "Admin" };

  // Dashboard state
  const [activeTab, setActiveTab] = useState<"overview" | "vehicles" | "orders" | "inquiries" | "posts" | "subscribers" | "settings">("overview");
  const [stats, setStats] = useState<any>(null);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // Vehicle Modal state
  const [editingVehicle, setEditingVehicle] = useState<any | null>(null);
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Post Modal state
  const [editingPost, setEditingPost] = useState<any | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  // Change password state
  const [newPassword, setNewPassword] = useState("");
  const [updatingPass, setUpdatingPass] = useState(false);

  // Fetch tab data when tab changes
  const refreshData = async () => {
    setLoadingData(true);
    try {
      if (activeTab === "overview") {
        const s = await adminStats();
        setStats(s);
      } else if (activeTab === "vehicles") {
        const v = await adminVehicles();
        setVehicles(v);
      } else if (activeTab === "orders") {
        const o = await adminOrders();
        setOrders(o);
      } else if (activeTab === "inquiries") {
        const i = await adminInquiries();
        setInquiries(i);
      } else if (activeTab === "posts") {
        const p = await adminPosts();
        setPosts(p);
      } else if (activeTab === "subscribers") {
        const sub = await adminSubscribers();
        setSubscribers(sub);
      }
    } catch (err: any) {
      toast.error("Failed to load data", { description: err?.message });
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [activeTab]);

  const handleDelete = async (table: "vehicles" | "posts" | "orders" | "inquiries", id: string) => {
    if (!confirm(`Are you sure you want to delete this entry from ${table}?`)) return;
    try {
      await adminDelete({ data: { table, id } });
      toast.success("Entry deleted");
      refreshData();
    } catch (err: any) {
      toast.error("Delete failed", { description: err?.message });
    }
  };

  // Helper for real image file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadingImage(true);

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setEditingVehicle((prev: any) => ({
            ...prev,
            images: [...(prev?.images || []), result],
          }));
          toast.success(`Uploaded ${file.name}`);
        }
      };
      reader.readAsDataURL(file);
    });
    setUploadingImage(false);
  };

  const removeVehicleImage = (indexToRemove: number) => {
    setEditingVehicle((prev: any) => ({
      ...prev,
      images: (prev?.images || []).filter((_: any, idx: number) => idx !== indexToRemove),
    }));
  };

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0b1e36] text-white flex flex-col shrink-0 border-r border-blue-950">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Bank Seized Cars Emblem"
              className="size-10 rounded-lg object-contain bg-slate-900 border border-amber-500/30 p-1 shadow-md"
            />
            <div>
              <h1 className="font-display text-sm font-black uppercase text-white leading-none">
                Bank Seized Cars
              </h1>
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">
                Admin Control Desk
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: "overview", label: "Overview", icon: LayoutDashboard },
            { id: "vehicles", label: "Vehicles", icon: Car },
            { id: "orders", label: "Orders", icon: ShoppingBag },
            { id: "inquiries", label: "Inquiries", icon: MessageSquare },
            { id: "posts", label: "Blog Posts", icon: FileText },
            { id: "subscribers", label: "Subscribers", icon: Mail },
            { id: "settings", label: "Settings", icon: Lock },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <tab.icon className="size-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Back to Home Button in Sidebar */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Button
            asChild
            variant="outline"
            className="w-full border-blue-400/40 bg-blue-500/10 hover:bg-blue-600 text-white font-bold uppercase text-xs tracking-wider"
          >
            <Link to="/">
              <ArrowLeft className="size-4 mr-2 text-blue-400" /> Back to Storefront
            </Link>
          </Button>
          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
            <span>Status:</span>
            <span className="font-bold text-emerald-400">Direct Admin Access</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="flex items-center justify-between border-b border-slate-200 pb-6 mb-8">
          <div>
            <h1 className="font-display text-2xl font-black uppercase text-slate-900">
              {activeTab} Management
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Control repository listings, orders, customer inquiries, and platform settings.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-slate-300 text-slate-700 font-bold uppercase text-xs"
            >
              <Link to="/">
                <ArrowLeft className="size-3.5 mr-1.5" /> Main Site
              </Link>
            </Button>

            <Button
              onClick={refreshData}
              variant="outline"
              size="sm"
              disabled={loadingData}
              className="border-slate-300 text-slate-700 font-bold uppercase text-xs"
            >
              <RefreshCw className={`size-3.5 mr-2 ${loadingData ? "animate-spin" : ""}`} /> Refresh
            </Button>
          </div>
        </div>

        {/* Tab 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-bold uppercase">Total Inventory</span>
                  <Car className="size-5 text-blue-600" />
                </div>
                <p className="font-display text-3xl font-black text-slate-900">{stats?.vehicles ?? 0}</p>
                <p className="text-xs text-slate-500 mt-1">{stats?.sold ?? 0} marked as sold</p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-bold uppercase">Pending Orders</span>
                  <ShoppingBag className="size-5 text-amber-600" />
                </div>
                <p className="font-display text-3xl font-black text-slate-900">{stats?.pendingOrders ?? 0}</p>
                <p className="text-xs text-slate-500 mt-1">{stats?.orders ?? 0} total orders</p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-bold uppercase">New Inquiries</span>
                  <MessageSquare className="size-5 text-emerald-600" />
                </div>
                <p className="font-display text-3xl font-black text-slate-900">{stats?.newInquiries ?? 0}</p>
                <p className="text-xs text-slate-500 mt-1">Direct customer questions</p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between text-slate-500 mb-2">
                  <span className="text-xs font-bold uppercase">Total Revenue</span>
                  <ShieldCheck className="size-5 text-emerald-600" />
                </div>
                <p className="font-display text-2xl font-black text-emerald-700">
                  {formatPrice(stats?.revenue ?? 0)}
                </p>
                <p className="text-xs text-slate-500 mt-1">{stats?.subscribers ?? 0} newsletter subscribers</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: VEHICLES */}
        {activeTab === "vehicles" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-lg text-slate-900">Vehicle Inventory Listings</h2>
              <Button
                onClick={() => {
                  setEditingVehicle({
                    slug: `vehicle-${Date.now().toString().slice(-4)}`,
                    name: "",
                    price: 0,
                    sale_price: null,
                    description: "",
                    mileage: "15,000 miles",
                    transmission: "Automatic",
                    exterior_color: "Black",
                    interior_color: "Leather",
                    fuel_type: "Gasoline",
                    trim: "Base",
                    title_status: "Clean Title",
                    body_type: "SUV",
                    make: "Porsche",
                    year: new Date().getFullYear(),
                    images: [],
                    is_hot_deal: true,
                    is_sold: false,
                    is_featured: true,
                    sort_order: 0,
                  });
                  setIsVehicleModalOpen(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 font-bold uppercase text-xs"
              >
                <Plus className="size-4 mr-1.5" /> Add New Vehicle
              </Button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                  <tr>
                    <th className="p-4">Image</th>
                    <th className="p-4">Vehicle</th>
                    <th className="p-4">Make / Year</th>
                    <th className="p-4">Asking Price</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {vehicles.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50">
                      <td className="p-4">
                        {v.images?.[0] ? (
                          <img src={v.images[0]} alt={v.name} className="size-12 rounded object-cover border border-slate-200" />
                        ) : (
                          <div className="size-12 rounded bg-slate-100 border flex items-center justify-center text-slate-400">
                            <ImageIcon className="size-5" />
                          </div>
                        )}
                      </td>
                      <td className="p-4 font-bold text-slate-900">{v.name}</td>
                      <td className="p-4 text-slate-600">{v.make} ({v.year})</td>
                      <td className="p-4 font-bold text-blue-700">{formatPrice(v.sale_price ?? v.price)}</td>
                      <td className="p-4">
                        {v.is_sold ? (
                          <span className="rounded bg-slate-900 px-2 py-0.5 font-bold text-white text-[10px]">
                            SOLD
                          </span>
                        ) : v.is_hot_deal ? (
                          <span className="rounded bg-red-600 px-2 py-0.5 font-bold text-white text-[10px]">
                            HOT DEAL
                          </span>
                        ) : (
                          <span className="rounded bg-emerald-600 px-2 py-0.5 font-bold text-white text-[10px]">
                            ACTIVE
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingVehicle(v);
                            setIsVehicleModalOpen(true);
                          }}
                          className="h-8 border-slate-300"
                        >
                          <Edit className="size-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete("vehicles", v.id)}
                          className="h-8 border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Vehicle Modal with Real Image Uploads */}
            {isVehicleModalOpen && editingVehicle && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
                  <div className="flex items-center justify-between border-b pb-3 mb-4">
                    <h3 className="font-display text-lg font-bold text-slate-900">
                      {editingVehicle.id ? "Edit Vehicle Listing" : "Add New Vehicle Listing"}
                    </h3>
                    <button onClick={() => setIsVehicleModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                      <X className="size-5" />
                    </button>
                  </div>

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      try {
                        await adminSaveVehicle({ data: editingVehicle });
                        toast.success("Vehicle saved successfully!");
                        setIsVehicleModalOpen(false);
                        refreshData();
                      } catch (err: any) {
                        toast.error("Error saving vehicle", { description: err?.message });
                      }
                    }}
                    className="space-y-4 text-xs"
                  >
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label>Vehicle Name *</Label>
                        <Input
                          required
                          value={editingVehicle.name}
                          onChange={(e) => setEditingVehicle({ ...editingVehicle, name: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Slug *</Label>
                        <Input
                          required
                          value={editingVehicle.slug}
                          onChange={(e) => setEditingVehicle({ ...editingVehicle, slug: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Asking Price ($) *</Label>
                        <Input
                          type="number"
                          required
                          value={editingVehicle.price}
                          onChange={(e) => setEditingVehicle({ ...editingVehicle, price: Number(e.target.value) })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Sale / Down Payment Price ($)</Label>
                        <Input
                          type="number"
                          value={editingVehicle.sale_price ?? ""}
                          onChange={(e) => setEditingVehicle({ ...editingVehicle, sale_price: e.target.value ? Number(e.target.value) : null })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Make</Label>
                        <Input
                          value={editingVehicle.make ?? ""}
                          onChange={(e) => setEditingVehicle({ ...editingVehicle, make: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Year</Label>
                        <Input
                          type="number"
                          value={editingVehicle.year ?? ""}
                          onChange={(e) => setEditingVehicle({ ...editingVehicle, year: Number(e.target.value) })}
                          className="mt-1"
                        />
                      </div>
                    </div>

                    {/* REAL IMAGE UPLOADER */}
                    <div className="rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/50 p-4 text-center space-y-3">
                      <div className="flex flex-col items-center justify-center">
                        <Upload className="size-8 text-blue-600 mb-1" />
                        <p className="font-bold text-slate-800 text-xs">Upload Real Vehicle Photos</p>
                        <p className="text-[11px] text-slate-500">Select image files from your computer (JPG, PNG, WebP)</p>
                      </div>

                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        id="vehicle-image-upload"
                        onChange={handleFileUpload}
                        className="hidden"
                      />

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("vehicle-image-upload")?.click()}
                        className="border-blue-400 text-blue-700 hover:bg-blue-100 font-bold uppercase text-xs"
                      >
                        <Upload className="size-3.5 mr-1.5" /> Choose Image Files
                      </Button>

                      {/* Display Image Previews */}
                      {editingVehicle.images && editingVehicle.images.length > 0 && (
                        <div className="grid grid-cols-4 gap-2 pt-3">
                          {editingVehicle.images.map((imgUrl: string, idx: number) => (
                            <div key={idx} className="relative group rounded-lg overflow-hidden border border-slate-300 shadow-sm aspect-video bg-slate-100">
                              <img src={imgUrl} alt={`Upload ${idx}`} className="size-full object-cover" />
                              <button
                                type="button"
                                onClick={() => removeVehicleImage(idx)}
                                className="absolute top-1 right-1 rounded-full bg-red-600 text-white p-1 shadow hover:bg-red-700 transition-colors"
                              >
                                <X className="size-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-6 py-2">
                      <label className="flex items-center gap-2 font-bold cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingVehicle.is_hot_deal}
                          onChange={(e) => setEditingVehicle({ ...editingVehicle, is_hot_deal: e.target.checked })}
                        />
                        Hot Deal Badge
                      </label>
                      <label className="flex items-center gap-2 font-bold cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingVehicle.is_sold}
                          onChange={(e) => setEditingVehicle({ ...editingVehicle, is_sold: e.target.checked })}
                        />
                        Mark as Sold
                      </label>
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t">
                      <Button type="button" variant="outline" onClick={() => setIsVehicleModalOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" className="bg-blue-600 hover:bg-blue-700 font-bold uppercase">
                        Save Vehicle Listing
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: ORDERS */}
        {activeTab === "orders" && (
          <div>
            <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                  <tr>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Contact</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-slate-50">
                      <td className="p-4">
                        <p className="font-bold text-slate-900">{o.first_name} {o.last_name}</p>
                        <p className="text-[11px] text-slate-500">{o.address}, {o.city}</p>
                      </td>
                      <td className="p-4">
                        <p className="text-slate-800">{o.email}</p>
                        <p className="text-slate-500">{o.phone}</p>
                      </td>
                      <td className="p-4 font-bold text-blue-700">{formatPrice(o.total)}</td>
                      <td className="p-4">
                        <select
                          value={o.status}
                          onChange={async (e) => {
                            try {
                              await adminSetOrderStatus({ data: { id: o.id, status: e.target.value as any } });
                              toast.success("Order status updated");
                              refreshData();
                            } catch (err: any) {
                              toast.error("Failed to update status");
                            }
                          }}
                          className="rounded border border-slate-300 bg-slate-50 px-2 py-1 text-xs font-bold text-slate-800"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="paid">Paid</option>
                          <option value="shipped">Shipped</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="p-4 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete("orders", o.id)}
                          className="h-8 border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: INQUIRIES */}
        {activeTab === "inquiries" && (
          <div className="space-y-4">
            {inquiries.map((inq) => (
              <div key={inq.id} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-900">{inq.name} ({inq.email})</span>
                  <div className="flex items-center gap-2">
                    <select
                      value={inq.status}
                      onChange={async (e) => {
                        try {
                          await adminSetInquiryStatus({ data: { id: inq.id, status: e.target.value as any } });
                          toast.success("Inquiry status updated");
                          refreshData();
                        } catch {
                          toast.error("Failed to update status");
                        }
                      }}
                      className="rounded border border-slate-300 bg-slate-50 px-2 py-1 text-xs font-bold"
                    >
                      <option value="new">New</option>
                      <option value="read">Read</option>
                      <option value="replied">Replied</option>
                      <option value="closed">Closed</option>
                    </select>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete("inquiries", inq.id)}
                      className="h-8 border-red-200 text-red-600"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-slate-500 font-semibold mb-2">Phone: {inq.phone || "N/A"} • Subject: {inq.subject || "General Inquiry"}</p>
                <p className="text-sm text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-200">{inq.message}</p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 5: POSTS */}
        {activeTab === "posts" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-lg text-slate-900">Blog Articles</h2>
              <Button
                onClick={() => {
                  setEditingPost({
                    slug: `post-${Date.now().toString().slice(-4)}`,
                    title: "",
                    excerpt: "",
                    content: "",
                    category: "Guides",
                    is_published: true,
                  });
                  setIsPostModalOpen(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 font-bold uppercase text-xs"
              >
                <Plus className="size-4 mr-1.5" /> Create Article
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {posts.map((p) => (
                <div key={p.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-blue-600 uppercase">{p.category}</span>
                    <h3 className="font-bold text-slate-900 text-sm mt-1">{p.title}</h3>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2">{p.excerpt}</p>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t">
                    <span className="text-xs font-bold text-emerald-600">{p.is_published ? "Published" : "Draft"}</span>
                    <Button size="sm" variant="outline" onClick={() => handleDelete("posts", p.id)} className="text-red-600">
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 6: SUBSCRIBERS */}
        {activeTab === "subscribers" && (
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase">
                <tr>
                  <th className="p-4">Email</th>
                  <th className="p-4">Subscribed Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {subscribers.map((s) => (
                  <tr key={s.id}>
                    <td className="p-4 font-bold text-slate-900">{s.email}</td>
                    <td className="p-4 text-slate-500">{new Date(s.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 7: SETTINGS */}
        {activeTab === "settings" && (
          <div className="max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h2 className="font-bold text-lg text-slate-900 border-b pb-2">Change Password</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setUpdatingPass(true);
                try {
                  await adminChangePassword({ data: { password: newPassword } });
                  toast.success("Password updated successfully");
                  setNewPassword("");
                } catch (err: any) {
                  toast.error("Failed to update password", { description: err?.message });
                } finally {
                  setUpdatingPass(false);
                }
              }}
              className="space-y-4"
            >
              <div>
                <Label className="text-xs font-bold uppercase text-slate-700">New Password</Label>
                <Input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-1"
                />
              </div>
              <Button type="submit" disabled={updatingPass} className="bg-blue-600 hover:bg-blue-700 font-bold uppercase text-xs">
                Update Password
              </Button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
