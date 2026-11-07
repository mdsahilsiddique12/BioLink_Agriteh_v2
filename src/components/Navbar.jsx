import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, User, LogOut, Sparkles, Globe, Leaf, Wheat, Mountain, Shield, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSubdomain } from '../context/SubdomainContext';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sectorDropdownOpen, setSectorDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { tenant, switchTenant, allTenants } = useSubdomain();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 25);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSectorDropdownOpen(false);
  }, [location]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setSectorDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sectorIcons = {
    corporate: Globe,
    manure: Leaf,
    feed: Wheat,
    seabuckthorn: Mountain,
  };

  const navLinks = [
    { to: '/', label: 'Overview' },
    { to: '/sample', label: 'Order Sample' },
    { to: '/institutional', label: 'Institutional Desk' },
    { to: '/lab-reports', label: 'COA Vault' },
    { to: '/logistics', label: 'Freight & Corridors' },
    { to: '/about', label: 'Corporate' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <header className="navbar-wrapper">
      <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`} id="main-nav">
        <div className="navbar__inner container">
          {/* Logo & Dynamic Sector Badge */}
          <div className="navbar__brand-group">
            <Link to="/" className="navbar__logo" id="nav-logo">
              <div className="navbar__logo-icon">
                <img src="/logo.png" alt="BioLink Logo" className="navbar__logo-img" />
              </div>
              <div className="navbar__logo-text">
                <span className="navbar__logo-brand">BioLink</span>
                <span className="navbar__logo-sub">Agritech</span>
              </div>
            </Link>

            {/* Interactive Sector Switcher Dropdown in Navbar */}
            <div className="sector-select-dropdown-wrap" ref={dropdownRef}>
              <button
                className="sector-current-pill"
                onClick={() => setSectorDropdownOpen(!sectorDropdownOpen)}
                aria-expanded={sectorDropdownOpen}
                id="navbar-sector-pill"
              >
                <span className="sector-pill-dot" />
                <span className="sector-pill-name">{tenant.shortName}</span>
                <ChevronDown size={14} className={`sector-pill-arrow ${sectorDropdownOpen ? 'rotated' : ''}`} />
              </button>

              {sectorDropdownOpen && (
                <div className="sector-dropdown-card glass-card">
                  <div className="sector-dropdown-header">
                    <span>Select Agricultural / Industrial Sector</span>
                  </div>
                  {Object.values(allTenants).map((t) => {
                    const Icon = sectorIcons[t.id] || Globe;
                    const isCurrent = tenant.id === t.id;

                    return (
                      <button
                        key={t.id}
                        onClick={() => {
                          switchTenant(t.id);
                          setSectorDropdownOpen(false);
                        }}
                        className={`sector-dropdown-item ${isCurrent ? 'sector-dropdown-item--current' : ''}`}
                      >
                        <div className="sector-dropdown-icon">
                          <Icon size={18} />
                        </div>
                        <div className="sector-dropdown-details">
                          <div className="sector-dropdown-title-row">
                            <span className="sector-dropdown-title">{t.name}</span>
                            {t.id === 'seabuckthorn' && <span className="badge-new">NEW</span>}
                          </div>
                          <span className="sector-dropdown-sub">{t.themeName} &bull; {t.subdomain ? `${t.subdomain}.biolinkagri.in` : 'biolinkagri.in'}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="navbar__links">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`navbar__link ${location.pathname === link.to ? 'navbar__link--active' : ''}`}
                id={`nav-link-${link.label.toLowerCase().replace(/[\s&]/g, '-')}`}
              >
                <span className="navbar__link-text">{link.label}</span>
                {location.pathname === link.to && <span className="navbar__link-indicator" />}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="navbar__actions">
            {user ? (
              <div className="navbar__user-profile">
                <div className="navbar__user-badge">
                  <User size={13} />
                  <span className="navbar__user-name">{user.name}</span>
                </div>
                <button onClick={logout} className="btn btn-outline navbar__logout-btn">
                  <LogOut size={13} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn btn-ghost navbar__login-btn">
                Portal Login
              </Link>
            )}

            <Link to="/sample" className="btn btn-outline navbar__sample-btn">
              <Sparkles size={13} /> Order Sample
            </Link>

            <Link to="/institutional" className="btn btn-primary navbar__cta">
              Get Bulk Quote
            </Link>

            <button
              className="navbar__mobile-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <div className={`navbar__mobile ${mobileOpen ? 'navbar__mobile--open' : ''}`}>
          <div className="navbar__mobile-inner">
            <div className="mobile-sector-picker">
              <span className="mobile-section-label">Select Dedicated Sector:</span>
              <div className="mobile-sector-grid">
                {Object.values(allTenants).map((t) => {
                  const Icon = sectorIcons[t.id] || Globe;
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        switchTenant(t.id);
                        setMobileOpen(false);
                      }}
                      className={`mobile-sector-btn ${tenant.id === t.id ? 'active' : ''}`}
                    >
                      <Icon size={14} />
                      <span>{t.shortName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mobile-nav-links">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`navbar__mobile-link ${location.pathname === link.to ? 'active' : ''}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="mobile-nav-footer">
              <Link to="/sample" className="btn btn-outline" style={{ width: '100%', marginBottom: '8px' }}>
                <Sparkles size={14} /> Order Lab Test Sample
              </Link>
              <Link to="/institutional" className="btn btn-primary" style={{ width: '100%' }}>
                Get 15+ MT Institutional Quote
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
