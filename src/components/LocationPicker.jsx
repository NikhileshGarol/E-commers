import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { MapPin, Search, Navigation, X, Home, Briefcase, Clock, Loader2, History } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import toast from 'react-hot-toast';
import axios from 'axios';
import { API_CONFIG } from '../Api';

export default function LocationPicker({ isOpen, onClose }) {
    const { updateLocation, user } = useAuthStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isDetecting, setIsDetecting] = useState(false);
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [recentLocations, setRecentLocations] = useState([]);

    useEffect(() => {
        if (isOpen) {
            if (user) {
                axios.get(`${API_CONFIG.BASE_URL}/api/user/addresses`)
                    .then(res => setSavedAddresses(res.data))
                    .catch(err => console.error(err));
            }
            const history = JSON.parse(localStorage.getItem('recent_locations') || '[]');
            setRecentLocations(history);
        }
    }, [isOpen, user]);

    // Debounced Autocomplete Fetch
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (searchQuery.length < 3) {
                setSuggestions([]);
                return;
            }
            setIsSearching(true);
            try {
                const response = await axios.get(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&addressdetails=1&limit=5&countrycodes=in`
                );
                setSuggestions(response.data);
            } catch (err) {
                console.error("Search failed", err);
            } finally {
                setIsSearching(false);
            }
        };
        const timer = setTimeout(fetchSuggestions, 600);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const addToHistory = (location) => {
        const history = JSON.parse(localStorage.getItem('recent_locations') || '[]');
        const filtered = history.filter(item => item.address !== location.address).slice(0, 4);
        const newHistory = [location, ...filtered];
        localStorage.setItem('recent_locations', JSON.stringify(newHistory));
        setRecentLocations(newHistory);
    };

    const handleDetectLocation = () => {
        setIsDetecting(true);
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    try {
                        const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
                        const address = res.data.display_name;
                        const detectedLocation = {
                            lat: latitude,
                            lng: longitude,
                            address: address || "Pinpointed Location"
                        };
                        updateLocation(detectedLocation);
                        addToHistory(detectedLocation);
                        toast.success("Nearby stores unlocked! 🚀");
                        onClose();
                    } catch (err) {
                        const fallback = { lat: latitude, lng: longitude, address: `Area near ${latitude.toFixed(4)}, ${longitude.toFixed(4)}` };
                        updateLocation(fallback);
                        addToHistory(fallback);
                        toast.success("Location pinpointed");
                        onClose();
                    } finally {
                        setIsDetecting(false);
                    }
                },
                (error) => {
                    toast.error("Geolocation failed.");
                    setIsDetecting(false);
                },
                { enableHighAccuracy: true }
            );
        } else {
            toast.error("Geolocation not supported.");
            setIsDetecting(false);
        }
    };

    const handleSelectLocation = (loc) => {
        const finalLocation = {
            lat: parseFloat(loc.lat),
            lng: parseFloat(loc.lon),
            address: loc.display_name
        };
        updateLocation(finalLocation);
        addToHistory(finalLocation);
        toast.success("Location set!");
        onClose();
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="location-modal-overlay" onClick={onClose}>
            <div className="location-modal animate-slide-down" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="title-stack">
                        <h3>Select Delivery Location</h3>
                        <p>Real-time stores near you</p>
                    </div>
                    <button className="close-btn" onClick={onClose}><X size={20} /></button>
                </div>

                <div className="modal-body">
                    <div className="search-section-premium">
                        <div className="search-input-wrapper">
                            <Search size={18} className="search-ico" />
                            <input
                                type="text"
                                placeholder="Search area, colony..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                            />
                            {isSearching && <Loader2 size={18} className="spin-loader" />}
                        </div>

                        {suggestions.length > 0 && (
                            <div className="suggestions-box">
                                {suggestions.map((loc, idx) => (
                                    <div key={idx} className="suggestion-item" onClick={() => handleSelectLocation(loc)}>
                                        <MapPin size={18} className="pin-ico" />
                                        <div className="suggest-text">
                                            <strong>{loc.address.suburb || loc.address.road || "Location Found"}</strong>
                                            <p>{loc.display_name}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <button className="detect-btn-v2" onClick={handleDetectLocation} disabled={isDetecting}>
                        <div className="icon-circle">
                            {isDetecting ? <Loader2 size={20} className="spin" /> : <Navigation size={20} />}
                        </div>
                        <div className="text-side">
                            <strong>Use Current Location</strong>
                            <span>Detect via GPS</span>
                        </div>
                    </button>

                    <div className="scrollable-content">
                        {savedAddresses.length > 0 && searchQuery.length < 3 && (
                            <div className="address-group">
                                <p className="group-label">Saved Addresses</p>
                                <div className="saved-grid">
                                    {savedAddresses.map(addr => (
                                        <div key={addr._id} className="saved-v2-item" onClick={() => { updateLocation(addr); onClose(); }}>
                                            <div className="type-icon">
                                                {addr.tag === 'Home' ? <Home size={18} /> : addr.tag === 'Office' ? <Briefcase size={18} /> : <MapPin size={18} />}
                                            </div>
                                            <div className="v2-info">
                                                <h5>{addr.tag}</h5>
                                                <p>{addr.address}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {recentLocations.length > 0 && searchQuery.length < 3 && (
                            <div className="address-group">
                                <p className="group-label">Recent Searches</p>
                                <div className="saved-grid">
                                    {recentLocations.map((loc, idx) => (
                                        <div key={idx} className="saved-v2-item" onClick={() => { updateLocation(loc); onClose(); }}>
                                            <div className="type-icon"><History size={18} /></div>
                                            <div className="v2-info">
                                                <h5>{loc.address.split(',')[0]}</h5>
                                                <p>{loc.address}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                .location-modal-overlay {
                    position: fixed;
                    top: 72px; /* Exactly below navbar */
                    left: 0; right: 0; bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: flex-start;
                    justify-content: center;
                    z-index: 999999 !important; /* Extremely high to beat any internal page z-index */
                    backdrop-filter: blur(8px);
                    padding: 20px;
                }

                .location-modal {
                    background: white;
                    width: 100%;
                    max-width: 480px;
                    border-radius: 20px;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                    animation: slideDown 0.3s cubic-bezier(0, 0, 0.2, 1);
                    display: flex;
                    flex-direction: column;
                    max-height: calc(100vh - 120px);
                }

                .modal-header { padding: 1.5rem 1.5rem 1rem; display: flex; justify-content: space-between; align-items: flex-start; }
                .title-stack h3 { font-size: 1.25rem; font-weight: 800; color: #1e293b; margin: 0; }
                .title-stack p { color: #64748b; font-size: 0.85rem; margin: 4px 0 0; }
                .close-btn { background: #f1f5f9; border: none; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #64748b; }

                .modal-body { padding: 0 1.5rem 1.5rem; display: flex; flex-direction: column; overflow: hidden; }
                .scrollable-content { overflow-y: auto; flex: 1; margin-right: -10px; padding-right: 10px; }

                .search-section-premium { position: relative; margin-bottom: 1.25rem; }
                .search-input-wrapper { position: relative; display: flex; align-items: center; }
                .search-ico { position: absolute; left: 1rem; color: #94a3b8; }
                .search-input-wrapper input { width: 100%; height: 48px; padding: 0 3rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; font-size: 0.95rem; outline: none; }
                .search-input-wrapper input:focus { border-color: #10B981; background: white; }

                .suggestions-box { position: absolute; top: 100%; left: 0; right: 0; background: white; border: 1px solid #e2e8f0; border-radius: 12px; margin-top: 4px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); z-index: 10; max-height: 200px; overflow-y: auto; }
                .suggestion-item { padding: 0.75rem 1rem; border-bottom: 1px solid #f1f5f9; cursor: pointer; display: flex; align-items: center; gap: 0.75rem; }
                .suggestion-item:hover { background: #f0fdf4; }

                .detect-btn-v2 { width: 100%; display: flex; align-items: center; gap: 1rem; padding: 1rem; background: #ecfdf5; border: 1px solid #d1fae5; border-radius: 12px; cursor: pointer; margin-bottom: 1.5rem; text-align: left; transition: 0.2s; }
                .detect-btn-v2:hover { background: #d1fae5; }
                .icon-circle { width: 36px; height: 36px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #10B981; }

                .address-group { margin-bottom: 1.5rem; }
                .group-label { font-size: 0.7rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; margin-bottom: 0.75rem; letter-spacing: 0.05em; }
                .saved-v2-item { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; border: 1px solid #f1f5f9; border-radius: 10px; cursor: pointer; transition: 0.2s; margin-bottom: 0.5rem; }
                .saved-v2-item:hover { border-color: #10B981; background: #f8fafc; }
                .type-icon { width: 32px; height: 32px; background: #f1f5f9; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #64748b; flex-shrink: 0; }
                .v2-info h5 { margin: 0; font-size: 0.9rem; color: #1e293b; }
                .v2-info p { margin: 1px 0 0; font-size: 0.75rem; color: #94a3b8; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

                @keyframes slideDown { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

                @media (max-width: 640px) {
                    .location-modal-overlay { top: 60px; padding: 10px; }
                    .modal-header { padding: 1.25rem 1rem 0.75rem; }
                    .modal-body { padding: 0 1rem 1rem; }
                }
            `}</style>
        </div>,
        document.body
    );
}
