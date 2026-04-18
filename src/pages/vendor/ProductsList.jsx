import React, { useEffect, useState } from 'react';
import { Package, Trash2, Plus, Edit, Search, Tag, MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_CONFIG } from '../../Api';

export default function VendorProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await axios.get(`${API_CONFIG.BASE_URL}/api/vendor-products`);
            setProducts(res.data);
            setLoading(false);
        } catch (err) {
            toast.error("Failed to load products");
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Remove this product from your store?")) return;
        try {
            await axios.delete(`${API_CONFIG.BASE_URL}/api/products/${id}`);
            toast.success("Product removed from listing");
            setProducts(products.filter(p => p._id !== id));
        } catch (err) {
            toast.error("Delete operation failed");
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="loading-state">Syncing store inventory...</div>;

    return (
        <div className="product-management">
            <header className="page-header">
                <div className="title-area">
                    <h1>Store Inventory</h1>
                    <p>Manage your product catalog, pricing, and stock status.</p>
                </div>
                <div className="header-actions">
                    <div className="search-bar-premium">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search products or categories..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Link to="/vendor/add-product" className="btn-primary">
                        <Plus size={18} /> Add Product
                    </Link>
                </div>
            </header>

            <div className="inventory-stats">
                <div className="stat-mini">
                    <span className="label">Total SKUs</span>
                    <span className="value">{products.length}</span>
                </div>
                <div className="stat-mini">
                    <span className="label">Live Online</span>
                    <span className="value">{products.length}</span>
                </div>
            </div>

            <div className="products-grid">
                {filteredProducts.length === 0 ? (
                    <div className="empty-inventory">
                        <Package size={64} />
                        <h3>Inventory is empty</h3>
                        <p>Start adding products to see them listed in your store.</p>
                        <Link to="/vendor/add-product" className="btn-outline">Add Your First Product</Link>
                    </div>
                ) : (
                    filteredProducts.map(product => (
                        <div key={product._id} className="premium-product-card">
                            <div className="product-image">
                                <img src={product.image} alt={product.name} />
                                <div className="product-tag">{product.category.replace('-', ' ')}</div>
                            </div>
                            <div className="product-info">
                                <div className="info-header">
                                    <h4>{product.name}</h4>
                                    <button className="btn-more"><MoreVertical size={16} /></button>
                                </div>
                                <div className="pricing">
                                    <span className="price">₹{product.price}</span>
                                    <span className="unit">per {product.unit}</span>
                                </div>
                                <div className="card-actions">
                                    <button className="btn-edit-action"><Edit size={16} /> Edit Details</button>
                                    <button onClick={() => handleDelete(product._id)} className="btn-delete-action" title="Remove Product">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <style>{`
                .product-management { padding: 1.5rem; max-width: 1200px; margin: 0 auto; }
                .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
                .page-header h1 { font-size: 1.75rem; color: #111827; margin: 0; }
                .page-header p { color: #6B7280; font-size: 0.95rem; margin-top: 0.25rem; }
                
                .header-actions { display: flex; gap: 1rem; align-items: center; }
                .search-bar-premium { display: flex; align-items: center; gap: 0.75rem; background: white; border: 1px solid #E5E7EB; padding: 0.65rem 1rem; border-radius: 12px; min-width: 320px; transition: 0.2s; }
                .search-bar-premium:focus-within { border-color: #10B981; box-shadow: 0 0 0 4px #ECFDF5; }
                .search-bar-premium input { border: none; outline: none; width: 100%; font-size: 0.95rem; }
                .search-bar-premium svg { color: #9CA3AF; }

                .btn-primary { display: flex; align-items: center; gap: 0.5rem; background: #10B981; color: white; border: none; padding: 0.75rem 1.25rem; border-radius: 12px; font-weight: 700; cursor: pointer; text-decoration: none; transition: 0.2s; }
                .btn-primary:hover { background: #059669; transform: translateY(-1px); box-shadow: 0 4px 6px -1px rgba(16, 185, 129, 0.2); }

                .inventory-stats { display: flex; gap: 2rem; margin-bottom: 2rem; background: white; padding: 1.25rem 2rem; border-radius: 1.25rem; border: 1px solid #F3F4F6; }
                .stat-mini { display: flex; flex-direction: column; }
                .stat-mini .label { font-size: 0.75rem; font-weight: 700; color: #9CA3AF; text-transform: uppercase; letter-spacing: 0.05em; }
                .stat-mini .value { font-size: 1.5rem; font-weight: 800; color: #111827; }

                .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }
                .premium-product-card { background: white; border-radius: 1.25rem; border: 1px solid #F3F4F6; box-shadow: 0 1px 3px rgba(0,0,0,0.05); overflow: hidden; transition: 0.2s; display: flex; flex-direction: column; }
                .premium-product-card:hover { transform: translateY(-4px); box-shadow: 0 12px 20px -8px rgba(0,0,0,0.1); }
                
                .product-image { height: 180px; position: relative; }
                .product-image img { width: 100%; height: 100%; object-fit: cover; }
                .product-tag { position: absolute; bottom: 0.75rem; left: 0.75rem; background: rgba(255,255,255,0.9); color: #10B981; padding: 4px 10px; border-radius: 6px; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; backdrop-filter: blur(4px); }

                .product-info { padding: 1.25rem; flex: 1; display: flex; flex-direction: column; }
                .info-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; }
                .info-header h4 { margin: 0; font-size: 1.1rem; color: #111827; font-weight: 700; }
                .btn-more { background: none; border: none; color: #9CA3AF; cursor: pointer; padding: 4px; border-radius: 6px; }
                .btn-more:hover { background: #F3F4F6; color: #111827; }

                .pricing { margin-bottom: 1.25rem; }
                .pricing .price { font-size: 1.25rem; font-weight: 800; color: #10B981; }
                .pricing .unit { font-size: 0.85rem; color: #6B7280; margin-left: 0.4rem; }

                .card-actions { display: flex; gap: 0.75rem; margin-top: auto; }
                .btn-edit-action { flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; background: #F3F4F6; color: #374151; border: none; padding: 0.6rem; border-radius: 10px; font-size: 0.85rem; font-weight: 700; cursor: pointer; transition: 0.2s; }
                .btn-edit-action:hover { background: #E5E7EB; }
                .btn-delete-action { width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; background: #FEE2E2; color: #EF4444; border: none; border-radius: 10px; cursor: pointer; transition: 0.2s; }
                .btn-delete-action:hover { background: #FECACA; }

                .empty-inventory { grid-column: 1 / -1; text-align: center; padding: 5rem 2rem; background: #F9FAFB; border-radius: 1.5rem; border: 2px dashed #E5E7EB; }
                .empty-inventory svg { color: #9CA3AF; margin-bottom: 1.5rem; }
                .empty-inventory h3 { font-size: 1.5rem; color: #111827; margin: 0; }
                .empty-inventory p { color: #6B7280; margin: 0.5rem 0 1.5rem 0; }
                .btn-outline { display: inline-block; border: 2px solid #10B981; color: #10B981; padding: 0.75rem 1.5rem; border-radius: 12px; font-weight: 700; text-decoration: none; transition: 0.2s; }
                .btn-outline:hover { background: #10B981; color: white; }

                .loading-state { display: flex; justify-content: center; align-items: center; min-height: 400px; color: #6B7280; font-weight: 700; }

                @media (max-width: 768px) {
                    .page-header { flex-direction: column; gap: 1.5rem; }
                    .header-actions { width: 100%; flex-direction: column; }
                    .search-bar-premium { width: 100%; min-width: 0; }
                    .btn-primary { width: 100%; justify-content: center; }
                }
            `}</style>
        </div>
    );
}
