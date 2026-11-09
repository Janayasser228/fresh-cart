import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useShop } from "../context/ShopContext";
import { CartIcon, HeartIcon, Logo, MenuIcon } from "./Icons";

export default function Navbar() {
  const { token, user, logout } = useAuth();
  const { cart, wishlist } = useShop();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const close = () => setOpen(false);
  const handleLogout = () => {
    logout();
    close();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Link to="/" onClick={close}><Logo /></Link>

        <button className="menu-btn" onClick={() => setOpen(!open)} aria-label="menu">
          <MenuIcon />
        </button>

        <nav className={`nav-links ${open ? "open" : ""}`} onClick={close}>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/products">Products</NavLink>
          <NavLink to="/categories">Categories</NavLink>
          <NavLink to="/brands">Brands</NavLink>
          {token && <NavLink to="/orders">Orders</NavLink>}

          <span className="nav-spacer" />

          {token ? (
            <>
              <NavLink to="/wishlist" className="icon-link">
                <HeartIcon /> {wishlist.length > 0 && <b className="badge">{wishlist.length}</b>}
              </NavLink>
              <NavLink to="/cart" className="icon-link">
                <CartIcon /> {cart.count > 0 && <b className="badge">{cart.count}</b>}
              </NavLink>
              <NavLink to="/change-password">Hi, {user?.name?.split(" ")[0]}</NavLink>
              <button className="link-btn" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register">Register</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
