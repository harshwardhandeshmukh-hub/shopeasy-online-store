import React, { useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { X, Package, Clock, Truck, CheckCircle2, RotateCcw, AlertCircle } from 'lucide-react';

export const OrdersModal: React.FC = () => {
  const { orders, fetchOrders, activeModal, setActiveModal, user } = useShop();

  useEffect(() => {
    if (activeModal === 'orders') {
      fetchOrders();
    }
  }, [activeModal, fetchOrders]);

  if (activeModal !== 'orders') return null;

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Shipped':
      case 'Out for Delivery':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Packed':
      case 'Ordered':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-extrabold text-base tracking-tight font-display">Your Orders & Deliveries</h3>
              <p className="text-[11px] text-slate-400">Track packages and review invoice histories</p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-5">
          {!user ? (
            <div className="text-center py-12 space-y-3">
              <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
              <h4 className="font-bold text-base text-slate-900">Please Sign In</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Sign in to your ShopEasy account to view your purchase history and live parcel tracking.
              </p>
              <button
                onClick={() => setActiveModal('auth')}
                className="px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Sign In to Account
              </button>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                <Package className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-base text-slate-900">No Orders Placed Yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Looks like you haven't bought anything yet. Explore our deals and start shopping!
              </p>
              <button
                onClick={() => setActiveModal(null)}
                className="px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Explore Today's Deals
              </button>
            </div>
          ) : (
            orders.map((order) => {
              const formattedDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              });

              const steps = [
                { label: 'Ordered', icon: Clock },
                { label: 'Packed', icon: Package },
                { label: 'Shipped', icon: Truck },
                { label: 'Delivered', icon: CheckCircle2 }
              ];

              const currentStepIdx = ['Ordered', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'].indexOf(order.orderStatus);

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:border-slate-300 transition-colors"
                >
                  {/* Order Card Header */}
                  <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex flex-wrap items-center gap-4">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Order Placed</span>
                        <span className="font-semibold text-slate-800">{formattedDate}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Amount</span>
                        <span className="font-bold text-slate-950 tabular-nums">{formatINR(order.total)}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Ship To</span>
                        <span className="font-semibold text-slate-800">{order.shippingAddress.fullName}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-slate-500">#{order.id}</span>
                      <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold border ${getStatusBadge(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>

                  {/* Tracking Step Visualizer */}
                  <div className="p-4 bg-white border-b border-slate-100">
                    <div className="flex items-center justify-between max-w-xl mx-auto relative">
                      <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 bg-slate-100 z-0"></div>
                      <div
                        className="absolute top-1/2 left-0 -translate-y-1/2 h-1 bg-emerald-500 z-0 transition-all duration-500"
                        style={{
                          width: `${Math.min(100, (Math.max(0, currentStepIdx) / 3) * 100)}%`
                        }}
                      ></div>

                      {steps.map((st, i) => {
                        const isDone = currentStepIdx >= i;
                        const isCurrent = currentStepIdx === i;
                        const Icon = st.icon;

                        return (
                          <div key={st.label} className="relative z-10 flex flex-col items-center gap-1">
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                                isDone
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-slate-200 text-slate-500'
                              } ${isCurrent ? 'ring-4 ring-emerald-100' : ''}`}
                            >
                              <Icon className="w-3.5 h-3.5" />
                            </div>
                            <span className={`text-[10px] font-bold ${isDone ? 'text-slate-900' : 'text-slate-400'}`}>
                              {st.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Order Items List */}
                  <div className="p-4 space-y-3">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between gap-4 text-xs">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-14 h-14 object-contain rounded-lg bg-slate-50 p-1 border border-slate-200 shrink-0"
                          />
                          <div>
                            <h5 className="font-bold text-slate-900 line-clamp-1">{item.name}</h5>
                            <span className="text-[11px] text-slate-500">Qty: {item.quantity}</span>
                          </div>
                        </div>
                        <span className="font-bold text-slate-950 tabular-nums">
                          {formatINR(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Footer note */}
                  <div className="p-3 bg-slate-50 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between items-center">
                    <span>Payment: <strong>{order.paymentMethod}</strong></span>
                    <span className="text-emerald-700 font-semibold">Standard 7-Day Replacement Guarantee</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};
