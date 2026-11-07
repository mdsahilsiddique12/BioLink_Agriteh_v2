import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, User, LogOut, ArrowRight, Globe, Leaf, Wheat, Mountain, Shield, Sparkles, Clock, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSubdomain } from '../context/SubdomainContext';
import './Navbar.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sectorDropdownOpen, setSectorDropdownOpen] = useState(false);
  const [showCoaModal, setShowCoaModal] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { tenant, switchTenant, allTenants } = useSubdomain();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
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

  const CurrentIcon = sectorIcons[tenant.id] || Globe;

  const getCtaConfig = () => {
    switch (tenant.id) {
      case 'manure':
        return { label: 'Order FOM Sample', to: '/sample', icon: Sparkles };
      case 'feed':
        return { label: 'Get Feed Allocation', to: '/institutional?sector=feed', icon: ArrowRight };
      case 'seabuckthorn':
        return { label: 'Request Pilot COA', to: '/contact?sector=seabuckthorn', icon: Sparkles };
      default:
        return { label: 'Instant Bulk Quote', to: '/institutional', icon: ArrowRight };
    }
  };

  const ctaConfig = getCtaConfig();
  const CtaIcon = ctaConfig.icon;

  return (
    <>
      <header className="neu-navbar-wrapper">
        <nav className={`neu-navbar ${scrolled ? 'neu-navbar--scrolled' : ''}`} id="main-nav">
          <div className="navbar__inner container">
            {/* Left: Brand Logo & Sector Switcher */}
            <div className="navbar__brand-area">
              <Link to="/" className="navbar__brand" id="nav-logo">
                <div className="neu-logo-container">
                  <img src="/logo.png" alt="BioLink" className="navbar__logo-img" />
                </div>
                <div className="navbar__brand-copy">
                  <span className="navbar__brand-title">BioLink</span>
                  <span className="navbar__brand-sector">{tenant.shortName}</span>
                </div>
              </Link>

              {/* Neumorphic Sector Switcher Pill */}
              <div className="neu-sector-dropdown-wrap" ref={dropdownRef}>
                <button
                  className="neu-sector-trigger"
                  onClick={() => setSectorDropdownOpen(!sectorDropdownOpen)}
                  id="nav-sector-trigger"
                  title="Switch Dedicated Sector Space"
                  aria-expanded={sectorDropdownOpen}
                >
                  <CurrentIcon size={14} className="sector-icon-active" />
                  <span className="sector-trigger-label">{tenant.shortName}</span>
                  <ChevronDown size={13} className={`sector-trigger-caret ${sectorDropdownOpen ? 'rotated' : ''}`} />
                </button>

                {sectorDropdownOpen && (
                  <div className="neu-sector-popover neu-card">
                    <div className="popover-header">
                      <span>Switch Dedicated Sector</span>
                    </div>
                    <div className="popover-list">
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
                            className={`popover-item ${isCurrent ? 'popover-item--current' : ''}`}
                          >
                            <div className={`popover-item-icon popover-item-icon--${t.id}`}>
                              <Icon size={16} />
                            </div>
                            <div className="popover-item-text">
                              <span className="popover-item-title">{t.name}</span>
                              <span className="popover-item-sub">{t.tagline}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Center: Clean Working Navigation (Centered & Balanced) */}
            <div className="navbar__nav-links">
              <a href="#product-specifications" className="neu-nav-item">
                Specifications
              </a>
              <a href="#tonnage-calculator" className="neu-nav-item">
                Freight Calculator
              </a>
              <button
                onClick={() => setShowCoaModal(true)}
                className="neu-nav-item neu-nav-item--coming-soon"
                title="Lab Reports Policy"
              >
                <span>Lab Reports</span>
                <span className="nav-coming-soon-badge">Coming Soon</span>
              </button>
              <Link to="/logistics" className={`neu-nav-item ${location.pathname === '/logistics' ? 'active' : ''}`}>
                Logistics &amp; Escrow
              </Link>
            </div>

            {/* Right: Actions */}
            <div className="navbar__actions">
              {user ? (
                <div className="navbar__user-node">
                  <span className="user-name">{user.name}</span>
                  <button onClick={logout} className="user-logout-btn" title="Logout">
                    <LogOut size={14} />
                  </button>
                </div>
              ) : (
                <Link to="/login" className="neu-ghost-link">
                  Login
                </Link>
              )}

              <Link to={ctaConfig.to} className="neu-btn neu-btn-primary neu-nav-cta" id="nav-cta-btn">
                <span>{ctaConfig.label}</span>
                <CtaIcon size={14} />
              </Link>

              <button
                className="neu-mobile-toggle"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Drawer */}
          <div className={`neu-mobile-drawer ${mobileOpen ? 'open' : ''}`}>
            <div className="mobile-drawer-inner neu-card">
              <div className="mobile-sector-switch-section">
                <span className="drawer-label">Active Sector Space:</span>
                <div className="mobile-sector-chips">
                  {Object.values(allTenants).map((t) => {
                    const Icon = sectorIcons[t.id] || Globe;
                    const isCurrent = tenant.id === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => {
                          switchTenant(t.id);
                          setMobileOpen(false);
                        }}
                        className={`mobile-chip ${isCurrent ? 'active' : ''}`}
                      >
                        <Icon size={14} />
                        <span>{t.shortName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mobile-links-section">
                <a href="#product-specifications" className="mobile-link" onClick={() => setMobileOpen(false)}>
                  Specifications &amp; Catalog
                </a>
                <a href="#tonnage-calculator" className="mobile-link" onClick={() => setMobileOpen(false)}>
                  Freight &amp; Route Estimator
                </a>
                <button
                  className="mobile-link"
                  style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                  onClick={() => {
                    setMobileOpen(false);
                    setShowCoaModal(true);
                  }}
                >
                  <span>Lab Reports (COA)</span>
                  <span className="nav-coming-soon-badge">Coming Soon</span>
                </button>
                <Link to="/logistics" className="mobile-link" onClick={() => setMobileOpen(false)}>
                  Logistics &amp; Escrow Tracking
                </Link>
                <Link to="/contact" className="mobile-link" onClick={() => setMobileOpen(false)}>
                  Contact Support Desk
                </Link>
              </div>

              <div className="mobile-cta-section">
                <Link to={ctaConfig.to} className="neu-btn neu-btn-primary" style={{ width: '100%' }} onClick={() => setMobileOpen(false)}>
                  {ctaConfig.label}
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Lab Reports & COA Personal Client Policy Modal */}
      {showCoaModal && (
        <div className="coa-modal-backdrop" onClick={() => setShowCoaModal(false)}>
          <div className="coa-modal-card neu-card" onClick={(e) => e.stopPropagation()}>
            <div className="coa-modal-header">
              <div className="coa-icon-circle">
                <Lock size={24} className="text-accent" />
              </div>
              <span className="coa-badge-coming-soon">COMING SOON: DIGITAL VAULT</span>
              <h3 className="coa-modal-title">Client-Confidential Laboratory Reports</h3>
            </div>

            <p className="coa-modal-desc">
              Comprehensive accredited batch laboratory test reports (including FCO Schedule IV, NPK calibration, Kjeldahl crude protein, and GC-MS fatty acid profiles) <strong>are provided personally when we connect directly with our clients upon verified sourcing request</strong>.
            </p>

            <div className="coa-modal-trust-box neu-inset">
              <Shield size={18} className="text-accent" style={{ flexShrink: 0 }} />
              <span>
                To protect our supplying CBG facilities and distilleries from unverified trade reproduction, full Certificate of Analysis (COA) documentation is delivered directly to your registered business email and WhatsApp alongside the Dharma Kanta weighbridge tare slip.
              </span>
            </div>

            <div className="coa-modal-actions">
              <Link
                to="/contact"
                className="neu-btn neu-btn-primary"
                onClick={() => setShowCoaModal(false)}
              >
                Connect With Procurement Desk
              </Link>
              <button
                className="neu-btn neu-btn-glass"
                onClick={() => setShowCoaModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
