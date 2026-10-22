import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Address, Order } from '../types';
import {
  X,
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  Package,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    cartDiscount,
    cartShipping,
    cartTotal,
    user,
    token,
    placeOrder,
    activeModal,
    setActiveModal,
    deliveryPincode
  } = useShop();

  const [shippingAddress, setShippingAddress] = useState<Address>({
    fullName: user?.name || 'Aarav Sharma',
    phone: user?.phone || '+91 98765 43210',
    street: user?.addresses?.[0]?.street || 'Flat 402, Skyline Residency, Linking Road',
    city: user?.addresses?.[0]?.city || 'Mumbai',
    state: user?.addresses?.[0]?.state || 'Maharashtra',
    pincode: deliveryPincode || '400050',
    type: 'Home'
  });

  const [paymentMethod, setPaymentMethod] = useState<string>('UPI (Google Pay / PhonePe)');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  if (activeModal !== 'checkout') return null;

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!token) {
      setActiveModal('auth');
      return;
    }

    if (!shippingAddress.fullName || !shippingAddress.street || !shippingAddress.pincode) {
      setErrorMsg('Please complete all required shipping fields.');
      return;
    }

    try {
      setSubmitting(true);
      const order = await placeOrder(shippingAddress, paymentMethod);
      setConfirmedOrder(order);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to place order. Please check details.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h3 className="font-extrabold text-base tracking-tight font-display">
              {confirmedOrder ? 'Order Confirmed' : 'Checkout & Simulated Payment'}
            </h3>
          </div>
          <button
            onClick={() => {
              setConfirmedOrder(null);
              setActiveModal(null);
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-6">
          
          {/* Order Confirmation Screen */}
          {confirmedOrder ? (
            <div className="text-center py-6 space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-black text-slate-950 font-display">
                  Order Successfully Placed!
                </h3>
                <p className="text-xs text-slate-500">
                  We've sent the order confirmation and tracking details to <strong>{confirmedOrder.customerEmail}</strong>.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between">
                  <span className="text-slate-500">Order ID:</span>
                  <span className="font-mono font-bold text-slate-900">{confirmedOrder.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Method:</span>
                  <span className="font-semibold text-slate-900">{confirmedOrder.paymentMethod} (Sandbox)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Estimated Delivery:</span>
                  <span className="font-bold text-emerald-700">Tomorrow by 11:00 AM</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 font-black text-slate-950 text-sm">
                  <span>Total Amount Paid:</span>
                  <span className="tabular-nums">{formatINR(confirmedOrder.total)}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 justify-center pt-2">
                <button
                  onClick={() => {
                    setConfirmedOrder(null);
                    setActiveModal('orders');
                  }}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Package className="w-4 h-4" />
                  <span>View Order & Tracking</span>
                </button>
                <button
                  onClick={() => {
                    setConfirmedOrder(null);
                    setActiveModal(null);
                  }}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitOrder} className="space-y-6">
              
              {/* Step 1: Delivery Address */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[11px]">1</span>
                    <span>Delivery Address</span>
                  </h4>
                  <span className="text-[11px] text-slate-500">All India Delivery</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.fullName}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                      placeholder="e.g. Aarav Sharma"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={shippingAddress.phone}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Street Address, Flat / House No. *</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.street}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                    placeholder="e.g. Flat 402, Skyline Residency, Linking Road"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-slate-900"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      placeholder="e.g. Mumbai"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">State *</label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                      placeholder="e.g. Maharashtra"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">PIN Code *</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={shippingAddress.pincode}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, pincode: e.target.value })}
                      placeholder="e.g. 400050"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-slate-900 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Payment Method */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center text-[11px]">2</span>
                    <span>Payment Method (Simulated Sandbox)</span>
                  </h4>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                    Test Mode Active
                  </span>
                </div>

                <div className="space-y-2">
                  <label
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                      paymentMethod === 'UPI (Google Pay / PhonePe)'
                        ? 'border-amber-400 bg-amber-50/40'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="UPI (Google Pay / PhonePe)"
                      checked={paymentMethod === 'UPI (Google Pay / PhonePe)'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="accent-amber-500"
                    />
                    <div className="flex-1 text-xs">
                      <div className="font-bold text-slate-900">UPI Instant Pay (Simulated)</div>
                      <div className="text-[11px] text-slate-500">Google Pay, PhonePe, Paytm, or BHIM UPI</div>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                      paymentMethod === 'Credit / Debit Card'
                        ? 'border-amber-400 bg-amber-50/40'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Credit / Debit Card"
                      checked={paymentMethod === 'Credit / Debit Card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="accent-amber-500"
                    />
                    <div className="flex-1 text-xs">
                      <div className="font-bold text-slate-900">Credit / Debit Card (Simulated)</div>
                      <div className="text-[11px] text-slate-500">Visa, MasterCard, RuPay & American Express</div>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                      paymentMethod === 'Cash on Delivery'
                        ? 'border-amber-400 bg-amber-50/40'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Cash on Delivery"
                      checked={paymentMethod === 'Cash on Delivery'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="accent-amber-500"
                    />
                    <div className="flex-1 text-xs">
                      <div className="font-bold text-slate-900">Cash on Delivery (COD)</div>
                      <div className="text-[11px] text-slate-500">Pay cash upon parcel delivery at your doorstep</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Step 3: Order Summary */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Items Total ({cart.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span className="font-semibold text-slate-900 tabular-nums">{formatINR(cartSubtotal)}</span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-xs text-emerald-700 font-semibold">
                    <span>Promotional Savings</span>
                    <span className="tabular-nums">-{formatINR(cartDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Delivery Charges</span>
                  <span className="font-semibold text-slate-900 tabular-nums">
                    {cartShipping === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : formatINR(cartShipping)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-950 pt-2 border-t border-slate-200">
                  <span>Order Total Payable</span>
                  <span className="tabular-nums text-base">{formatINR(cartTotal)}</span>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>{submitting ? 'Placing Your Order...' : 'Place Order & Complete Payment'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
