import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { X, Lock, Mail, User as UserIcon, Phone, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { user, login, register, logout, activeModal, setActiveModal, updateUserProfile } = useShop();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (activeModal !== 'auth') return null;

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password, phone);
      }
      setActiveModal(null);
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (type: 'customer' | 'admin') => {
    if (type === 'customer') {
      setEmail('user@shopeasy.com');
      setPassword('password123');
      setName('Aarav Sharma');
      setPhone('+91 98765 43210');
    } else {
      setEmail('admin@shopeasy.com');
      setPassword('admin123');
      setName('ShopEasy Admin');
      setPhone('+91 98111 22334');
    }
  };

  return (
    <div className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden relative">
        
        {/* Header Close Button */}
        <button
          onClick={() => setActiveModal(null)}
          className="absolute top-4 right-4 z-20 p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Top Banner */}
        <div className="p-6 bg-slate-900 text-white text-center space-y-1">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 font-black flex items-center justify-center text-xl mx-auto shadow-md">
            S
          </div>
          <h3 className="font-extrabold text-lg tracking-tight font-display text-white">
            {user ? 'Your Account Profile' : 'Welcome to ShopEasy Store'}
          </h3>
          <p className="text-xs text-slate-400">
            {user ? `Signed in as ${user.email}` : 'Access your cart, order tracking, and member offers'}
          </p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {user ? (
            /* Logged In Profile View */
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Account Name:</span>
                  <span className="font-bold text-slate-900">{user.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Email:</span>
                  <span className="font-bold text-slate-900">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Role:</span>
                  <span className="px-2 py-0.5 bg-slate-200 rounded text-[10px] font-bold uppercase">{user.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Phone:</span>
                  <span className="font-bold text-slate-900">{user.phone || 'Not added'}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setActiveModal('orders')}
                  className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors cursor-pointer"
                >
                  View My Orders
                </button>
                {user.role === 'admin' && (
                  <button
                    onClick={() => setActiveModal('admin')}
                    className="flex-1 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Admin Portal
                  </button>
                )}
              </div>

              <button
                onClick={() => {
                  logout();
                  setActiveModal(null);
                }}
                className="w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-lg transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          ) : (
            /* Sign In / Register Forms */
            <>
              {/* Tab Selector */}
              <div className="flex p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMsg('');
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    mode === 'login' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMsg('');
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                    mode === 'register' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Create Account
                </button>
              </div>

              {/* Fast 1-Click Demo Buttons */}
              <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-1.5 text-xs">
                <div className="text-[10px] uppercase font-bold text-amber-900 tracking-wider">
                  ⚡ Fast One-Click Demo Logins:
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => fillCredentials('customer')}
                    className="flex-1 py-1.5 px-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Demo Customer
                  </button>
                  <button
                    type="button"
                    onClick={() => fillCredentials('admin')}
                    className="flex-1 py-1.5 px-2 bg-slate-900 hover:bg-slate-800 text-amber-400 text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Demo Admin
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleAuthSubmit} className="space-y-3.5">
                {mode === 'register' && (
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Your Full Name *</label>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Aarav Sharma"
                        className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-slate-900"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Email Address *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="user@shopeasy.com"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Password *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-slate-900"
                    />
                  </div>
                </div>

                {mode === 'register' && (
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Mobile Number (Optional)</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-slate-900"
                      />
                    </div>
                  </div>
                )}

                {errorMsg && (
                  <div className="p-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Please wait...' : mode === 'login' ? 'Sign In to ShopEasy' : 'Create Your Account'}
                </button>
              </form>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
