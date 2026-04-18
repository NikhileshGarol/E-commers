import React, { useState } from 'react';
import { ArrowLeft, Phone, Lock, User, MapPin, Store } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import useAuthStore from '../store/useAuthStore';
import { API_CONFIG } from '../Api';

export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        password: '',
        role: 'customer',
        store_name: ''
    });
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuthStore();

    React.useEffect(() => {
        if (isAuthenticated && user) {
            if (user.role === 'admin') navigate('/admin');
            else if (user.role === 'vendor') navigate('/vendor');
            else navigate('/');
        }
    }, [isAuthenticated, user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Prepare data based on role
            const payload = { ...formData };
            if (payload.role !== 'vendor') delete payload.store_name;

            await axios.post(`${API_CONFIG.BASE_URL}/api/auth/register`, payload);
            toast.success('Registration successful! Please login.');
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed.');
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-header">
                    <h1 style={{ color: '#10B981', fontSize: '2rem', marginBottom: '0.5rem' }}>KiranaKart</h1>
                    <h2>Create Account</h2>
                    <p>Join KiranaKart today</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="role-selector mb-4 flex justify-center gap-2">
                        {['customer', 'vendor', 'admin'].map(r => (
                            <button
                                key={r}
                                type="button"
                                className={`role-tab ${formData.role === r ? 'active' : ''}`}
                                onClick={() => setFormData({ ...formData, role: r })}
                            >
                                {r.charAt(0).toUpperCase() + r.slice(1)}
                            </button>
                        ))}
                    </div>

                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                        <User className="input-icon" size={18} />
                    </div>

                    {formData.role === 'vendor' && (
                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="Store Name"
                                value={formData.store_name}
                                onChange={(e) => setFormData({ ...formData, store_name: e.target.value })}
                                required
                            />
                            <Store className="input-icon" size={18} />
                        </div>
                    )}

                    <div className="input-group">
                        <span className="country-code">+91</span>
                        <input
                            type="tel"
                            placeholder="Mobile Number"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            maxLength={10}
                            required
                        />
                        <Phone className="input-icon" size={18} />
                    </div>

                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                        <Lock className="input-icon" size={18} />
                    </div>

                    <button type="submit" className="btn btn-primary full-width">
                        Register as {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
                    </button>
                    <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: '#6B7280' }}>
                        Already have an account? <Link to="/login" style={{ color: '#10B981', fontWeight: 600 }}>Login here</Link>
                    </p>
                </form>
            </div>
            <style>{`
        /* Reusing Login styles */
        .login-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #F3F4F6; padding: 1rem; }
        .login-container { background: white; padding: 2.5rem; border-radius: 1rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); width: 100%; max-width: 400px; text-align: center; }
        .back-link { display: inline-flex; align-items: center; gap: 0.5rem; color: #6B7280; margin-bottom: 2rem; font-size: 0.9rem; float: left; }
        .login-header { clear: both; margin-bottom: 2rem; }
        .input-group { position: relative; display: flex; align-items: center; background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 0.5rem; margin-bottom: 1.5rem; padding: 0.25rem 0.75rem; }
        .input-group input { border: none; background: transparent; width: 100%; padding: 0.75rem; font-size: 1rem; outline: none; }
        .input-icon { color: #9CA3AF; }
        .country-code { font-weight: 600; color: #111827; padding-right: 0.5rem; border-right: 1px solid #E5E7EB; }
        .full-width { width: 100%; }
        .btn-primary { background: #10B981; color: white; border: none; padding: 0.8rem; border-radius: 0.5rem; font-weight: 600; cursor: pointer; transition: 0.2s; }
        .btn-primary:hover { background: #059669; }

        .role-selector {
            display: flex;
            background: #F3F4F6;
            padding: 4px;
            border-radius: 0.75rem;
            margin-bottom: 2rem;
        }

        .role-tab {
            flex: 1;
            padding: 0.6rem;
            border-radius: 0.5rem;
            font-size: 0.85rem;
            font-weight: 600;
            color: #6B7280;
            transition: 0.2s;
            border: none;
            background: transparent;
            cursor: pointer;
        }

        .role-tab.active {
            background: white;
            color: #10B981;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
      `}</style>
        </div>
    );
}
