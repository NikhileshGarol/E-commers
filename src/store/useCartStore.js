import { create } from 'zustand';

const useCartStore = create((set) => ({
    cart: [],

    // Helper to get ID consistently
    getId: (item) => item._id || item.id,

    // Add item to cart
    addToCart: (product) => set((state) => {
        const pId = product._id || product.id;
        const existingItem = state.cart.find(item => (item._id || item.id) === pId);

        if (existingItem) {
            return {
                cart: state.cart.map(item =>
                    (item._id || item.id) === pId
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            };
        }
        return { cart: [...state.cart, { ...product, quantity: 1 }] };
    }),

    // Remove item from cart
    removeFromCart: (productId) => set((state) => ({
        cart: state.cart.filter(item => (item._id || item.id) !== productId)
    })),

    // Update quantity
    updateQuantity: (productId, quantity) => set((state) => ({
        cart: state.cart.map(item =>
            (item._id || item.id) === productId ? { ...item, quantity } : item
        ).filter(item => item.quantity > 0)
    })),

    // Clear cart
    clearCart: () => set({ cart: [] }),

    // Get total price
    getTotalPrice: () => {
        return (state) => state.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    // Get total items
    getTotalItems: () => {
        return (state) => state.cart.reduce((total, item) => total + item.quantity, 0);
    }
}));

export default useCartStore;
