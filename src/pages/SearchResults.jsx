import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Star, Plus, SearchX } from 'lucide-react';
import useCartStore from '../store/useCartStore';
import { API_CONFIG } from '../Api';

export default function SearchResults() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const addToCart = useCartStore((state) => state.addToCart);

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${API_CONFIG.BASE_URL}/api/products/search?q=${query}`);
                setProducts(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (query) {
            fetchResults();
        }
    }, [query]);

    return (
        <div className="search-page">
            <div className="container">
                <h1>Search Results for "{query}"</h1>

                {loading ? (
                    <p>Searching...</p>
                ) : products.length > 0 ? (
                    <div className="products-grid">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} addToCart={addToCart} />
                        ))}
                    </div>
                ) : (
                    <div className="no-results">
                        <SearchX size={48} />
                        <p>No products found matching "{query}"</p>
                        <Link to="/" className="btn btn-primary">Browse Categories</Link>
                    </div>
                )}
            </div>

            <style>{`
        .search-page { padding: 2rem 0; min-height: 80vh; background: #F9FAFB; }
        .search-page h1 { margin-bottom: 2rem; }
        
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 1.5rem;
        }

        .no-results {
           text-align: center;
           padding: 4rem 0;
           color: var(--text-secondary);
           display: flex;
           flex-direction: column;
           align-items: center;
           gap: 1rem;
        }
      `}</style>
        </div>
    );
}

function ProductCard({ product, addToCart }) {
    // Reusing ProductCard styles from global or duplicated for now
    // In a real app, this should be a shared component
    const [isAdded, setIsAdded] = useState(false);

    const handleAdd = () => {
        addToCart(product);
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    return (
        <div className="product-card">
            <div className="product-img">
                <img src={product.image} alt={product.name} />
                <span className="rating-badge"><Star size={12} fill="currentColor" /> {product.rating}</span>
            </div>

            <div className="product-content">
                <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="unit">{product.unit}</p>
                </div>

                <div className="product-footer">
                    <div className="price">₹{product.price}</div>
                    <button
                        className={`add-btn ${isAdded ? 'added' : ''}`}
                        onClick={handleAdd}
                    >
                        {isAdded ? 'Added' : 'Add'}
                        {!isAdded && <Plus size={16} />}
                    </button>
                </div>
            </div>

            {/* Inline styles for this specific instance to ensure it looks right without external css file dependency */}
            <style>{`
          .product-card { background: white; border-radius: 12px; overflow: hidden; border: 1px solid #F3F4F6; }
          .product-img { height: 160px; position: relative; background: #F3F4F6; }
          .product-img img { width: 100%; height: 100%; object-fit: cover; }
          .rating-badge { position: absolute; bottom: 8px; left: 8px; background: rgba(255,255,255,0.9); padding: 2px 6px; border-radius: 4px; font-size: 0.75rem; font-weight: 600; display: flex; align-items: center; gap: 2px; }
          .product-content { padding: 1rem; }
          .product-info h3 { font-size: 1rem; margin-bottom: 0.25rem; color: #111827; }
          .unit { font-size: 0.85rem; color: #9CA3AF; margin-bottom: 1rem; }
          .product-footer { display: flex; justify-content: space-between; align-items: center; }
          .price { font-weight: 700; font-size: 1.1rem; color: #111827; }
          .add-btn { background: #ECFDF5; color: #059669; border: 1px solid #D1FAE5; padding: 0.4rem 0.8rem; border-radius: 8px; font-weight: 600; font-size: 0.9rem; display: flex; align-items: center; gap: 4px; cursor: pointer; }
          .add-btn:hover { background: #059669; color: white; }
          .add-btn.added { background: #059669; color: white; }
        `}</style>
        </div>
    );
}
