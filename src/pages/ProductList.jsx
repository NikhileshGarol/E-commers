import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Filter, ShoppingCart, Star, Plus, Search, ChevronRight, LayoutGrid, List } from 'lucide-react';
import useCartStore from '../store/useCartStore';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function ProductList() {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewType, setViewType] = useState('grid');
  const addToCart = useCartStore((state) => state.addToCart);

  const categoryName = categoryId
    ? categoryId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : 'All Products';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5000/api/products?category=${categoryId || ''}`);
        setProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryId]);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="catalog-loading">
      <div className="loader-pulse"></div>
      <p>Gathering fresh {categoryName} items...</p>
    </div>
  );

  return (
    <div className="catalog-page">
      <div className="container">
        {/* Breadcrumbs & Header */}
        <header className="catalog-header">
          <nav className="breadcrumb">
            <Link to="/">Home</Link>
            <ChevronRight size={14} />
            <span className="current">{categoryName}</span>
          </nav>
          <div className="header-flex">
            <div className="title-area">
              <h1>{categoryName}</h1>
              <p className="item-count">{filteredProducts.length} premium selections found</p>
            </div>
            <div className="controls">
              <div className="search-pill">
                <Search size={18} />
                <input
                  type="text"
                  placeholder={`Search in ${categoryName}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="view-toggle">
                <button className={viewType === 'grid' ? 'active' : ''} onClick={() => setViewType('grid')}><LayoutGrid size={18} /></button>
                <button className={viewType === 'list' ? 'active' : ''} onClick={() => setViewType('list')}><List size={18} /></button>
              </div>
              <button className="filter-pill">
                <Filter size={18} /> <span>Filters</span>
              </button>
            </div>
          </div>
        </header>

        {/* Catalog Grid */}
        {filteredProducts.length === 0 ? (
          <div className="empty-catalog">
            <div className="ghost-icon">👻</div>
            <h3>No items found</h3>
            <p>We couldn't find any products matching your search in this category.</p>
            <button className="btn-reset" onClick={() => setSearchTerm('')}>Reset Search</button>
          </div>
        ) : (
          <div className={`products-showcase ${viewType}`}>
            {filteredProducts.map(product => (
              <ProductCardV2 key={product._id} product={product} addToCart={addToCart} viewType={viewType} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        .catalog-page { padding: 2rem 0 6rem; background: #F8FAFC; min-height: 100vh; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; }

        .breadcrumb { display: flex; align-items: center; gap: 0.5rem; color: #94A3B8; font-size: 0.85rem; font-weight: 600; margin-bottom: 1.5rem; }
        .breadcrumb a { color: #64748B; text-decoration: none; transition: 0.2s; }
        .breadcrumb a:hover { color: #10B981; }
        .breadcrumb .current { color: #10B981; }

        .catalog-header { margin-bottom: 3rem; }
        .header-flex { display: flex; justify-content: space-between; align-items: flex-end; gap: 2rem; }
        .title-area h1 { font-size: 2.5rem; font-weight: 900; color: #0F172A; margin: 0; letter-spacing: -0.02em; }
        .item-count { color: #64748B; margin-top: 0.25rem; font-weight: 600; font-size: 0.95rem; }

        .controls { display: flex; align-items: center; gap: 1rem; }
        .search-pill { background: white; border: 1px solid #E2E8F0; padding: 0.6rem 1rem; border-radius: 12px; display: flex; align-items: center; gap: 0.75rem; width: 300px; transition: 0.2s; }
        .search-pill:focus-within { border-color: #10B981; box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1); }
        .search-pill input { border: none; outline: none; font-size: 0.95rem; width: 100%; font-weight: 500; }
        .search-pill svg { color: #94A3B8; }

        .view-toggle { background: white; border: 1px solid #E2E8F0; border-radius: 12px; display: flex; padding: 3px; }
        .view-toggle button { width: 36px; height: 36px; border: none; background: none; border-radius: 8px; color: #94A3B8; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
        .view-toggle button.active { background: #F1F5F9; color: #10B981; }

        .filter-pill { background: white; border: 1px solid #E2E8F0; padding: 0.6rem 1.25rem; border-radius: 12px; display: flex; align-items: center; gap: 0.75rem; color: #1E293B; font-weight: 700; cursor: pointer; font-size: 0.9rem; transition: 0.2s; }
        .filter-pill:hover { background: #F8FAFC; border-color: #CBD5E1; }

        /* Showcase Grid */
        .products-showcase.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 2rem; }
        .products-showcase.list { display: flex; flex-direction: column; gap: 1rem; }

        .empty-catalog { text-align: center; padding: 6rem 1rem; background: white; border-radius: 2rem; border: 2px dashed #E2E8F0; }
        .ghost-icon { font-size: 4rem; margin-bottom: 1.5rem; display: block; }
        .btn-reset { margin-top: 1.5rem; background: #0F172A; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 12px; font-weight: 700; cursor: pointer; }

        .catalog-loading { display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 60vh; }
        .loader-pulse { width: 48px; height: 48px; background: #10B981; border-radius: 12px; animation: pulseS 1.5s infinite ease-in-out; }
        @keyframes pulseS { 0% { transform: scale(0.8); opacity: 0.5; } 50% { transform: scale(1.1); opacity: 1; } 100% { transform: scale(0.8); opacity: 0.5; } }

        @media (max-width: 900px) {
            .header-flex { flex-direction: column; align-items: flex-start; }
            .search-pill { width: 100%; }
        }
      `}</style>
    </div>
  );
}

function ProductCardV2({ product, addToCart, viewType }) {
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    setIsAdding(true);
    addToCart(product);
    toast.success(`${product.name} added to cart!`, {
      icon: '🛒',
      style: { borderRadius: '12px', background: '#333', color: '#fff' }
    });
    setTimeout(() => setIsAdding(false), 800);
  };

  return (
    <div className={`p-card-v2 ${viewType}`}>
      <div className="p-img-box">
        <img src={product.image} alt={product.name} loading="lazy" />
        <div className="p-badge">{product.category.split('-')[0]}</div>
      </div>

      <div className="p-details">
        <div className="p-header">
          <h4>{product.name}</h4>
          <div className="p-rating"><Star size={12} fill="currentColor" /> {product.rating || '4.2'}</div>
        </div>
        <p className="p-unit">{product.unit || 'per unit'}</p>

        <div className="p-footer">
          <div className="p-price">
            <span className="curr">₹</span>
            <span className="amt">{product.price}</span>
          </div>
          <button className={`p-add-btn ${isAdding ? 'anim-add' : ''}`} onClick={handleAdd} disabled={isAdding}>
            {isAdding ? 'Done!' : <><Plus size={18} /> Add</>}
          </button>
        </div>
      </div>

      <style>{`
        .p-card-v2 { background: white; border-radius: 20px; border: 1px solid #F1F5F9; overflow: hidden; transition: 0.3s; position: relative; }
        .p-card-v2:hover { transform: translateY(-8px); box-shadow: 0 20px 30px -10px rgba(0,0,0,0.08); border-color: #E2E8F0; }
        
        .p-img-box { height: 200px; position: relative; background: #F8FAFC; overflow: hidden; }
        .p-img-box img { width: 100%; height: 100%; object-fit: contain; padding: 1rem; transition: 0.5s; }
        .p-card-v2:hover .p-img-box img { transform: scale(1.1); }
        
        .p-badge { position: absolute; top: 1rem; left: 1rem; background: rgba(255,255,255,0.9); padding: 4px 10px; border-radius: 8px; font-size: 0.65rem; font-weight: 800; text-transform: uppercase; color: #10B981; border: 1px solid #F1F5F9; backdrop-filter: blur(8px); }
        
        .p-details { padding: 1.5rem; }
        .p-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem; }
        .p-header h4 { font-size: 1.1rem; color: #0F172A; margin: 0; font-weight: 800; line-height: 1.4; }
        .p-rating { display: flex; align-items: center; gap: 4px; font-size: 0.75rem; font-weight: 800; color: #F59E0B; background: #FFFBEB; padding: 2px 8px; border-radius: 6px; }
        
        .p-unit { color: #94A3B8; font-size: 0.85rem; font-weight: 600; margin-bottom: 1.5rem; }
        
        .p-footer { display: flex; justify-content: space-between; align-items: center; }
        .p-price { display: flex; align-items: baseline; color: #0F172A; }
        .p-price .curr { font-size: 1rem; font-weight: 800; color: #10B981; margin-right: 2px; }
        .p-price .amt { font-size: 1.6 rem; font-weight: 900; letter-spacing: -0.02em; }
        
        .p-add-btn { background: #0F172A; color: white; border: none; padding: 0.6rem 1.25rem; border-radius: 12px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 6px; transition: 0.2s; font-size: 0.9rem; }
        .p-add-btn:hover { background: #10B981; transform: scale(1.05); }
        .p-add-btn.anim-add { background: #10B981; width: 85px; justify-content: center; }

        /* List View Mode */
        .p-card-v2.list { display: flex; align-items: center; height: 160px; }
        .p-card-v2.list .p-img-box { width: 160px; height: 100%; flex-shrink: 0; }
        .p-card-v2.list .p-details { flex: 1; padding: 0 2rem; display: flex; flex-direction: column; justify-content: center; }
        .p-card-v2.list .p-unit { margin-bottom: 0.5rem; }

        @media (max-width: 640px) {
            .p-card-v2.list { flex-direction: column; height: auto; }
            .p-card-v2.list .p-img-box { width: 100%; height: 200px; }
            .p-card-v2.list .p-details { padding: 1.5rem; }
        }
      `}</style>
    </div>
  );
}
