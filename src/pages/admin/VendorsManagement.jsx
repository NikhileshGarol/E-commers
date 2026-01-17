import React, { useEffect, useState } from 'react';
import { Store, Star, MapPin, Trash2, Phone, User as UserIcon, Edit2, Plus, X, Search, Navigation } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function VendorsManagement() {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVendor, setEditingVendor] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        name: '', store_name: '', phone: '', password: '',
        location: { address: '', lat: 12.97, lng: 77.59 }
    });

    const fetchVendors = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/vendors');
            setVendors(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load vendors");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVendors();
    }, []);

    const filteredVendors = vendors.filter(v =>
        (v.store_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (v.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (v.phone.includes(searchTerm))
    );

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to remove this vendor store?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/admin/users/${id}`);
            toast.success("Vendor removed");
            setVendors(vendors.filter(v => v._id !== id));
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    const handleEdit = (vendor) => {
        setEditingVendor(vendor);
        setFormData({
            name: vendor.name,
            store_name: vendor.store_name || '',
            phone: vendor.phone,
            password: '',
            location: vendor.location || { address: '', lat: 12.97, lng: 77.59 }
        });
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setEditingVendor(null);
        setFormData({
            name: '', store_name: '', phone: '', password: '',
            location: { address: '', lat: 12.97, lng: 77.59 }
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingVendor) {
                const dataToSend = { ...formData };
                if (!dataToSend.password) delete dataToSend.password;
                await axios.put(`http://localhost:5000/api/admin/users/${editingVendor._id}`, dataToSend);
                toast.success("Vendor profile updated");
            } else {
                await axios.post('http://localhost:5000/api/admin/users', { ...formData, role: 'vendor' });
                toast.success("New vendor onboarded");
            }
            setIsModalOpen(false);
            fetchVendors();
        } catch (err) {
            toast.error(err.response?.data?.message || "Operation failed");
        }
    };

    if (loading) return <div className="loading-state">Refreshing vendor partnerships...</div>;

    return (
        <div className="admin-manage-vendors">
            <header className="page-header">
                <div className="title-area">
                    <h1>Vendor Partnerships</h1>
                    <p>Onboard and manage local shopkeepers and store inventory.</p>
                </div>
                <div className="header-actions">
                    <div className="search-box">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Store name, owner or mobile..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn-onboard" onClick={handleAdd}>
                        <Plus size={18} /> Onboard Vendor
                    </button>
                </div>
            </header>

            <div className="vendors-grid">
                {filteredVendors.length === 0 ? (
                    <div className="empty-state">No vendors found matching your criteria.</div>
                ) : (
                    filteredVendors.map(vendor => (
                        <div key={vendor._id} className="premium-vendor-card">
                            <div className="card-top">
                                <div className="store-identity">
                                    <div className="store-icon-box">
                                        <Store size={24} />
                                    </div>
                                    <div className="info">
                                        <h3>{vendor.store_name || 'Unofficial Store'}</h3>
                                        <div className="rating-pill">
                                            <Star size={12} fill="currentColor" /> {vendor.store_rating || '5.0'}
                                        </div>
                                    </div>
                                </div>
                                <div className="card-actions">
                                    <button onClick={() => handleEdit(vendor)} className="icon-btn edit"><Edit2 size={16} /></button>
                                    <button onClick={() => handleDelete(vendor._id)} className="icon-btn delete"><Trash2 size={16} /></button>
                                </div>
                            </div>

                            <div className="card-body">
                                <div className="detail-row">
                                    <UserIcon size={14} />
                                    <span>Owner: <strong>{vendor.name}</strong></span>
                                </div>
                                <div className="detail-row">
                                    <Phone size={14} />
                                    <span>Mobile: <strong>{vendor.phone}</strong></span>
                                </div>
                                <div className="detail-row location">
                                    <MapPin size={14} />
                                    <span className="address-text">{vendor.location?.address || 'Location Hidden'}</span>
                                </div>
                            </div>

                            <div className="card-footer">
                                <div className="status-indicator">
                                    <span className="dot"></span> Active Partner
                                </div>
                                <button className="btn-inventory">View Inventory</button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-card animate-slide-up">
                        <div className="modal-header">
                            <div>
                                <h3>{editingVendor ? 'Refine Store Profile' : 'Onboard New Partner'}</h3>
                                <p>Provide accurate shop information for listing.</p>
                            </div>
                            <button className="close-btn" onClick={() => setIsModalOpen(false)}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Official Store Name</label>
                                    <div className="input-wrapper">
                                        <Store className="icon" size={18} />
                                        <input required type="text" placeholder="e.g. Agarwal Sweets" value={formData.store_name} onChange={e => setFormData({ ...formData, store_name: e.target.value })} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Owner Name</label>
                                    <div className="input-wrapper">
                                        <UserIcon className="icon" size={18} />
                                        <input required type="text" placeholder="Owner Full Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Business Phone</label>
                                    <div className="input-wrapper">
                                        <Phone className="icon" size={18} />
                                        <input required type="tel" placeholder="Mobile Number" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Store Password {editingVendor && <span className="helper">(Empty to keep)</span>}</label>
                                    <input required={!editingVendor} type="password" placeholder="••••••••" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                                </div>
                            </div>
                            <div className="form-group full">
                                <label>Store Primary Address</label>
                                <div className="input-wrapper">
                                    <MapPin className="icon" size={18} />
                                    <input required type="text" placeholder="Street, Area, City" value={formData.location.address} onChange={e => setFormData({ ...formData, location: { ...formData.location, address: e.target.value } })} />
                                </div>
                            </div>
                            <div className="form-actions">
                                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Discard</button>
                                <button type="submit" className="btn-submit">{editingVendor ? 'Update Store' : 'Onboard Store'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                .admin-manage-vendors { padding: 1.5rem; max-width: 1200px; margin: 0 auto; }
                .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2.5rem; }
                .page-header h1 { font-size: 1.75rem; color: #111827; margin: 0; }
                .page-header p { color: #6B7280; font-size: 0.95rem; margin: 0.25rem 0 0 0; }
                
                .header-actions { display: flex; gap: 1rem; align-items: center; }
                .search-box { display: flex; align-items: center; gap: 0.75rem; background: white; border: 1px solid #E5E7EB; padding: 0.6rem 1rem; border-radius: 12px; min-width: 300px; }
                .search-box input { border: none; outline: none; width: 100%; font-size: 0.9rem; }
                .search-box svg { color: #9CA3AF; }

                .btn-onboard { display: flex; align-items: center; gap: 0.5rem; background: #10B981; color: white; border: none; padding: 0.75rem 1.25rem; border-radius: 12px; font-weight: 700; cursor: pointer; transition: 0.2s; }
                .btn-onboard:hover { background: #059669; transform: translateY(-1px); box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.2); }

                .vendors-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1.5rem; }
                .premium-vendor-card { background: white; border-radius: 1.5rem; border: 1px solid #F3F4F6; box-shadow: 0 1px 3px rgba(0,0,0,0.1); padding: 1.5rem; display: flex; flex-direction: column; transition: 0.2s; }
                .premium-vendor-card:hover { transform: translateY(-4px); box-shadow: 0 12px 20px -8px rgba(0,0,0,0.1); border-color: #D1FAE5; }
                
                .card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; }
                .store-identity { display: flex; gap: 1rem; }
                .store-icon-box { width: 48px; height: 48px; background: #ECFDF5; color: #10B981; border-radius: 14px; display: flex; align-items: center; justify-content: center; }
                .store-identity .info h3 { margin: 0; font-size: 1.125rem; color: #111827; }
                .rating-pill { display: inline-flex; align-items: center; gap: 4px; background: #FFFBEB; color: #D97706; font-size: 0.75rem; font-weight: 800; padding: 2px 8px; border-radius: 6px; margin-top: 0.4rem; }
                
                .card-actions { display: flex; gap: 0.5rem; }
                .icon-btn { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border: none; border-radius: 8px; cursor: pointer; transition: 0.2s; }
                .icon-btn.edit { background: #EEF2FF; color: #6366F1; }
                .icon-btn.delete { background: #FEE2E2; color: #EF4444; }

                .card-body { flex: 1; display: grid; gap: 0.75rem; margin-bottom: 1.5rem; }
                .detail-row { display: flex; align-items: center; gap: 0.75rem; font-size: 0.9rem; color: #4B5563; }
                .detail-row svg { color: #9CA3AF; flex-shrink: 0; }
                .detail-row strong { color: #111827; }
                .detail-row.location { align-items: flex-start; }
                .address-text { line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

                .card-footer { display: flex; justify-content: space-between; align-items: center; padding-top: 1rem; border-top: 1px solid #F3F4F6; }
                .status-indicator { display: flex; align-items: center; gap: 6px; font-size: 0.75rem; font-weight: 700; color: #10B981; text-transform: uppercase; }
                .status-indicator .dot { width: 8px; height: 8px; background: #10B981; border-radius: 50%; box-shadow: 0 0 0 3px #DCFCE7; }
                .btn-inventory { background: #F9FAFB; border: 1px solid #E5E7EB; color: #374151; padding: 0.5rem 0.75rem; border-radius: 8px; font-size: 0.8rem; font-weight: 600; cursor: pointer; }

                /* Modal */
                .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.4); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; }
                .modal-card { background: white; padding: 2.5rem; border-radius: 1.5rem; width: 100%; max-width: 600px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
                .modal-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2.5rem; }
                .modal-header h3 { font-size: 1.5rem; color: #111827; margin: 0; }
                .modal-header p { font-size: 0.9rem; color: #6B7280; margin: 0.4rem 0 0 0; }
                
                .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
                .form-group { margin-bottom: 1.5rem; }
                .form-group.full { grid-column: span 2; }
                .form-group label { display: block; font-size: 0.85rem; font-weight: 700; color: #374151; margin-bottom: 0.6rem; }
                .input-wrapper { display: flex; align-items: center; background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 12px; transition: 0.2s; }
                .input-wrapper:focus-within { border-color: #10B981; background: white; box-shadow: 0 0 0 4px #ECFDF5; }
                .input-wrapper .icon { padding-left: 1rem; color: #9CA3AF; }
                .input-wrapper input { background: transparent; border: none; padding: 0.8rem 1rem; width: 100%; outline: none; font-size: 0.95rem; }
                .form-group input[type="password"] { width: 100%; padding: 0.8rem 1rem; border: 1px solid #E5E7EB; border-radius: 12px; background: #F9FAFB; outline: none; }

                .form-actions { display: flex; gap: 1rem; margin-top: 1rem; }
                .btn-submit { flex: 2; background: #10B981; color: white; border: none; padding: 1rem; border-radius: 12px; font-weight: 700; cursor: pointer; }
                .btn-cancel { flex: 1; background: #F3F4F6; color: #4B5563; border: none; padding: 1rem; border-radius: 12px; font-weight: 600; cursor: pointer; }

                .loading-state { display: flex; justify-content: center; align-items: center; min-height: 400px; color: #6B7280; font-weight: 600; }
                .animate-slide-up { animation: slideUp 0.3s ease-out; }
                @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            `}</style>
        </div>
    );
}
