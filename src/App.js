import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store';
import './App.css';

// Layout Components
import Layout from './components/Layout/Layout';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import Dashboard from './components/Dashboard/Dashboard';

// Inventory Components
import Products from './components/Inventory/Products';
import ProductForm from './components/Inventory/ProductForm';
import Categories from './components/Inventory/Categories';

// Customer Components
import Customers from './components/Customers/Customers';
import CustomerForm from './components/Customers/CustomerForm';
import CustomerDetails from './components/Customers/CustomerDetails';

// Sales Components
import Sales from './components/Sales/Sales';
import SaleForm from './components/Sales/SaleForm';
import SaleDetails from './components/Sales/SaleDetails';

// Payment Components
import Payments from './components/Payments/Payments';
import PaymentForm from './components/Payments/PaymentForm';
import PaymentDetails from './components/Payments/PaymentDetails';

// User Components
import Profile from './components/Auth/Profile';
import Users from './components/Users/Users';
import UserForm from './components/Users/UserForm';
import UserDetails from './components/Users/UserDetails';

// Protected Route Component
import ProtectedRoute from './components/Auth/ProtectedRoute';

// UI Components

function App() {
  return (
    <Provider store={store}>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />

              {/* Inventory Routes */}
              <Route path="inventory/products" element={<Products />} />
              <Route path="inventory/products/new" element={<ProductForm />} />
              <Route path="inventory/products/:id/edit" element={<ProductForm />} />
              <Route path="inventory/categories" element={<Categories />} />

              {/* Customer Routes */}
              <Route path="customers" element={<Customers />} />
              <Route path="customers/new" element={<CustomerForm />} />
              <Route path="customers/:id" element={<CustomerDetails />} />
              <Route path="customers/:id/edit" element={<CustomerForm />} />

              {/* Sales Routes */}
              <Route path="sales" element={<Sales />} />
              <Route path="sales/new" element={<SaleForm />} />
              <Route path="sales/:id" element={<SaleDetails />} />
              <Route path="sales/:id/edit" element={<SaleForm />} />

              {/* Payment Routes */}
              <Route path="payments" element={<Payments />} />
              <Route path="payments/new" element={<PaymentForm />} />
              <Route path="payments/:id" element={<PaymentDetails />} />
              <Route path="payments/:id/edit" element={<PaymentForm />} />

              {/* User Management Routes (Admin/Manager only) */}
              <Route path="users" element={<Users />} />
              <Route path="users/new" element={<UserForm />} />
              <Route path="users/:id" element={<UserDetails />} />
              <Route path="users/:id/edit" element={<UserForm />} />

              {/* Profile Route */}
              <Route path="profile" element={<Profile />} />
            </Route>

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
