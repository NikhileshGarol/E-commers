import React, { useEffect, useState } from 'react';
import { DollarSign, ShoppingBag, Package, TrendingUp, Clock, Calendar } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { API_CONFIG } from '../../Api';

export default function VendorDashboard() {
    const [stats, setStats] = useState({ totalEarnings: 0, totalOrders: 0, totalProducts: 0, growth: '+10%' });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, ordersRes] = await Promise.all([
                    axios.get(`${API_CONFIG.BASE_URL}/api/vendor-stats`),
                    axios.get(`${API_CONFIG.BASE_URL}/api/vendor/orders`)
                ]);
                setStats(statsRes.data);
                setRecentOrders(ordersRes.data.slice(0, 5));
            } catch (err) {
                console.error("Dashboard fetch error", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="loading-container">Synchronizing your store data...</div>;

    return (
        <div className="vendor-dashboard">
            <header className="dashboard-header">
                <div>
                    <h1>Partner Overview</h1>
                    <p>Track your store performance and real-time orders</p>
                </div>
                <div className="dashboard-actions">
                    <button className="btn-secondary"><Calendar size={18} /> Performance Log</button>
                    <Link to="/vendor/add-product" className="btn-primary">Add New Product</Link>
                </div>
            </header>

            <div className="stats-grid">
                <StatCard title="Total Earnings" value={`₹${stats.totalEarnings.toLocaleString('en-IN')}`} icon={<DollarSign size={24} />} color="emerald" trend="+8.4%" />
                <StatCard title="Total Orders" value={stats.totalOrders} icon={<ShoppingBag size={24} />} color="blue" trend="+12.5%" />
                <StatCard title="Active Inventory" value={stats.totalProducts} icon={<Package size={24} />} color="indigo" />
                <StatCard title="Revenue Growth" value={stats.growth} icon={<TrendingUp size={24} />} color="amber" trend="+2.1%" />
            </div>

            <div className="dashboard-content-grid">
                <div className="recent-orders-card main-card">
                    <div className="card-header">
                        <h3>Recent Orders</h3>
                        <Link to="/vendor/orders" className="view-all-link">Manage All Orders</Link>
                    </div>
                    <div className="table-wrapper">
                        <table className="dashboard-table">
                            <thead>
                                <tr>
                                    <th>Ref ID</th>
                                    <th>Customer</th>
                                    <th>Settlement</th>
                                    <th>Fulfillment</th>
                                    <th>Received</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.length === 0 ? (
                                    <tr><td colSpan="5" className="empty-table">Your store is ready! Awaiting first order.</td></tr>
                                ) : (
                                    recentOrders.map(order => (
                                        <tr key={order._id}>
                                            <td className="order-id-cell">
                                                <div className="order-icon-box"><ShoppingBag size={14} /></div>
                                                <span>#{order._id.slice(-6).toUpperCase()}</span>
                                            </td>
                                            <td>
                                                <div className="cust-info">
                                                    <span className="cust-name">{order.userId?.name || 'Customer'}</span>
                                                    <span className="cust-phone">{order.userId?.phone}</span>
                                                </div>
                                            </td>
                                            <td className="amount-cell">₹{order.totalAmount}</td>
                                            <td><span className={`status-pill ${order.status.toLowerCase().replace(/\s+/g, '-')}`}>{order.status}</span></td>
                                            <td>
                                                <div className="time-cell">
                                                    <Clock size={12} /> {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="performance-summary card-sidebar">
                    <div className="main-card">
                        <div className="card-header"><h3>Store Vitals</h3></div>
                        <div className="card-body">
                            <div className="perf-item">
                                <div className="info-row">
                                    <span className="label">Fulfillment Rate</span>
                                    <span className="val">92%</span>
                                </div>
                                <div className="progress-bar"><div className="fill" style={{ width: '92%' }}></div></div>
                            </div>
                            <div className="perf-item">
                                <div className="info-row">
                                    <span className="label">Customer Rating</span>
                                    <span className="val">4.2/5</span>
                                </div>
                                <div className="stars">⭐⭐⭐⭐☆</div>
                            </div>
                        </div>
                        <div className="sidebar-footer-action">
                            <Link to="/vendor/profile" className="btn-full-width">Update Store Profile</Link>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .vendor-dashboard { padding: 0.5rem; }
                .dashboard-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2.5rem; }
                .dashboard-header h1 { font-size: 2rem; color: #0F172A; margin: 0; font-weight: 850; letter-spacing: -0.02em; }
                .dashboard-header p { color: #64748B; margin: 0.25rem 0 0 0; font-size: 1rem; }
                .dashboard-actions { display: flex; gap: 1rem; }
                
                .btn-primary { background: #10B981; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 12px; font-weight: 700; cursor: pointer; text-decoration: none; transition: 0.2s; box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.2); }
                .btn-primary:hover { background: #059669; transform: translateY(-2px); }
                .btn-secondary { background: white; color: #334155; border: 1px solid #E2E8F0; padding: 0.75rem 1.5rem; border-radius: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: 0.2s; }
                .btn-secondary:hover { background: #F8FAFC; border-color: #CBD5E1; }

                .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; margin-bottom: 2.5rem; }
                .stat-card { background: white; padding: 1.5rem; border-radius: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05); border: 1px solid #F1F5F9; transition: 0.2s; }
                .stat-card:hover { transform: translateY(-3px); }
                .stat-card-header { display: flex; justify-content: space-between; margin-bottom: 1rem; }
                .stat-icon-box { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; }
                .stat-trend { font-size: 0.75rem; font-weight: 800; color: #10B981; background: #ECFDF5; padding: 4px 10px; border-radius: 50px; }
                .stat-info h4 { font-size: 0.85rem; color: #64748B; font-weight: 700; margin: 0; text-transform: uppercase; letter-spacing: 0.025em; }
                .stat-info .val { font-size: 1.85rem; font-weight: 850; color: #0F172A; margin-top: 0.5rem; display: block; letter-spacing: -0.02em; }

                .emerald { background: #ECFDF5; color: #10B981; }
                .blue { background: #EFF6FF; color: #3B82F6; }
                .indigo { background: #EEF2FF; color: #6366F1; }
                .amber { background: #FFFBEB; color: #F59E0B; }

                .dashboard-content-grid { display: grid; grid-template-columns: 1fr 320px; gap: 1.5rem; }
                .main-card { background: white; border-radius: 1.5rem; border: 1px solid #F1F5F9; box-shadow: 0 1px 3px rgba(0,0,0,0.05); overflow: hidden; display: flex; flex-direction: column; }
                .card-header { padding: 1.5rem 2rem; border-bottom: 1px solid #F1F5F9; display: flex; justify-content: space-between; align-items: center; }
                .card-header h3 { font-size: 1.15rem; color: #0F172A; margin: 0; font-weight: 800; }
                .view-all-link { color: #10B981; font-weight: 800; text-decoration: none; font-size: 0.9rem; transition: 0.2s; }
                .view-all-link:hover { text-decoration: underline; }

                .dashboard-table { width: 100%; border-collapse: collapse; }
                .dashboard-table th { text-align: left; padding: 1rem 2rem; background: #F8FAFC; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: #64748B; font-weight: 800; }
                .dashboard-table td { padding: 1.1rem 2rem; border-bottom: 1px solid #F1F5F9; font-size: 0.95rem; }
                
                .order-id-cell { display: flex; align-items: center; gap: 0.75rem; font-weight: 800; color: #0F172A; font-family: monospace; }
                .order-icon-box { background: #F8FAFC; padding: 6px; border-radius: 10px; color: #64748B; border: 1px solid #E2E8F0; }
                
                .cust-info { display: flex; flex-direction: column; }
                .cust-name { font-weight: 700; color: #334155; }
                .cust-phone { font-size: 0.75rem; color: #94A3B8; }
                .amount-cell { font-weight: 850; color: #0F172A; font-size: 1rem; }

                .status-pill { padding: 4px 12px; border-radius: 50px; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; }
                .status-pill.pending { background: #FEF3C7; color: #D97706; }
                .status-pill.confirmed { background: #DBEAFE; color: #2563EB; }
                .status-pill.delivered { background: #DCFCE7; color: #16A34A; }
                .status-pill.out-for-delivery { background: #E0E7FF; color: #4338CA; }

                .time-cell { display: flex; align-items: center; gap: 6px; color: #94A3B8; font-size: 0.85rem; font-weight: 600; }
                .empty-table { text-align: center; padding: 4rem !important; color: #94A3B8; font-style: italic; }

                .card-body { padding: 2rem; flex: 1; }
                .perf-item { margin-bottom: 2rem; }
                .perf-item .info-row { display: flex; justify-content: space-between; margin-bottom: 0.75rem; }
                .perf-item .label { font-size: 0.85rem; font-weight: 700; color: #64748B; }
                .progress-bar { height: 10px; background: #F1F5F9; border-radius: 6px; overflow: hidden; }
                .progress-bar .fill { height: 100%; background: #10B981; border-radius: 6px; }
                .perf-item .val { font-weight: 800; font-size: 0.95rem; color: #0F172A; }
                .stars { color: #F59E0B; letter-spacing: 2px; margin-top: 0.5rem; }

                .sidebar-footer-action { padding: 0 2rem 2rem 2rem; }
                .btn-full-width { display: block; width: 100%; text-align: center; padding: 0.85rem; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; color: #475569; font-weight: 700; text-decoration: none; font-size: 0.9rem; transition: 0.2s; }
                .btn-full-width:hover { background: #F1F5F9; color: #0F172A; }

                .loading-container { display: flex; justify-content: center; align-items: center; min-height: 400px; color: #64748B; font-weight: 800; font-size: 1.1rem; }

                @media (max-width: 1280px) {
                    .dashboard-content-grid { grid-template-columns: 1fr; }
                    .stats-grid { grid-template-columns: repeat(2, 1fr); }
                }
            `}</style>
        </div>
    );
}

function StatCard({ title, value, icon, color, trend }) {
    return (
        <div className="stat-card">
            <div className="stat-card-header">
                <div className={`stat-icon-box ${color}`}>{icon}</div>
                {trend && <div className="stat-trend">{trend}</div>}
            </div>
            <div className="stat-info">
                <h4>{title}</h4>
                <span className="val">{value}</span>
            </div>
        </div>
    );
}
