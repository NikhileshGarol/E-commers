import React, { useState } from 'react';
import axios from 'axios';
import { Upload, Package, Ruler, Hash, Image as ImageIcon, CheckCircle2, Layers } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_CONFIG } from '../../Api';

export default function AddProduct() {
    const [formData, setFormData] = useState({
        name: '',
        category: 'fresh-vegetables',
        price: '',
        unit: 'kg',
        image: ''
    });

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${API_CONFIG.BASE_URL}/api/products`, formData);
            toast.success('Product Added Successfully!');
            setFormData({ name: '', category: 'fresh-vegetables', price: '', unit: 'kg', image: '' });
        } catch (error) {
            toast.error('Failed to add product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-product-container">
            <header className="page-header">
                <div>
                    <h1>Expand Inventory</h1>
                    <p>Add a new product to your store listing for customers to browse.</p>
                </div>
            </header>

            <div className="form-card-main">
                <form onSubmit={handleSubmit} className="premium-form">
                    <div className="form-section">
                        <div className="section-title">
                            <Package size={18} />
                            <span>Core Details</span>
                        </div>
                        <div className="form-group">
                            <label>Product Title</label>
                            <div className="input-with-icon">
                                <Package className="icon" size={18} />
                                <input
                                    type="text"
                                    placeholder="e.g. Alphonso Mangoes (Grade A)"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Category</label>
                                <div className="input-with-icon">
                                    <Layers className="icon" size={18} />
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="fresh-vegetables">Fresh Vegetables</option>
                                        <option value="fruits">Fruits</option>
                                        <option value="atta-rice">Atta & Rice</option>
                                        <option value="dairy-milk">Dairy & Milk</option>
                                        <option value="snacks">Snacks & Drinks</option>
                                        <option value="household">Household Items</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Selling Unit</label>
                                <div className="input-with-icon">
                                    <Ruler className="icon" size={18} />
                                    <select
                                        value={formData.unit}
                                        onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                                    >
                                        <option value="kg">kilogram (kg)</option>
                                        <option value="g">gram (g)</option>
                                        <option value="L">Litre (L)</option>
                                        <option value="ml">millilitre (ml)</option>
                                        <option value="pcs">piece (pcs)</option>
                                        <option value="packet">packet</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <div className="section-title">
                            <Hash size={18} />
                            <span>Pricing & Media</span>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Store Price (₹)</label>
                                <div className="input-with-icon">
                                    <span className="currency-symbol">₹</span>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Product Image Link</label>
                                <div className="input-with-icon">
                                    <ImageIcon className="icon" size={18} />
                                    <input
                                        type="url"
                                        placeholder="https://images.unsplash.com/..."
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {formData.image && (
                            <div className="image-preview-box">
                                <img src={formData.image} alt="Preview" onError={(e) => e.target.style.display = 'none'} />
                                <div className="preview-label">Live Preview</div>
                            </div>
                        )}
                    </div>

                    <div className="form-footer">
                        <button type="submit" className="btn-primary-lg" disabled={loading}>
                            {loading ? (
                                <div className="loader"></div>
                            ) : (
                                <><CheckCircle2 size={20} /> Publish Product</>
                            )}
                        </button>
                    </div>
                </form>
            </div>

            <style>{`
                .add-product-container { padding: 1.5rem; max-width: 800px; margin: 0 auto; }
                .page-header { margin-bottom: 2.5rem; }
                .page-header h1 { font-size: 2rem; color: #111827; margin: 0; }
                .page-header p { color: #6B7280; font-size: 1rem; margin-top: 0.25rem; }

                .form-card-main { background: white; border-radius: 1.5rem; border: 1px solid #F3F4F6; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); overflow: hidden; }
                .premium-form { padding: 2.5rem; }
                
                .form-section { margin-bottom: 2.5rem; }
                .section-title { display: flex; align-items: center; gap: 0.75rem; color: #374151; font-weight: 700; font-size: 1rem; margin-bottom: 1.5rem; padding-bottom: 0.75rem; border-bottom: 2px solid #F3F4F6; }
                .section-title svg { color: #10B981; }

                .form-group { margin-bottom: 1.5rem; }
                .form-group label { display: block; font-size: 0.85rem; font-weight: 700; color: #4B5563; margin-bottom: 0.6rem; }
                
                .input-with-icon { 
                    position: relative; 
                    display: flex; 
                    align-items: center; 
                    background: #F9FAFB; 
                    border: 2px solid #F3F4F6; 
                    border-radius: 12px; 
                    transition: 0.2s; 
                }
                .input-with-icon:focus-within { 
                    border-color: #10B981; 
                    background: white; 
                    box-shadow: 0 0 0 4px #ECFDF5; 
                }
                
                .input-with-icon .icon, .currency-symbol { 
                    position: absolute; 
                    left: 1rem; 
                    color: #9CA3AF; 
                    pointer-events: none;
                    z-index: 2;
                }
                .currency-symbol { font-weight: 800; font-size: 1rem; color: #10B981; }

                .input-with-icon input, .input-with-icon select { 
                    width: 100%; 
                    background: transparent; 
                    border: none; 
                    padding: 0.85rem 1rem 0.85rem 2.85rem; 
                    font-size: 1rem; 
                    outline: none; 
                    color: #111827; 
                    -webkit-appearance: none;
                    -moz-appearance: none;
                    appearance: none;
                }

                /* Unique styling for selects within icon wrapper */
                .input-with-icon select {
                    cursor: pointer;
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
                    background-repeat: no-repeat;
                    background-position: right 1rem center;
                    background-size: 1.2rem;
                    padding-right: 2.85rem;
                }

                .input-with-icon:focus-within select {
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2310B981' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
                }

                .input-with-icon select::-ms-expand {
                    display: none;
                }
                
                .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
                
                .image-preview-box { margin-top: 1rem; border-radius: 12px; overflow: hidden; position: relative; border: 2px solid #F3F4F6; aspect-ratio: 16/9; }
                .image-preview-box img { width: 100%; height: 100%; object-fit: cover; }
                .preview-label { position: absolute; top: 1rem; right: 1rem; background: rgba(0,0,0,0.6); color: white; padding: 4px 10px; border-radius: 6px; font-size: 0.7rem; font-weight: 700; backdrop-filter: blur(4px); }

                .form-footer { margin-top: 1rem; }
                .btn-primary-lg { width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.75rem; background: #10B981; color: white; border: none; padding: 1.125rem; border-radius: 14px; font-size: 1.1rem; font-weight: 800; cursor: pointer; transition: 0.2s; }
                .btn-primary-lg:hover { background: #059669; transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(16, 185, 129, 0.3); }
                .btn-primary-lg:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

                .loader { width: 24px; height: 24px; border: 3px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }

                @media (max-width: 640px) {
                    .form-row { grid-template-columns: 1fr; }
                    .premium-form { padding: 1.5rem; }
                }
            `}</style>
        </div>
    );
}
