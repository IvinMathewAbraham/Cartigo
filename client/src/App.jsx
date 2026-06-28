import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

import GuestRoute from "./routes/GuestRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
// import RoleRoute from "./routes/RoleRoute";

import HomePage from "./pages/HomePage";
import ProductListingPage from "./pages/ProductListingPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import CartPage from "./pages/CartPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";

import "./App.css";

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <CartProvider>
                    <Routes>

                        {/* Public Routes */}

                        <Route
                            path="/"
                            element={<HomePage />}
                        />

                        <Route
                            path="/products"
                            element={<ProductListingPage />}
                        />

                        <Route
                            path="/products/:id"
                            element={<ProductDetailsPage />}
                        />

                        {/* Guest Routes */}

                        <Route
                            path="/login"
                            element={
                                <GuestRoute>
                                    <LoginPage />
                                </GuestRoute>
                            }
                        />

                        <Route
                            path="/register"
                            element={
                                <GuestRoute>
                                    <RegisterPage />
                                </GuestRoute>
                            }
                        />

                        {/* Protected Routes */}

                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <ProfilePage />
                                </ProtectedRoute>
                            }
                        />

                        <Route
                            path="/cart"
                            element={
                                <ProtectedRoute>
                                    <CartPage />
                                </ProtectedRoute>
                            }
                        />

                    </Routes>
                </CartProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}


{/* // import CheckoutPage from './pages/CheckoutPage';
// import ProfilePage from './pages/ProfilePage';
// import OrdersPage from './pages/OrdersPage';
// import NotFoundPage from './pages/NotFoundPage'; */}


{/* <Route path="/products" element={<ProductsPage />} />


        <Route path="/checkout" element={<CheckoutPage />} />


        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/orders" element={<OrdersPage />} />


        <Route path="*" element={<NotFoundPage />} /> */}