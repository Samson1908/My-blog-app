import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";

import CreateBlog from "./components/CreateBlog";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Register from "./pages/Register";
import BlogList from "./pages/BlogList";
import BlogDetails from "./pages/BlogDetails"; // BlogDetails component
import Footer from "./components/Footer";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Users from "./pages/Users";
import UserDetails from "./components/UserDetails";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token");
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

// Layout for authenticated pages
const AuthenticatedLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-grow">
        <Sidebar />
        <main className="flex-grow p-6">{children}</main>
      </div>
      <Footer />
    </div>
  );
};

// App layout handling login and authenticated routes
const Layout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";

  return (
    <>
      {isLoginPage ? (
        <main className="min-h-screen">
          <Routes>
            <Route path="/" element={<Login />} />
          </Routes>
        </main>
      ) : (
        <AuthenticatedLayout>
          <Routes>
            <Route
              path="/blogs"
              element={
                <ProtectedRoute>
                  <BlogList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/blogs/:id"
              element={
                <ProtectedRoute>
                  <BlogDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users/:userId"  // New route for UserDetails
              element={
                <ProtectedRoute>
                  <UserDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create"
              element={
                <ProtectedRoute>
                  <CreateBlog />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/users"
              element={
                <ProtectedRoute>
                  <Users />
                </ProtectedRoute>
              }
            />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Routes>
        </AuthenticatedLayout>
      )}
    </>
  );
};

// Main App component
const App = () => {
  return (
    <Router>
      <Layout />
    </Router>
  );
};

export default App;
