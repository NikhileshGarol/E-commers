import React, { useEffect, useState } from 'react';
import { User, Phone, Calendar, Trash2, Edit2, Plus, X, Shield, Search } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function UsersManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({ name: '', phone: '', password: '', role: 'customer' });

    const fetchUsers = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/admin/users');
            setUsers(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load users");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.phone.includes(searchTerm)
    );

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/admin/users/${id}`);
            toast.success("User deleted");
            setUsers(users.filter(u => u._id !== id));
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({ name: user.name, phone: user.phone, password: '', role: user.role });
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setEditingUser(null);
        setFormData({ name: '', phone: '', password: '', role: 'customer' });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingUser) {
                const dataToSend = { ...formData };
                if (!dataToSend.password) delete dataToSend.password;
                await axios.put(`http://localhost:5000/api/admin/users/${editingUser._id}`, dataToSend);
                toast.success("User updated");
            } else {
                await axios.post('http://localhost:5000/api/admin/users', formData);
                toast.success("User added");
            }
            setIsModalOpen(false);
            fetchUsers();
        } catch (err) {
            toast.error(err.response?.data?.message || "Operation failed");
        }
    };

    if (loading) return <div className="loading-state">Syncing user database...</div>;

    return (
        <div className="admin-manage-users">
            <header className="page-header">
                <div className="title-area">
                    <h1>User Directory</h1>
                    <p>Manage permissions and access levels for all platform members.</p>
                </div>
                <div className="header-actions">
                    <div className="search-box">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search by name or phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn-add-user" onClick={handleAdd}>
                        <Plus size={18} /> Create User
                    </button>
                </div>
            </header>

            <div className="content-card">
                <div className="table-wrapper">
                    <table className="premium-table">
                        <thead>
                            <tr>
                                <th>Account Holder</th>
                                <th>Access Role</th>
                                <th>Communication</th>
                                <th>Registration Date</th>
                                <th className="text-right">Manage</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length === 0 ? (
                                <tr><td colSpan="5" className="empty-row">No users found matching your search.</td></tr>
                            ) : (
                                filteredUsers.map(u => (
                                    <tr key={u._id}>
                                        <td>
                                            <div className="user-profile-cell">
                                                <div className="avatar-box">{u.name[0]}</div>
                                                <div className="details">
                                                    <span className="name">{u.name}</span>
                                                    <span className="uid">ID: {u._id.slice(-8).toUpperCase()}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`role-tag ${u.role}`}>
                                                <Shield size={12} /> {u.role}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="contact-cell">
                                                <Phone size={14} /> {u.phone}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="date-cell">
                                                <Calendar size={14} /> {new Date(u.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </div>
                                        </td>
                                        <td className="text-right">
                                            <div className="action-buttons">
                                                <button className="action-btn edit" onClick={() => handleEdit(u)} title="Edit User">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button className="action-btn delete" onClick={() => handleDelete(u._id)} title="Delete User">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-card animate-pop">
                        <div className="modal-header">
                            <div>
                                <h3>{editingUser ? 'Update Profile' : 'New Account'}</h3>
                                <p>{editingUser ? 'Modifying existing user permissions' : 'Adding a new verified member'}</p>
                            </div>
                            <button className="close-btn" onClick={() => setIsModalOpen(false)}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="modal-form">
                            <div className="form-group">
                                <label>Profile Display Name</label>
                                <div className="input-wrapper">
                                    <User className="icon" size={18} />
                                    <input required type="text" placeholder="e.g. Rahul Sharma" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Registered Phone</label>
                                <div className="input-wrapper">
                                    <Phone className="icon" size={18} />
                                    <input required type="tel" placeholder="10-digit mobile number" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Security Password {editingUser && <span className="helper">(Empty to keep)</span>}</label>
                                <input required={!editingUser} type="password" placeholder="••••••••" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>System Role</label>
                                <select value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })}>
                                    <option value="customer">Default Customer</option>
                                    <option value="vendor">Verified Vendor</option>
                                </select>
                            </div>
                            <div className="form-actions">
                                <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Discard</button>
                                <button type="submit" className="btn-submit">{editingUser ? 'Apply Changes' : 'Initialize Account'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                .admin-manage-users { padding: 1.5rem; max-width: 1200px; margin: 0 auto; }
                .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2.5rem; }
                .page-header h1 { font-size: 1.75rem; color: #111827; margin: 0; }
                .page-header p { color: #6B7280; font-size: 0.95rem; margin: 0.25rem 0 0 0; }
                
                .header-actions { display: flex; gap: 1rem; align-items: center; }
                .search-box { display: flex; align-items: center; gap: 0.75rem; background: white; border: 1px solid #E5E7EB; padding: 0.6rem 1rem; border-radius: 12px; min-width: 300px; }
                .search-box input { border: none; outline: none; width: 100%; font-size: 0.9rem; }
                .search-box svg { color: #9CA3AF; }

                .btn-add-user { display: flex; align-items: center; gap: 0.5rem; background: #6366F1; color: white; border: none; padding: 0.75rem 1.25rem; border-radius: 12px; font-weight: 700; cursor: pointer; transition: 0.2s; }
                .btn-add-user:hover { background: #4F46E5; transform: translateY(-1px); box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.2); }

                .content-card { background: white; border-radius: 1.25rem; border: 1px solid #F3F4F6; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow: hidden; }
                .premium-table { width: 100%; border-collapse: collapse; text-align: left; }
                .premium-table th { padding: 1rem 1.5rem; background: #F9FAFB; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.05em; color: #6B7280; font-weight: 700; border-bottom: 1px solid #F3F4F6; }
                .premium-table td { padding: 1.25rem 1.5rem; border-bottom: 1px solid #F3F4F6; font-size: 0.95rem; }
                
                .user-profile-cell { display: flex; align-items: center; gap: 1rem; }
                .avatar-box { width: 40px; height: 40px; background: #EEF2FF; color: #6366F1; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.1rem; }
                .user-profile-cell .details { display: flex; flex-direction: column; }
                .user-profile-cell .name { font-weight: 700; color: #111827; }
                .user-profile-cell .uid { font-size: 0.7rem; color: #9CA3AF; font-family: monospace; }
                
                .role-tag { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 50px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; }
                .role-tag.customer { background: #EFF6FF; color: #3B82F6; }
                .role-tag.vendor { background: #ECFDF5; color: #10B981; }

                .contact-cell, .date-cell { display: flex; align-items: center; gap: 8px; color: #4B5563; }
                .contact-cell svg, .date-cell svg { color: #9CA3AF; }
                
                .text-right { text-align: right; }
                .action-buttons { display: flex; gap: 0.5rem; justify-content: flex-end; }
                .action-btn { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border: none; border-radius: 8px; cursor: pointer; transition: 0.2s; }
                .action-btn.edit { background: #E0F2FE; color: #0284C7; }
                .action-btn.edit:hover { background: #BAE6FD; }
                .action-btn.delete { background: #FEE2E2; color: #EF4444; }
                .action-btn.delete:hover { background: #FECACA; }

                /* Modal */
                .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.4); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1000; }
                .modal-card { background: white; padding: 2.5rem; border-radius: 1.5rem; width: 100%; max-width: 480px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
                .modal-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
                .modal-header h3 { font-size: 1.5rem; color: #111827; margin: 0; }
                .modal-header p { font-size: 0.9rem; color: #6B7280; margin: 0.4rem 0 0 0; }
                .close-btn { background: none; border: none; color: #9CA3AF; cursor: pointer; padding: 4px; border-radius: 8px; transition: 0.2s; }
                .close-btn:hover { background: #F3F4F6; color: #111827; }

                .form-group { margin-bottom: 1.5rem; }
                .form-group label { display: block; font-size: 0.85rem; font-weight: 700; color: #374151; margin-bottom: 0.6rem; }
                .input-wrapper { display: flex; align-items: center; background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 12px; transition: 0.2s; }
                .input-wrapper:focus-within { border-color: #6366F1; background: white; box-shadow: 0 0 0 4px #EEF2FF; }
                .input-wrapper .icon { padding-left: 1rem; color: #9CA3AF; }
                .input-wrapper input { background: transparent; border: none; padding: 0.8rem 1rem; width: 100%; outline: none; font-size: 0.95rem; }
                .form-group input[type="password"], .form-group select { width: 100%; padding: 0.8rem 1rem; border: 1px solid #E5E7EB; border-radius: 12px; background: #F9FAFB; outline: none; }
                .form-group .helper { font-weight: normal; color: #9CA3AF; font-size: 0.75rem; }

                .form-actions { display: flex; gap: 1rem; margin-top: 2.5rem; }
                .btn-submit { flex: 2; background: #6366F1; color: white; border: none; padding: 1rem; border-radius: 12px; font-weight: 700; cursor: pointer; }
                .btn-cancel { flex: 1; background: #F3F4F6; color: #4B5563; border: none; padding: 1rem; border-radius: 12px; font-weight: 600; cursor: pointer; }

                .loading-state { display: flex; justify-content: center; align-items: center; min-height: 400px; color: #6B7280; font-weight: 600; }
                .empty-row { text-align: center; padding: 4rem !important; color: #9CA3AF; font-style: italic; }
                
                .animate-pop { animation: popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
                @keyframes popIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            `}</style>
        </div>
    );
}
