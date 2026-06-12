import { NavLink } from "react-router-dom";
import "./Header.css";
import logoImg from "../../assets/logo.png";
import menuIcon from "../../assets/header-menu-button.png";

export default function Header() {
  function getNavLinkClass({ isActive }: { isActive: boolean }) {
    return isActive ? "header__link header__link--active" : "header__link";
  }

  return (
    <header className="header">
      <div className="header__brand-container">
        <button className="header__menu-btn" aria-label="Open navigation menu">
          <img src={menuIcon} alt="" className="header__menu-icon" />
        </button>
        
        <NavLink to="/" className="header__logo-link">
          <img src={logoImg} alt="Mesh AI" className="header__logo" />
        </NavLink>
      </div>

      <nav className="header__nav">
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