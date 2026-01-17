require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/database');
const User = require('./models/User');
const Product = require('./models/Product');

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = 'kirana-secret-key-change-this';

app.use(cors());
app.use(express.json());

// --- CONNECT DB & SEED ---

connectDB();

const seedDatabase = async () => {
    try {
        const count = await User.countDocuments();
        if (count === 0) {
            console.log('Seeding Database (Fresh)...');
            const hashedPassword = await bcrypt.hash('password123', 10);

            // 1. Admin
            await User.create({
                name: 'Super Admin',
                phone: '9999999999',
                password: hashedPassword,
                role: 'admin'
            });

            // 2. Vendors
            const v1 = await User.create({
                name: 'Suresh Gupta',
                phone: '9876543210',
                password: hashedPassword,
                role: 'vendor',
                store_name: 'Gupta General Store',
                store_rating: 4.5,
                location: { lat: 12.9716, lng: 77.6412, address: 'Indiranagar, Bangalore' },
                store_description: 'Daily essentials and fresh grocery'
            });

            const v2 = await User.create({
                name: 'Priya Singh',
                phone: '9876543211',
                password: hashedPassword,
                role: 'vendor',
                store_name: 'Organic Harvest',
                store_rating: 4.8,
                location: { lat: 12.9352, lng: 77.6245, address: 'Koramangala, Bangalore' },
                store_description: 'Fresh organic fruits and vegetables'
            });

            const v3 = await User.create({
                name: 'Ramesh Kumar',
                phone: '9876543212',
                password: hashedPassword,
                role: 'vendor',
                store_name: 'Modern Dairy & Snacks',
                store_rating: 4.6,
                location: { lat: 12.9141, lng: 77.6411, address: 'HSR Layout, Bangalore' },
                store_description: 'Dairy products and evening snacks'
            });

            console.log('Vendors created. Running product filler...');
        }

        // --- NEW: Product population for EXISTING vendors ---
        const vendors = await User.find({ role: 'vendor' });
        const productTemplates = [
            // Fresh Vegetables
            { name: 'Fresh Tomato', category: 'fresh-vegetables', price: 40, unit: 'kg', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=300&q=80', rating: 4.8 },
            { name: 'Red Onions', category: 'fresh-vegetables', price: 35, unit: 'kg', image: 'https://images.unsplash.com/photo-1508747703725-719777637510?auto=format&fit=crop&w=300&q=80', rating: 4.5 },
            { name: 'New Potatoes', category: 'fresh-vegetables', price: 30, unit: 'kg', image: 'https://images.unsplash.com/photo-1518977676641-8ee04c99ace5?auto=format&fit=crop&w=300&q=80', rating: 4.7 },
            { name: 'Green Chilies', category: 'fresh-vegetables', price: 15, unit: '100g', image: 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=300&q=80', rating: 4.6 },
            { name: 'Fresh Coriander', category: 'fresh-vegetables', price: 10, unit: 'bunch', image: 'https://images.unsplash.com/photo-1514944288352-fffbb99fca3f?auto=format&fit=crop&w=300&q=80', rating: 4.9 },

            // Fruits
            { name: 'Royal Gala Apples', category: 'fruits', price: 180, unit: 'kg', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6bcd6?auto=format&fit=crop&w=300&q=80', rating: 4.9 },
            { name: 'Ripe Bananas', category: 'fruits', price: 60, unit: 'dozen', image: 'https://images.unsplash.com/photo-1571771894821-ad99026a09b7?auto=format&fit=crop&w=300&q=80', rating: 4.7 },
            { name: 'Valencia Oranges', category: 'fruits', price: 120, unit: 'kg', image: 'https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=300&q=80', rating: 4.5 },
            { name: 'Sweet Grapes', category: 'fruits', price: 90, unit: '500g', image: 'https://images.unsplash.com/photo-1537640538966-79f369b41f8f?auto=format&fit=crop&w=300&q=80', rating: 4.4 },

            // Dairy & Milk
            { name: 'Full Cream Milk', category: 'dairy-milk', price: 33, unit: '500ml', image: 'https://images.unsplash.com/photo-1563636619-e910f01ba1e8?auto=format&fit=crop&w=300&q=80', rating: 4.8 },
            { name: 'Fresh Paneer', category: 'dairy-milk', price: 85, unit: '200g', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=300&q=80', rating: 4.7 },
            { name: 'Greek Yogurt', category: 'dairy-milk', price: 50, unit: 'cup', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=300&q=80', rating: 4.6 },
            { name: 'Salted Butter', category: 'dairy-milk', price: 55, unit: '100g', image: 'https://images.unsplash.com/photo-1589985273934-0136666be376?auto=format&fit=crop&w=300&q=80', rating: 4.8 },

            // Atta & Rice
            { name: 'Chakki Fresh Atta', category: 'atta-rice', price: 210, unit: '5kg', image: 'https://images.unsplash.com/photo-1627485204210-d99616d6cf50?auto=format&fit=crop&w=300&q=80', rating: 4.7 },
            { name: 'Basmati Rice Premium', category: 'atta-rice', price: 140, unit: 'kg', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=300&q=80', rating: 4.9 },
            { name: 'Moong Dal', category: 'atta-rice', price: 65, unit: '500g', image: 'https://images.unsplash.com/photo-1585996853123-2868c2957d60?auto=format&fit=crop&w=300&q=80', rating: 4.5 },

            // Snacks & Chips
            { name: 'Classic Salted Chips', category: 'snacks-drinks', price: 20, unit: 'pkt', image: 'https://images.unsplash.com/photo-1566478431375-d57de26f53fb?auto=format&fit=crop&w=300&q=80', rating: 4.3 },
            { name: 'Roasted Almonds', category: 'snacks-drinks', price: 150, unit: '100g', image: 'https://images.unsplash.com/photo-1508061253366-f7da158b6fd9?auto=format&fit=crop&w=300&q=80', rating: 4.8 },
            { name: 'Chocolate Bar', category: 'snacks-drinks', price: 80, unit: 'bar', image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=300&q=80', rating: 4.7 },
            { name: 'Lemonade Sparkle', category: 'snacks-drinks', price: 45, unit: 'bottle', image: 'https://images.unsplash.com/photo-1622483767028-3f66f361ef56?auto=format&fit=crop&w=300&q=80', rating: 4.2 },

            // Household
            { name: 'Dishwash Gel', category: 'household', price: 105, unit: 'bottle', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=300&q=80', rating: 4.5 },
            { name: 'Fabric Surf', category: 'household', price: 250, unit: '1kg', image: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&w=300&q=80', rating: 4.6 },
            { name: 'Scented Surface Cleaner', category: 'household', price: 180, unit: 'bottle', image: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=300&q=80', rating: 4.4 }
        ];

        for (const vendor of vendors) {
            const productCount = await Product.countDocuments({ vendorId: vendor._id });
            if (productCount < 5) { // If a vendor has less than 5 products, assume they need a full catalog
                console.log(`Adding missing products to: ${vendor.store_name || vendor.name}...`);
                const productsToInsert = productTemplates.map(t => ({ ...t, vendorId: vendor._id }));
                await Product.insertMany(productsToInsert);
            }
        }

        console.log('Product catalog audit complete.');
    } catch (err) {
        console.error('Seeding error:', err);
    }
};

// Run Seeder after short delay to ensure connection
setTimeout(seedDatabase, 2000);


// --- UTILS ---

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
    var R = 6371; // km
    var dLat = deg2rad(lat2 - lat1);
    var dLon = deg2rad(lon2 - lon1);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function deg2rad(deg) { return deg * (Math.PI / 180); }

// Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// --- AUTH ENDPOINTS ---

app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, phone, password, role } = req.body;
        // Check exists
        const existingUser = await User.findOne({ phone });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ name, phone, password: hashedPassword, role: role || 'customer' });

        res.status(201).json({ message: 'User created' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { phone, password } = req.body;
        const user = await User.findOne({ phone });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, SECRET_KEY);

        // Prepare user object
        const userObj = {
            id: user._id,
            name: user.name,
            role: user.role,
            location: user.location // Mongoose schema has embedded location
        };

        if (user.role === 'vendor') {
            userObj.store_name = user.store_name;
        }

        res.json({ token, user: userObj });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// --- API ENDPOINTS ---

app.get('/', (req, res) => {
    res.send('KiranaKart API is running...');
});

// --- STATISTICS ENDPOINTS ---

app.get('/api/vendor-stats', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'vendor') return res.sendStatus(403);

        const vendorId = req.user.id;

        // 1. Total Orders
        const totalOrders = await Order.countDocuments({ vendorId });

        // 2. Total Earnings (Only for Delivered orders ideally, but for now all confirmed/delivered)
        const orders = await Order.find({
            vendorId,
            status: { $in: ['Confirmed', 'Delivered', 'Out for Delivery'] }
        });
        const totalEarnings = orders.reduce((sum, order) => sum + order.totalAmount, 0);

        // 3. Total Products
        const totalProducts = await Product.countDocuments({ vendorId });

        res.json({
            totalOrders,
            totalEarnings,
            totalProducts,
            growth: '+10%' // Mock growth
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/admin/stats', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.sendStatus(403);

        const totalOrders = await Order.countDocuments();
        const activeOrders = await Order.countDocuments({ status: { $ne: 'Delivered' } });

        const validOrders = await Order.find({ status: { $in: ['Confirmed', 'Delivered', 'Out for Delivery'] } });
        const totalRevenue = validOrders.reduce((sum, order) => sum + order.totalAmount, 0);

        const totalVendors = await User.countDocuments({ role: 'vendor' });
        const totalCustomers = await User.countDocuments({ role: 'customer' });

        res.json({
            totalRevenue,
            activeOrders,
            totalVendors,
            totalUsers: totalVendors + totalCustomers
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- VENDOR ENDPOINTS ---

app.get('/api/vendors', async (req, res) => {
    try {
        const { lat, lng } = req.query;
        // Find all vendors
        let vendors = await User.find({ role: 'vendor' })
            .select('id name store_name store_rating location phone store_image store_description');

        // Map to frontend expected format
        let mappedVendors = vendors.map(v => ({
            id: v._id,
            name: v.store_name || v.name, // Use store name preferentially
            owner: v.name,
            phone: v.phone,
            rating: v.store_rating,
            store_image: v.store_image,
            store_description: v.store_description,
            location: v.location // { lat, lng, address }
        }));

        if (lat && lng) {
            mappedVendors = mappedVendors.map(v => ({
                ...v,
                distance: getDistanceFromLatLonInKm(lat, lng, v.location?.lat, v.location?.lng)
            })).sort((a, b) => a.distance - b.distance);
        }

        res.json(mappedVendors);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Update Location
app.put('/api/vendors/:id/location', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { lat, lng, address } = req.body;

        // Ensure the authenticated user is the vendor they are trying to update
        if (req.user.role !== 'vendor' || req.user.id !== id) {
            return res.sendStatus(403); // Forbidden
        }

        const updatedUser = await User.findByIdAndUpdate(id, {
            location: { lat, lng, address }
        }, { new: true });

        res.json(updatedUser.location);
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

app.put('/api/user/location', authenticateToken, async (req, res) => {
    try {
        const { lat, lng, address } = req.body;
        const updatedUser = await User.findByIdAndUpdate(req.user.id, {
            location: { lat, lng, address }
        }, { new: true });
        res.json(updatedUser.location);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- ADDRESS MANAGEMENT ---
app.get('/api/user/addresses', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('addresses');
        res.json(user.addresses || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/user/addresses', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const newAddress = { ...req.body, id: undefined }; // Let mongo generate _id
        if (newAddress.isDefault) {
            user.addresses.forEach(a => a.isDefault = false);
        }
        if (user.addresses.length === 0) newAddress.isDefault = true;

        user.addresses.push(newAddress);
        await user.save();
        res.status(201).json(user.addresses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/user/addresses/:id', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const address = user.addresses.id(req.params.id);
        if (!address) return res.status(404).json({ message: 'Address not found' });

        if (req.body.isDefault) {
            user.addresses.forEach(a => a.isDefault = false);
        }

        Object.assign(address, req.body);
        await user.save();
        res.json(user.addresses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/user/addresses/:id', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.addresses.pull(req.params.id);
        await user.save();
        res.json(user.addresses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/user/addresses/:id/select', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const address = user.addresses.id(req.params.id);
        if (!address) return res.status(404).json({ message: 'Address not found' });

        user.location = {
            address: address.address,
            lat: address.lat,
            lng: address.lng
        };
        await user.save();
        res.json({ location: user.location });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Fetch logged in vendor's products
app.get('/api/vendor-products', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'vendor') return res.sendStatus(403);
        const products = await Product.find({ vendorId: req.user.id });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/products', async (req, res) => {
    try {
        const { category, vendorId } = req.query;
        let query = {};
        if (category) query.category = category;
        if (vendorId) query.vendorId = vendorId;

        const products = await Product.find(query);
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/products/:id', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'vendor') return res.sendStatus(403);

        const product = await Product.findOne({ _id: req.params.id, vendorId: req.user.id });
        if (!product) return res.status(404).json({ message: 'Product not found or unauthorized' });

        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/products/search', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.json([]);

        // Mongo Regex Search
        const regex = new RegExp(q, 'i');
        const products = await Product.find({
            $or: [
                { name: regex },
                { category: regex }
            ]
        });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get product by ID
app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/products', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'vendor') return res.sendStatus(403);

        const newProduct = await Product.create({
            vendorId: req.user.id,
            ...req.body
        });
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const Order = require('./models/Order');

// --- ORDER ENDPOINTS ---

// Place Order
app.post('/api/orders', authenticateToken, async (req, res) => {
    try {
        const { items, deliveryAddress, paymentMethod } = req.body;
        const userId = req.user.id;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No items in order' });
        }

        // 1. Group items by Vendor
        const ordersByVendor = {}; // { vendorId: [items...] }

        items.forEach(item => {
            const vId = item.vendorId;
            if (!ordersByVendor[vId]) {
                ordersByVendor[vId] = [];
            }
            ordersByVendor[vId].push({
                productId: item.id || item._id, // Handle both id formats
                name: item.name,
                quantity: item.quantity,
                price: item.price
            });
        });

        // 2. Create an Order for each Vendor
        const createdOrders = [];

        for (const [vendorId, vendorItems] of Object.entries(ordersByVendor)) {
            // Calculate total for this specific vendor's order
            const totalAmount = vendorItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            const order = await Order.create({
                userId,
                vendorId,
                items: vendorItems,
                totalAmount,
                deliveryAddress,
                paymentMethod,
                status: 'Pending'
            });
            createdOrders.push(order);
        }

        res.status(201).json({ message: 'Orders placed successfully', orders: createdOrders });

    } catch (err) {
        console.error("Order Error:", err);
        res.status(500).json({ message: 'Failed to place order', error: err.message });
    }
});

// Get User Orders
app.get('/api/user/orders', authenticateToken, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id })
            .populate('vendorId', 'name store_name') // Get Store Name
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Vendor Orders (For Dashboard)
app.get('/api/vendor/orders', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'vendor') return res.sendStatus(403);

        const orders = await Order.find({ vendorId: req.user.id })
            .populate('userId', 'name phone') // Get Customer Details
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Order Status (Vendor)
app.put('/api/orders/:id/status', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'vendor') return res.sendStatus(403);
        const { status } = req.body;

        const order = await Order.findOne({ _id: req.params.id, vendorId: req.user.id });
        if (!order) return res.status(404).json({ message: 'Order not found' });

        order.status = status;
        await order.save();
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- VENDOR & STORE DETAILS ---

app.get('/api/vendors/:id', async (req, res) => {
    try {
        const vendor = await User.findOne({ _id: req.params.id, role: 'vendor' })
            .select('name store_name store_rating location phone store_image store_description');
        if (!vendor) return res.status(404).json({ message: 'Vendor not found' });
        res.json(vendor);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/vendors/:id/products', async (req, res) => {
    try {
        const products = await Product.find({ vendorId: req.params.id });
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- ADMIN MANAGEMENT ---

app.get('/api/admin/vendors', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.sendStatus(403);
        const vendors = await User.find({ role: 'vendor' }).sort({ createdAt: -1 });
        res.json(vendors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/admin/users', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.sendStatus(403);
        const users = await User.find({ role: { $ne: 'admin' } }).sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/admin/users/:id', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.sendStatus(403);
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin Add User
app.post('/api/admin/users', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.sendStatus(403);
        const { name, phone, password, role, store_name, location } = req.body;

        const existingUser = await User.findOne({ phone });
        if (existingUser) return res.status(400).json({ message: 'User with this phone already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name, phone, password: hashedPassword, role, store_name, location
        });
        res.status(201).json(newUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin Edit User
app.put('/api/admin/users/:id', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'admin') return res.sendStatus(403);
        const updates = req.body;

        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10);
        }

        const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Vendor Update Profile
app.put('/api/vendor/profile', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'vendor') return res.sendStatus(403);
        const { store_name, store_description, store_image, location, phone, name } = req.body;

        const updatedUser = await User.findByIdAndUpdate(req.user.id, {
            store_name, store_description, store_image, location, phone, name
        }, { new: true });

        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- START SERVER ---

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
