import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Star, Clock, ShieldCheck, Truck, MapPin, Navigation, Search, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';
import heroImage from '../assets/hero_banner.png';
import useAuthStore from '../store/useAuthStore';
import axios from 'axios';
import LocationPicker from '../components/LocationPicker';

export default function Home() {
  const [vendors, setVendors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const updateLocation = useAuthStore((state) => state.updateLocation);
  const [isDetecting, setIsDetecting] = useState(false);
  const navigate = useNavigate();

  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const handleDetectLocation = () => {
    setIsDetecting(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
            const address = res.data.display_name;
            updateLocation({ lat: latitude, lng: longitude, address: address || "Pinpointed Location" });
            toast.success("Nearby stores unlocked! 🚀");
          } catch (err) {
            updateLocation({ lat: latitude, lng: longitude, address: `Near ${latitude.toFixed(4)}, ${longitude.toFixed(4)}` });
            toast.success("Location set precisely");
          } finally {
            setIsDetecting(false);
          }
        },
        () => {
          toast.error("Location permission required.");
          setIsDetecting(false);
        },
        { enableHighAccuracy: true }
      );
    } else {
      toast.error("Geolocation not supported.");
      setIsDetecting(false);
    }
  };

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        let url = 'http://localhost:5000/api/vendors';
        if (user?.location) {
          url += `?lat=${user.location.lat}&lng=${user.location.lng}`;
        }
        const res = await axios.get(url);
        setVendors(res.data);
      } catch (err) {
        console.error("Failed to fetch vendors", err);
      }
    };
    fetchVendors();
  }, [user]);

  const categories = [
    { name: 'Fresh Vegetables', icon: '🥦', id: 'fresh-vegetables', color: 'linear-gradient(135deg, #DCFCE7 0%, #BBF7D0 100%)' },
    { name: 'Fruits', icon: '🍎', id: 'fruits', color: 'linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%)' },
    { name: 'Dairy & Milk', icon: '🥛', id: 'dairy-milk', color: 'linear-gradient(135deg, #E0F2FE 0%, #BAE6FD 100%)' },
    { name: 'Atta & Rice', icon: '🌾', id: 'atta-rice', color: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)' },
    { name: 'Snacks & Chips', icon: '🍟', id: 'snacks-drinks', color: 'linear-gradient(135deg, #F3E8FF 0%, #E9D5FF 100%)' },
    { name: 'Household', icon: '🧼', id: 'household', color: 'linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%)' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${searchTerm}`);
    }
  };

  return (
    <div className="home-container">
      {/* Dynamic Background Pattern */}
      <div className="bg-pattern"></div>

      {/* Hero Section */}
      <section className="hero-modern">
        <div className="container">
          {!user?.location && (
            <div className="floating-location-cta">
              <div className="cta-icon"><MapPin size={24} /></div>
              <div className="cta-content">
                <h4>Unlock Local Magic</h4>
                <p>Detect your location to see lightning-fast delivery options near you.</p>
              </div>
              <div className="cta-actions">
                <button className="cta-btn primary" onClick={handleDetectLocation} disabled={isDetecting}>
                  {isDetecting ? <div className="loader-mini"></div> : <><Navigation size={18} /> Detect Current</>}
                </button>
                <button className="cta-btn secondary" onClick={() => setIsLocationModalOpen(true)}>
                  Set Manually
                </button>
              </div>
            </div>
          )}

          <div className="hero-layout">
            <div className="hero-main-text">
              <div className="trust-badge">
                <ShieldCheck size={16} /> Trusted by 50,000+ Households
              </div>
              <h1>Your Neighborhood <br /><span className="gradient-text">Kirana Store</span> <br />Directly to You.</h1>
              <p className="hero-subtext">Order from local shops you trust. Fresh essentials delivered in minutes, not hours.</p>

              <form className="hero-search-box" onSubmit={handleSearch}>
                <Search className="search-icon" size={20} />
                <input
                  type="text"
                  placeholder="Search for 'Aashirvaad Atta' or 'Fresh Tomato'..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="search-btn">Find Items</button>
              </form>

              {isAuthenticated && user?.location && (
                <div className="location-context">
                  <div className="delivery-pill" onClick={() => setIsLocationModalOpen(true)}>
                    <MapPin size={14} className="pin" /> Delivery in <strong>15 mins</strong> to <span>{user.location.address?.split(',')[0]}</span>
                  </div>
                  <p className="full-address-hint">{user.location.address}</p>
                </div>
              )}
            </div>

            <div className="hero-visual">
              <div className="delivery-card-overlay top">
                <div className="icon-box green"><Clock size={16} /></div>
                <div>
                  <strong>15 Mins</strong>
                  <span>Avg. Delivery</span>
                </div>
              </div>
              <div className="delivery-card-overlay bottom">
                <div className="icon-box gold"><Star size={16} /></div>
                <div>
                  <strong>4.8 Rating</strong>
                  <span>Store Satisfaction</span>
                </div>
              </div>
              <img src={heroImage} alt="Fresh Groceries" className="main-hero-img" />
              <div className="blob-bg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Location Picker Modal */}
      <LocationPicker
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />

      {/* Trust Pillars */}
      <div className="container">
        <div className="trust-pillars">
          <div className="pillar">
            <div className="p-icon"><Truck size={24} /></div>
            <div className="p-text"><h5>Fast Delivery</h5><p>Under 15 minutes</p></div>
          </div>
          <div className="pillar">
            <div className="p-icon"><ShoppingBag size={24} /></div>
            <div className="p-text"><h5>Local Shops</h5><p>Support neighborhoods</p></div>
          </div>
          <div className="pillar">
            <div className="p-icon"><ShieldCheck size={24} /></div>
            <div className="p-text"><h5>Best Quality</h5><p>Hand-picked for you</p></div>
          </div>
        </div>
      </div>

      {/* Category Section */}
      <section className="category-explorer">
        <div className="container">
          <div className="section-head">
            <h2>Explore Categories</h2>
            <Link to="/search" className="link-arrow">Browse All <ArrowRight size={16} /></Link>
          </div>
          <div className="category-carousel">
            {categories.map((cat) => (
              <Link to={`/category/${cat.id}`} key={cat.id} className="cat-card-modern">
                <div className="cat-visual" style={{ background: cat.color }}>
                  <span className="cat-emoji">{cat.icon}</span>
                </div>
                <h5>{cat.name}</h5>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Nearby Stores */}
      <section className="stores-near-you">
        <div className="container">
          <div className="section-head">
            <div className="title-stack">
              <h2>{user?.location ? 'Stores Near You' : 'Top Performing Stores'}</h2>
              <p>Curated list of the best local markets in your vicinity.</p>
            </div>
          </div>

          <div className="store-grid-premium">
            {vendors.length === 0 ? (
              <div className="no-stores">
                <div className="search-ghost"><Search size={48} /></div>
                <h3>No stores found nearby</h3>
                <p>Try searching for a different area or set your location manually.</p>
              </div>
            ) : (
              vendors.map((shop) => (
                <Link to={`/store/${shop.id}`} key={shop.id} className="store-card-v2">
                  <div className="store-img-wrapper">
                    <img src={shop.store_image || "https://images.unsplash.com/photo-1604719312566-b7cb041eb416?auto=format&fit=crop&w=600&q=80"} alt={shop.name} />
                    <div className="time-overlay">15 MINS</div>
                    <div className="rating-overlay"><Star size={12} fill="white" stroke="none" /> {shop.rating || '4.5'}</div>
                  </div>
                  <div className="store-details">
                    <h4>{shop.name}</h4>
                    <p className="store-address"><MapPin size={12} /> {shop.location?.address || 'Local Area'}</p>
                    <div className="store-footer-meta">
                      <span className="category-tag">{shop.store_description?.split(' ')[0] || 'General Store'}</span>
                      <span className="delivery-status">Free Delivery</span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      <style>{`
        .home-container { position: relative; overflow-x: hidden; background: #FFFFFF; }
        .bg-pattern { position: absolute; inset: 0; background-image: radial-gradient(#F3F4F6 1.5px, transparent 1.5px); background-size: 32px 32px; opacity: 0.4; z-index: 0; }
        
        .container { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; position: relative; z-index: 1; }

        /* Floating Location CTA */
        .floating-location-cta { background: #1E293B; border-radius: 20px; padding: 1.5rem 2.25rem; display: flex; align-items: center; gap: 2rem; margin: 2rem 0; box-shadow: 0 20px 40px -15px rgba(0,0,0,0.3); color: white; animation: floatUp 0.8s ease-out; border: 1px solid rgba(255,255,255,0.1); }
        .cta-icon { width: 56px; height: 56px; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 16px; display: flex; align-items: center; justify-content: center; color: #10B981; }
        .cta-content { flex: 1; }
        .cta-content h4 { font-size: 1.35rem; margin-bottom: 0.25rem; font-weight: 800; }
        .cta-content p { font-size: 0.95rem; opacity: 0.6; font-weight: 500; }
        
        .cta-actions { display: flex; gap: 1rem; }
        .cta-btn { padding: 0.85rem 1.5rem; border-radius: 14px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: 0.3s; font-size: 0.95rem; border: none; }
        .cta-btn.primary { background: #10B981; color: white; }
        .cta-btn.primary:hover { background: #059669; transform: translateY(-3px); box-shadow: 0 10px 20px -5px rgba(16, 185, 129, 0.4); }
        .cta-btn.secondary { background: rgba(255,255,255,0.05); color: white; border: 1px solid rgba(255,255,255,0.1); }
        .cta-btn.secondary:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2); }

        .location-context { margin-bottom: 1rem; }
        .full-address-hint { font-size: 0.75rem; color: #94A3B8; margin: 6px 0 0 4px; font-weight: 600; max-width: 400px; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }

        /* Hero v2 */
        .hero-modern { padding: 4rem 0 6rem; }
        .hero-layout { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 4rem; align-items: center; }
        
        .trust-badge { display: inline-flex; align-items: center; gap: 8px; background: #F1F5F9; color: #475569; padding: 0.4rem 1rem; border-radius: 50px; font-weight: 700; font-size: 0.8rem; margin-bottom: 1.5rem; }
        .hero-main-text h1 { font-size: 4.5rem; font-weight: 900; line-height: 1.1; letter-spacing: -0.04em; margin-bottom: 2rem; }
        .gradient-text { background: linear-gradient(90deg, #10B981 0%, #3B82F6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .hero-subtext { font-size: 1.25rem; color: #64748B; margin-bottom: 3rem; line-height: 1.6; max-width: 500px; }

        .hero-search-box { background: white; border: 2px solid #F1F5F9; border-radius: 20px; padding: 0.75rem; display: flex; align-items: center; gap: 1rem; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); transition: 0.3s; margin-bottom: 2rem; }
        .hero-search-box:focus-within { border-color: #10B981; box-shadow: 0 20px 40px -10px rgba(16, 185, 129, 0.1); }
        .search-icon { color: #94A3B8; margin-left: 0.5rem; }
        .hero-search-box input { flex: 1; border: none; outline: none; font-size: 1.1rem; font-weight: 500; }
        .search-btn { background: #0F172A; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 14px; font-weight: 700; cursor: pointer; transition: 0.2s; }
        .search-btn:hover { background: #1E293B; transform: translateX(2px); }

        .delivery-pill { display: inline-flex; align-items: center; gap: 8px; background: #ECFDF5; border: 1px solid #D1FAE5; color: #065F46; padding: 0.6rem 1.25rem; border-radius: 12px; font-size: 0.9rem; cursor: pointer; transition: 0.2s; }
        .delivery-pill:hover { background: #D1FAE5; transform: scale(1.02); }
        .delivery-pill .pin { color: #10B981; }
        .delivery-pill span { color: #047857; text-decoration: underline; font-weight: 700; }

        .hero-visual { position: relative; }
        .main-hero-img { width: 100%; border-radius: 3rem; position: relative; z-index: 2; box-shadow: 0 30px 60px -15px rgba(0,0,0,0.15); }
        .blob-bg { position: absolute; top: -10%; left: -10%; width: 120%; height: 120%; background: radial-gradient(circle, #D1FAE5 0%, transparent 70%); z-index: 1; }
        
        .delivery-card-overlay { position: absolute; z-index: 3; background: white; padding: 1rem 1.5rem; border-radius: 20px; display: flex; align-items: center; gap: 1rem; box-shadow: 0 15px 30px -5px rgba(0,0,0,0.1); border: 1px solid #F1F5F9; }
        .delivery-card-overlay.top { top: 10%; right: -10%; animation: float 4s ease-in-out infinite; }
        .delivery-card-overlay.bottom { bottom: 10%; left: -10%; animation: float 4s ease-in-out infinite 2s; }
        .icon-box { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
        .icon-box.green { background: #ECFDF5; color: #059669; }
        .icon-box.gold { background: #FFFBEB; color: #D97706; }
        .delivery-card-overlay strong { display: block; font-size: 1rem; color: #0F172A; }
        .delivery-card-overlay span { font-size: 0.75rem; color: #94A3B8; font-weight: 700; text-transform: uppercase; }

        @keyframes float { 0% { transform: translateY(0); } 50% { transform: translateY(-15px); } 100% { transform: translateY(0); } }

        /* Pillars */
        .trust-pillars { display: flex; justify-content: space-between; background: #F8FAFC; padding: 2.5rem; border-radius: 2.5rem; margin-bottom: 6rem; gap: 2rem; border: 1px solid #F1F5F9; }
        .pillar { display: flex; align-items: center; gap: 1.25rem; }
        .p-icon { width: 56px; height: 56px; background: white; border-radius: 16px; display: flex; align-items: center; justify-content: center; color: #10B981; box-shadow: 0 4px 10px rgba(0,0,0,0.03); }
        .p-text h5 { font-size: 1.1rem; margin-bottom: 2px; }
        .p-text p { font-size: 0.85rem; color: #64748B; margin: 0; }

        /* Category Explorer */
        .category-explorer { padding-bottom: 6rem; }
        .section-head { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 3rem; }
        .section-head h2 { font-size: 2.25rem; font-weight: 900; margin: 0; color: #0F172A; }
        .link-arrow { color: #10B981; font-weight: 800; text-decoration: none; display: flex; align-items: center; gap: 8px; transition: 0.2s; }
        .link-arrow:hover { gap: 12px; opacity: 0.8; }

        .category-carousel { display: grid; grid-template-columns: repeat(6, 1fr); gap: 1.5rem; }
        .cat-card-modern { text-decoration: none; text-align: center; transition: 0.3s; }
        .cat-visual { height: 160px; border-radius: 24px; display: flex; align-items: center; justify-content: center; margin-bottom: 1.25rem; transition: 0.3s; }
        .cat-emoji { font-size: 3.5rem; transition: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .cat-card-modern h5 { font-size: 1rem; color: #334155; font-weight: 700; margin: 0; }
        
        .cat-card-modern:hover { transform: translateY(-8px); }
        .cat-card-modern:hover .cat-visual { box-shadow: 0 15px 30px -10px rgba(0,0,0,0.1); }
        .cat-card-modern:hover .cat-emoji { transform: scale(1.2); }

        /* Store Grid */
        .stores-near-you { padding-bottom: 8rem; }
        .title-stack p { color: #64748B; margin: 0.5rem 0 0 0; font-size: 1.1rem; }
        
        .store-grid-premium { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 2.5rem; }
        .store-card-v2 { text-decoration: none; background: white; border-radius: 2rem; overflow: hidden; border: 1px solid #F1F5F9; transition: 0.3s; }
        .store-card-v2:hover { transform: translateY(-10px); box-shadow: 0 30px 60px -20px rgba(0,0,0,0.12); }
        
        .store-img-wrapper { height: 220px; position: relative; overflow: hidden; }
        .store-img-wrapper img { width: 100%; height: 100%; object-fit: cover; transition: 0.5s; }
        .store-card-v2:hover img { transform: scale(1.1); }
        
        .time-overlay { position: absolute; bottom: 1.25rem; left: 1.25rem; background: rgba(255,255,255,0.9); padding: 6px 14px; border-radius: 12px; font-weight: 800; font-size: 0.75rem; color: #0F172A; backdrop-filter: blur(8px); }
        .rating-overlay { position: absolute; top: 1.25rem; right: 1.25rem; background: #10B981; color: white; padding: 6px 14px; border-radius: 12px; font-weight: 800; font-size: 0.8rem; display: flex; align-items: center; gap: 4px; box-shadow: 0 4px 10px rgba(16, 185, 129, 0.3); }

        .store-details { padding: 1.75rem; }
        .store-details h4 { font-size: 1.35rem; font-weight: 800; color: #0F172A; margin: 0 0 0.5rem 0; }
        .store-address { font-size: 0.85rem; color: #94A3B8; display: flex; align-items: center; gap: 6px; margin-bottom: 1.5rem; }
        
        .store-footer-meta { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #F1F5F9; padding-top: 1.25rem; }
        .category-tag { background: #F8FAFC; color: #64748B; padding: 4px 12px; border-radius: 8px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; }
        .delivery-status { color: #10B981; font-weight: 800; font-size: 0.8rem; }

        .loader-mini { width: 18px; height: 18px; border: 3px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 1024px) {
            .hero-layout { grid-template-columns: 1fr; text-align: center; }
            .hero-main-text h1 { font-size: 3rem; }
            .hero-subtext { margin: 0 auto 3rem; }
            .hero-visual { max-width: 500px; margin: 0 auto; }
            .hero-search-box { margin: 2rem auto; }
            .category-carousel { grid-template-columns: repeat(3, 1fr); gap: 2rem; }
            .trust-pillars { flex-direction: column; gap: 2rem; }
        }
      `}</style>
    </div>
  );
}
