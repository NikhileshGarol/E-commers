import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import ProductList from './pages/ProductList';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Profile from './pages/Profile';
import VendorLayout from './layouts/VendorLayout';
import VendorDashboard from './pages/vendor/Dashboard';
import AddProduct from './pages/vendor/AddProduct';
import SearchResults from './pages/SearchResults';
import { Toaster } from 'react-hot-toast';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Register from './pages/Register';
import VendorOrders from './pages/vendor/Orders';
import VendorProducts from './pages/vendor/ProductsList';
import StoreDetails from './pages/StoreDetails';
import VendorsManagement from './pages/admin/VendorsManagement';
import UsersManagement from './pages/admin/UsersManagement';
import VendorProfile from './pages/vendor/Profile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Customer Routes */}
        <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
          <Route index element={<Home />} />
          <Route path="search" element={<SearchResults />} />
          <Route path="category/:categoryId" element={<ProductList />} />
          <Route path="cart" element={<Cart />} />
          <Route path="profile" element={<Profile />} />
          <Route path="store/:vendorId" element={<StoreDetails />} />
        </Route>

        {/* Protected Vendor Routes */}
        <Route path="/vendor" element={<ProtectedRoute role="vendor"><VendorLayout /></ProtectedRoute>}>
          <Route index element={<VendorDashboard />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="orders" element={<VendorOrders />} />
          <Route path="products" element={<VendorProducts />} />
          <Route path="profile" element={<VendorProfile />} />
        </Route>

        {/* Protected Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="vendors" element={<VendorsManagement />} />
          <Route path="users" element={<UsersManagement />} />
        </Route>

        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
      </Routes>
      <Toaster position="bottom-center" />
    </BrowserRouter>
  );
}

export default App;
