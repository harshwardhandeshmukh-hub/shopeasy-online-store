import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { Order, Product } from '../types';
import {
  X,
  ShieldCheck,
  Package,
  TrendingUp,
  ShoppingBag,
  Users,
  Plus,
  Trash2,
  RefreshCw,
  Database
} from 'lucide-react';

export const AdminModal: React.FC = () => {
  const { user, token, activeModal, setActiveModal, refreshProducts, showToast } = useShop();

  const [tab, setTab] = useState<'stats' | 'orders' | 'inventory'>('stats');
  const [stats, setStats] = useState<any>(null);
  const [adminOrders, setAdminOrders] = useState<Order[]>([]);
  const [adminProducts, setAdminProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // New product form
  const [newName, setNewName] = useState('');
  const [newBrand, setNewBrand] = useState('');
  const [newCategory, setNewCategory] = useState('Electronics');
  const [newPrice, setNewPrice] = useState('');
  const [newStock, setNewStock] = useState('25');
  const [newDesc, setNewDesc] = useState('');

  const fetchAdminData = async () => {
    if (!token || user?.role !== 'admin') return;
    setLoading(true);
    try {
      const [statsRes, ordersRes, prodsRes] = await Promise.all([
        fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/admin/orders', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('/api/products')
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (ordersRes.ok) {
        const oData = await ordersRes.json();
        setAdminOrders(oData.orders || []);
      }
      if (prodsRes.ok) {
        const pData = await prodsRes.json();
        setAdminProducts(pData.products || []);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeModal === 'admin') {
      fetchAdminData();
    }
  }, [activeModal, token, user]);

  if (activeModal !== 'admin') return null;

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        showToast(`Order #${orderId} status updated to ${newStatus}.`, 'success');
        fetchAdminData();
      }
    } catch {
      showToast('Failed to update order status.', 'error');
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newName,
          brand: newBrand || 'ShopEasy Premium',
          category: newCategory,
          price: Number(newPrice),
          stock: Number(newStock),
          description: newDesc
        })
      });

      if (res.ok) {
        showToast('Product added to inventory.', 'success');
        setNewName('');
        setNewBrand('');
        setNewPrice('');
        setNewDesc('');
        fetchAdminData();
        refreshProducts();
      }
    } catch {
      showToast('Failed to create product.', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-6 h-6 text-amber-400" />
            <div>
              <h3 className="font-extrabold text-base tracking-tight font-display">
                ShopEasy Admin Operations Portal
              </h3>
              <p className="text-[11px] text-slate-400">Inventory control, order status tracking & revenue reports</p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-5 gap-6 text-xs">
          <button
            onClick={() => setTab('stats')}
            className={`py-3 font-bold cursor-pointer transition-colors ${
              tab === 'stats' ? 'border-b-2 border-slate-950 text-slate-950' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Revenue & KPIs
          </button>
          <button
            onClick={() => setTab('orders')}
            className={`py-3 font-bold cursor-pointer transition-colors ${
              tab === 'orders' ? 'border-b-2 border-slate-950 text-slate-950' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Order Management ({adminOrders.length})
          </button>
          <button
            onClick={() => setTab('inventory')}
            className={`py-3 font-bold cursor-pointer transition-colors ${
              tab === 'inventory' ? 'border-b-2 border-slate-950 text-slate-950' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Product Catalog ({adminProducts.length})
          </button>
        </div>

        {/* Tab Content */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-6">
          {user?.role !== 'admin' ? (
            <div className="text-center py-10 space-y-3">
              <ShieldCheck className="w-10 h-10 text-amber-500 mx-auto" />
              <h4 className="font-bold text-base text-slate-900">Administrator Access Required</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Sign in with the admin credentials (<strong>admin@shopeasy.com</strong> / <strong>admin123</strong>) to access this dashboard.
              </p>
              <button
                onClick={() => setActiveModal('auth')}
                className="px-5 py-2 bg-slate-900 text-white font-bold text-xs rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Sign In as Admin
              </button>
            </div>
          ) : (
            <>
              {/* Tab 1: Stats */}
              {tab === 'stats' && stats && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <span className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
                        Total Gross Sales
                      </span>
                      <div className="text-xl font-black text-slate-950 tabular-nums">
                        {formatINR(stats.totalSales)}
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <span className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
                        <Package className="w-3.5 h-3.5 text-blue-600" />
                        Total Orders
                      </span>
                      <div className="text-xl font-black text-slate-950 tabular-nums">
                        {stats.totalOrders}
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <span className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
                        <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
                        Avg Order Value
                      </span>
                      <div className="text-xl font-black text-slate-950 tabular-nums">
                        {formatINR(stats.averageOrderValue)}
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <span className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-purple-600" />
                        Registered Users
                      </span>
                      <div className="text-xl font-black text-slate-950 tabular-nums">
                        {stats.totalUsers}
                      </div>
                    </div>
                  </div>

                  {/* System Architecture Box */}
                  <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                      <Database className="w-4 h-4 text-emerald-600" />
                      <span>Persistent Storage Engine</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      All catalog inventory, customer registrations, passwords, shopping carts, and order timelines are securely saved to persistent storage on the Node.js server.
                    </p>
                  </div>
                </div>
              )}

              {/* Tab 2: Orders */}
              {tab === 'orders' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">Customer Orders</h4>
                    <button
                      onClick={fetchAdminData}
                      className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Refresh</span>
                    </button>
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                        <tr>
                          <th className="p-3">Order ID</th>
                          <th className="p-3">Customer</th>
                          <th className="p-3">Items</th>
                          <th className="p-3">Total</th>
                          <th className="p-3">Current Status</th>
                          <th className="p-3 text-right">Update Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {adminOrders.map((o) => (
                          <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-3 font-mono font-bold text-slate-900">#{o.id}</td>
                            <td className="p-3">
                              <div className="font-bold text-slate-900">{o.customerName}</div>
                              <div className="text-[11px] text-slate-400">{o.customerEmail}</div>
                            </td>
                            <td className="p-3">{o.items.length} item(s)</td>
                            <td className="p-3 font-bold text-slate-950 tabular-nums">{formatINR(o.total)}</td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                                {o.orderStatus}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              <select
                                value={o.orderStatus}
                                onChange={(e) => handleStatusUpdate(o.id, e.target.value)}
                                className="px-2 py-1 text-xs border border-slate-300 rounded-md bg-white cursor-pointer outline-none"
                              >
                                <option value="Ordered">Ordered</option>
                                <option value="Packed">Packed</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Out for Delivery">Out for Delivery</option>
                                <option value="Delivered">Delivered</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Tab 3: Inventory */}
              {tab === 'inventory' && (
                <div className="space-y-6">
                  {/* Add Product Form */}
                  <form onSubmit={handleAddProduct} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
                    <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Plus className="w-4 h-4 text-emerald-600" />
                      <span>Add New Inventory Item</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">Product Title *</label>
                        <input
                          type="text"
                          required
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          placeholder="e.g. Wireless Smart Speaker"
                          className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">Brand Name</label>
                        <input
                          type="text"
                          value={newBrand}
                          onChange={(e) => setNewBrand(e.target.value)}
                          placeholder="e.g. AuraSound"
                          className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">Category *</label>
                        <select
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                        >
                          <option value="Electronics">Electronics</option>
                          <option value="Fashion">Fashion</option>
                          <option value="Home & Kitchen">Home & Kitchen</option>
                          <option value="Beauty & Grooming">Beauty & Grooming</option>
                          <option value="Sports & Fitness">Sports & Fitness</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">Price in INR (₹) *</label>
                        <input
                          type="number"
                          required
                          value={newPrice}
                          onChange={(e) => setNewPrice(e.target.value)}
                          placeholder="2499"
                          className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">Stock Quantity *</label>
                        <input
                          type="number"
                          required
                          value={newStock}
                          onChange={(e) => setNewStock(e.target.value)}
                          placeholder="30"
                          className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">Description</label>
                        <input
                          type="text"
                          value={newDesc}
                          onChange={(e) => setNewDesc(e.target.value)}
                          placeholder="Brief product highlights and specs..."
                          className="w-full px-3 py-1.5 border border-slate-300 rounded-lg bg-white"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                    >
                      Save Product to Store
                    </button>
                  </form>

                  {/* Products Table */}
                  <div className="border border-slate-200 rounded-xl overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                        <tr>
                          <th className="p-3">Product Name</th>
                          <th className="p-3">Category</th>
                          <th className="p-3">Price</th>
                          <th className="p-3">Stock</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {adminProducts.map((p) => (
                          <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-3">
                              <div className="font-bold text-slate-900">{p.name}</div>
                              <div className="text-[11px] text-slate-400">{p.brand}</div>
                            </td>
                            <td className="p-3">{p.category}</td>
                            <td className="p-3 font-bold text-slate-950 tabular-nums">{formatINR(p.price)}</td>
                            <td className="p-3">
                              <span className={`font-semibold ${p.stock <= 15 ? 'text-amber-700' : 'text-slate-800'}`}>
                                {p.stock} units
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
};
