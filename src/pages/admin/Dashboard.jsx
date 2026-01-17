import React, { useEffect, useState } from 'react';
import { DollarSign, ShoppingBag, Users, Store, TrendingUp } from 'lucide-react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
    const [stats, setStats] = useState({ totalRevenue: 0, activeOrders: 0, totalVendors: 0, totalUsers: 0 });
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, vendorsRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/admin/stats'),
                    axios.get('http://localhost:5000/api/vendors')
                ]);
                setStats(statsRes.data);
                setVendors(vendorsRes.data.slice(0, 5)); // Only show top 5 on dashboard
            } catch (err) {
                console.error("Admin dashboard fetch error", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="loading-container">Syncing platform metrics...</div>;

    return (
        <div className="admin-dashboard">
            <header className="dashboard-header">
                <div>
                    <h1>E-Commerce Control Center</h1>
                    <p>Site-wide performance and partner management</p>
                </div>
                <div className="current-date">
                    {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
            </header>

            <div className="stats-grid">
                <StatCard title="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString('en-IN')}`} icon={<DollarSign size={24} />} color="emerald" trend="+12.5%" />
                <StatCard title="Active Orders" value={stats.activeOrders} icon={<ShoppingBag size={24} />} color="blue" trend="+5.2%" />
                <StatCard title="Total Vendors" value={stats.totalVendors} icon={<Store size={24} />} color="indigo" />
                <StatCard title="Total Users" value={stats.totalUsers} icon={<Users size={24} />} color="amber" />
            </div>

            <div className="dashboard-grid">
                <div className="recent-section main-card">
                    <div className="card-header">
                        <h3>Partnership Overview</h3>
                        <Link to="/admin/vendors" className="view-all-btn">Manage All Vendors</Link>
                    </div>
                    <div className="table-responsive">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>Store Identity</th>
                                    <th>Ownership</th>
                                    <th>Contact</th>
                                    <th>Location</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vendors.length === 0 ? (
                                    <tr><td colSpan="5" className="empty-msg">No vendors registered yet.</td></tr>
                                ) : (
                                    vendors.map(vendor => (
                                        <tr key={vendor.id}>
                                            <td className="store-name-cell">
                                                <div className="store-avatar">{vendor.name[0]}</div>
                                                <span>{vendor.name}</span>
                                            </td>
                                            <td>{vendor.owner}</td>
                                            <td>{vendor.phone}</td>
                                            <td>{vendor.location?.address?.split(',')[0]}</td>
                                            <td><span className="badge-active">Online</span></td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <style>{`
                .admin-dashboard { padding: 0.5rem; }
                .dashboard-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2.5rem; }
                .dashboard-header h1 { font-size: 2rem; color: #111827; margin: 0; letter-spacing: -0.02em; font-weight: 800; }
                .dashboard-header p { color: #6B7280; margin: 0.25rem 0 0 0; font-size: 1rem; }
                .current-date { color: #64748B; font-size: 0.9rem; font-weight: 600; background: white; padding: 0.5rem 1rem; border-radius: 10px; border: 1px solid #E2E8F0; }

                .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; margin-bottom: 2.5rem; }
                .stat-card { background: white; padding: 1.5rem; border-radius: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #F1F5F9; transition: 0.2s; }
                .stat-card:hover { transform: translateY(-3px); box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); }
                .stat-card-header { display: flex; justify-content: space-between; margin-bottom: 1rem; }
                .stat-icon-box { width: 48px; height: 48px; border-radius: 14px; display: flex; align-items: center; justify-content: center; }
                .stat-trend { font-size: 0.75rem; font-weight: 700; color: #10B981; background: #ECFDF5; padding: 4px 10px; border-radius: 50px; height: fit-content; }
                
                .stat-info h4 { font-size: 0.85rem; color: #64748B; font-weight: 700; margin: 0; text-transform: uppercase; letter-spacing: 0.025em; }
                .stat-info .val { font-size: 1.85rem; font-weight: 850; color: #0F172A; margin-top: 0.5rem; display: block; letter-spacing: -0.02em; }

                .emerald { background: #ECFDF5; color: #10B981; }
                .blue { background: #EFF6FF; color: #3B82F6; }
                .indigo { background: #EEF2FF; color: #6366F1; }
                .amber { background: #FFFBEB; color: #F59E0B; }

                .main-card { background: white; border-radius: 1.5rem; border: 1px solid #F1F5F9; box-shadow: 0 1px 3px rgba(0,0,0,0.05); overflow: hidden; }
                .card-header { padding: 1.75rem 2rem; border-bottom: 1px solid #F1F5F9; display: flex; justify-content: space-between; align-items: center; }
                .card-header h3 { font-size: 1.25rem; color: #0F172A; margin: 0; font-weight: 800; }
                .view-all-btn { background: #F8FAFC; border: 1px solid #E2E8F0; padding: 0.6rem 1.25rem; border-radius: 10px; font-size: 0.85rem; font-weight: 700; cursor: pointer; color: #475569; text-decoration: none; transition: 0.2s; }
                .view-all-btn:hover { background: #F1F5F9; color: #0F172A; border-color: #CBD5E1; }

                .admin-table { width: 100%; border-collapse: collapse; }
                .admin-table th { text-align: left; padding: 1rem 2rem; background: #F8FAFC; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: #64748B; font-weight: 800; }
                .admin-table td { padding: 1.25rem 2rem; border-bottom: 1px solid #F1F5F9; font-size: 0.95rem; color: #334155; }
                
                .store-name-cell { display: flex; align-items: center; gap: 1rem; font-weight: 700; color: #0F172A; }
                .store-avatar { width: 36px; height: 36px; border-radius: 10px; background: #F1F5F9; color: #6366F1; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; font-weight: 800; }
                
                .badge-active { background: #DCFCE7; color: #166534; padding: 4px 12px; border-radius: 50px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; }

                .loading-container { display: flex; justify-content: center; align-items: center; min-height: 400px; color: #64748B; font-weight: 700; font-size: 1.1rem; }
                .empty-msg { text-align: center; padding: 3rem !important; color: #94A3B8; font-style: italic; }

                @media (max-width: 1024px) {
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
