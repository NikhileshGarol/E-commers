import React, { useEffect, useState } from 'react';
import { Shield, LayoutDashboard, Users, Store, LogOut, ChevronRight, Menu, Bell } from 'lucide-react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import axios from 'axios';

export default function AdminLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const logout = useAuthStore(state => state.logout);
    const user = useAuthStore(state => state.user);
    const [stats, setStats] = useState({ activeOrders: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/admin/stats');
                setStats(res.data);
            } catch (err) {
                console.error("Admin Layout stats error", err);
            }
        };
        fetchStats();
    }, [location.pathname]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <div className="admin-layout-wrapper">
            <aside className="premium-sidebar">
                <div className="sidebar-brand">
                    <div className="brand-circle">
                        <Shield size={24} />
                    </div>
                    <div className="brand-text">
                        <h3>Kirana<span>Admin</span></h3>
                        <span className="version">v2.4.0 High Precision</span>
                    </div>
                </div>

                <div className="sidebar-scroll-container">
                    <div className="sidebar-divider">MANAGEMENT</div>

                    <nav className="nav-menu">
                        <Link to="/admin" className={`nav-link ${isActive('/admin') ? 'active' : ''}`}>
                            <div className="icon-wrap"><LayoutDashboard size={20} /></div>
                            <span>Overview</span>
                            {isActive('/admin') && <ChevronRight size={14} className="active-chevron" />}
                        </Link>
                        <Link to="/admin/vendors" className={`nav-link ${isActive('/admin/vendors') ? 'active' : ''}`}>
                            <div className="icon-wrap"><Store size={20} /></div>
                            <span>Vendor Directory</span>
                            {isActive('/admin/vendors') && <ChevronRight size={14} className="active-chevron" />}
                        </Link>
                        <Link to="/admin/users" className={`nav-link ${isActive('/admin/users') ? 'active' : ''}`}>
                            <div className="icon-wrap"><Users size={20} /></div>
                            <span>User Access</span>
                            {isActive('/admin/users') && <ChevronRight size={14} className="active-chevron" />}
                        </Link>
                    </nav>

                    <div className="sidebar-divider">MONITORING</div>
                    <nav className="nav-menu">
                        <div className="nav-link">
                            <div className="icon-wrap"><Bell size={20} /></div>
                            <span>System Alerts</span>
                            {stats.activeOrders > 0 && <div className="nav-pill">{stats.activeOrders} Active</div>}
                        </div>
                    </nav>
                </div>

                <div className="sidebar-user-card">
                    <div className="u-avatar">A</div>
                    <div className="u-info">
                        <span className="u-name">{user?.name || 'Administrator'}</span>
                        <span className="u-role">Root Admin</span>
                    </div>
                    <button onClick={handleLogout} className="btn-logout-mini" title="Secure Logout">
                        <LogOut size={16} />
                    </button>
                </div>
            </aside>

            <div className="admin-main">
                <header className="top-navbar">
                    <button className="mobile-menu-btn"><Menu size={20} /></button>
                    <div className="search-placeholder">
                        <kbd>⌘</kbd> <kbd>K</kbd> to search everything...
                    </div>
                    <div className="top-actions">
                        <div className="notification-bell">
                            <div className="ping"></div>
                            <Shield size={20} />
                        </div>
                    </div>
                </header>

                <div className="page-scroll-area">
                    <Outlet />
                </div>
            </div>

            <style>{`
                .admin-layout-wrapper { display: flex; height: 100vh; background: #F8FAFC; overflow: hidden; }
                
                .premium-sidebar { width: 280px; background: #0F172A; color: white; display: flex; flex-direction: column; padding: 2rem 1.5rem; flex-shrink: 0; }
                
                .sidebar-brand { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; flex-shrink: 0; }
                .brand-circle { width: 44px; height: 44px; background: linear-gradient(135deg, #10B981 0%, #059669 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3); }
                .brand-text h3 { margin: 0; font-size: 1.25rem; font-weight: 800; letter-spacing: -0.02em; }
                .brand-text h3 span { color: #10B981; }
                .brand-text .version { font-size: 0.65rem; color: #64748B; font-weight: 700; text-transform: uppercase; margin-top: 2px; display: block; }

                .sidebar-scroll-container { flex: 1; overflow-y: auto; padding-right: 4px; margin-bottom: 1rem; scrollbar-width: thin; scrollbar-color: #1E293B transparent; }
                .sidebar-scroll-container::-webkit-scrollbar { width: 4px; }
                .sidebar-scroll-container::-webkit-scrollbar-thumb { background: #1E293B; border-radius: 10px; }

                .sidebar-divider { font-size: 0.7rem; font-weight: 800; color: #475569; letter-spacing: 0.1em; margin-bottom: 1rem; margin-top: 1.5rem; padding-left: 0.5rem; }

                .nav-menu { display: flex; flex-direction: column; gap: 0.5rem; }
                .nav-link { display: flex; align-items: center; gap: 1rem; padding: 0.85rem 1rem; color: #94A3B8; text-decoration: none; border-radius: 12px; transition: 0.2s; font-weight: 600; font-size: 0.95rem; }
                .nav-link:hover { background: rgba(255,255,255,0.05); color: white; }
                .nav-link.active { background: #1E293B; color: white; border: 1px solid rgba(255,255,255,0.1); }
                .nav-link .icon-wrap { color: #475569; transition: 0.2s; }
                .nav-link.active .icon-wrap { color: #10B981; }
                .active-chevron { margin-left: auto; color: #10B981; }
                
                .nav-pill { margin-left: auto; background: #3B82F6; color: white; font-size: 0.65rem; padding: 2px 8px; border-radius: 20px; font-weight: 800; box-shadow: 0 0 10px rgba(59, 130, 246, 0.4); }

                .sidebar-user-card { margin-top: auto; background: #1E293B; padding: 1rem; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05); display: flex; align-items: center; gap: 0.75rem; flex-shrink: 0; }
                .u-avatar { width: 36px; height: 36px; background: #10B981; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.9rem; }
                .u-info { flex: 1; display: flex; flex-direction: column; min-width: 0; }
                .u-name { font-size: 0.850rem; font-weight: 700; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
                .u-role { font-size: 0.7rem; color: #64748B; font-weight: 600; }
                .btn-logout-mini { background: none; border: none; color: #64748B; cursor: pointer; padding: 6px; border-radius: 6px; transition: 0.2s; }
                .btn-logout-mini:hover { color: #EF4444; background: rgba(239, 68, 68, 0.1); }

                .admin-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
                .top-navbar { height: 72px; background: white; border-bottom: 1px solid #F1F5F9; display: flex; align-items: center; justify-content: space-between; padding: 0 2rem; flex-shrink: 0; }
                .mobile-menu-btn { display: none; }
                .search-placeholder { color: #94A3B8; font-size: 0.9rem; background: #F1F5F9; padding: 0.5rem 1rem; border-radius: 10px; display: flex; align-items: center; gap: 4px; }
                .search-placeholder kbd { background: white; border: 1px solid #E2E8F0; padding: 0 4px; border-radius: 4px; font-size: 0.7rem; color: #64748B; font-weight: 700; }

                .notification-bell { position: relative; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: #F8FAFC; border-radius: 12px; color: #64748B; cursor: pointer; }
                .notification-bell .ping { position: absolute; top: 10px; right: 10px; width: 8px; height: 8px; background: #10B981; border-radius: 50%; border: 2px solid white; }

                .page-scroll-area { flex: 1; overflow-y: auto; padding: 1.5rem; }
                
                @media (max-width: 1024px) {
                    .premium-sidebar { display: none; }
                    .mobile-menu-btn { display: block; background: none; border: none; color: #64748B; }
                }
            `}</style>
        </div>
    );
}
