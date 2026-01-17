import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Truck, ShieldCheck, CreditCard } from 'lucide-react';
import useCartStore from '../store/useCartStore';

export default function Cart() {
   const navigate = useNavigate();
   const { cart, removeFromCart, updateQuantity, getTotalPrice } = useCartStore();

   const totalPrice = getTotalPrice()(useCartStore.getState());
   const deliveryThreshold = 500;
   const deliveryFee = totalPrice >= deliveryThreshold ? 0 : 40;
   const platformFee = 5;
   const finalTotal = totalPrice + deliveryFee + platformFee;

   const progressToFree = Math.min((totalPrice / deliveryThreshold) * 100, 100);

   if (cart.length === 0) {
      return (
         <div className="empty-bag-view">
            <div className="empty-bag-canvas">
               <div className="empty-bag-icon">
                  <ShoppingBag size={80} />
               </div>
               <h2>Your shopping bag is empty</h2>
               <p>Looks like you haven't discovered our fresh selections yet. Start browsing your neighborhood stores now!</p>
               <Link to="/" className="btn-shop-now">Start Discovering</Link>
            </div>
         </div>
      );
   }

   return (
      <div className="bag-page">
         <div className="container">
            <header className="bag-header">
               <button onClick={() => navigate(-1)} className="btn-back-soft">
                  <ArrowLeft size={18} /> <span>Back</span>
               </button>
               <h1>Shopping Bag <span>({cart.length} items)</span></h1>
            </header>

            <div className="bag-layout">
               <div className="bag-items-container">
                  {/* Free Delivery Promo */}
                  <div className="delivery-promo-card">
                     <div className="promo-head">
                        <div className="icon-wrap"><Truck size={20} /></div>
                        <div className="promo-text">
                           {deliveryFee === 0 ? (
                              <strong>You've unlocked FREE delivery! 🥳</strong>
                           ) : (
                              <strong>Add ₹{deliveryThreshold - totalPrice} more for FREE delivery</strong>
                           )}
                           <p>Standard delivery within 15-20 minutes</p>
                        </div>
                     </div>
                     <div className="progress-outer">
                        <div className="progress-inner" style={{ width: `${progressToFree}%` }}></div>
                     </div>
                  </div>

                  <div className="items-list">
                     {cart.map(item => (
                        <div key={item._id || item.id} className="bag-item-card">
                           <div className="item-visual">
                              <img src={item.image} alt={item.name} />
                           </div>
                           <div className="item-main">
                              <div className="item-top">
                                 <div className="item-identity">
                                    <h3>{item.name}</h3>
                                    <p className="item-unit">{item.unit || 'per unit'}</p>
                                 </div>
                                 <div className="item-price-sticky">
                                    ₹{item.price * item.quantity}
                                 </div>
                              </div>

                              <div className="item-footer">
                                 <div className="qty-stepper-premium">
                                    <button
                                       className="step-btn"
                                       onClick={() => updateQuantity(item._id || item.id, item.quantity - 1)}
                                       disabled={item.quantity <= 1}
                                    >
                                       <Minus size={16} />
                                    </button>
                                    <span className="qty-val">{item.quantity}</span>
                                    <button
                                       className="step-btn"
                                       onClick={() => updateQuantity(item._id || item.id, item.quantity + 1)}
                                    >
                                       <Plus size={16} />
                                    </button>
                                 </div>
                                 <button className="btn-remove-soft" onClick={() => removeFromCart(item._id || item.id)}>
                                    <Trash2 size={16} /> Remove
                                 </button>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>

                  <div className="cart-guarantees">
                     <div className="guarantee"><ShieldCheck size={18} /> 100% Quality Guaranteed</div>
                     <div className="guarantee"><CreditCard size={18} /> Encrypted Payments</div>
                  </div>
               </div>

               <aside className="bag-summary-sidebar">
                  <div className="summary-card-premium">
                     <h3>Checkout Summary</h3>

                     <div className="bill-breakdown">
                        <div className="bill-row">
                           <span>Bag Subtotal</span>
                           <span className="val">₹{totalPrice}</span>
                        </div>
                        <div className="bill-row">
                           <span>Delivery Partner Fee</span>
                           <span className={`val ${deliveryFee === 0 ? 'free' : ''}`}>
                              {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                           </span>
                        </div>
                        <div className="bill-row">
                           <span>Platform Operational Fee</span>
                           <span className="val">₹{platformFee}</span>
                        </div>
                     </div>

                     <div className="bill-divider"></div>

                     <div className="bill-total-row">
                        <div className="total-label">
                           <strong>To Pay</strong>
                           <span>Incl. all taxes & fees</span>
                        </div>
                        <div className="total-val">₹{finalTotal}</div>
                     </div>

                     <button className="btn-checkout-primary" onClick={() => navigate('/checkout')}>
                        Proceed to Checkout <ArrowLeft size={18} style={{ transform: 'rotate(180deg)' }} />
                     </button>

                     <p className="safe-tip">Safe and secure payments. Easy returns within 24 hours.</p>
                  </div>

                  <Link to="/" className="btn-continue-shopping">
                     <ArrowLeft size={16} /> Continue Shopping
                  </Link>
               </aside>
            </div>
         </div>

         <style>{`
            .bag-page { padding: 4rem 0 8rem; background: #F8FAFC; min-height: 100vh; }
            .container { max-width: 1100px; margin: 0 auto; padding: 0 1.5rem; }

            .bag-header { margin-bottom: 3rem; }
            .btn-back-soft { background: none; border: none; display: flex; align-items: center; gap: 8px; color: #94A3B8; font-weight: 700; cursor: pointer; margin-bottom: 1rem; transition: 0.2s; }
            .btn-back-soft:hover { color: #10B981; }
            .bag-header h1 { font-size: 2.5rem; font-weight: 900; color: #0F172A; margin: 0; letter-spacing: -0.02em; }
            .bag-header h1 span { color: #94A3B8; font-weight: 600; font-size: 1.5rem; }

            .bag-layout { display: grid; grid-template-columns: 1fr 380px; gap: 3rem; }
            
            /* Left Side */
            .delivery-promo-card { background: white; border-radius: 20px; padding: 1.5rem; border: 1px solid #F1F5F9; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02); margin-bottom: 2rem; }
            .promo-head { display: flex; gap: 1rem; margin-bottom: 1rem; }
            .icon-wrap { width: 44px; height: 44px; background: #ECFDF5; color: #10B981; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
            .promo-text strong { display: block; font-size: 1rem; color: #0F172A; margin-bottom: 2px; }
            .promo-text p { font-size: 0.8rem; color: #94A3B8; margin: 0; font-weight: 600; }
            .progress-outer { height: 8px; background: #F1F5F9; border-radius: 10px; overflow: hidden; }
            .progress-inner { height: 100%; background: #10B981; border-radius: 10px; transition: 0.8s cubic-bezier(0.19, 1, 0.22, 1); }

            .items-list { background: white; border-radius: 24px; border: 1px solid #F1F5F9; overflow: hidden; margin-bottom: 2rem; }
            .bag-item-card { display: flex; gap: 1.5rem; padding: 1.5rem; border-bottom: 1px solid #F1F5F9; transition: 0.2s; }
            .bag-item-card:last-child { border-bottom: none; }
            .bag-item-card:hover { background: #FAFAFA; }

            .item-visual { width: 100px; height: 100px; background: #F8FAFC; border-radius: 16px; flex-shrink: 0; padding: 0.5rem; overflow: hidden; }
            .item-visual img { width: 100%; height: 100%; object-fit: contain; }

            .item-main { flex: 1; display: flex; flex-direction: column; }
            .item-top { display: flex; justify-content: space-between; margin-bottom: 1rem; }
            .item-identity h3 { font-size: 1.1rem; color: #0F172A; margin: 0 0 0.25rem; font-weight: 800; }
            .item-unit { font-size: 0.85rem; color: #94A3B8; font-weight: 700; margin: 0; }
            .item-price-sticky { font-size: 1.25rem; font-weight: 900; color: #0F172A; }

            .item-footer { display: flex; justify-content: space-between; align-items: center; margin-top: auto; }
            .qty-stepper-premium { display: flex; align-items: center; gap: 1rem; background: #F1F5F9; padding: 4px; border-radius: 12px; }
            .step-btn { width: 32px; height: 32px; border: none; background: white; border-radius: 8px; color: #1E293B; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.05); transition: 0.2s; }
            .step-btn:hover:not(:disabled) { transform: translateY(-1px); color: #10B981; }
            .step-btn:disabled { opacity: 0.4; cursor: not-allowed; }
            .qty-val { font-weight: 800; font-size: 1rem; color: #0F172A; min-width: 20px; text-align: center; }

            .btn-remove-soft { background: none; border: none; font-size: 0.85rem; font-weight: 700; color: #F87171; cursor: pointer; display: flex; align-items: center; gap: 6px; padding: 8px; border-radius: 8px; transition: 0.2s; }
            .btn-remove-soft:hover { background: #FEF2F2; color: #EF4444; }

            .cart-guarantees { display: flex; gap: 2rem; color: #94A3B8; font-size: 0.85rem; font-weight: 700; padding-left: 0.5rem; }
            .guarantee { display: flex; align-items: center; gap: 8px; }

            /* Sidebar */
            .bag-summary-sidebar { position: sticky; top: 100px; height: fit-content; }
            .summary-card-premium { background: white; border-radius: 24px; padding: 2rem; border: 1px solid #F1F5F9; box-shadow: 0 20px 40px -10px rgba(0,0,0,0.05); margin-bottom: 1.5rem; }
            .summary-card-premium h3 { font-size: 1.25rem; font-weight: 900; color: #0F172A; margin: 0 0 1.5rem 0; }

            .bill-breakdown { display: grid; gap: 1rem; margin-bottom: 2rem; }
            .bill-row { display: flex; justify-content: space-between; font-size: 0.95rem; color: #64748B; font-weight: 600; }
            .bill-row .val { color: #1E293B; font-weight: 800; }
            .val.free { color: #10B981; }

            .bill-divider { height: 1px; background: #F1F5F9; margin-bottom: 1.5rem; }

            .bill-total-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
            .total-label strong { display: block; font-size: 1.25rem; color: #0F172A; }
            .total-label span { font-size: 0.75rem; color: #94A3B8; font-weight: 700; }
            .total-val { font-size: 2rem; font-weight: 950; color: #0F172A; letter-spacing: -0.04em; }

            .btn-checkout-primary { width: 100%; border: none; background: #10B981; color: white; padding: 1.25rem; border-radius: 16px; font-weight: 800; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; gap: 1rem; cursor: pointer; transition: 0.3s; box-shadow: 0 10px 20px -5px rgba(16, 185, 129, 0.4); }
            .btn-checkout-primary:hover { background: #059669; transform: translateY(-3px); box-shadow: 0 15px 30px -5px rgba(16, 185, 129, 0.5); }
            
            .safe-tip { text-align: center; color: #94A3B8; font-size: 0.75rem; font-weight: 600; margin: 1.25rem 0 0; }

            .btn-continue-shopping { display: flex; align-items: center; justify-content: center; gap: 8px; color: #64748B; font-weight: 800; font-size: 0.9rem; text-decoration: none; transition: 0.2s; }
            .btn-continue-shopping:hover { color: #0F172A; }

            /* Empty State */
            .empty-bag-view { min-height: 80vh; display: flex; align-items: center; justify-content: center; text-align: center; padding: 2rem; }
            .empty-bag-icon { width: 140px; height: 140px; background: #F1F5F9; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #CBD5E1; margin: 0 auto 2.5rem; }
            .empty-bag-view h2 { font-size: 2rem; font-weight: 900; color: #0F172A; margin-bottom: 1rem; }
            .empty-bag-view p { color: #64748B; max-width: 400px; margin: 0 auto 2.5rem; line-height: 1.6; font-size: 1.1rem; }
            .btn-shop-now { display: inline-block; background: #10B981; color: white; border: none; padding: 1rem 2.5rem; border-radius: 16px; font-weight: 800; text-decoration: none; box-shadow: 0 10px 20px -5px rgba(16, 185, 129, 0.3); transition: 0.3s; }
            .btn-shop-now:hover { transform: translateY(-3px); box-shadow: 0 15px 30px -5px rgba(16, 185, 129, 0.4); }

            @media (max-width: 900px) {
                .bag-layout { grid-template-columns: 1fr; }
                .bag-summary-sidebar { position: static; }
            }
         `}</style>
      </div>
   );
}
