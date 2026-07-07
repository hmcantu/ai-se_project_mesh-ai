import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./Header.css";
import logoImg from "../../assets/logo.png";
import menuIcon from "../../assets/header-menu-button.png";
 
type Props = {
  onMenuOpen: () => void;
  onMenuClose: () => void;
  isMobileMenuOpen: boolean;
};
 
export default function Header({ onMenuOpen, onMenuClose, isMobileMenuOpen }: Props) {
  const navigate = useNavigate();
  const { isAuthenticated, currentUser, logout } = useAuth();
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState<boolean>(false);

  function getNavLinkClass({ isActive }: { isActive: boolean }) {
    return isActive ? "header__link header__link--active" : "header__link";
  }

  const handleLogout = () => {
    logout();
    setIsAccountMenuOpen(false);
    navigate("/login");
  };
 
  return (
    <header className={isMobileMenuOpen ? "header header_mobile" : "header"}>
      <div className="header__brand-container">
        <button 
          className="header__menu-btn" 
          type="button"
          aria-label="Open navigation menu"
          onClick={onMenuOpen}
        >
          <img 
            src={menuIcon} 
            alt="" 
            className="header__menu-icon" 
            style={{ pointerEvents: 'none' }}
          />
        </button>
        
        <NavLink to="/" className="header__logo-link" onClick={onMenuClose}>
          <img src={logoImg} alt="Mesh AI" className="header__logo" />
        </NavLink>
      </div>

      {isAuthenticated && (
        <nav className={isMobileMenuOpen ? "header__nav header__nav_mobile" : "header__nav"} onClick={onMenuClose}>
          <NavLink to="/knowledge" className={getNavLinkClass}>
            Knowledge Base
          </NavLink>
          <NavLink to="/chat" className={getNavLinkClass}>
            Chat
          </NavLink>

          {/* Account Dropdown Area */}
          <div className="header__dropdown-container" style={{ position: "relative", display: "inline-block" }} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="header__dropdown-btn"
              aria-haspopup="menu"
              aria-expanded={isAccountMenuOpen}
              onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
            >
              {currentUser?.name || "Account"}'s Account
            </button>

            {isAccountMenuOpen && (
              <ul className="header__menu" role="menu" style={{ position: "absolute", right: 0, background: "white", listStyle: "none", padding: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.15)", borderRadius: "4px", zIndex: 10 }}>
                <li role="none">
                  <button
                    type="button"
                    role="menuitem"
                    className="header__menu-item"
                    onClick={handleLogout}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", width: "100%", textAlign: "left", padding: "4px 8px" }}
                  >
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}