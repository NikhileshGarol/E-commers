import React, { useState } from 'react';
import { ShoppingCart, Search, User, MapPin } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useCartStore from '../store/useCartStore';
import useAuthStore from '../store/useAuthStore';
import LocationPicker from './LocationPicker';

export default function Navbar() {
  const totalItems = useCartStore((state) => state.getTotalItems()(state));
  const user = useAuthStore((state) => state.user);
  const [query, setQuery] = useState('');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        {/* Logo Section */}
        <div className="logo-section">
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="logo-icon">
              <span style={{ fontSize: '1.5rem' }}>🥦</span>
            </div>
            <div className="logo-text">
              <h2>Kirana<span className="highlight">Kart</span></h2>
            </div>
          </Link>
          <div className="location-pill" onClick={() => setShowLocationModal(true)}>
            <MapPin size={14} />
            <span className="truncate">{user?.location?.address || 'Set Location'}</span>
          </div>
        </div>

        {/* Search Bar - Hidden on small mobile, visible on desktop */}
        <form className="search-bar" onSubmit={handleSearch}>
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search for rice, dal, coke..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>

        {/* Actions */}
        <div className="nav-actions">
          <Link to="/profile" className="icon-btn">
            <User size={24} />
          </Link>
          <Link to="/cart" className="icon-btn cart-btn">
            <ShoppingCart size={24} />
            {totalItems > 0 && <span className="badge">{totalItems}</span>}
          </Link>
        </div>
      </div>

      <style>{`
        .navbar {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          position: sticky;
          top: 0;
          z-index: 1000;
          border-bottom: 1px solid rgba(0,0,0,0.05);
          padding: 1rem 0;
        }

        .navbar-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .logo-text h2 {
          font-size: 1.5rem;
          margin: 0;
          line-height: 1;
          color: var(--text-primary);
        }

        .highlight {
          color: var(--primary-color);
        }

        .location-pill {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          color: var(--text-secondary);
          margin-top: 0.25rem;
        }

        .search-bar {
          flex: 1;
          max-width: 500px;
          position: relative;
          display: none; /* Mobile first hidden, block on md */
        }

        @media (min-width: 768px) {
          .search-bar { display: block; }
        }

        .search-bar input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 3rem;
          border-radius: 50px;
          border: 1px solid #E5E7EB;
          background: #F3F4F6;
          font-size: 0.95rem;
          transition: all 0.2s;
          outline: none;
        }

        .search-bar input:focus {
          background: white;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1);
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-light);
        }

        .nav-actions {
          display: flex;
          gap: 1rem;
        }

        .icon-btn {
          padding: 0.5rem;
          border-radius: 50%;
          color: var(--text-secondary);
          transition: 0.2s;
          position: relative;
        }

        .icon-btn:hover {
          background: #F3F4F6;
          color: var(--primary-color);
        }

        .badge {
          position: absolute;
          top: -2px;
          right: -2px;
          background: var(--error);
          color: white;
          font-size: 0.7rem;
          font-weight: bold;
          height: 18px;
          width: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid white;
        }

        .truncate {
          max-width: 120px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .location-pill {
          cursor: pointer;
          transition: 0.2s;
        }
        .location-pill:hover {
          color: var(--primary-color);
        }
      `}</style>
      <LocationPicker isOpen={showLocationModal} onClose={() => setShowLocationModal(false)} />
    </nav>
  );
}
