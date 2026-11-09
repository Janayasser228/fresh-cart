import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { errMsg } from "../api";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

const ShopContext = createContext();
export const useShop = () => useContext(ShopContext);

const emptyCart = { count: 0, cartId: null, products: [], total: 0 };

export function ShopProvider({ children }) {
  const { token } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [cart, setCart] = useState(emptyCart);
  const [wishlist, setWishlist] = useState([]);
  const [busy, setBusy] = useState(null); // id المنتج اللي بيتعمل عليه عملية

  const loadCart = useCallback(async () => {
    try {
      const { data } = await api.get("/cart");
      setCart({
        count: data.numOfCartItems || 0,
        cartId: data.cartId || data.data?._id || null,
        products: data.data?.products || [],
        total: data.data?.totalCartPrice || 0,
      });
    } catch {
      setCart(emptyCart);
    }
  }, []);

  const loadWishlist = useCallback(async () => {
    try {
      const { data } = await api.get("/wishlist");
      setWishlist(data.data || []);
    } catch {
      setWishlist([]);
    }
  }, []);

  useEffect(() => {
    if (token) {
      loadCart();
      loadWishlist();
    } else {
      setCart(emptyCart);
      setWishlist([]);
    }
  }, [token, loadCart, loadWishlist]);

  const needLogin = () => {
    if (token) return false;
    toast("Please login first", "error");
    navigate("/login");
    return true;
  };

  // ---------- Cart ----------
  const addToCart = async (productId) => {
    if (needLogin()) return;
    setBusy(productId);
    try {
      const { data } = await api.post("/cart", { productId });
      toast(data.message || "Added to cart");
      await loadCart();
    } catch (e) {
      toast(errMsg(e), "error");
    } finally {
      setBusy(null);
    }
  };

  const removeFromCart = async (productId) => {
    setBusy(productId);
    try {
      await api.delete(`/cart/${productId}`);
      toast("Removed from cart");
      await loadCart();
    } catch (e) {
      toast(errMsg(e), "error");
    } finally {
      setBusy(null);
    }
  };

  const updateCount = async (productId, count) => {
    if (count < 1) return removeFromCart(productId);
    setBusy(productId);
    try {
      await api.put(`/cart/${productId}`, { count });
      await loadCart();
    } catch (e) {
      toast(errMsg(e), "error");
    } finally {
      setBusy(null);
    }
  };

  const clearCart = async () => {
    try {
      await api.delete("/cart");
      setCart(emptyCart);
      toast("Cart cleared");
    } catch (e) {
      toast(errMsg(e), "error");
    }
  };

  // ---------- Wishlist ----------
  const isWished = (id) => wishlist.some((p) => p._id === id);

  const toggleWishlist = async (productId) => {
    if (needLogin()) return;
    try {
      if (isWished(productId)) {
        await api.delete(`/wishlist/${productId}`);
        toast("Removed from wishlist");
      } else {
        await api.post("/wishlist", { productId });
        toast("Added to wishlist");
      }
      await loadWishlist();
    } catch (e) {
      toast(errMsg(e), "error");
    }
  };

  return (
    <ShopContext.Provider
      value={{
        cart, wishlist, busy,
        loadCart, addToCart, updateCount, removeFromCart, clearCart,
        isWished, toggleWishlist,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}
