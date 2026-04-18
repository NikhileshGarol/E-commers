const axios = require('axios');
const { API_CONFIG } = require('./api.config');

const register = async (data) => {
    try {
        const res = await axios.post(`${API_CONFIG.BASE_URL}/api/auth/register`, data);
        console.log(`Success: ${data.name} (${data.role}) - ${res.data.message}`);
    } catch (err) {
        console.error(`Error: ${data.name} (${data.role}) - ${err.response?.data?.message || err.message}`);
    }
};

const run = async () => {
    await register({ name: "Customer User", phone: "9000000001", password: "password123", role: "customer" });
    await register({ name: "Vendor User", phone: "9000000002", password: "password123", role: "vendor", store_name: "New City Kirana" });
    await register({ name: "Admin User", phone: "9000000003", password: "password123", role: "admin" });
};

run();
