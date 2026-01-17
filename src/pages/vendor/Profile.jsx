import React, { useState, useEffect } from 'react';
import { Store, MapPin, Phone, User, Image as ImageIcon, Info, Save, Navigation } from 'lucide-react';
import axios from 'axios';
import useAuthStore from '../../store/useAuthStore';
import toast from 'react-hot-toast';

export default function VendorProfile() {
    const { user, updateLocation } = useAuthStore();
    const [formData, setFormData] = useState({
        name: '',
        store_name: '',
        phone: '',
        store_description: '',
        store_image: '',
        location: { address: '', lat: 0, lng: 0 }
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // We could just use 'user' from store, but let's fetch fresh data
                const res = await axios.get(`http://localhost:5000/api/vendors/${user.id}`);
                const data = res.data;
                setFormData({
                    name: data.owner || data.name || '',
                    store_name: data.store_name || '',
                    phone: data.phone || '',
                    store_description: data.store_description || '',
                    store_image: data.store_image || '',
                    location: data.location || { address: '', lat: 0, lng: 0 }
                });
                setLoading(false);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load profile");
                setLoading(false);
            }
        };
        if (user?.id) fetchProfile();
    }, [user.id]);

    const handleDetectLocation = () => {
        if (!navigator.geolocation) return toast.error("Geolocation not supported");
        toast.loading("Pinpointing store...", { id: 'geo' });
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords;
                try {
                    const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
                    setFormData({
                        ...formData,
                        location: {
                            lat: latitude,
                            lng: longitude,
                            address: res.data.display_name
                        }
                    });
                    toast.success("Location pinpointed!", { id: 'geo' });
                } catch (err) {
                    toast.error("Reverse geocoding failed", { id: 'geo' });
                }
            },
            () => toast.error("Detection failed", { id: 'geo' }),
            { enableHighAccuracy: true }
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await axios.put('http://localhost:5000/api/vendor/profile', formData);
            toast.success("Profile updated successfully!");
            // Update local store if needed (like address/store name)
            if (formData.location) updateLocation(formData.location);
            setSaving(false);
        } catch (err) {
            console.error(err);
            toast.error("Update failed");
            setSaving(false);
        }
    };

    if (loading) return <div className="p-10">Loading profile...</div>;

    return (
        <div className="store-profile-page">
            <div className="profile-card">
                <div className="card-header">
                    <h2>Store Profile</h2>
                    <p>Manage your store information and how it appears to customers.</p>
                </div>

                <form onSubmit={handleSubmit} className="profile-form">
                    <div className="form-section">
                        <h3><Store size={18} /> Basic Information</h3>
                        <div className="input-grid">
                            <div className="input-field">
                                <label>Store Name</label>
                                <div className="input-wrapper">
                                    <Store className="icon" size={16} />
                                    <input
                                        type="text"
                                        value={formData.store_name}
                                        onChange={(e) => setFormData({ ...formData, store_name: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="input-field">
                                <label>Owner Name</label>
                                <div className="input-wrapper">
                                    <User className="icon" size={16} />
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="input-field">
                                <label>Business Phone</label>
                                <div className="input-wrapper">
                                    <Phone className="icon" size={16} />
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <div className="section-title-row">
                            <h3><MapPin size={18} /> Location Details</h3>
                            <button type="button" className="detect-inline-btn" onClick={handleDetectLocation}>
                                <Navigation size={14} /> Detect Current Store Location
                            </button>
                        </div>
                        <div className="input-field full">
                            <label>Store Address</label>
                            <div className="input-wrapper">
                                <MapPin className="icon" size={16} />
                                <input
                                    type="text"
                                    value={formData.location.address}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        location: { ...formData.location, address: e.target.value }
                                    })}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3><Info size={18} /> Additional Info</h3>
                        <div className="input-field full">
                            <label>Store Image URL</label>
                            <div className="input-wrapper">
                                <ImageIcon className="icon" size={16} />
                                <input
                                    type="text"
                                    placeholder="https://images.unsplash.com/..."
                                    value={formData.store_image}
                                    onChange={(e) => setFormData({ ...formData, store_image: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="input-field full">
                            <label>Store Description</label>
                            <div className="input-wrapper">
                                <textarea
                                    rows="4"
                                    value={formData.store_description}
                                    onChange={(e) => setFormData({ ...formData, store_description: e.target.value })}
                                    placeholder="Tell customers what makes your store special..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-footer">
                        <button type="submit" className="save-btn" disabled={saving}>
                            {saving ? 'Saving...' : <><Save size={18} /> Save Changes</>}
                        </button>
                    </div>
                </form>
            </div>

            <style>{`
                .store-profile-page { padding: 1rem; max-width: 900px; margin: 0 auto; }
                .profile-card { background: white; border-radius: 1.5rem; padding: 2.5rem; box-shadow: var(--shadow-sm); border: 1px solid #F3F4F6; }
                
                .card-header { margin-bottom: 3rem; }
                .card-header h2 { font-size: 1.75rem; color: #111827; margin-bottom: 0.5rem; }
                .card-header p { color: #6B7280; font-size: 0.95rem; }

                .form-section { margin-bottom: 2.5rem; }
                .form-section h3 { display: flex; align-items: center; gap: 0.75rem; font-size: 1.1rem; color: #374151; margin-bottom: 0; padding-bottom: 0; border: none; }
                .section-title-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; padding-bottom: 0.75rem; border-bottom: 1px solid #F3F4F6; }
                .detect-inline-btn { display: flex; align-items: center; gap: 6px; background: #ECFDF5; color: #10B981; border: 1px solid #D1FAE5; padding: 0.4rem 0.8rem; border-radius: 8px; font-size: 0.8rem; font-weight: 600; cursor: pointer; transition: 0.2s; }
                .detect-inline-btn:hover { background: #D1FAE5; border-color: #10B981; }
                
                .input-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
                .input-field { display: flex; flex-direction: column; gap: 0.5rem; }
                .input-field.full { grid-column: span 2; }
                .input-field label { font-size: 0.85rem; font-weight: 600; color: #4B5563; }

                .input-wrapper { position: relative; display: flex; align-items: center; background: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 0.75rem; transition: 0.2s; }
                .input-wrapper:focus-within { border-color: #10B981; background: white; box-shadow: 0 0 0 4px #ECFDF5; }
                
                .input-wrapper .icon { position: absolute; left: 1rem; color: #9CA3AF; }
                .input-wrapper input, .input-wrapper textarea { width: 100%; border: none; background: transparent; padding: 0.8rem 1rem 0.8rem 2.75rem; font-size: 0.95rem; outline: none; }
                .input-wrapper textarea { padding-left: 1rem; }

                .form-footer { margin-top: 3rem; display: flex; justify-content: flex-end; }
                .save-btn { display: flex; align-items: center; gap: 0.75rem; background: #10B981; color: white; border: none; padding: 1rem 2rem; border-radius: 1rem; font-weight: 700; cursor: pointer; transition: 0.2s; }
                .save-btn:hover { background: #059669; transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.2); }
                .save-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

                @media (max-width: 640px) {
                    .input-grid { grid-template-columns: 1fr; }
                    .profile-card { padding: 1.5rem; }
                }
            `}</style>
        </div>
    );
}
