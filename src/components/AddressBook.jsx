import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Trash2, Edit2, CheckCircle2, Home, Briefcase, Navigation } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import useAuthStore from '../store/useAuthStore';

export default function AddressBook() {
    const { user, updateLocation } = useAuthStore();
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        tag: 'Home', houseNo: '', area: '', landmark: '', address: '', lat: 0, lng: 0
    });

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/user/addresses');
            setAddresses(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleDetectLocation = () => {
        if (!navigator.geolocation) {
            return toast.error("Geolocation not supported");
        }
        toast.loading("Detecting precise location...", { id: 'geo' });
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords;
                try {
                    const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
                    const addrData = res.data.address;
                    const displayName = res.data.display_name;

                    // Try to extract area/street
                    const area = addrData.suburb || addrData.neighbourhood || addrData.residential || addrData.road || addrData.city_district || "";

                    setFormData({
                        ...formData,
                        lat: latitude,
                        lng: longitude,
                        area: area,
                        address: displayName
                    });
                    toast.success("Location pinpointed!", { id: 'geo' });
                } catch (err) {
                    console.error("Reverse geocoding failed", err);
                    setFormData({
                        ...formData,
                        lat: latitude,
                        lng: longitude,
                        address: `Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`
                    });
                    toast.success("Coordinates pinpointed", { id: 'geo' });
                }
            },
            (err) => {
                toast.error("Failed to detect location", { id: 'geo' });
            },
            { enableHighAccuracy: true }
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const fullAddress = `${formData.houseNo}, ${formData.area} ${formData.landmark ? '(' + formData.landmark + ')' : ''}`;
            const dataToSave = { ...formData, address: fullAddress };

            let res;
            if (editingId) {
                res = await axios.put(`http://localhost:5000/api/user/addresses/${editingId}`, dataToSave);
                toast.success("Address updated");
            } else {
                res = await axios.post('http://localhost:5000/api/user/addresses', dataToSave);
                toast.success("Address added");
            }
            setAddresses(res.data);
            setIsAdding(false);
            setEditingId(null);
            setFormData({ tag: 'Home', houseNo: '', area: '', landmark: '', address: '', lat: 0, lng: 0 });
        } catch (err) {
            toast.error("Failed to save address");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this address?")) return;
        try {
            const res = await axios.delete(`http://localhost:5000/api/user/addresses/${id}`);
            setAddresses(res.data);
            toast.success("Address removed");
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    const handleSelect = async (id) => {
        try {
            const res = await axios.post(`http://localhost:5000/api/user/addresses/${id}/select`);
            updateLocation(res.data.location);
            toast.success("Delivery address updated");
        } catch (err) {
            toast.error("Selection failed");
        }
    };

    const startEdit = (addr) => {
        setEditingId(addr._id);
        setFormData({
            tag: addr.tag, houseNo: addr.houseNo, area: addr.area, landmark: addr.landmark,
            address: addr.address, lat: addr.lat, lng: addr.lng
        });
        setIsAdding(true);
    };

    if (loading) return <div className="p-4">Loading addresses...</div>;

    return (
        <div className="address-book">
            <div className="section-header">
                <h3><MapPin size={20} /> Saved Addresses</h3>
                {!isAdding && (
                    <button className="add-btn-small" onClick={() => setIsAdding(true)}>
                        <Plus size={16} /> Add New
                    </button>
                )}
            </div>

            {isAdding ? (
                <form className="address-form" onSubmit={handleSubmit}>
                    <div className="tag-selector">
                        {['Home', 'Office', 'Other'].map(t => (
                            <button
                                key={t}
                                type="button"
                                className={`tag-btn ${formData.tag === t ? 'active' : ''}`}
                                onClick={() => setFormData({ ...formData, tag: t })}
                            >
                                {t === 'Home' && <Home size={14} />}
                                {t === 'Office' && <Briefcase size={14} />}
                                {t}
                            </button>
                        ))}
                    </div>

                    <div className="form-row">
                        <input
                            required
                            placeholder="Flat / House No. / Building"
                            value={formData.houseNo}
                            onChange={e => setFormData({ ...formData, houseNo: e.target.value })}
                        />
                    </div>
                    <div className="form-row">
                        <input
                            required
                            placeholder="Area / Colony / Street"
                            value={formData.area}
                            onChange={e => setFormData({ ...formData, area: e.target.value })}
                        />
                    </div>
                    <div className="form-row">
                        <input
                            placeholder="Landmark (Optional)"
                            value={formData.landmark}
                            onChange={e => setFormData({ ...formData, landmark: e.target.value })}
                        />
                    </div>

                    <div className="geo-detect-row">
                        <button type="button" className="detect-btn" onClick={handleDetectLocation}>
                            <Navigation size={14} /> Use Precise Current Location
                        </button>
                        {formData.lat !== 0 && <span className="coords-tag">GPS Fixed</span>}
                    </div>

                    <div className="form-actions">
                        <button type="button" className="cancel-btn" onClick={() => { setIsAdding(false); setEditingId(null); }}>Cancel</button>
                        <button type="submit" className="save-btn">{editingId ? 'Update Address' : 'Save Address'}</button>
                    </div>
                </form>
            ) : (
                <div className="address-list">
                    {addresses.length === 0 ? (
                        <div className="empty-state">No saved addresses yet.</div>
                    ) : (
                        addresses.map(addr => (
                            <div key={addr._id} className={`address-card ${user?.location?.address === addr.address ? 'selected' : ''}`}>
                                <div className="addr-main" onClick={() => handleSelect(addr._id)}>
                                    <div className="addr-tag">
                                        {addr.tag === 'Home' ? <Home size={14} /> : addr.tag === 'Office' ? <Briefcase size={14} /> : <MapPin size={14} />}
                                        {addr.tag}
                                        {user?.location?.address === addr.address && <span className="active-badge">Active</span>}
                                    </div>
                                    <p className="full-addr">{addr.address}</p>
                                </div>
                                <div className="addr-actions">
                                    <button onClick={() => startEdit(addr)} title="Edit"><Edit2 size={16} /></button>
                                    <button onClick={() => handleDelete(addr._id)} title="Delete"><Trash2 size={16} /></button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            <style>{`
                .address-book { background: white; border-radius: 1rem; padding: 1.5rem; margin-top: 1.5rem; border: 1px solid #F3F4F6; }
                .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
                .section-header h3 { display: flex; align-items: center; gap: 0.5rem; font-size: 1.1rem; margin: 0; }
                
                .add-btn-small { background: #E0E7FF; color: #4338CA; border: none; padding: 0.5rem 0.75rem; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 4px; font-size: 0.85rem; }
                
                .address-form { display: grid; gap: 1rem; background: #F9FAFB; padding: 1rem; border-radius: 12px; }
                .tag-selector { display: flex; gap: 0.5rem; }
                .tag-btn { display: flex; align-items: center; gap: 4px; padding: 0.4rem 1rem; border-radius: 20px; border: 1px solid #E5E7EB; background: white; cursor: pointer; font-size: 0.85rem; }
                .tag-btn.active { background: #4F46E5; color: white; border-color: #4F46E5; }
                
                .address-form input { padding: 0.75rem; border: 1px solid #E5E7EB; border-radius: 8px; outline: none; }
                .address-form input:focus { border-color: #4F46E5; }
                
                .geo-detect-row { display: flex; align-items: center; gap: 1rem; }
                .detect-btn { background: #ECFDF5; color: #059669; border: 1px solid #D1FAE5; padding: 0.5rem; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 4px; font-size: 0.8rem; font-weight: 600; }
                .coords-tag { font-size: 0.75rem; color: #059669; font-weight: 700; background: #D1FAE5; padding: 2px 6px; border-radius: 4px; }
                
                .form-actions { display: flex; gap: 1rem; margin-top: 0.5rem; }
                .save-btn { flex: 1; background: #4F46E5; color: white; border: none; padding: 0.75rem; border-radius: 8px; font-weight: 700; cursor: pointer; }
                .cancel-btn { flex: 0.5; background: #E5E7EB; border: none; padding: 0.75rem; border-radius: 8px; cursor: pointer; }
                
                .address-list { display: grid; gap: 1rem; }
                .address-card { border: 1px solid #F3F4F6; border-radius: 12px; padding: 1rem; display: flex; justify-content: space-between; align-items: flex-start; transition: 0.2s; cursor: pointer; }
                .address-card:hover { border-color: #4F46E5; background: #F9FAFB; }
                .address-card.selected { border-color: #4F46E5; background: #F5F3FF; }
                
                .addr-main { flex: 1; }
                .addr-tag { display: flex; align-items: center; gap: 4px; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: #6B7280; margin-bottom: 0.5rem; }
                .active-badge { margin-left: auto; background: #4F46E5; color: white; padding: 2px 8px; border-radius: 10px; font-size: 0.65rem; }
                .full-addr { font-size: 0.95rem; color: #111827; line-height: 1.4; margin: 0; }
                
                .addr-actions { display: flex; gap: 0.5rem; }
                .addr-actions button { background: transparent; border: none; color: #9CA3AF; padding: 0.4rem; border-radius: 6px; cursor: pointer; }
                .addr-actions button:hover { color: #4F46E5; background: white; }
            `}</style>
        </div>
    );
}
