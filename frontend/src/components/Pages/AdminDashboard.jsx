import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Package, Users, ShoppingCart, Activity, X, Plus, Trash2, Pencil, ImageOff, ChevronDown, AlertCircle, CheckCircle, RefreshCw, ExternalLink, Download } from 'lucide-react';
import api from '../../api/axios';


// ─── FILE VIEWER MODAL ─────────────────────────────────────────────────────────
const FileViewerModal = ({ file, onClose }) => {
  if (!file) return null;
  // Always use https — ensure fl_inline is present for Cloudinary raw URLs
  const rawUrl = (file.fileUrl || '').replace(/^http:\/\//, 'https://');
  const url = rawUrl.includes('/upload/') && !rawUrl.includes('fl_inline')
    ? rawUrl.replace('/upload/', '/upload/fl_inline/')
    : rawUrl;

  const ext = (file.fileName || '').split('.').pop().toLowerCase();
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
  const isPdf = ext === 'pdf';
  // DOC, DOCX, etc. — browsers cannot render these natively; provide download
  const isDownloadOnly = !isImage && !isPdf;

  return (
    <div className="fixed inset-0 z-[200] bg-black/95 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-neutral-900 border-b border-neutral-800 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-xl">{isImage ? '🖼️' : '📄'}</span>
          <div>
            <p className="text-white font-bold text-sm truncate max-w-sm">{file.fileName || 'Document'}</p>
            <p className="text-neutral-500 text-xs capitalize">
              {file.name} · {file.printType?.replace('-', ' ')} · {file.copies} copies
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold rounded-xl transition-colors"
          >
            <Download size={14} /> Download File
          </a>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors ml-1">
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Viewer */}
      <div className="flex-1 bg-neutral-950 overflow-hidden">
        {isImage && (
          <div className="w-full h-full flex items-center justify-center p-8">
            <img src={url} alt={file.fileName} className="max-w-full max-h-full object-contain rounded-2xl" />
          </div>
        )}

        {isPdf && (
          /* <object> uses the browser's built-in PDF renderer — works with Cloudinary fl_inline URLs */
          <object
            data={url}
            type="application/pdf"
            className="w-full h-full"
          >
            {/* Fallback if browser blocks object rendering */}
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-8">
              <span className="text-6xl">📄</span>
              <p className="text-white font-bold text-lg">PDF preview not available in this browser</p>
              <p className="text-neutral-400 text-sm">Click the button below to open or download the file.</p>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl transition-colors"
              >
                <ExternalLink size={16} /> Open PDF
              </a>
            </div>
          </object>
        )}

        {isDownloadOnly && (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-8">
            <span className="text-7xl">📝</span>
            <p className="text-white font-bold text-xl">{file.fileName}</p>
            <p className="text-neutral-400">
              <span className="uppercase font-bold text-amber-400">.{ext}</span> files cannot be previewed in the browser.
            </p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="flex items-center gap-2 px-8 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl transition-colors text-lg mt-2"
            >
              <Download size={20} /> Download to View
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── ADD / EDIT PRODUCT MODAL ─────────────────────────────────────────────────
const ProductModal = ({ product, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: product?.name || '',
    price: product?.price || '',
    discountPrice: product?.discountPrice || '',
    description: product?.description || '',
    brand: product?.brand || '',
    stock: product?.stock || 0,
    tags: product?.tags?.join(', ') || '',
    imageUrl: product?.images?.[0]?.url || '',
    categoryId: product?.category?._id || '',
  });
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  // Inline category creation
  const [showNewCat, setShowNewCat] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [creatingCat, setCreatingCat] = useState(false);

  // Load categories on mount
  useEffect(() => {
    api.get('/categories').then(res => setCategories(res.data.data || [])).catch(() => {});
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreateCategory = async () => {
    if (!newCatName.trim()) return;
    setCreatingCat(true);
    try {
      const res = await api.post('/categories', { name: newCatName.trim() });
      const created = res.data.data;
      setCategories(prev => [...prev, created]);
      setForm(prev => ({ ...prev, categoryId: created._id }));
      setNewCatName('');
      setShowNewCat(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create category');
    } finally {
      setCreatingCat(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price) { setError('Name and price are required.'); return; }
    setSaving(true); setError('');
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        category: form.categoryId || null,
      };
      delete payload.categoryId;

      if (product?._id) {
        await api.put(`/products/${product._id}`, payload);
      } else {
        await api.post('/products', payload);
      }
      onSave();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-neutral-900 border border-neutral-700 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-800">
          <h2 className="text-xl font-bold text-white">{product ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-xl">
              <AlertCircle size={16} className="shrink-0" />{error}
            </div>
          )}

          {/* Image preview */}
          {form.imageUrl && (
            <div className="rounded-2xl overflow-hidden h-40 border border-neutral-700">
              <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = 'none'; }} />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Cloudinary Image URL</label>
            <input name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="https://res.cloudinary.com/..." className="w-full bg-black border border-neutral-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors placeholder:text-neutral-600" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Product Name <span className="text-red-400">*</span></label>
              <input name="name" value={form.name} onChange={handleChange} required placeholder="e.g. Oxford Notebook A4" className="w-full bg-black border border-neutral-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors placeholder:text-neutral-600" />
            </div>

            {/* Category Selector */}
            <div className="col-span-2 space-y-2">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Category</label>
              <div className="flex gap-2">
                <select
                  name="categoryId"
                  value={form.categoryId}
                  onChange={handleChange}
                  className="flex-1 bg-black border border-neutral-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors"
                >
                  <option value="">— No Category —</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setShowNewCat(prev => !prev)}
                  className="px-3 py-2 bg-neutral-800 hover:bg-amber-500/20 border border-neutral-700 hover:border-amber-500/50 text-amber-400 rounded-xl text-sm font-bold transition-colors whitespace-nowrap"
                  title="Create new category"
                >
                  + New
                </button>
              </div>

              {/* Inline Category Creation */}
              {showNewCat && (
                <div className="flex gap-2 animate-in fade-in">
                  <input
                    value={newCatName}
                    onChange={e => setNewCatName(e.target.value)}
                    placeholder="Category name (e.g. Stationery)"
                    className="flex-1 bg-black border border-amber-500/50 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500"
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleCreateCategory())}
                  />
                  <button
                    type="button"
                    onClick={handleCreateCategory}
                    disabled={creatingCat || !newCatName.trim()}
                    className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-xl text-sm transition-colors disabled:opacity-50"
                  >
                    {creatingCat ? '...' : 'Create'}
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Price (₹) <span className="text-red-400">*</span></label>
              <input name="price" value={form.price} onChange={handleChange} type="number" min="0" step="0.01" required placeholder="250" className="w-full bg-black border border-neutral-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors placeholder:text-neutral-600" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Discount Price (₹)</label>
              <input name="discountPrice" value={form.discountPrice} onChange={handleChange} type="number" min="0" step="0.01" placeholder="200" className="w-full bg-black border border-neutral-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors placeholder:text-neutral-600" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Stock</label>
              <input name="stock" value={form.stock} onChange={handleChange} type="number" min="0" placeholder="50" className="w-full bg-black border border-neutral-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors placeholder:text-neutral-600" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Brand</label>
              <input name="brand" value={form.brand} onChange={handleChange} placeholder="Classmate" className="w-full bg-black border border-neutral-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors placeholder:text-neutral-600" />
            </div>

            <div className="col-span-2 space-y-1">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Short description of the product..." className="w-full bg-black border border-neutral-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors placeholder:text-neutral-600 resize-none" />
            </div>

            <div className="col-span-2 space-y-1">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Tags (comma-separated)</label>
              <input name="tags" value={form.tags} onChange={handleChange} placeholder="notebook, stationery, A4" className="w-full bg-black border border-neutral-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors placeholder:text-neutral-600" />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl border border-neutral-700 text-neutral-300 hover:text-white hover:border-neutral-500 transition-colors font-medium text-sm">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {saving ? 'Saving...' : (product ? 'Save Changes' : 'Add Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


// ─── PRODUCT LIST TABLE ────────────────────────────────────────────────────────
const ProductTable = ({ products, onEdit, onDelete }) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-16 text-neutral-500">
        <Package size={48} className="mx-auto mb-4 opacity-30" />
        <p className="font-medium">No products yet. Add your first product!</p>
      </div>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-800 text-neutral-500 text-left">
            <th className="pb-4 pl-2 font-semibold">Product</th>
            <th className="pb-4 font-semibold">Price</th>
            <th className="pb-4 font-semibold">Stock</th>
            <th className="pb-4 font-semibold">Brand</th>
            <th className="pb-4 text-right pr-2 font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800/50">
          {products.map(p => (
            <tr key={p._id} className="hover:bg-neutral-800/40 transition-colors group">
              <td className="py-4 pl-2">
                <div className="flex items-center gap-3">
                  {p.images?.[0]?.url ? (
                    <img src={p.images[0].url} alt={p.name} className="w-10 h-10 rounded-lg object-cover border border-neutral-700" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center border border-neutral-700">
                      <ImageOff size={16} className="text-neutral-600" />
                    </div>
                  )}
                  <div>
                    <p className="text-white font-medium line-clamp-1">{p.name}</p>
                    {p.tags?.length > 0 && <p className="text-neutral-500 text-xs truncate">{p.tags.slice(0, 3).join(', ')}</p>}
                  </div>
                </div>
              </td>
              <td className="py-4">
                <div>
                  <span className="text-amber-400 font-bold">₹{p.price}</span>
                  {p.discountPrice && <span className="text-neutral-500 text-xs line-through ml-1">₹{p.discountPrice}</span>}
                </div>
              </td>
              <td className="py-4">
                <span className={`font-medium ${p.stock === 0 ? 'text-red-400' : p.stock < 10 ? 'text-yellow-400' : 'text-green-400'}`}>{p.stock}</span>
              </td>
              <td className="py-4 text-neutral-400">{p.brand || '—'}</td>
              <td className="py-4 pr-2 text-right">
                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => onEdit(p)} className="p-2 rounded-lg bg-neutral-800 hover:bg-amber-500 hover:text-black text-neutral-400 transition-all" title="Edit"><Pencil size={14} /></button>
                  <button onClick={() => onDelete(p)} className="p-2 rounded-lg bg-neutral-800 hover:bg-red-500 hover:text-white text-neutral-400 transition-all" title="Delete"><Trash2 size={14} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ─── DELETE CONFIRM DIALOG ────────────────────────────────────────────────────
const DeleteDialog = ({ product, onCancel, onConfirm, loading }) => (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 bg-red-500/10 rounded-xl"><Trash2 size={20} className="text-red-400" /></div>
        <h3 className="text-white font-bold text-lg">Delete Product</h3>
      </div>
      <p className="text-neutral-400 text-sm mb-6">Are you sure you want to delete <span className="text-white font-medium">"{product.name}"</span>? This cannot be undone.</p>
      <div className="flex gap-3">
        <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-neutral-700 text-neutral-300 hover:text-white font-medium text-sm transition-colors">Cancel</button>
        <button onClick={onConfirm} disabled={loading} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-colors disabled:opacity-60">
          {loading ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  </div>
);

// ─── TOAST NOTIFICATION ───────────────────────────────────────────────────────
const Toast = ({ message, type }) => (
  <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-medium transition-all ${type === 'success' ? 'bg-green-500 text-black' : 'bg-red-500 text-white'}`}>
    <CheckCircle size={18} />
    {message}
  </div>
);

// ─── MAIN DASHBOARD ───────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);

  // Stats state
  const [stats, setStats] = useState({ totalUsers: 0, totalProducts: 0, totalOrders: 0, pendingOrders: 0, totalRevenue: 0 });
  const [statsLoading, setStatsLoading] = useState(false);

  // Orders state
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  // Print Requests state
  const [printRequests, setPrintRequests] = useState([]);
  const [printLoading, setPrintLoading] = useState(false);
  const [updatingPrintId, setUpdatingPrintId] = useState(null);
  const [viewingFile, setViewingFile] = useState(null); // for file viewer modal

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const res = await api.get('/orders/admin/stats');
      setStats(res.data.data || {});
    } catch {
      // silently fail — stats will just show 0
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchProducts = async () => {
    setProductsLoading(true);
    try {
      const res = await api.get('/products');
      setProducts(res.data.data || []);
    } catch {
      showToast('Failed to load products', 'error');
    } finally {
      setProductsLoading(false);
    }
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await api.get('/orders/all/orders');
      setOrders(res.data.data || []);
    } catch {
      showToast('Failed to load orders', 'error');
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      showToast('Order status updated!');
      fetchOrders();
      fetchStats();
    } catch {
      showToast('Failed to update order status', 'error');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const fetchPrintRequests = async () => {
    setPrintLoading(true);
    try {
      const res = await api.get('/print-request');
      setPrintRequests(res.data.data || []);
    } catch {
      showToast('Failed to load print requests', 'error');
    } finally {
      setPrintLoading(false);
    }
  };

  const handleUpdatePrintStatus = async (id, newStatus) => {
    setUpdatingPrintId(id);
    try {
      await api.put(`/print-request/${id}/status`, { status: newStatus });
      showToast('Print request status updated!');
      fetchPrintRequests();
    } catch {
      showToast('Failed to update print status', 'error');
    } finally {
      setUpdatingPrintId(null);
    }
  };

  // Fetch stats on mount
  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === 'products') fetchProducts();
    if (activeTab === 'orders') fetchOrders();
    if (activeTab === 'prints') fetchPrintRequests();
  }, [activeTab]);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-amber-500 font-bold">Loading...</div>;
  if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) return <Navigate to="/login" />;

  const handleSave = () => {
    setModalOpen(false);
    setEditingProduct(null);
    fetchProducts();
    showToast('Product saved successfully!');
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/products/${deleteTarget._id}`);
      setDeleteTarget(null);
      fetchProducts();
      showToast('Product deleted');
    } catch {
      showToast('Failed to delete product', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const statCards = [
    { title: "Total Products", value: statsLoading ? '…' : (stats.totalProducts ?? 0), icon: <Package size={24} />, color: "amber" },
    { title: "Total Users", value: statsLoading ? '…' : (stats.totalUsers ?? 0), icon: <Users size={24} />, color: "blue" },
    { title: "Pending Orders", value: statsLoading ? '…' : (stats.pendingOrders ?? 0), icon: <ShoppingCart size={24} />, color: "green" },
    { title: "Total Revenue", value: statsLoading ? '…' : `₹${(stats.totalRevenue ?? 0).toLocaleString()}`, icon: <Activity size={24} />, color: "purple" }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'products', label: 'Products' },
    { id: 'orders', label: 'Orders' },
    { id: 'prints', label: 'Print Requests' },
  ];

  return (
    <>
    <div className="min-h-screen bg-black pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Modals */}
      {(modalOpen || editingProduct) && (
        <ProductModal
          product={editingProduct}
          onClose={() => { setModalOpen(false); setEditingProduct(null); }}
          onSave={handleSave}
        />
      )}
      {deleteTarget && (
        <DeleteDialog product={deleteTarget} onCancel={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={deleting} />
      )}
      {toast && <Toast message={toast.message} type={toast.type} />}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-1">
              Admin <span className="text-amber-500">Dashboard</span>
            </h1>
            <p className="text-neutral-400">Welcome back, <span className="text-amber-400 font-medium">{user.name}</span>!
              <span className="ml-2 text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">{user.role}</span>
            </p>
          </div>
          <button
            onClick={() => { setEditingProduct(null); setModalOpen(true); }}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-bold px-6 py-3 rounded-full shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:-translate-y-0.5 transition-all"
          >
            <Plus size={18} strokeWidth={2.5} /> Add New Product
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-neutral-900/60 border border-neutral-800 rounded-2xl p-1 w-fit">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-amber-500 text-black shadow-lg' : 'text-neutral-400 hover:text-white'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <>
            {/* Stats Grid */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-neutral-500 text-sm">Dashboard statistics</p>
              <button onClick={fetchStats} disabled={statsLoading} className="flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 transition-colors disabled:opacity-50">
                <RefreshCw size={14} className={statsLoading ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {statCards.map((stat, i) => (
                <div key={i} className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 hover:border-amber-500/30 transition-colors group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-neutral-800 rounded-2xl text-amber-500 group-hover:bg-amber-500 group-hover:text-black transition-all">
                      {stat.icon}
                    </div>
                  </div>
                  <p className="text-neutral-400 text-sm font-bold mb-1">{stat.title}</p>
                  <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8">
              <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button onClick={() => { setEditingProduct(null); setModalOpen(true); }} className="flex items-center gap-3 bg-neutral-800 hover:bg-amber-500/10 hover:border-amber-500/50 text-white p-4 rounded-2xl font-medium transition-all border border-neutral-700 text-left">
                  <div className="p-2 bg-amber-500/20 rounded-xl"><Plus size={18} className="text-amber-400" /></div>
                  Add New Product
                </button>
                <button onClick={() => setActiveTab('products')} className="flex items-center gap-3 bg-neutral-800 hover:bg-amber-500/10 hover:border-amber-500/50 text-white p-4 rounded-2xl font-medium transition-all border border-neutral-700 text-left">
                  <div className="p-2 bg-amber-500/20 rounded-xl"><Package size={18} className="text-amber-400" /></div>
                  Manage Inventory
                </button>
                <button className="flex items-center gap-3 bg-neutral-800 hover:bg-neutral-700 text-white p-4 rounded-2xl font-medium transition-colors border border-neutral-700 text-left">
                  <div className="p-2 bg-neutral-700 rounded-xl"><ShoppingCart size={18} className="text-neutral-400" /></div>
                  View Print Requests
                </button>
              </div>
            </div>
          </>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">All Products <span className="text-neutral-500 font-normal text-base">({products.length})</span></h3>
              <button onClick={() => { setEditingProduct(null); setModalOpen(true); }} className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-bold px-4 py-2.5 rounded-xl text-sm transition-colors">
                <Plus size={16} /> Add Product
              </button>
            </div>
            {productsLoading ? (
              <div className="text-center py-16 text-amber-500">Loading products...</div>
            ) : (
              <ProductTable
                products={products}
                onEdit={(p) => { setEditingProduct(p); setModalOpen(true); }}
                onDelete={(p) => setDeleteTarget(p)}
              />
            )}
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">All Orders <span className="text-neutral-500 font-normal text-base">({orders.length})</span></h3>
              <button onClick={fetchOrders} disabled={ordersLoading} className="flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 transition-colors disabled:opacity-50">
                <RefreshCw size={14} className={ordersLoading ? 'animate-spin' : ''} /> Refresh
              </button>
            </div>
            {ordersLoading ? (
              <div className="text-center py-16 text-amber-500">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16 text-neutral-500">
                <ShoppingCart size={48} className="mx-auto mb-4 opacity-30" />
                <p>No orders yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-800 text-neutral-500 text-left">
                      <th className="pb-4 pl-2 font-semibold">Order Info</th>
                      <th className="pb-4 font-semibold">Customer</th>
                      <th className="pb-4 font-semibold">Amount</th>
                      <th className="pb-4 font-semibold">Status</th>
                      <th className="pb-4 pr-2 font-semibold text-right">Update</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/50">
                    {orders.map(order => (
                      <tr key={order._id} className="hover:bg-neutral-800/40 transition-colors">
                        <td className="py-4 pl-2">
                          <p className="text-white font-mono text-xs">{order._id.slice(-8).toUpperCase()}</p>
                          <p className="text-neutral-500 text-xs mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </td>
                        <td className="py-4">
                          <p className="text-white font-medium">{order.user?.name || 'Unknown'}</p>
                          <p className="text-neutral-500 text-xs">{order.user?.email || ''}</p>
                        </td>
                        <td className="py-4">
                          <span className="text-amber-400 font-bold">₹{order.totalPrice?.toLocaleString()}</span>
                        </td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                            order.orderStatus === 'delivered' ? 'bg-green-500/20 text-green-400' :
                            order.orderStatus === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                            order.orderStatus === 'shipped' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-amber-500/20 text-amber-400'
                          }`}>{order.orderStatus || 'pending'}</span>
                        </td>
                        <td className="py-4 pr-2 text-right">
                          <select
                            disabled={updatingOrderId === order._id}
                            value={order.orderStatus || 'pending'}
                            onChange={e => handleUpdateOrderStatus(order._id, e.target.value)}
                            className="bg-neutral-800 border border-neutral-700 text-white text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-amber-500 cursor-pointer disabled:opacity-50"
                          >
                            {['pending','confirmed','processing','shipped','delivered','cancelled'].map(s => (
                              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* PRINT REQUESTS TAB */}
        {activeTab === 'prints' && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Print Requests <span className="text-neutral-500 font-normal text-base">({printRequests.length})</span></h3>
              <button onClick={fetchPrintRequests} disabled={printLoading} className="flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 transition-colors disabled:opacity-50">
                <RefreshCw size={14} className={printLoading ? 'animate-spin' : ''} /> Refresh
              </button>
            </div>
            {printLoading ? (
              <div className="text-center py-16 text-amber-500">Loading print requests...</div>
            ) : printRequests.length === 0 ? (
              <div className="text-center py-16 text-neutral-500">
                <Package size={48} className="mx-auto mb-4 opacity-30" />
                <p>No print requests yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-800 text-neutral-500 text-left">
                      <th className="pb-4 pl-2 font-semibold">Request</th>
                      <th className="pb-4 font-semibold">Customer</th>
                      <th className="pb-4 font-semibold">Print Options</th>
                      <th className="pb-4 font-semibold">File</th>
                      <th className="pb-4 font-semibold">Status</th>
                      <th className="pb-4 pr-2 font-semibold text-right">Update</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/50">
                    {printRequests.map(pr => (
                      <tr key={pr._id} className="hover:bg-neutral-800/40 transition-colors">
                        <td className="py-4 pl-2">
                          <p className="text-white font-mono text-xs">{pr._id.slice(-8).toUpperCase()}</p>
                          <p className="text-neutral-500 text-xs mt-0.5">{new Date(pr.createdAt).toLocaleDateString()}</p>
                        </td>
                        <td className="py-4">
                          <p className="text-white font-medium">{pr.name}</p>
                          <p className="text-neutral-500 text-xs">{pr.phone}</p>
                        </td>
                        <td className="py-4">
                          <p className="text-neutral-300 text-xs capitalize">{pr.printType?.replace('-', ' ')} · {pr.copies} copies</p>
                          <p className="text-neutral-500 text-xs">{pr.paperSize} · {pr.bindingType}</p>
                          {pr.notes && <p className="text-neutral-500 text-xs italic mt-0.5 max-w-[150px] truncate">"{pr.notes}"</p>}
                        </td>
                        <td className="py-4">
                          {pr.fileUrl ? (
                            <button
                              onClick={() => setViewingFile(pr)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-bold rounded-lg transition-colors"
                            >
                              📄 View File
                            </button>
                          ) : (
                            <span className="text-neutral-600 text-xs">No file</span>
                          )}
                        </td>
                        <td className="py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                            pr.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                            pr.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                            pr.status === 'printing' ? 'bg-blue-500/20 text-blue-400' :
                            pr.status === 'ready' ? 'bg-purple-500/20 text-purple-400' :
                            'bg-amber-500/20 text-amber-400'
                          }`}>{pr.status}</span>
                        </td>
                        <td className="py-4 pr-2 text-right">
                          <select
                            disabled={updatingPrintId === pr._id}
                            value={pr.status}
                            onChange={e => handleUpdatePrintStatus(pr._id, e.target.value)}
                            className="bg-neutral-800 border border-neutral-700 text-white text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-amber-500 cursor-pointer disabled:opacity-50"
                          >
                            {['pending', 'reviewing', 'printing', 'ready', 'completed', 'cancelled'].map(s => (
                              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
    {/* File Viewer Modal */}
    {viewingFile && <FileViewerModal file={viewingFile} onClose={() => setViewingFile(null)} />}
    </>
  );
};

export default AdminDashboard;
