import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Calendar, MapPin, User as UserIcon, LogOut, ChevronRight, ShoppingBag, Clock, CheckCircle } from 'lucide-react';
import axios from 'axios';
import useAuthStore from '../store/useAuthStore';
import AddressBook from '../components/AddressBook';
import toast from 'react-hot-toast';
import { API_CONFIG } from '../Api';

export default function Profile() {
    const { user, logout } = useAuthStore();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('orders');
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            axios.get(`${API_CONFIG.BASE_URL}/api/user/orders`)
                .then(res => {
                    setOrders(res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
                    setLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        }
    }, [user]);

    const handleLogout = () => {
        const confirmLogout = window.confirm("Are you sure you want to log out?");
        if (confirmLogout) {
            logout();
            toast.success("Log out successful");
            navigate('/login');
        }
    };

    if (!user) return (
        <div className="unauth-view">
            <div className="lock-icon">🔒</div>
            <h2>Session Expired</h2>
            <p>Please login to your account to view your orders and manage addresses.</p>
            <Link to="/login" className="btn-login-redirect">Go to Login</Link>
        </div>
    );

    return (
        <div className="profile-container-v2">
            <div className="container">
                <header className="profile-v2-header">
                    <div className="user-profile-card">
                        <div className="avatar-v2">
                            {user.name?.[0].toUpperCase() || 'U'}
                            <div className="status-indicator"></div>
                        </div>
                        <div className="user-v2-details">
                            <div className="badge-user">Member since 2024</div>
                            <h2>{user.name}</h2>
                            <p>{user.phone}</p>
                            {user.location && (
                                <div className="loc-v2">
                                    <MapPin size={12} /> {user.location.address?.split(',')[0]}
                                </div>
                            )}
                        </div>
                        <button onClick={handleLogout} className="btn-logout-v2">
                            <LogOut size={18} /> Logout
                        </button>
                    </div>

                    <nav className="profile-tabs">
                        <button
                            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
                            onClick={() => setActiveTab('orders')}
                        >
                            <ShoppingBag size={18} /> Orders
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'addresses' ? 'active' : ''}`}
                            onClick={() => setActiveTab('addresses')}
                        >
                            <MapPin size={18} /> Saved Places
                        </button>
                    </nav>
                </header>

                <main className="profile-v2-content">
                    {activeTab === 'addresses' ? (
                        <div className="address-section-v2 animate-fade">
                            <AddressBook />
                        </div>
                    ) : (
                        <div className="orders-section-v2 animate-fade">
                            <div className="section-title-stack">
                                <h3>Order History</h3>
                                <p>Track and manage your recent purchases</p>
                            </div>

                            {loading ? (
                                <div className="orders-loading-v2">
                                    <div className="skeleton-order"></div>
                                    <div className="skeleton-order"></div>
                                </div>
                            ) : orders.length === 0 ? (
                                <div className="empty-orders-v2">
                                    <div className="empty-ico">📦</div>
                                    <h4>No orders yet</h4>
                                    <p>Your order history is empty. Start shopping to see your orders here.</p>
                                    <Link to="/" className="btn-browse-v2">Browse Stores</Link>
                                </div>
                            ) : (
                                <div className="orders-v2-grid">
                                    {orders.map(order => (
                                        <div key={order._id} className="order-v2-card">
                                            <div className="order-v2-header">
                                                <div className="store-pill">
                                                    <div className="dot"></div>
                                                    <span>{order.vendorId?.name || 'Local Store'}</span>
                                                </div>
                                                <div className="order-v2-id">#{order._id.slice(-6).toUpperCase()}</div>
                                            </div>

                                            <div className="order-v2-body">
                                                <div className="items-summary">
                                                    {order.items.map((item, idx) => (
                                                        <div key={idx} className="order-v2-item">
                                                            <span className="q">{item.quantity}x</span> {item.name}
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className={`status-v2 ${order.status.toLowerCase().replace(/\s+/g, '-')}`}>
                                                    {order.status === 'Delivered' ? <CheckCircle size={14} /> : <Clock size={14} />}
                                                    {order.status}
                                                </div>
                                            </div>

                                            <div className="order-v2-footer">
                                                <div className="time-v2">
                                                    <Calendar size={14} /> {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                                </div>
                                                <div className="total-v2">₹{order.totalAmount}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>

            <style>{`
                .profile-container-v2 { padding: 4rem 0 8rem; background: #F8FAFC; min-height: 100vh; }
                .container { max-width: 900px; margin: 0 auto; padding: 0 1.5rem; }

                .profile-v2-header { margin-bottom: 3rem; }
                .user-profile-card { background: white; border-radius: 24px; padding: 2.5rem; display: flex; align-items: center; gap: 2rem; border: 1px solid #F1F5F9; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.02); margin-bottom: 2rem; }
                
                .avatar-v2 { width: 90px; height: 90px; background: #10B981; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; font-weight: 900; position: relative; }
                .status-indicator { position: absolute; bottom: 5px; right: 5px; width: 14px; height: 14px; background: #22C55E; border: 3px solid white; border-radius: 50%; }

                .user-v2-details { flex: 1; }
                .badge-user { display: inline-block; background: #F1F5F9; color: #64748B; padding: 2px 10px; border-radius: 50px; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; margin-bottom: 0.5rem; }
                .user-v2-details h2 { font-size: 1.75rem; font-weight: 900; color: #0F172A; margin: 0; }
                .user-v2-details p { color: #94A3B8; font-weight: 700; margin: 2px 0 0.5rem; }
                .loc-v2 { display: flex; align-items: center; gap: 6px; font-size: 0.85rem; color: #64748B; font-weight: 600; }

                .btn-logout-v2 { background: #FEF2F2; color: #EF4444; border: none; padding: 0.75rem 1.25rem; border-radius: 12px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: 0.2s; }
                .btn-logout-v2:hover { background: #EF4444; color: white; transform: translateY(-2px); }

                .profile-tabs { display: flex; gap: 1rem; border-bottom: 1px solid #E2E8F0; padding-bottom: 1px; }
                .tab-btn { background: none; border: none; padding: 1rem 1.5rem; font-size: 1rem; font-weight: 800; color: #94A3B8; cursor: pointer; position: relative; display: flex; align-items: center; gap: 10px; transition: 0.2s; }
                .tab-btn.active { color: #10B981; }
                .tab-btn.active::after { content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 3px; background: #10B981; border-radius: 3px 3px 0 0; }

                .section-title-stack { margin-bottom: 2rem; }
                .section-title-stack h3 { font-size: 1.5rem; font-weight: 950; color: #0F172A; margin: 0; }
                .section-title-stack p { color: #94A3B8; font-size: 0.95rem; font-weight: 600; margin: 4px 0 0; }

                .orders-v2-grid { display: grid; gap: 1.25rem; }
                .order-v2-card { background: white; border-radius: 20px; border: 1px solid #F1F5F9; padding: 1.5rem; transition: 0.2s; }
                .order-v2-card:hover { transform: translateX(5px); border-color: #E2E8F0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }

                .order-v2-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
                .store-pill { display: flex; align-items: center; gap: 10px; background: #F8FAFC; padding: 6px 12px; border-radius: 10px; }
                .store-pill .dot { width: 8px; height: 8px; background: #10B981; border-radius: 50%; }
                .store-pill span { font-size: 0.85rem; font-weight: 800; color: #1E293B; }
                .order-v2-id { font-family: monospace; font-size: 0.85rem; font-weight: 800; color: #94A3B8; }

                .order-v2-body { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 1.5rem; }
                .items-summary { display: grid; gap: 4px; }
                .order-v2-item { font-size: 0.95rem; font-weight: 600; color: #475569; }
                .order-v2-item .q { color: #10B981; font-weight: 800; margin-right: 6px; }

                .status-v2 { display: flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 8px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; }
                .status-v2.pending { background: #FFFBEB; color: #D97706; }
                .status-v2.confirmed { background: #EFF6FF; color: #1D4ED8; }
                .status-v2.delivered { background: #ECFDF5; color: #047857; }
                .status-v2.out-for-delivery { background: #EEF2FF; color: #3730A3; }

                .order-v2-footer { border-top: 1px dashed #F1F5F9; padding-top: 1.25rem; display: flex; justify-content: space-between; align-items: center; }
                .time-v2 { display: flex; align-items: center; gap: 6px; font-size: 0.85rem; color: #94A3B8; font-weight: 700; }
                .total-v2 { font-size: 1.25rem; font-weight: 950; color: #0F172A; }

                .empty-orders-v2 { text-align: center; padding: 5rem 2rem; background: white; border-radius: 24px; border: 1px dashed #E2E8F0; }
                .empty-ico { font-size: 3.5rem; margin-bottom: 1.5rem; }
                .empty-orders-v2 h4 { font-size: 1.25rem; font-weight: 900; margin: 0 0 0.5rem 0; }
                .empty-orders-v2 p { color: #94A3B8; max-width: 300px; margin: 0 auto 2rem; font-weight: 600; }
                .btn-browse-v2 { display: inline-block; background: #10B981; color: white; text-decoration: none; padding: 0.85rem 2rem; border-radius: 12px; font-weight: 800; }

                .unauth-view { min-height: 80vh; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
                /* Animations */
                .animate-fade { animation: fadeIn 0.4s ease-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
}
