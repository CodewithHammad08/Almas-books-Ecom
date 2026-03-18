import React, { useState } from 'react';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, X, MapPin, CreditCard, Banknote, CheckCircle, Printer, Package } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

// ─── STEP INDICATOR ──────────────────────────────────────────────────────────
const StepIndicator = ({ step }) => {
  const steps = ['Address', 'Payment', 'Confirm'];
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {steps.map((label, i) => (
        <React.Fragment key={i}>
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
              step > i + 1 ? 'bg-amber-500 border-amber-500 text-black' :
              step === i + 1 ? 'bg-amber-500 border-amber-500 text-black' :
              'bg-transparent border-neutral-600 text-neutral-500'
            }`}>
              {step > i + 1 ? '✓' : i + 1}
            </div>
            <span className={`text-[10px] mt-1 font-bold uppercase tracking-wider ${step >= i + 1 ? 'text-amber-400' : 'text-neutral-600'}`}>{label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className={`w-16 h-0.5 mb-4 mx-1 transition-all ${step > i + 1 ? 'bg-amber-500' : 'bg-neutral-700'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

// ─── ADDRESS STEP ─────────────────────────────────────────────────────────────
const AddressStep = ({ address, onChange, onNext }) => {
  const fields = [
    { key: 'name', label: 'Full Name', placeholder: 'Ali Khan', type: 'text' },
    { key: 'phone', label: 'Phone Number', placeholder: '+91 1234567890', type: 'tel' },
    { key: 'street', label: 'Street / Area', placeholder: 'XYZ Street', type: 'text' },
    { key: 'city', label: 'City', placeholder: 'Thane,Mumbai', type: 'text' },
    { key: 'pincode', label: 'Postal / ZIP Code', placeholder: '75500', type: 'text' },
  ];

  const isValid = fields.every(f => address[f.key]?.trim());

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-amber-500/20 rounded-xl"><MapPin size={20} className="text-amber-400" /></div>
        <div>
          <h3 className="text-white font-bold text-lg">Delivery Address</h3>
          <p className="text-neutral-500 text-xs">Where should we send your order?</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {fields.map(f => (
          <div key={f.key} className={f.key === 'street' ? 'sm:col-span-2' : ''}>
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5 block">{f.label}</label>
            <input
              type={f.type}
              value={address[f.key] || ''}
              onChange={e => onChange({ ...address, [f.key]: e.target.value })}
              placeholder={f.placeholder}
              className="w-full bg-black border border-neutral-700 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-amber-500 transition-colors placeholder:text-neutral-600"
            />
          </div>
        ))}
      </div>

      <button
        onClick={onNext}
        disabled={!isValid}
        className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
      >
        Continue to Payment <ArrowRight size={18} />
      </button>
    </div>
  );
};

// ─── PAYMENT STEP ─────────────────────────────────────────────────────────────
const PaymentStep = ({ method, onChange, onNext, onBack, total }) => {
  const [cardData, setCardData] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [processing, setProcessing] = useState(false);

  const formatCard = val => val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const formatExpiry = val => {
    const v = val.replace(/\D/g, '').slice(0, 4);
    return v.length >= 3 ? `${v.slice(0, 2)}/${v.slice(2)}` : v;
  };

  const isCardValid = method === 'COD' || (
    cardData.number.replace(/\s/g, '').length === 16 &&
    cardData.name.trim() &&
    cardData.expiry.length === 5 &&
    cardData.cvv.length >= 3
  );

  const handlePay = async () => {
    if (method === 'Online') {
      setProcessing(true);
      await new Promise(r => setTimeout(r, 1800)); // simulate payment processing
      setProcessing(false);
    }
    onNext();
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-amber-500/20 rounded-xl"><CreditCard size={20} className="text-amber-400" /></div>
        <div>
          <h3 className="text-white font-bold text-lg">Payment Method</h3>
          <p className="text-neutral-500 text-xs">Choose how you'd like to pay</p>
        </div>
      </div>

      {/* Method Selector */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {[
          { id: 'COD', label: 'Cash on Delivery', icon: <Banknote size={22} />, sub: 'Pay when you receive' },
          { id: 'Online', label: 'Card / Online', icon: <CreditCard size={22} />, sub: 'Visa, Mastercard, etc.' },
        ].map(opt => (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all text-center ${
              method === opt.id ? 'border-amber-500 bg-amber-500/10' : 'border-neutral-700 bg-neutral-800/50 hover:border-neutral-500'
            }`}
          >
            <span className={method === opt.id ? 'text-amber-400' : 'text-neutral-400'}>{opt.icon}</span>
            <span className={`font-bold text-sm ${method === opt.id ? 'text-white' : 'text-neutral-300'}`}>{opt.label}</span>
            <span className="text-neutral-500 text-xs">{opt.sub}</span>
          </button>
        ))}
      </div>

      {/* COD Info */}
      {method === 'COD' && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6 text-sm text-green-400">
          ✅ You'll pay <span className="font-bold">₹{total.toLocaleString()}</span> at the time of delivery.
        </div>
      )}

      {/* Card Form */}
      {method === 'Online' && (
        <div className="space-y-4 mb-6">
          <div className="bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700 rounded-2xl p-5">
            <div className="flex justify-between items-start mb-6">
              <div className="w-10 h-7 bg-amber-500 rounded-md" />
              <span className="text-neutral-400 text-xs font-mono">VISA/MC</span>
            </div>
            <p className="text-white font-mono tracking-widest text-sm mb-4">{cardData.number || '•••• •••• •••• ••••'}</p>
            <div className="flex justify-between">
              <span className="text-neutral-400 text-xs">{cardData.name || 'CARD HOLDER'}</span>
              <span className="text-neutral-400 text-xs">{cardData.expiry || 'MM/YY'}</span>
            </div>
          </div>

          {[
            { key: 'number', label: 'Card Number', placeholder: '1234 5678 9012 3456', format: formatCard, span: true },
            { key: 'name', label: 'Cardholder Name', placeholder: 'Ali Khan', format: v => v, span: true },
            { key: 'expiry', label: 'Expiry (MM/YY)', placeholder: 'MM/YY', format: formatExpiry, span: false },
            { key: 'cvv', label: 'CVV', placeholder: '•••', format: v => v.replace(/\D/g, '').slice(0, 4), span: false },
          ].map(f => (
            <div key={f.key} className={f.span ? 'col-span-2' : ''}>
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1.5 block">{f.label}</label>
              <input
                type={f.key === 'cvv' ? 'password' : 'text'}
                value={cardData[f.key]}
                onChange={e => setCardData({ ...cardData, [f.key]: f.format(e.target.value) })}
                placeholder={f.placeholder}
                className="w-full bg-black border border-neutral-700 text-white rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:border-amber-500 transition-colors placeholder:text-neutral-600"
              />
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 py-3.5 rounded-xl border border-neutral-700 text-neutral-300 hover:text-white hover:border-neutral-500 transition-colors font-medium text-sm">
          ← Back
        </button>
        <button
          onClick={handlePay}
          disabled={!isCardValid || processing}
          className="flex-[2] bg-amber-500 hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed text-black font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2"
        >
          {processing ? (
            <><div className="w-4 h-4 border-2 border-black/40 border-t-black rounded-full animate-spin" /> Processing...</>
          ) : (
            <>{method === 'COD' ? 'Place Order' : `Pay ₹${total.toLocaleString()}`} <ArrowRight size={18} /></>
          )}
        </button>
      </div>
    </div>
  );
};

// ─── INVOICE MODAL ────────────────────────────────────────────────────────────
const InvoiceModal = ({ order, address, paymentMethod, cartItems, total, shipping, onClose }) => {
  const handlePrint = () => {
    const printContent = document.getElementById('invoice-print-area').innerHTML;
    const win = window.open('', '_blank', 'width=800,height=700');
    win.document.write(`
      <html><head>
        <title>Invoice - Almas Books</title>
        <style>
          body { font-family: 'Segoe UI', sans-serif; background: #fff; color: #111; margin: 0; padding: 32px; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; border-bottom: 2px solid #f59e0b; padding-bottom: 20px; }
          .brand { font-size: 24px; font-weight: 900; color: #111; }
          .brand span { color: #f59e0b; }
          .invoice-id { font-size: 12px; color: #666; margin-top: 4px; }
          .section-title { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #888; margin-bottom: 8px; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 32px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
          th { text-align: left; font-size: 11px; font-weight: 700; text-transform: uppercase; color: #888; padding: 8px 0; border-bottom: 1px solid #e5e5e5; }
          td { padding: 10px 0; font-size: 13px; border-bottom: 1px solid #f5f5f5; }
          .total-row { font-weight: 900; font-size: 15px; color: #f59e0b; }
          .label { color: #666; font-size: 12px; }
          .footer { text-align: center; color: #aaa; font-size: 11px; margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px; }
        </style>
      </head><body>${printContent}</body></html>
    `);
    win.document.close();
    win.print();
  };

  const date = new Date().toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">

        {/* Green success header */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-8 rounded-t-3xl text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={36} className="text-white" />
          </div>
          <h2 className="text-white font-black text-2xl">Order Placed!</h2>
          <p className="text-green-100 text-sm mt-1">Your order has been confirmed successfully</p>
        </div>

        {/* Invoice Body */}
        <div id="invoice-print-area" className="p-8">
          {/* Print Header */}
          <div className="header" style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'32px', borderBottom:'2px solid #f59e0b', paddingBottom:'20px'}}>
            <div>
              <div className="brand" style={{fontSize:'24px', fontWeight:'900', color:'#111'}}>
                <span style={{color:'#f59e0b'}}>الماس</span> | Almas Books
              </div>
              <div className="invoice-id" style={{fontSize:'12px', color:'#666', marginTop:'4px'}}>GSOT: General Store & Office Supplies</div>
            </div>
            <div className="text-right" style={{textAlign:'right'}}>
              <div style={{fontWeight:'700', fontSize:'18px', color:'#111'}}>INVOICE</div>
              <div style={{fontSize:'12px', color:'#888', marginTop:'4px'}}>
                #{order?._id?.slice(-8).toUpperCase() || 'ORD00001'}
              </div>
              <div style={{fontSize:'12px', color:'#888'}}>{date}</div>
            </div>
          </div>

          {/* Info Grid */}
          <div className="info-grid" style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'32px', marginBottom:'32px'}}>
            <div>
              <div className="section-title" style={{fontSize:'11px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.1em', color:'#888', marginBottom:'8px'}}>Bill To</div>
              <p style={{fontWeight:'700', fontSize:'14px', color:'#111'}}>{address.name}</p>
              <p style={{fontSize:'13px', color:'#555', marginTop:'2px'}}>{address.phone}</p>
              <p style={{fontSize:'13px', color:'#555'}}>{address.street}</p>
              <p style={{fontSize:'13px', color:'#555'}}>{address.city}, {address.pincode}</p>
            </div>
            <div>
              <div className="section-title" style={{fontSize:'11px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.1em', color:'#888', marginBottom:'8px'}}>Payment Info</div>
              <p style={{fontSize:'13px', color:'#555'}}><strong>Method:</strong> {paymentMethod === 'COD' ? 'Cash on Delivery' : 'Card / Online'}</p>
              <p style={{fontSize:'13px', color:'#555', marginTop:'4px'}}><strong>Status:</strong> <span style={{color: paymentMethod === 'COD' ? '#f59e0b' : '#22c55e'}}>{paymentMethod === 'COD' ? 'Pending (COD)' : 'Paid'}</span></p>
            </div>
          </div>

          {/* Items Table */}
          <table style={{width:'100%', borderCollapse:'collapse', marginBottom:'24px'}}>
            <thead>
              <tr>
                <th style={{textAlign:'left', fontSize:'11px', fontWeight:'700', textTransform:'uppercase', color:'#888', padding:'8px 0', borderBottom:'1px solid #e5e5e5'}}>Item</th>
                <th style={{textAlign:'center', fontSize:'11px', fontWeight:'700', textTransform:'uppercase', color:'#888', padding:'8px 0', borderBottom:'1px solid #e5e5e5'}}>Qty</th>
                <th style={{textAlign:'right', fontSize:'11px', fontWeight:'700', textTransform:'uppercase', color:'#888', padding:'8px 0', borderBottom:'1px solid #e5e5e5'}}>Price</th>
                <th style={{textAlign:'right', fontSize:'11px', fontWeight:'700', textTransform:'uppercase', color:'#888', padding:'8px 0', borderBottom:'1px solid #e5e5e5'}}>Total</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, i) => (
                <tr key={i}>
                  <td style={{padding:'10px 0', fontSize:'13px', borderBottom:'1px solid #f5f5f5', color:'#111'}}>{item.name}</td>
                  <td style={{padding:'10px 0', fontSize:'13px', borderBottom:'1px solid #f5f5f5', textAlign:'center', color:'#555'}}>{item.quantity}</td>
                  <td style={{padding:'10px 0', fontSize:'13px', borderBottom:'1px solid #f5f5f5', textAlign:'right', color:'#555'}}>₹{item.price.toLocaleString()}</td>
                  <td style={{padding:'10px 0', fontSize:'13px', borderBottom:'1px solid #f5f5f5', textAlign:'right', fontWeight:'600', color:'#111'}}>₹{(item.price * item.quantity).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" style={{padding:'8px 0', textAlign:'right', fontSize:'12px', color:'#888'}}>Subtotal</td>
                <td style={{padding:'8px 0', textAlign:'right', fontSize:'13px', color:'#111'}}>₹{(total - shipping).toLocaleString()}</td>
              </tr>
              <tr>
                <td colSpan="3" style={{padding:'4px 0', textAlign:'right', fontSize:'12px', color:'#888'}}>Shipping</td>
                <td style={{padding:'4px 0', textAlign:'right', fontSize:'13px', color:'#111'}}>₹{shipping.toLocaleString()}</td>
              </tr>
              <tr>
                <td colSpan="3" style={{padding:'12px 0', textAlign:'right', fontWeight:'700', fontSize:'15px', color:'#111', borderTop:'2px solid #e5e5e5'}}>Grand Total</td>
                <td style={{padding:'12px 0', textAlign:'right', fontWeight:'900', fontSize:'15px', color:'#f59e0b', borderTop:'2px solid #e5e5e5'}}>₹{total.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>

          {/* Footer */}
          <div className="footer" style={{textAlign:'center', color:'#aaa', fontSize:'11px', marginTop:'40px', borderTop:'1px solid #eee', paddingTop:'20px'}}>
            Thank you for shopping with Almas Books & General Store 🎉<br />
            For any queries contact us at: <strong>almasbooks@example.com</strong>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 px-8 pb-8">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-sm transition-colors"
          >
            <Printer size={16} /> Print / Save PDF
          </button>
          <button
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-sm transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── CHECKOUT MODAL ───────────────────────────────────────────────────────────
const CheckoutModal = ({ cartItems, subtotal, shipping, total, user, onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const saved = (() => { try { return JSON.parse(localStorage.getItem('savedAddress') || '{}'); } catch { return {}; } })();
  const [address, setAddress] = useState({
    name: saved.name || user?.name || '',
    phone: saved.phone || user?.phone || '',
    street: saved.street || '',
    city: saved.city || '',
    pincode: saved.pincode || '',
  });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [placing, setPlacing] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [error, setError] = useState('');

  const handlePlaceOrder = async () => {
    setPlacing(true);
    setError('');
    try {
      localStorage.setItem('savedAddress', JSON.stringify(address));
      const orderData = {
        items: cartItems.map(item => ({ product: item._id, quantity: item.quantity, price: item.price })),
        totalPrice: total,
        shippingAddress: address,
        paymentMethod,
      };
      const res = await api.post('/orders', orderData);
      setPlacedOrder(res.data.data);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-neutral-900 border border-neutral-700 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-800">
          <h2 className="text-white font-bold text-lg">Checkout</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"><X size={20} /></button>
        </div>

        <div className="p-6">
          <StepIndicator step={step} />

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-xl mb-4 flex items-center gap-2">
              ⚠️ {error}
            </div>
          )}

          {step === 1 && (
            <AddressStep address={address} onChange={setAddress} onNext={() => setStep(2)} />
          )}

          {step === 2 && (
            <PaymentStep
              method={paymentMethod}
              onChange={setPaymentMethod}
              total={total}
              onBack={() => setStep(1)}
              onNext={handlePlaceOrder}
            />
          )}

          {step === 3 && (
            <InvoiceModal
              order={placedOrder}
              address={address}
              paymentMethod={paymentMethod}
              cartItems={cartItems}
              total={total}
              shipping={shipping}
              onClose={() => { onSuccess(); onClose(); }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// ─── MAIN CART COMPONENT ──────────────────────────────────────────────────────
const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart, cartCount } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const handleUpdateQuantity = (id, change, currentQty) => {
    const newQty = currentQty + change;
    if (newQty > 0) updateQuantity(id, newQty);
    else removeFromCart(id);
  };

  const handleCheckoutClick = () => {
    if (!user) {
      alert("Please login to checkout!");
      navigate('/login');
      return;
    }
    setCheckoutOpen(true);
  };

  const handleOrderSuccess = () => {
    clearCart();
    navigate('/');
  };

  const subtotal = cartTotal;
  const shipping = cartItems.length > 0 ? 50 : 0;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-black pt-32 pb-12 px-4 flex flex-col items-center justify-center text-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-amber-500/20 blur-[50px] rounded-full"></div>
          <div className="relative bg-gradient-to-br from-neutral-800 to-neutral-900 p-8 rounded-[2rem] border border-neutral-700/50 shadow-2xl">
            <ShoppingBag size={80} className="text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
          </div>
        </div>
        <h2 className="text-4xl font-black text-white mb-4 tracking-tight">Your cart is <span className="text-amber-500">empty</span></h2>
        <p className="text-neutral-400 mb-10 max-w-md text-lg">Looks like you haven't added anything yet. Explore our collection of premium stationery and books.</p>
        <Link to="/shop" className="group bg-amber-500 hover:bg-amber-400 text-black px-10 py-4 rounded-2xl font-black text-lg transition-all duration-300 shadow-[0_0_30px_rgba(245,158,11,0.2)] hover:shadow-[0_0_50px_rgba(245,158,11,0.4)] flex items-center gap-3 active:scale-95">
          Start Shopping <ArrowRight size={20} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-32 pb-32 xl:pb-20 px-4 sm:px-6 lg:px-8">
      {checkoutOpen && (
        <CheckoutModal
          cartItems={cartItems}
          subtotal={subtotal}
          shipping={shipping}
          total={total}
          user={user}
          onClose={() => setCheckoutOpen(false)}
          onSuccess={handleOrderSuccess}
        />
      )}

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              Your <span className="text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.2)]">Cart</span>
            </h1>
            <p className="text-neutral-400 mt-2 font-medium">Review your items before checkout ({cartCount} items)</p>
          </div>
          <button onClick={clearCart} className="self-start md:self-auto flex items-center gap-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 px-4 py-2.5 rounded-xl transition-all font-bold text-sm border border-red-500/20 hover:border-red-500/40">
            <Trash2 size={16} /> Clear Cart
          </button>
        </div>

        <div className="flex flex-col xl:flex-row gap-8 lg:gap-12">
          {/* Cart Items List */}
          <div className="flex-1 grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 h-fit content-start">
            {cartItems.map((item) => (
              <div key={item._id} className="group flex flex-col items-stretch gap-3 sm:gap-4 bg-neutral-900/40 backdrop-blur-xl border border-neutral-800/60 rounded-[1.25rem] sm:rounded-3xl p-3 sm:p-5 hover:border-amber-500/40 hover:bg-neutral-900/80 transition-all duration-500 shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/0 via-amber-500/0 to-amber-500/5 translate-y-[-100%] group-hover:translate-y-[0%] transition-transform duration-1000"></div>
                
                {/* Image */}
                <div className="w-full h-32 sm:h-48 bg-black/40 rounded-xl sm:rounded-2xl overflow-hidden shrink-0 relative border border-neutral-800/50">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain p-2 sm:p-4 opacity-85 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                  <div className="absolute inset-0 border border-white/5 rounded-xl sm:rounded-2xl pointer-events-none"></div>
                  {/* Absolute Delete Button on Image */}
                  <button onClick={() => removeFromCart(item._id)} className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 p-1.5 sm:p-2 bg-black/60 backdrop-blur-md text-neutral-400 hover:text-red-500 hover:bg-red-500/20 rounded-lg sm:rounded-xl transition-all shadow-lg border border-white/5 md:opacity-0 group-hover:opacity-100 md:translate-y-2 group-hover:translate-y-0 duration-300 z-20">
                    <X size={16} className="sm:w-[18px] sm:h-[18px]" strokeWidth={2.5} />
                  </button>
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between relative z-10">
                  <div className="mb-3 sm:mb-4">
                    <h3 className="text-sm sm:text-lg font-bold text-white mb-1 sm:mb-1.5 line-clamp-2 leading-tight group-hover:text-amber-400 transition-colors pr-1">{item.name}</h3>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mt-1.5 sm:mt-2 gap-0.5 sm:gap-1">
                       <p className="text-amber-500 font-black text-sm sm:text-xl">₹{item.price.toLocaleString()}</p>
                       <div className="text-left sm:text-right mt-1 sm:mt-0">
                         <p className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest mb-0.5 hidden sm:block">Total</p>
                         <p className="text-neutral-400 sm:text-white font-bold sm:font-black text-xs sm:text-lg"><span className="sm:hidden text-neutral-500 font-medium mr-1 border-b border-neutral-800 pb-0.5">Total:</span>₹{(item.price * item.quantity).toLocaleString()}</p>
                       </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-neutral-800/50">
                    {/* Quantity Selector */}
                    <div className="flex items-center bg-black/80 rounded-lg sm:rounded-xl border border-neutral-700/50 p-1 shadow-inner w-full justify-between sm:justify-start">
                      <button onClick={() => handleUpdateQuantity(item._id, -1, item.quantity)} className="p-2 sm:p-3 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-md sm:rounded-lg transition-all active:scale-95">
                        <Minus size={14} className="sm:w-4 sm:h-4" strokeWidth={3} />
                      </button>
                      <span className="flex-1 sm:w-16 text-center text-white font-black text-sm sm:text-lg">{item.quantity}</span>
                      <button onClick={() => handleUpdateQuantity(item._id, 1, item.quantity)} className="p-2 sm:p-3 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-md sm:rounded-lg transition-all active:scale-95">
                        <Plus size={14} className="sm:w-4 sm:h-4" strokeWidth={3} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary (Desktop Sticky / Mobile flow) */}
          <div className="w-full xl:w-[420px] shrink-0">
             <div className="bg-gradient-to-b from-neutral-900 to-black border border-neutral-800 rounded-[2rem] p-8 sticky top-32 shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
                <h3 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                   <ShoppingBag className="text-amber-500" size={24} /> Order Summary
                </h3>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center text-neutral-400 font-medium">
                    <span>Subtotal</span>
                    <span className="text-white text-lg font-bold">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-neutral-400 font-medium">
                    <span>Shipping Estimate</span>
                    <span className="text-white text-lg font-bold">₹{shipping.toLocaleString()}</span>
                  </div>
                  
                  <div className="h-px bg-gradient-to-r from-transparent via-neutral-700 to-transparent my-6" />
                  
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="block text-white font-black text-2xl leading-none">Total</span>
                      <span className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest mt-1.5 block">Inclusive of all taxes</span>
                    </div>
                    <span className="text-amber-500 font-black text-4xl leading-none drop-shadow-[0_0_15px_rgba(245,158,11,0.2)]">₹{total.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckoutClick}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-black font-black py-5 rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.2)] hover:shadow-[0_0_40px_rgba(245,158,11,0.4)] transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 text-lg active:scale-[0.98]"
                >
                  Proceed to Checkout <ArrowRight size={22} strokeWidth={3} />
                </button>

                <div className="mt-8 flex flex-col items-center gap-4">
                  <div className="flex items-center gap-6 text-neutral-600">
                     <CreditCard size={28} />
                     <Banknote size={28} />
                     <Package size={28} />
                  </div>
                  <p className="text-neutral-500 text-[10px] font-bold uppercase tracking-widest text-center">
                    Secure checkout powered by Almas
                  </p>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Mobile Floating Checkout Bar */}
      <div className="xl:hidden fixed bottom-[4.5rem] sm:bottom-[5.5rem] left-0 right-0 p-3 sm:p-4 z-[45] animate-in slide-in-from-bottom-10 duration-500 pointer-events-none">
         <div className="bg-neutral-900/95 backdrop-blur-3xl border border-neutral-700/80 rounded-3xl p-4 shadow-[0_-10px_50px_rgba(0,0,0,0.8)] flex items-center justify-between gap-4 pointer-events-auto max-w-7xl mx-auto relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent pointer-events-none"></div>
            <div className="pl-2 relative z-10">
               <p className="text-neutral-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1">Total Pay</p>
               <p className="text-amber-500 font-black text-2xl sm:text-3xl leading-none drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]">₹{total.toLocaleString()}</p>
            </div>
            <button onClick={handleCheckoutClick} className="relative z-10 bg-amber-500 hover:bg-amber-400 text-black font-black px-6 sm:px-10 py-3.5 sm:py-4 rounded-2xl flex items-center gap-2 sm:gap-3 transition-all shadow-[0_0_20px_rgba(245,158,11,0.4)] active:scale-95 text-sm sm:text-lg">
              Checkout <ArrowRight size={20} strokeWidth={3} className="hidden sm:block" />
            </button>
         </div>
      </div>
    </div>
  );
};

export default Cart;