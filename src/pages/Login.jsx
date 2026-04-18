import React, { useState } from 'react';
import { ArrowLeft, Phone, Lock, MapPin } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';
import toast from 'react-hot-toast';
import axios from 'axios';
import { API_CONFIG } from '../Api';

export default function Login() {
  const [phone, setPhone] = useState('9876543210'); // Default for demo convenience
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const { login, isAuthenticated, user: authUser } = useAuthStore();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated && authUser) {
      if (authUser.role === 'admin') navigate('/admin');
      else if (authUser.role === 'vendor') navigate('/vendor');
      else navigate('/');
    }
  }, [isAuthenticated, authUser, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Authenticate
      const res = await axios.post(`${API_CONFIG.BASE_URL}/api/auth/login`, { phone, password });
      const { user, token } = res.data;

      // Get Location if possible
      if (navigator.geolocation && user.role === 'customer') {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            user.location = {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
              address: 'Detected Location' // In real app, reverse geocode this
            };
            login(user, token); // Function now handles persisting user with location
          },
          (err) => {
            console.warn("Location access denied or error", err);
            login(user, token); // Login anyway without location
          }
        );
      } else {
        login(user, token);
      }

      toast.success(`Welcome back, ${user.name}!`);

      // Redirect
      const from = location.state?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
      } else {
        if (user.role === 'admin') navigate('/admin');
        else if (user.role === 'vendor') navigate('/vendor');
        else navigate('/');
      }

    } catch (err) {
      toast.error(err.response?.data?.message || 'Login Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Header */}
        <div className="login-header">
          <h1 style={{ color: 'var(--primary-color)', fontSize: '2.5rem', marginBottom: '0.5rem' }}>KiranaKart</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Log in to access your local kirana</p>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <div className="input-group">
            <span className="country-code">+91</span>
            <input
              type="tel"
              placeholder="Enter mobile number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={10}
              required
            />
            <Phone className="input-icon" size={18} />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Lock className="input-icon" size={18} />
          </div>

          <button type="submit" className="btn btn-primary full-width" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="login-hints" style={{ marginTop: '2rem', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-secondary)', background: '#F9FAFB', padding: '1rem', borderRadius: '10px' }}>
          <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Demo Credentials:</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            <span><strong>Customer:</strong> 9000000001</span>
            <span><strong>Pass:</strong> password123</span>
            <span><strong>Vendor:</strong> 9000000006</span>
            <span><strong>Pass:</strong> password123</span>
            <span><strong>Admin:</strong> 9000000003</span>
            <span><strong>Pass:</strong> password123</span>
          </div>
        </div>

        <p className="terms-text" style={{ marginTop: '1.5rem' }}>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>

        <p className="terms-text">
          By clicking, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
        </p>
      </div>

      <style>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #F3F4F6;
          padding: 1rem;
        }

        .login-container {
          background: white;
          padding: 2.5rem;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
          width: 100%;
          max-width: 450px;
          text-align: center;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-secondary);
          margin-bottom: 2rem;
          font-size: 0.9rem;
          float: left;
        }

        .login-header {
          clear: both;
          margin-bottom: 2rem;
        }

        /* Role Grid */
        .role-grid {
           display: grid;
           grid-template-columns: 1fr 1fr 1fr;
           gap: 1rem;
           margin-bottom: 2rem;
        }

        .role-card {
           display: flex;
           flex-direction: column;
           align-items: center;
           gap: 0.5rem;
           padding: 1rem 0.5rem;
           border-radius: var(--radius-md);
           border: 1px solid #E5E7EB;
           background: white;
           transition: 0.2s;
           cursor: pointer;
        }

        .role-card:hover {
           border-color: var(--primary-color);
           background: #F0FDF4;
        }

        .role-card .icon {
           width: 40px; 
           height: 40px;
           border-radius: 50%;
           display: flex;
           align-items: center;
           justify-content: center;
           color: white;
        }

        .role-card.customer .icon { background: #3B82F6; }
        .role-card.vendor .icon { background: #F59E0B; }
        .role-card.admin .icon { background: #10B981; }
        
        .role-card span { font-size: 0.85rem; font-weight: 500; color: var(--text-secondary); }

        .divider {
           position: relative;
           text-align: center;
           margin-bottom: 2rem;
        }
        
        .divider::before {
           content: '';
           position: absolute;
           left: 0; top: 50%;
           width: 100%; height: 1px;
           background: #E5E7EB;
        }
        
        .divider span {
           position: relative;
           background: white;
           padding: 0 1rem;
           color: var(--text-light);
           font-size: 0.8rem;
        }

        .input-group {
          position: relative;
          display: flex;
          align-items: center;
          background: #F9FAFB;
          border: 1px solid #E5E7EB;
          border-radius: var(--radius-md);
          margin-bottom: 1.5rem;
          padding: 0.25rem 0.75rem;
          border-focus-within: 1px solid var(--primary-color);
        }

        .country-code {
          font-weight: 600;
          color: var(--text-primary);
          padding-right: 0.5rem;
          border-right: 1px solid #E5E7EB;
        }

        .input-group input {
          border: none;
          background: transparent;
          width: 100%;
          padding: 0.75rem;
          font-size: 1rem;
          outline: none;
          font-weight: 500;
        }

        .input-icon {
          color: var(--text-light);
        }

        .full-width {
          width: 100%;
        }

        .terms-text {
          margin-top: 1.5rem;
          font-size: 0.8rem;
          color: var(--text-light);
        }

        .terms-text a {
            color: var(--primary-color);
            text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
