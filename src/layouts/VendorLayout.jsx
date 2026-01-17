import React, { useEffect, useState } from 'react';
import { LayoutDashboard, Package, FolderPlus, LogOut, Store, ClipboardList, User, ChevronRight, Bell, Menu } from 'lucide-react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import axios from 'axios';

export default function VendorLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const logout = useAuthStore(state => state.logout);
    const user = useAuthStore(state => state.user);
    const [newOrdersCount, setNewOrdersCount] = useState(0);

    useEffect(() => {
        const fetchOrderCount = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/vendor/orders');
                const pending = res.data.filter(o => o.status === 'Pending').length;
                setNewOrdersCount(pending);
            } catch (err) {
                console.error("Layout fetch error", err);
            }
        };
        if (user) fetchOrderCount();
    }, [user, location.pathname]); // Re-check when navigating

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <div className="layout-wrapper">
            <aside className="premium-sidebar">
                <div className="sidebar-brand">
                    <div className="brand-circle">
                        <Store size={22} />
                    </div>
                    <div className="brand-text">
                        <h3>Partner<span>Hub</span></h3>
                        <span className="version">Verified Merchant</span>
                    </div>
                </div>

                <div className="sidebar-scroll-container">
                    <div className="sidebar-divider">OPERATIONS</div>
                    <nav className="nav-menu">
                        <Link to="/vendor" className={`nav-link ${isActive('/vendor') ? 'active' : ''}`}>
                            <div className="icon-wrap"><LayoutDashboard size={20} /></div>
                            <span>Dashboard</span>
                            {isActive('/vendor') && <ChevronRight size={14} className="active-chevron" />}
                        </Link>
                        <Link to="/vendor/orders" className={`nav-link ${isActive('/vendor/orders') ? 'active' : ''}`}>
                            <div className="icon-wrap"><ClipboardList size={20} /></div>
                            <span>Order Portal</span>
                            {newOrdersCount > 0 && <div className="nav-pill">{newOrdersCount} New</div>}
                        </Link>
                    </nav>

                    <div className="sidebar-divider">INVENTORY</div>
                    <nav className="nav-menu">
                        <Link to="/vendor/products" className={`nav-link ${isActive('/vendor/products') ? 'active' : ''}`}>
                            <div className="icon-wrap"><Package size={20} /></div>
                            <span>My Products</span>
                        </Link>
                        <Link to="/vendor/add-product" className={`nav-link ${isActive('/vendor/add-product') ? 'active' : ''}`}>
                            <div className="icon-wrap"><FolderPlus size={20} /></div>
                            <span>Add Listing</span>
                        </Link>
                    </nav>

                    <div className="sidebar-divider">ACCOUNT</div>
                    <nav className="nav-menu">
                        <Link to="/vendor/profile" className={`nav-link ${isActive('/vendor/profile') ? 'active' : ''}`}>
                            <div className="icon-wrap"><User size={20} /></div>
                            <span>Store Details</span>
                        </Link>
                    </nav>

                    {/* Placeholder for more links to demonstrate scroll */}
                    <div style={{ height: '20px' }}></div>
                </div>

                <div className="sidebar-user-card">
                    <div className="u-avatar">{user?.name?.[0] || 'V'}</div>
                    <div className="u-info">
                        <span className="u-name">{user?.store_name || user?.name || 'Partner'}</span>
                        <span className="u-role">Merchant Partner</span>
                    </div>
                    <button onClick={handleLogout} className="btn-logout-mini" title="Secure Logout">
                        <LogOut size={16} />
                    </button>
                </div>
            </aside>

            <div className="main-content-canvas">
                <header className="top-navbar">
                    <button className="mobile-menu-btn"><Menu size={20} /></button>
                    <div className="status-badge-live">
                        <div className="ping"></div>
                        <span>Store is <strong>Online</strong></span>
                    </div>
                    <div className="top-actions">
                        <div className="notification-bell">
                            <Bell size={20} />
                            <div className="ping-small"></div>
                        </div>
                    </div>
                </header>

                <div className="page-scroll-area">
                    <Outlet />
                </div>
            </div>

            <style>{`
                .layout-wrapper { display: flex; height: 100vh; background: #F8FAFC; overflow: hidden; }
                
                .premium-sidebar { width: 280px; background: #0F172A; color: white; display: flex; flex-direction: column; padding: 2rem 1.5rem; flex-shrink: 0; }
                
                .sidebar-brand { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; flex-shrink: 0; }
                .brand-circle { width: 44px; height: 44px; background: linear-gradient(135deg, #10B981 0%, #059669 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3); }
                .brand-text h3 { margin: 0; font-size: 1.25rem; font-weight: 800; letter-spacing: -0.02em; }
                .brand-text h3 span { color: #10B981; }
                .brand-text span { font-size: 0.65rem; color: #64748B; font-weight: 700; text-transform: uppercase; margin-top: 2px; display: block; }

                .sidebar-scroll-container { flex: 1; overflow-y: auto; padding-right: 4px; margin-bottom: 1rem; scrollbar-width: thin; scrollbar-color: #1E293B transparent; }
                .sidebar-scroll-container::-webkit-scrollbar { width: 4px; }
                .sidebar-scroll-container::-webkit-scrollbar-thumb { background: #1E293B; border-radius: 10px; }

                .sidebar-divider { font-size: 0.7rem; font-weight: 800; color: #475569; letter-spacing: 0.1em; margin-bottom: 1rem; margin-top: 1.5rem; padding-left: 0.5rem; }

                .nav-menu { display: flex; flex-direction: column; gap: 0.5rem; }
                .nav-link { display: flex; align-items: center; gap: 1rem; padding: 0.85rem 1rem; color: #94A3B8; text-decoration: none; border-radius: 12px; transition: 0.2s; font-weight: 600; font-size: 0.95rem; }
                .nav-link:hover { background: rgba(255,255,255,0.05); color: white; }
                .nav-link.active { background: #1E293B; color: white; border: 1px solid rgba(255,255,255,0.05); }
                .nav-link .icon-wrap { color: #475569; transition: 0.2s; }
                .nav-link.active .icon-wrap { color: #10B981; }
                .active-chevron { margin-left: auto; color: #10B981; }
                
                .nav-pill { margin-left: auto; background: #10B981; color: white; font-size: 0.65rem; padding: 2px 8px; border-radius: 20px; font-weight: 800; }

                .sidebar-user-card { margin-top: auto; background: #1E293B; padding: 1rem; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05); display: flex; align-items: center; gap: 0.75rem; flex-shrink: 0; }
                .u-avatar { width: 36px; height: 36px; background: #10B981; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.9rem; }
                .u-info { flex: 1; display: flex; flex-direction: column; min-width: 0; }
                .u-name { font-size: 0.850rem; font-weight: 700; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
                .u-role { font-size: 0.7rem; color: #64748B; font-weight: 600; }
                .btn-logout-mini { background: none; border: none; color: #64748B; cursor: pointer; padding: 6px; border-radius: 6px; transition: 0.2s; }
                .btn-logout-mini:hover { color: #EF4444; background: rgba(239, 68, 68, 0.1); }

                .main-content-canvas { flex: 1; display: flex; flex-direction: column; min-width: 0; }
                .top-navbar { height: 72px; background: white; border-bottom: 1px solid #F1F5F9; display: flex; align-items: center; justify-content: space-between; padding: 0 2rem; flex-shrink: 0; }
                .mobile-menu-btn { display: none; }
                
                .status-badge-live { display: flex; align-items: center; gap: 8px; background: #F0FDF4; border: 1px solid #DCFCE7; padding: 0.5rem 1rem; border-radius: 12px; font-size: 0.85rem; color: #166534; }
                .status-badge-live .ping { width: 8px; height: 8px; background: #10B981; border-radius: 50%; position: relative; }
                .status-badge-live .ping::after { content: ''; position: absolute; inset: 0; background: #10B981; border-radius: 50%; animation: pulse 2s infinite; }
                @keyframes pulse { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(3); opacity: 0; } }

                .notification-bell { position: relative; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: #F8FAFC; border-radius: 12px; color: #64748B; cursor: pointer; }
                .ping-small { position: absolute; top: 10px; right: 10px; width: 7px; height: 7px; background: #EF4444; border-radius: 50%; border: 2px solid white; }

                .page-scroll-area { flex: 1; overflow-y: auto; padding: 1.5rem; }
                
                @media (max-width: 1024px) {
                    .premium-sidebar { display: none; }
                    .mobile-menu-btn { display: block; background: none; border: none; color: #64748B; }
                }
            `}</style>
        </div>
    );
}
