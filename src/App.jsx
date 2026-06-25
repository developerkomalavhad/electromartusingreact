import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import initialProducts from "./data/products";
import { api, storage } from "./api/client";
import Home from "./pages/Home/Home";
import Products from "./pages/Products/Products";
import Cart from "./pages/Cart/Cart";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Checkout from "./pages/Checkout/Checkout";
import ContactUs from "./pages/ContactUs/ContactUs";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import AdminProducts from "./pages/AdminProducts/AdminProducts";
import AdminOrders from "./pages/AdminOrders/AdminOrders";
import AdminUsers from "./pages/AdminUsers/AdminUsers";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import "./App.css";

function ProtectedAdminRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "Admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  const [products, setProducts] = useState(initialProducts);
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState(storage.getUser());
  const [appMessage, setAppMessage] = useState("");
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Demo Admin",
      email: "admin@electromart.test",
      role: "Admin",
      status: "Active",
    },
    {
      id: 2,
      name: "Sample Customer",
      email: "customer@electromart.test",
      role: "Customer",
      status: "Active",
    },
  ]);
  const [orders, setOrders] = useState([
    {
      id: 1001,
      customer: "Sample Customer",
      email: "customer@electromart.test",
      total: 79900,
      items: 1,
      status: "Packed",
      payment: "UPI",
      date: "2026-06-22",
    },
    {
      id: 1002,
      customer: "Aarav Sharma",
      email: "aarav@example.com",
      total: 112998,
      items: 2,
      status: "Delivered",
      payment: "Card",
      date: "2026-06-20",
    },
  ]);

  const cartCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  );

  const loadProducts = useCallback(async () => {
    try {
      const nextProducts = await api.getProducts();
      setProducts(nextProducts);
      setAppMessage("");
    } catch (error) {
      setAppMessage("Backend unavailable. Showing local demo products.");
    }
  }, []);

  const loadAdminData = useCallback(async () => {
    if (user?.role !== "Admin") {
      return;
    }

    try {
      const [nextOrders, nextUsers] = await Promise.all([
        api.getOrders(),
        api.getUsers(),
      ]);
      setOrders(nextOrders);
      setUsers(nextUsers);
    } catch (error) {
      setAppMessage(error.message);
    }
  }, [user]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  const handleSession = (session) => {
    storage.setSession(session);
    setUser(session.user);
  };

  const loginUser = async (credentials) => {
    const session = await api.login(credentials);
    handleSession(session);
    return session.user;
  };

  const registerUser = async (profile) => {
    const session = await api.register(profile);
    handleSession(session);
    return session.user;
  };

  const logout = () => {
    storage.clearSession();
    setUser(null);
  };

  const getItemId = (product) => product._id || product.id;

  const addToCart = (product) => {
    const productId = getItemId(product);

    setCartItems((items) => {
      const existingItem = items.find((item) => getItemId(item) === productId);

      if (existingItem) {
        return items.map((item) =>
          getItemId(item) === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...items, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      setCartItems((items) => items.filter((item) => getItemId(item) !== productId));
      return;
    }

    setCartItems((items) =>
      items.map((item) =>
        getItemId(item) === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCartItems([]);

  const createOrder = async (order) => {
    const nextOrder = await api.createOrder({
      ...order,
      items: cartItems.map((item) => ({
        product: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
    });
    setOrders((items) => [nextOrder, ...items]);
    clearCart();
  };

  const addProduct = async (product) => {
    const nextProduct = await api.createProduct({
      ...product,
      price: Number(product.price),
      rating: Number(product.rating),
      stock: Number(product.stock || 10),
    });
    setProducts((items) => [nextProduct, ...items]);
  };

  const updateProduct = async (productId, updates) => {
    const nextProduct = await api.updateProduct(productId, {
      ...updates,
      price: Number(updates.price),
      rating: Number(updates.rating),
      stock: Number(updates.stock || 0),
    });
    setProducts((items) =>
      items.map((item) =>
        getItemId(item) === productId ? nextProduct : item
      )
    );
  };

  const deleteProduct = async (productId) => {
    await api.deleteProduct(productId);
    setProducts((items) => items.filter((item) => getItemId(item) !== productId));
    setCartItems((items) => items.filter((item) => getItemId(item) !== productId));
  };

  const updateOrderStatus = async (orderId, status) => {
    const nextOrder = await api.updateOrderStatus(orderId, status);
    setOrders((items) =>
      items.map((item) => (getItemId(item) === orderId ? nextOrder : item))
    );
  };

  const updateUserStatus = async (userId, status) => {
    const nextUser = await api.updateUserStatus(userId, status);
    setUsers((items) =>
      items.map((item) => (getItemId(item) === userId ? nextUser : item))
    );
  };

  return (
    <BrowserRouter>
      <Navbar cartCount={cartCount} user={user} onLogout={logout} />
      {appMessage && <div className="app-message">{appMessage}</div>}
      <Routes>
        <Route
          path="/"
          element={<Home products={products} onAddToCart={addToCart} />}
        />
        <Route
          path="/products"
          element={
            <Products products={products} onAddToCart={addToCart} />
          }
        />
        <Route
          path="/cart"
          element={
            <Cart cartItems={cartItems} updateQuantity={updateQuantity} />
          }
        />
        <Route
          path="/login"
          element={<Login user={user} onLogin={loginUser} />}
        />
        <Route
          path="/register"
          element={<Register user={user} onRegister={registerUser} />}
        />
        <Route
          path="/checkout"
          element={
            !user ? (
              <Navigate to="/login" replace />
            ) : cartItems.length ? (
              <Checkout
                cartItems={cartItems}
                user={user}
                onOrderPlaced={createOrder}
              />
            ) : (
              <Navigate to="/products" replace />
            )
          }
        />
        <Route path="/contact" element={<ContactUs />} />
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute user={user}>
              <AdminDashboard products={products} orders={orders} users={users} />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedAdminRoute user={user}>
              <AdminProducts
                products={products}
                onAddProduct={addProduct}
                onUpdateProduct={updateProduct}
                onDeleteProduct={deleteProduct}
              />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedAdminRoute user={user}>
              <AdminOrders orders={orders} onUpdateStatus={updateOrderStatus} />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedAdminRoute user={user}>
              <AdminUsers users={users} onUpdateStatus={updateUserStatus} />
            </ProtectedAdminRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
