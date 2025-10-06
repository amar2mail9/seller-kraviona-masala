import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DashBoard from "./components/DashBoard/DashBoard";
import Layout from "./components/Layout";
import Email from "./components/Email/Email";
import Login from "./components/auth/Login";

import ProductTable from "./components/Product/ProductTable";
import ViewCategory from "./components/Category/ViewCategory";
import AddCategory from "./components/Category/AddCategory";
import AddProduct from "./components/Product/AddProduct";

// ✅ Private route (only for logged-in users)
const PrivateRoute = ({ children }) => {
  const token = sessionStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

// ✅ Public route (only for NOT logged-in users)
const PublicRoute = ({ children }) => {
  const token = sessionStorage.getItem("token");
  return token ? <Navigate to="/" replace /> : children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 👇 Public route — only for users WITHOUT token */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* 👇 Protected routes — only for users WITH token */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <DashBoard />
            </PrivateRoute>
          }
        />
        <Route
          path="/emails"
          element={
            <PrivateRoute>
              <Email />
            </PrivateRoute>
          }
        />

         <Route
          path="/products"
          element={
            <PrivateRoute>
              <ProductTable />
            </PrivateRoute>
          }
        />

        <Route
          path="/categories"
          element={
            <PrivateRoute>
              <ViewCategory />
            </PrivateRoute>
          }
        />
        <Route
          path="/add-category"
          element={
            <PrivateRoute>
              <AddCategory />
            </PrivateRoute>
          }
        />
        <Route
          path="/add-product"
          element={
            <PrivateRoute>
              <AddProduct />
            </PrivateRoute>
          }
        />

        {/* 👇 404 fallback */}
        <Route
          path="*"
          element={
            <Layout>
              <div className="flex items-center justify-center h-full text-center text-gray-400 text-xl">
                404 - Page Not Found
              </div>
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
