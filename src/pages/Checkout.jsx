import React, { useState } from 'react';
import { ArrowLeft, CreditCard, Banknote, ShieldCheck, MapPin, Wallet, Zap, Shield, Phone, User as UserIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import toast from 'react-hot-toast';
import axios from 'axios';
import { API_CONFIG } from '../Api';

export default function Checkout() {
    const { cart, clearCart } = useCartStore();
    const { user } = useAuthStore();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [form, setForm] = useState({
        firstName: user?.name?.split(' ')[0] || '',
        lastName: user?.name?.split(' ')[1] || '',
        phone: user?.phone || '',
        address: user?.location?.address || '',
        city: 'Bengaluru',
        pincode: '560037'
    });

    if (cart.length === 0) {
        navigate('/');
        return null;
    }

    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = totalPrice >= 500 ? 0 : 40;
    const platformFee = 5;
    const grandTotal = totalPrice + shipping + platformFee;

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const deliveryAddress = `${form.address}, ${form.city} - ${form.pincode}. Ph: ${form.phone}`;

            await axios.post(`${API_CONFIG.BASE_URL}/api/orders`, {
                items: cart,
                totalAmount: grandTotal,
                deliveryAddress,
                paymentMethod
            });

            setTimeout(() => {
                setLoading(false);
                clearCart();
                toast.success('Order Placed Successfully! 🚀', {
                    duration: 5000,
                    icon: '✅',
                    style: { background: '#10B981', color: '#fff', borderRadius: '12px' }
                });
                navigate('/profile');
            }, 1000);
        } catch (err) {
            console.error(err);
            setLoading(false);
            toast.error('Failed to process checkout.');
        }
    };

    return (
        <div className="checkout-container-v2">
            <div className="container">
                <header className="checkout-nav">
                    <button onClick={() => navigate(-1)} className="btn-back-minimal">
                        <ArrowLeft size={18} /> Exit Checkout
                    </button>
                    <div className="secure-head"><Shield size={16} /> Secure SSL Checkout</div>
                </header>

                <div className="checkout-split">
                    <div className="checkout-main-flow">
                        <div className="flow-step">
                            <div className="step-badge">1</div>
                            <div className="step-card">
                                <div className="step-title">
                                    <MapPin size={22} className="ico" />
                                    <div>
                                        <h3>Delivery Destination</h3>
                                        <p>Where should we drop off your items?</p>
                                    </div>
                                </div>

                                <form id="order-form-v2" onSubmit={handlePlaceOrder} className="checkout-form">
                                    <div className="form-row">
                                        <div className="input-group">
                                            <label><UserIcon size={14} /> First Name</label>
                                            <input type="text" placeholder="John" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
                                        </div>
                                        <div className="input-group">
                                            <label>Last Name</label>
                                            <input type="text" placeholder="Doe" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required />
                                        </div>
                                    </div>

                                    <div className="input-group full">
                                        <label><Phone size={14} /> Contact Number</label>
                                        <input type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
                                    </div>

                                    <div className="input-group full">
                                        <label><MapPin size={14} /> Complete Delivery Address</label>
                                        <textarea
                                            rows="3"
                                            placeholder="Flat/House No, Floor, Building Name, Street"
                                            value={form.address}
                                            onChange={(e) => setForm({ ...form, address: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="form-row">
                                        <div className="input-group">
                                            <label>City</label>
                                            <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
                                        </div>
                                        <div className="input-group">
                                            <label>Zip/Pincode</label>
                                            <input type="text" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} required />
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>

                        <div className="flow-step">
                            <div className="step-badge">2</div>
                            <div className="step-card">
                                <div className="step-title">
                                    <CreditCard size={22} className="ico" />
                                    <div>
                                        <h3>Payment Selection</h3>
                                        <p>Safe and verified payment pathways</p>
                                    </div>
                                </div>

                                <div className="payment-stack">
                                    <label className={`pay-card ${paymentMethod === 'COD' ? 'selected' : ''}`}>
                                        <input type="radio" name="pay" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} />
                                        <div className="pay-icon"><Banknote size={24} /></div>
                                        <div className="pay-desc">
                                            <h4>Cash on Delivery</h4>
                                            <p>Pay at your doorstep with Cash/UPI</p>
                                        </div>
                                        {paymentMethod === 'COD' && <div className="check-ring">✓</div>}
                                    </label>

                                    <label className={`pay-card ${paymentMethod === 'UPI' ? 'selected' : ''}`}>
                                        <input type="radio" name="pay" value="UPI" checked={paymentMethod === 'UPI'} onChange={() => setPaymentMethod('UPI')} />
                                        <div className="pay-icon"><Zap size={24} color="#6366F1" /></div>
                                        <div className="pay-desc">
                                            <h4>Instant Delivery via UPI</h4>
                                            <p>GooglePay, PhonePe or Amazon Pay</p>
                                        </div>
                                        {paymentMethod === 'UPI' && <div className="check-ring">✓</div>}
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <aside className="checkout-sidebar">
                        <div className="summary-card-v2">
                            <h3>Order Preview</h3>
                            <div className="mini-products">
                                {cart.map(item => (
                                    <div key={item._id || item.id} className="mini-p-row">
                                        <div className="mini-p-info">
                                            <strong>{item.quantity}x</strong> <span>{item.name}</span>
                                        </div>
                                        <div className="mini-p-price">₹{item.price * item.quantity}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="total-stack">
                                <div className="t-row">
                                    <span>Subtotal</span>
                                    <span>₹{totalPrice}</span>
                                </div>
                                <div className="t-row">
                                    <span>Shipping & Handling</span>
                                    <span className={shipping === 0 ? 'free' : ''}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                                </div>
                                <div className="t-row">
                                    <span>Service Charges</span>
                                    <span>₹{platformFee}</span>
                                </div>
                                <div className="t-total">
                                    <div className="t-text">Total Amount</div>
                                    <div className="t-val">₹{grandTotal}</div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                form="order-form-v2"
                                className="place-order-premium-btn"
                                disabled={loading}
                            >
                                {loading ? <div className="loader-dots"><span></span><span></span><span></span></div> : `Confirm Order • ₹${grandTotal}`}
                            </button>

                            <div className="trust-seals">
                                <span className="seal"><ShieldCheck size={14} /> Quality Checked</span>
                                <span className="seal"><Zap size={14} /> Instant Confirmation</span>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            <style>{`
                .checkout-container-v2 { padding: 4rem 0 8rem; background: #F8FAFC; min-height: 100vh; }
                .container { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; }

                .checkout-nav { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3rem; }
                .btn-back-minimal { background: none; border: none; font-weight: 800; color: #94A3B8; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: 0.2s; }
                .btn-back-minimal:hover { color: #10B981; }
                .secure-head { font-size: 0.8rem; font-weight: 800; text-transform: uppercase; color: #10B981; display: flex; align-items: center; gap: 6px; background: #ECFDF5; padding: 6px 12px; border-radius: 50px; }

                .checkout-split { display: grid; grid-template-columns: 1fr 400px; gap: 4rem; }
                
                .flow-step { position: relative; padding-left: 3rem; margin-bottom: 3rem; }
                .flow-step::before { content: ''; position: absolute; left: 1rem; top: 2rem; bottom: -3rem; width: 2px; background: #E2E8F0; }
                .flow-step:last-child::before { display: none; }
                .step-badge { position: absolute; left: 0; top: 0; width: 32px; height: 32px; background: #1E293B; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; z-index: 2; border: 4px solid #F8FAFC; }
                
                .step-card { background: white; border-radius: 24px; padding: 2.5rem; border: 1px solid #F1F5F9; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
                .step-title { display: flex; align-items: center; gap: 1.25rem; margin-bottom: 2.5rem; }
                .step-title .ico { color: #10B981; }
                .step-title h3 { font-size: 1.4rem; font-weight: 900; color: #0F172A; margin: 0; }
                .step-title p { color: #94A3B8; font-size: 0.95rem; margin-top: 2px; font-weight: 600; }

                .checkout-form { display: grid; gap: 1.5rem; }
                .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
                
                .input-group { display: flex; flex-direction: column; gap: 0.5rem; }
                .input-group label { font-size: 0.8rem; font-weight: 800; color: #64748B; text-transform: uppercase; display: flex; align-items: center; gap: 6px; }
                .input-group input, .input-group textarea { background: #F8FAFC; border: 2px solid #F1F5F9; border-radius: 12px; padding: 1rem; font-size: 1rem; font-weight: 600; outline: none; transition: 0.2s; }
                .input-group input:focus, .input-group textarea:focus { border-color: #10B981; background: white; box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.05); }

                .payment-stack { display: grid; gap: 1rem; }
                .pay-card { position: relative; display: flex; align-items: center; gap: 1.5rem; padding: 1.5rem; background: #F8FAFC; border: 2px solid #F1F5F9; border-radius: 20px; cursor: pointer; transition: 0.2s; }
                .pay-card input { display: none; }
                .pay-card.selected { border-color: #10B981; background: #ECFDF5; }
                .pay-card .pay-icon { width: 56px; height: 56px; background: white; border-radius: 16px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.04); }
                .pay-desc h4 { font-size: 1.1rem; color: #0F172A; margin: 0 0 4px; font-weight: 800; }
                .pay-desc p { color: #64748B; font-size: 0.85rem; margin: 0; font-weight: 600; }
                .check-ring { margin-left: auto; width: 28px; height: 28px; background: #10B981; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 950; font-size: 0.9rem; }

                .checkout-sidebar { position: sticky; top: 40px; }
                .summary-card-v2 { background: white; border-radius: 24px; padding: 2rem; border: 1px solid #F1F5F9; box-shadow: 0 20px 40px -10px rgba(0,0,0,0.05); }
                .summary-card-v2 h3 { font-size: 1.25rem; font-weight: 900; color: #0F172A; margin-bottom: 1.5rem; }

                .mini-products { max-height: 200px; overflow-y: auto; margin-bottom: 2rem; padding-right: 10px; }
                .mini-p-row { display: flex; justify-content: space-between; font-size: 0.9rem; font-weight: 600; margin-bottom: 0.75rem; color: #475569; }
                .mini-p-info strong { color: #10B981; margin-right: 8px; }
                
                .total-stack { background: #F8FAFC; border-radius: 16px; padding: 1.5rem; margin-bottom: 2rem; }
                .t-row { display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 700; color: #94A3B8; margin-bottom: 0.75rem; }
                .t-row .free { color: #10B981; }
                .t-total { display: flex; justify-content: space-between; align-items: baseline; border-top: 1px dashed #E2E8F0; padding-top: 1rem; margin-top: 1rem; }
                .t-text { font-size: 1rem; font-weight: 800; color: #0F172A; }
                .t-val { font-size: 1.75rem; font-weight: 950; color: #0F172A; letter-spacing: -0.04em; }

                .place-order-premium-btn { width: 100%; height: 60px; border: none; background: #1E293B; color: white; border-radius: 16px; font-weight: 800; font-size: 1.1rem; cursor: pointer; transition: 0.3s; box-shadow: 0 10px 20px -5px rgba(30, 41, 59, 0.3); }
                .place-order-premium-btn:hover:not(:disabled) { transform: translateY(-3px); background: #10B981; box-shadow: 0 15px 30px -5px rgba(16, 185, 129, 0.4); }
                .place-order-premium-btn:disabled { opacity: 0.7; cursor: not-allowed; }

                .loader-dots { display: flex; align-items: center; justify-content: center; gap: 4px; }
                .loader-dots span { width: 6px; height: 6px; background: white; border-radius: 50%; animation: dotAnim 0.6s infinite alternate; }
                .loader-dots span:nth-child(2) { animation-delay: 0.2s; }
                .loader-dots span:nth-child(3) { animation-delay: 0.4s; }
                @keyframes dotAnim { to { transform: translateY(-6px); opacity: 0.4; } }

                .trust-seals { display: flex; justify-content: center; gap: 1.5rem; margin-top: 1.5rem; font-size: 0.75rem; font-weight: 800; color: #94A3B8; }
                .seal { display: flex; align-items: center; gap: 4px; }

                @media (max-width: 1024px) {
                    .checkout-split { grid-template-columns: 1fr; }
                    .checkout-sidebar { position: static; }
                    .form-row { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
}
