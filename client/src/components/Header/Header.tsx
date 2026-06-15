import { NavLink } from "react-router-dom";
import "./Header.css";
import logoImg from "../../assets/logo.png";
import menuIcon from "../../assets/header-menu-button.png";

type Props = {
  onMenuOpen: () => void;
  onMenuClose: () => void;
  isMobileMenuOpen: boolean;
};

export default function Header({ onMenuOpen, onMenuClose, isMobileMenuOpen }: Props) {
  function getNavLinkClass({ isActive }: { isActive: boolean }) {
    return isActive ? "header__link header__link--active" : "header__link";
  }

  return (
    <header className={isMobileMenuOpen ? "header header_mobile" : "header"}>
      <div className="header__brand-container">
        <button 
          className="header__menu-btn" 
          type="button"
          aria-label="Open navigation menu"
          onClick={() => {
            console.log("🎯 HAMBURGER BUTTON CLICKED!"); // 👈 Temporary test log
            onMenuOpen();
          }}
        >
          <img 
            src={menuIcon} 
            alt="" 
            className="header__menu-icon" 
            style={{ pointerEvents: 'none' }} // 👈 Prevents the image element from absorbing the click
          />
        </button>
        
        <NavLink to="/" className="header__logo-link" onClick={onMenuClose}>
          <img src={logoImg} alt="Mesh AI" className="header__logo" />
        </NavLink>
      </div>

      <nav className={isMobileMenuOpen ? "header__nav header__nav_mobile" : "header__nav"} onClick={onMenuClose}>
        <NavLink to="/knowledge" className={getNavLinkClass}>
          Knowledge Base
        </NavLink>
        <NavLink to="/chat" className={getNavLinkClass}>
          Chat
        </NavLink>
      </nav>
    </header>
  );
}