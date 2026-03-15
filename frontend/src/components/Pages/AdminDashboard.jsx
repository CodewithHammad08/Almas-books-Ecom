import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Package, Users, ShoppingCart, Activity } from 'lucide-react';

const AdminDashboard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-amber-500 font-bold">Loading...</div>;
  }

  // Basic route protection
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" />;
  }

  const stats = [
    { title: "Total Users", value: "128", icon: <Users size={24} />, trend: "+12%" },
    { title: "Total Products", value: "45", icon: <Package size={24} />, trend: "+4%" },
    { title: "Active Orders", value: "12", icon: <ShoppingCart size={24} />, trend: "+25%" },
    { title: "Revenue", value: "45,000₹", icon: <Activity size={24} />, trend: "+18%" }
  ];

  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              Admin <span className="text-amber-500">Dashboard</span>
            </h1>
            <p className="text-neutral-400">Welcome back, {user.name}!</p>
          </div>
          <button className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-6 py-3 rounded-full shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 transition-all">
            + Add New Product
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 hover:border-amber-500/30 transition-colors group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-neutral-800 rounded-2xl text-amber-500 group-hover:bg-amber-500 group-hover:text-black transition-colors">
                  {stat.icon}
                </div>
                <span className="text-green-500 bg-green-500/10 px-2 py-1 rounded-lg text-sm font-bold">
                  {stat.trend}
                </span>
              </div>
              <p className="text-neutral-400 text-sm font-bold mb-1">{stat.title}</p>
              <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
            </div>
          ))}
        </div>

        {/* Placeholder specific sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-3xl p-8">
            <h3 className="text-xl font-bold text-white mb-6">Recent Orders (Placeholder)</h3>
            <div className="text-center py-10 text-neutral-500 border-2 border-dashed border-neutral-800 rounded-2xl">
              Connect to /api/orders controller to map data out here.
            </div>
          </div>
          <div className="lg:col-span-1 bg-neutral-900 border border-neutral-800 rounded-3xl p-8">
            <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
            <div className="space-y-4">
              <button className="w-full text-left bg-neutral-800 hover:bg-neutral-700 text-white p-4 rounded-xl font-medium transition-colors border border-neutral-700 hover:border-amber-500/50">
                Manage Inventory
              </button>
              <button className="w-full text-left bg-neutral-800 hover:bg-neutral-700 text-white p-4 rounded-xl font-medium transition-colors border border-neutral-700 hover:border-amber-500/50">
                View Submitted Print Requests
              </button>
              <button className="w-full text-left bg-neutral-800 hover:bg-neutral-700 text-white p-4 rounded-xl font-medium transition-colors border border-neutral-700 hover:border-amber-500/50">
                Customer Messages
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
