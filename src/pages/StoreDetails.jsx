import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, Phone, Package, ArrowLeft, Search, ShoppingBag, Clock, ShieldCheck, Plus } from 'lucide-react';
import axios from 'axios';
import useCartStore from '../store/useCartStore';
import toast from 'react-hot-toast';

export default function StoreDetails() {
    const { vendorId } = useParams();
    const [vendor, setVendor] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const addToCart = useCartStore((state) => state.addToCart);

    useEffect(() => {
        const fetchStoreData = async () => {
            try {
                const [vendorRes, productsRes] = await Promise.all([
                    axios.get(`http://localhost:5000/api/vendors/${vendorId}`),
                    axios.get(`http://localhost:5000/api/vendors/${vendorId}/products`)
                ]);
                setVendor(vendorRes.data);
                setProducts(productsRes.data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch store details", err);
                toast.error("Store not found");
                setLoading(false);
            }
        };
        fetchStoreData();
    }, [vendorId]);

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="store-loading-view">
            <div className="store-loader-ring"></div>
            <p>Entering the store aisles...</p>
        </div>
    );

    if (!vendor) return <div className="store-error">404: Store not found.</div>;

    return (
        <div className="store-portal">
            <div className="container">
                <header className="store-nav-minimal">
                    <Link to="/" className="btn-back-link">
                        <ArrowLeft size={18} /> Exit Store
                    </Link>
                    <div className="store-status-pill">
                        <div className="pulse-dot"></div> Open & Delivering
                    </div>
                </header>

                <div className="store-profile-banner">
                    <div className="banner-visual">
                        <img src={vendor.store_image || "https://images.unsplash.com/photo-1604719312566-b7cb041eb416?auto=format&fit=crop&w=1200&q=80"} alt={vendor.store_name} />
                        <div className="banner-dim"></div>
                    </div>

                    <div className="store-identity-overlay">
                        <div className="store-square-avatar">
                            {vendor.store_name?.[0].toUpperCase() || 'S'}
                        </div>
                        <div className="store-text-box">
                            <div className="store-rating-top"><Star size={14} fill="white" stroke="none" /> {vendor.store_rating || '4.5'}</div>
                            <h1>{vendor.store_name || vendor.name}</h1>
                            <p className="store-desc-large">{vendor.store_description || 'Your reliable neighborhood store for fresh daily essentials and grocery items.'}</p>

                            <div className="store-footer-stats">
                                <div className="s-stat"><MapPin size={16} /> {vendor.location?.address?.split(',')[0] || 'Local Neighborhood'}</div>
                                <div className="s-stat"><Clock size={16} /> 15-20 Mins Delivery</div>
                                <div className="s-stat"><ShieldCheck size={16} /> Verified Merchant</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="catalog-browser">
                    <div className="catalog-toolbar">
                        <div className="catalog-title-side">
                            <h2>In-Store Catalog</h2>
                            <p>{filteredProducts.length} items available today</p>
                        </div>
                        <div className="search-bar-standalone">
                            <Search size={20} className="ico" />
                            <input
                                type="text"
                                placeholder="Search from this store..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="store-items-grid">
                        {filteredProducts.length === 0 ? (
                            <div className="empty-catalog-box">
                                <p>No items match your search. Try looking for something else!</p>
                            </div>
                        ) : (
                            filteredProducts.map(product => (
                                <ProductCardV3 key={product._id} product={product} addToCart={addToCart} />
                            ))
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                .store-portal { padding: 2rem 0 8rem; background: #F8FAFC; min-height: 100vh; }
                .container { max-width: 1100px; margin: 0 auto; padding: 0 1.5rem; }

                .store-nav-minimal { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
                .btn-back-link { text-decoration: none; color: #94A3B8; font-weight: 800; display: flex; align-items: center; gap: 8px; transition: 0.2s; }
                .btn-back-link:hover { color: #10B981; }
                
                .store-status-pill { background: #ECFDF5; color: #059669; padding: 6px 14px; border-radius: 50px; font-size: 0.75rem; font-weight: 800; display: flex; align-items: center; gap: 8px; text-transform: uppercase; letter-spacing: 0.05em; }
                .pulse-dot { width: 8px; height: 8px; background: #10B981; border-radius: 50%; animation: pulseStatus 1.5s infinite; }
                @keyframes pulseStatus { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.5); opacity: 0.4; } 100% { transform: scale(1); opacity: 1; } }

                .store-profile-banner { position: relative; border-radius: 2.5rem; overflow: hidden; margin-bottom: 4rem; box-shadow: 0 20px 40px -20px rgba(0,0,0,0.1); }
                .banner-visual { height: 350px; position: relative; }
                .banner-visual img { width: 100%; height: 100%; object-fit: cover; }
                .banner-dim { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 60%, transparent 100%); }

                .store-identity-overlay { position: absolute; bottom: 0; left: 0; right: 0; padding: 3rem; display: flex; align-items: flex-end; gap: 2.5rem; z-index: 2; }
                .store-square-avatar { width: 140px; height: 140px; background: #10B981; color: white; border-radius: 2rem; border: 6px solid white; display: flex; align-items: center; justify-content: center; font-size: 3.5rem; font-weight: 900; box-shadow: 0 10px 20px rgba(0,0,0,0.2); flex-shrink: 0; }
                
                .store-text-box { flex: 1; color: white; }
                .store-rating-top { display: inline-flex; align-items: center; gap: 6px; background: #10B981; padding: 4px 12px; border-radius: 8px; font-weight: 800; font-size: 0.9rem; margin-bottom: 1rem; }
                .store-text-box h1 { font-size: 3rem; font-weight: 950; margin: 0; letter-spacing: -0.04em; }
                .store-desc-large { font-size: 1.15rem; color: rgba(255,255,255,0.8); margin: 0.75rem 0 2rem; max-width: 600px; line-height: 1.5; font-weight: 500; }
                
                .store-footer-stats { display: flex; gap: 2rem; border-top: 1px solid rgba(255,255,255,0.15); padding-top: 2rem; }
                .s-stat { display: flex; align-items: center; gap: 8px; font-size: 0.95rem; color: rgba(255,255,255,0.9); font-weight: 700; }

                /* Catalog Browser */
                .catalog-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3rem; }
                .catalog-title-side h2 { font-size: 1.85rem; font-weight: 900; color: #0F172A; margin: 0; }
                .catalog-title-side p { color: #94A3B8; font-weight: 700; margin: 4px 0 0; }
                
                .search-bar-standalone { background: white; border: 1px solid #E2E8F0; padding: 0.85rem 1.5rem; border-radius: 16px; display: flex; align-items: center; gap: 1rem; width: 350px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); }
                .search-bar-standalone .ico { color: #94A3B8; }
                .search-bar-standalone input { border: none; outline: none; font-size: 1rem; width: 100%; font-weight: 600; }

                .store-items-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 2.5rem; }
                .empty-catalog-box { grid-column: 1/-1; text-align: center; padding: 5rem; background: white; border-radius: 2rem; color: #94A3B8; font-weight: 700; border: 2px dashed #E2E8F0; }

                .store-loading-view { min-height: 80vh; display: flex; flex-direction: column; align-items: center; justify-content: center; }
                .store-loader-ring { width: 50px; height: 50px; border: 4px solid #F1F5F9; border-top-color: #10B981; border-radius: 50%; animation: spinS 1s linear infinite; }
                @keyframes spinS { to { transform: rotate(360deg); } }

                @media (max-width: 900px) {
                    .store-identity-overlay { flex-direction: column; align-items: center; text-align: center; }
                    .store-footer-stats { justify-content: center; }
                    .catalog-toolbar { flex-direction: column; gap: 2rem; align-items: flex-start; }
                    .search-bar-standalone { width: 100%; }
                }
            `}</style>
        </div>
    );
}

function ProductCardV3({ product, addToCart }) {
    const [isAdded, setIsAdded] = useState(false);

    const handleAdd = () => {
        setIsAdded(true);
        addToCart(product);
        toast.success(`Picked ${product.name}!`, { icon: '🛒' });
        setTimeout(() => setIsAdded(false), 800);
    };

    return (
        <div className="p-card-v3">
            <div className="p-img">
                <img src={product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80'} alt={product.name} />
                <div className="p-badge-v3">Fresh</div>
            </div>
            <div className="p-info-v3">
                <div className="p-meta">
                    <span className="unit">{product.unit || 'per unit'}</span>
                </div>
                <h3>{product.name}</h3>
                <div className="p-footer-v3">
                    <div className="p-price">₹{product.price}</div>
                    <button className={`p-btn-v3 ${isAdded ? 'added' : ''}`} onClick={handleAdd}>
                        {isAdded ? 'Added' : <><Plus size={16} /> Buy</>}
                    </button>
                </div>
            </div>

            <style>{`
                .p-card-v3 { background: white; border-radius: 24px; border: 1px solid #F1F5F9; overflow: hidden; transition: 0.3s cubic-bezier(0.19, 1, 0.22, 1); }
                .p-card-v3:hover { transform: translateY(-10px); border-color: #E2E8F0; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.1); }
                
                .p-img { height: 200px; padding: 1.5rem; background: #F8FAFC; position: relative; }
                .p-img img { width: 100%; height: 100%; object-fit: contain; transition: 0.5s; }
                .p-card-v3:hover .p-img img { transform: scale(1.1); }
                
                .p-badge-v3 { position: absolute; top: 1.25rem; left: 1.25rem; background: #10B981; color: white; padding: 4px 10px; border-radius: 8px; font-size: 0.6rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; }
                
                .p-info-v3 { padding: 1.5rem; }
                .p-info-v3 h3 { font-size: 1.1rem; color: #0F172A; margin: 0 0 1.25rem; font-weight: 800; line-height: 1.4; }
                
                .p-meta { margin-bottom: 4px; }
                .unit { font-size: 0.8rem; color: #94A3B8; font-weight: 800; text-transform: uppercase; }
                
                .p-footer-v3 { display: flex; justify-content: space-between; align-items: center; }
                .p-price { font-size: 1.5rem; font-weight: 950; color: #0F172A; letter-spacing: -0.04em; }
                
                .p-btn-v3 { background: #0F172A; color: white; border: none; padding: 0.6rem 1.25rem; border-radius: 14px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: 0.2s; font-size: 0.9rem; }
                .p-btn-v3:hover { background: #10B981; transform: scale(1.05); }
                .p-btn-v3.added { background: #10B981; }
            `}</style>
        </div>
    );
}
