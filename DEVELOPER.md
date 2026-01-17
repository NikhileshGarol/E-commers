# KiranaKart Developer Documentation

Welcome to the **KiranaKart** development guide. This document serves as a comprehensive resource for developers looking to understand the architecture, data flow, and implementation details of the platform to extend its capabilities.

---

## 🚀 1. Technology Stack

### **Frontend**
- **Library**: React.js (Vite)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) (Lightweight, fast state handling)
- **Icons**: [Lucide-React](https://lucide.dev/)
- **Styling**: Vanilla CSS (Custom Variable-based Design System)
- **Routing**: React Router v6
- **Notifications**: React Hot Toast
- **HTTP Client**: Axios

### **Backend**
- **Runtime**: Node.js & Express
- **Database**: MongoDB (via Mongoose)
- **Security**: JSON Web Tokens (JWT) & Bcrypt
- **API Connectivity**: OpenStreetMap (Nominatim API) for Geolocation

---

## 🏗️ 2. Project Architecture

The project follows a decoupled **Client-Server** architecture.

### **Backend Structure (`/server`)**
- `index.js`: Main entry point, API routes, and middleware.
- `models/`: Mongoose schemas (User, Product, Order).
- `middleware/`: Authentication logic (`authenticateToken`).

### **Frontend Structure (`/src`)**
- `assets/`: Global styles and static assets.
- `components/`: Reusable UI elements (LocationPicker, AddressBook, ProtectedRoute).
- `layouts/`: Role-specific view wrappers (MainLayout, VendorLayout, AdminLayout).
- `pages/`: Page-level components organized by role (Customer, Vendor, Admin).
- `store/`: Zustand stores for Auth and Cart.

---

## 🔐 3. Authentication & Roles

KiranaKart implements **Role-Based Access Control (RBAC)**. When a user logs in, the backend evaluates their role and returns it within the JWT payload.

### **Roles defined:**
1.  **`customer`**: Default role. Can manage addresses, browse products, and place orders.
2.  **`vendor`**: Can manage store inventory, fulfill orders, and update store profile/location.
3.  **`admin`**: System-wide access. Manage users, oversee vendors, and view global performance metrics.

---

## 📍 4. Advanced Features

### **Real-time Geocoding**
The platform uses the **Nominatim API** to convert raw coordinates into human-readable addresses.
- **Workflow**: `navigator.geolocation` captures Lat/Lng ➡️ Nominatim API fetches JSON address ➡️ Zustand `updateLocation` persists it.
- **Components**: Found in `LocationPicker.jsx`, `AddressBook.jsx`, and `vendor/Profile.jsx`.

### **Dynamic Dashboards**
Dashboards are designed for high-resolution performance monitoring.
- **Admin**: Aggregates site-wide data (Revenue, Active Orders) using MongoDB aggregation and count documents.
- **Vendor**: Filters data specifically for the logged-in vendor ID to show personalized metrics.

---

## 🗃️ 5. Database Schema Highlights

### **User Schema (`models/User.js`)**
Stores credentials, role, active location, and an `addresses` array for multi-address management (Home, Office, etc.).

### **Order Schema (`models/Order.js`)**
Tracks the link between `userId` (customer) and `vendorId` (shopkeeper), alongside a granular `status` field:
- `Pending` ➡️ `Confirmed` ➡️ `Out for Delivery` ➡️ `Delivered`

---

## 🛠️ 6. How to Extend

### **Adding a New API Endpoint**
1.  Create the route in `server/index.js`.
2.  Apply `authenticateToken` middleware if the data is sensitive.
3.  Add role checks: `if (req.user.role !== 'admin') return res.sendStatus(403)`.

### **Adding a New Page (Frontend)**
1.  Create the component in the appropriate `src/pages/` subfolder.
2.  Import it in `App.jsx`.
3.  Wrap the route in a `<ProtectedRoute role="desired_role">` if it requires specific access.
4.  Update the corresponding layout sidebar (e.g., `AdminLayout.jsx`) to include the new link.

---

## 📦 7. Installation & Setup

1.  **Clone the Repository**.
2.  **Environment Variables**: Create a `.env` file in the server root.
    ```env
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_super_secret_key
    ```
3.  **Install Dependencies**:
    ```bash
    # Client
    npm install
    # Server
    cd server && npm install
    ```
4.  **Run Dev Mode**:
    ```bash
    # Client
    npm run dev
    # Server (in /server)
    npm start / nodemon index.js
    ```

---

## 📝 8. Design Tokens (CSS)
The app uses a premium design system. If you want to maintain the look, use these CSS variables or patterns:
- **Primary Emerald**: `#10B981` (Used for success/vendor actions)
- **Primary Indigo**: `#6366F1` (Used for branding/admin layout)
- **Border Radius**: `1.5rem` for cards, `12px` for buttons.
- **Backgrounds**: Use `#F8FAFC` for page backgrounds to maintain the premium "SaaS" feel.

---

*KiranaKart - Bridging Local Vendors with Modern Technology.*
