import { NavLink } from "react-router-dom";
import logoIcon from "../../assets/logo.png"; // Using the high-res PNG we saved earlier
import "./Header.css";

export default function Header() {
  function getNavLinkClass({ isActive }: { isActive: boolean }) {
    return `header__link ${isActive ? "header__link--active" : ""}`;
  }

  return (
    <header className="header">
      <div className="header__logo-container">
        <img src={logoIcon} alt="Mesh AI Logo" className="header__logo" />
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