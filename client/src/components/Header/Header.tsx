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

          <div className="header__dropdown-container" style={{ position: "relative", display: "inline-block" }} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="header__account-btn"
              aria-haspopup="menu"
              aria-expanded={isAccountMenuOpen}
              onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
            >
              <span className="header__account-name">
                {currentUser?.name ? `${currentUser.name}'s Account` : "Account's Account"}
              </span>
              <svg 
                className={`header__chevron-icon ${isAccountMenuOpen ? 'header__chevron-icon_open' : ''}`} 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M6 9L12 15L18 9" stroke="#1C1C1C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {isAccountMenuOpen && (
              <div className="header__dropdown-menu" role="menu">
                <button 
                  type="button" 
                  role="menuitem"
                  className="header__dropdown-item" 
                  onClick={handleLogout}
                >
                  <span className="header__logout-text">Logout</span>
                  <svg 
                    className="header__logout-icon" 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="#FA5A5A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 17L21 12L16 7" stroke="#FA5A5A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 12H9" stroke="#FA5A5A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}