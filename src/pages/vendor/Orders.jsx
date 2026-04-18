import React, { useEffect, useState } from 'react';
import { Package, Clock, CheckCircle2, Truck, MapPin, User, ChevronRight, AlertCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_CONFIG } from '../../Api';

export default function VendorOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await axios.get(`${API_CONFIG.BASE_URL}/api/vendor/orders`);
            setOrders(res.data);
        } catch (err) {
            toast.error("Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await axios.put(`${API_CONFIG.BASE_URL}/api/orders/${id}/status`, { status });
            toast.success(`Order is now ${status}`);
            fetchOrders();
        } catch (err) {
            toast.error("Status update failed");
        }
    };

    if (loading) return <div className="loading-state">Fetching active orders...</div>;

    return (
        <div className="orders-management">
            <header className="page-header">
                <div className="title-area">
                    <h1>Order Fulfillment</h1>
                    <p>Process incoming requests and manage delivery statuses.</p>
                </div>
                <div className="order-stats-bar">
                    <div className="stat-pod active">
                        <span className="count">{orders.filter(o => o.status !== 'Delivered').length}</span>
                        <span className="label">Ongoing</span>
                    </div>
                </div>
            </header>

            {orders.length === 0 ? (
                <div className="empty-orders-canvas">
                    <div className="icon-ring"><Package size={48} /></div>
                    <h3>No active orders</h3>
                    <p>New orders from nearby customers will appear here automatically.</p>
                </div>
            ) : (
                <div className="orders-timeline">
                    {orders.map(order => (
                        <div key={order._id} className="premium-order-card">
                            <div className="card-side-status" data-status={order.status.toLowerCase().replace(/\s+/g, '-')}></div>

                            <div className="card-main-content">
                                <div className="order-top-row">
                                    <div className="id-group">
                                        <span className="order-hash">#{order._id.slice(-6).toUpperCase()}</span>
                                        <div className="timestamp">
                                            <Clock size={12} /> {new Date(order.createdAt).toLocaleDateString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                    <div className="price-tag">₹{order.totalAmount}</div>
                                </div>

                                <div className="customer-row">
                                    <div className="cust-avatar">{order.userId?.name?.[0] || 'C'}</div>
                                    <div className="cust-details">
                                        <span className="name">{order.userId?.name || 'Guest Customer'}</span>
                                        <span className="address"><MapPin size={12} /> {order.deliveryAddress}</span>
                                    </div>
                                    <div className="status-badge" data-status={order.status.toLowerCase().replace(/\s+/g, '-')}>
                                        {order.status}
                                    </div>
                                </div>

                                <div className="items-list-summary">
                                    <div className="section-title">Order Content</div>
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="order-item-snippet">
                                            <div className="dot"></div>
                                            <span className="qty">{item.quantity}x</span>
                                            <span className="item-name">{item.name}</span>
                                            <span className="item-price">₹{item.price * item.quantity}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="card-footer-actions">
                                    <div className="delivery-timer">
                                        <AlertCircle size={14} /> Expected fulfillment in 15 mins
                                    </div>
                                    <div className="btn-group">
                                        {order.status === 'Pending' && (
                                            <button onClick={() => updateStatus(order._id, 'Confirmed')} className="btn-action confirm">Accept & Confirm</button>
                                        )}
                                        {order.status === 'Confirmed' && (
                                            <button onClick={() => updateStatus(order._id, 'Out for Delivery')} className="btn-action dispatch">Mark as Dispatched</button>
                                        )}
                                        {order.status === 'Out for Delivery' && (
                                            <button onClick={() => updateStatus(order._id, 'Delivered')} className="btn-action deliver">Complete Delivery</button>
                                        )}
                                        {order.status === 'Delivered' && (
                                            <div className="completion-tag"><CheckCircle2 size={16} /> Order Completed</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <style>{`
                .orders-management { padding: 1.5rem; max-width: 1000px; margin: 0 auto; }
                .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5rem; }
                .page-header h1 { font-size: 1.8rem; color: #111827; margin: 0; }
                .page-header p { color: #6B7280; font-size: 1rem; margin-top: 0.25rem; }
                
                .stat-pod { background: white; border: 1px solid #F3F4F6; padding: 0.5rem 1.25rem; border-radius: 12px; display: flex; flex-direction: column; align-items: center; }
                .stat-pod .count { font-size: 1.25rem; font-weight: 800; color: #10B981; }
                .stat-pod .label { font-size: 0.65rem; font-weight: 800; text-transform: uppercase; color: #9CA3AF; letter-spacing: 0.05em; }

                .orders-timeline { display: grid; gap: 1.5rem; }
                .premium-order-card { background: white; border-radius: 1.5rem; border: 1px solid #F3F4F6; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); overflow: hidden; display: flex; }
                
                .card-side-status { width: 6px; flex-shrink: 0; }
                .card-side-status[data-status="pending"] { background: #FBBF24; }
                .card-side-status[data-status="confirmed"] { background: #3B82F6; }
                .card-side-status[data-status="out-for-delivery"] { background: #8B5CF6; }
                .card-side-status[data-status="delivered"] { background: #10B981; }

                .card-main-content { padding: 1.5rem; flex: 1; }
                
                .order-top-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.25rem; }
                .order-hash { font-family: monospace; font-weight: 800; color: #111827; font-size: 1.1rem; }
                .timestamp { display: flex; align-items: center; gap: 4px; color: #9CA3AF; font-size: 0.8rem; margin-top: 2px; }
                .price-tag { font-size: 1.5rem; font-weight: 800; color: #111827; }

                .customer-row { display: flex; align-items: center; gap: 1rem; padding: 1rem; background: #F9FAFB; border-radius: 1rem; margin-bottom: 1.5rem; }
                .cust-avatar { width: 40px; height: 40px; background: white; border: 1px solid #E5E7EB; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 800; color: #374151; }
                .cust-details { flex: 1; display: flex; flex-direction: column; }
                .cust-details .name { font-weight: 700; color: #111827; }
                .cust-details .address { font-size: 0.8rem; color: #6B7280; display: flex; align-items: center; gap: 4px; margin-top: 2px; }
                
                .status-badge { padding: 4px 12px; border-radius: 50px; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; }
                .status-badge[data-status="pending"] { background: #FFFBEB; color: #D97706; }
                .status-badge[data-status="confirmed"] { background: #EFF6FF; color: #2563EB; }
                .status-badge[data-status="out-for-delivery"] { background: #F5F3FF; color: #7C3AED; }
                .status-badge[data-status="delivered"] { background: #ECFDF5; color: #059669; }

                .items-list-summary { margin-bottom: 1.5rem; }
                .items-list-summary .section-title { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: #9CA3AF; letter-spacing: 0.05em; margin-bottom: 0.75rem; }
                .order-item-snippet { display: flex; align-items: center; gap: 8px; font-size: 0.95rem; color: #374151; padding: 0.25rem 0; }
                .order-item-snippet .dot { width: 4px; height: 4px; background: #E5E7EB; border-radius: 50%; }
                .order-item-snippet .qty { font-weight: 800; color: #6B7280; min-width: 25px; }
                .order-item-snippet .item-name { flex: 1; }
                .order-item-snippet .item-price { color: #9CA3AF; font-size: 0.85rem; }

                .card-footer-actions { border-top: 1px solid #F3F4F6; padding-top: 1.25rem; display: flex; justify-content: space-between; align-items: center; }
                .delivery-timer { display: flex; align-items: center; gap: 6px; font-size: 0.85rem; color: #F59E0B; font-weight: 600; }
                
                .btn-group { display: flex; gap: 0.75rem; }
                .btn-action { border: none; padding: 0.75rem 1.5rem; border-radius: 10px; font-weight: 800; cursor: pointer; transition: 0.2s; font-size: 0.9rem; }
                .btn-action.confirm { background: #2563EB; color: white; }
                .btn-action.confirm:hover { background: #1D4ED8; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.3); }
                .btn-action.dispatch { background: #7C3AED; color: white; }
                .btn-action.deliver { background: #059669; color: white; }
                
                .completion-tag { display: flex; align-items: center; gap: 6px; color: #059669; font-weight: 800; font-size: 0.9rem; }

                .loading-state { display: flex; justify-content: center; align-items: center; min-height: 400px; color: #6B7280; font-weight: 700; }
                .empty-orders-canvas { text-align: center; padding: 6rem 2rem; background: white; border-radius: 1.5rem; border: 1px solid #F3F4F6; }
                .icon-ring { width: 80px; height: 80px; background: #F9FAFB; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem; color: #D1D5DB; }
                .empty-orders-canvas h3 { font-size: 1.5rem; color: #111827; margin: 0; }
                .empty-orders-canvas p { color: #6B7280; margin-top: 0.5rem; }

                @media (max-width: 640px) {
                    .card-footer-actions { flex-direction: column; gap: 1rem; align-items: flex-start; }
                    .btn-group, .btn-action { width: 100%; }
                }
            `}</style>
        </div>
    );
}
