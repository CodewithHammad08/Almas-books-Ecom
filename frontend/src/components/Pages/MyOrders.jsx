import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { ShoppingBag, Package, Truck, CheckCircle2, XCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../../api/axios';

const statusConfig = {
  pending:    { icon: <Clock size={14} />,         color: 'bg-amber-500/20 text-amber-400',   label: 'Pending' },
  confirmed:  { icon: <CheckCircle2 size={14} />,  color: 'bg-blue-500/20 text-blue-400',     label: 'Confirmed' },
  processing: { icon: <Package size={14} />,       color: 'bg-purple-500/20 text-purple-400', label: 'Processing' },
  shipped:    { icon: <Truck size={14} />,         color: 'bg-cyan-500/20 text-cyan-400',     label: 'Shipped' },
  delivered:  { icon: <CheckCircle2 size={14} />,  color: 'bg-green-500/20 text-green-400',   label: 'Delivered' },
  cancelled:  { icon: <XCircle size={14} />,       color: 'bg-red-500/20 text-red-400',       label: 'Cancelled' },
};

const OrderCard = ({ order }) => {
  const [expanded, setExpanded] = useState(false);
  const status = statusConfig[order.orderStatus] || statusConfig.pending;
  const date = new Date(order.createdAt).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden hover:border-amber-500/30 transition-all duration-300">
      {/* Order Header */}
      <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-neutral-800 rounded-2xl shrink-0">
            <ShoppingBag size={20} className="text-amber-500" />
          </div>
          <div>
            <p className="text-white font-bold">Order #{order._id.slice(-8).toUpperCase()}</p>
            <p className="text-neutral-500 text-xs mt-0.5">{date} · {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</p>
            <p className="text-neutral-500 text-xs mt-0.5">
              Payment: <span className="text-neutral-300">{order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Card / Online'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-neutral-500 text-xs">Total</p>
            <p className="text-amber-400 font-black text-xl">₹{order.totalPrice?.toLocaleString()}</p>
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shrink-0 ${status.color}`}>
            {status.icon} {status.label}
          </div>
        </div>
      </div>

      {/* Expand/Collapse */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-center gap-2 py-3 border-t border-neutral-800 text-neutral-500 hover:text-amber-400 text-xs font-bold uppercase tracking-wider transition-colors hover:bg-neutral-800/30"
      >
        {expanded ? <><ChevronUp size={14} /> Hide Details</> : <><ChevronDown size={14} /> View Details</>}
      </button>

      {/* Order Details */}
      {expanded && (
        <div className="p-6 border-t border-neutral-800 bg-neutral-900/50 animate-in fade-in">
          {/* Items */}
          <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-4">Items Ordered</h4>
          <div className="space-y-3 mb-6">
            {order.items?.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-12 h-12 bg-neutral-800 rounded-xl overflow-hidden shrink-0 border border-neutral-700">
                  {item.productImage ? (
                    <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><Package size={16} className="text-neutral-600" /></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm truncate">{item.productName}</p>
                  <p className="text-neutral-500 text-xs">Qty: {item.quantity} × ₹{item.price?.toLocaleString()}</p>
                </div>
                <p className="text-amber-400 font-bold text-sm shrink-0">₹{(item.quantity * item.price).toLocaleString()}</p>
              </div>
            ))}
          </div>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <>
              <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">Delivery Address</h4>
              <div className="bg-neutral-800/50 rounded-2xl p-4 text-sm text-neutral-300">
                <p className="font-bold text-white">{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.phone}</p>
                <p>{order.shippingAddress.street}, {order.shippingAddress.city} - {order.shippingAddress.pincode}</p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

const MyOrders = () => {
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders');
        setOrders(res.data.data || []);
      } catch {
        setOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-amber-500 font-bold">Loading...</div>;
  if (!user) return <Navigate to="/login" />;

  const filtered = filter === 'all' ? orders : orders.filter(o => o.orderStatus === filter);
  const filters = ['all', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            My <span className="text-amber-500">Orders</span>
          </h1>
          <p className="text-neutral-400">Track and manage all your orders</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 flex-wrap mb-8">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all ${
                filter === f ? 'bg-amber-500 text-black' : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600'
              }`}
            >
              {f === 'all' ? `All (${orders.length})` : f}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {ordersLoading ? (
          <div className="text-center py-20 text-amber-500 font-bold">Loading your orders...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-neutral-900 p-8 rounded-full mb-6 w-fit mx-auto">
              <ShoppingBag size={48} className="text-neutral-600" />
            </div>
            <p className="text-neutral-400 text-lg">
              {filter === 'all' ? "You haven't placed any orders yet." : `No ${filter} orders.`}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filtered.map(order => <OrderCard key={order._id} order={order} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
