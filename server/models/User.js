const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['customer', 'vendor', 'admin'],
        default: 'customer'
    },
    // Location Data (Embedded - Active/Selected)
    location: {
        lat: Number,
        lng: Number,
        address: String
    },
    // Saved Delivery Addresses
    addresses: [{
        tag: String, // Home, Office, etc.
        houseNo: String,
        area: String,
        landmark: String,
        address: String, // Full combined address
        lat: Number,
        lng: Number,
        isDefault: { type: Boolean, default: false }
    }],
    // Vendor Specific Data
    store_name: {
        type: String
    },
    store_image: {
        type: String
    },
    store_description: {
        type: String
    },
    store_rating: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
