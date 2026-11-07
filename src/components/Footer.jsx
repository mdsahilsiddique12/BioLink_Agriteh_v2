import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ArrowUpRight, Globe, Send, ShieldCheck, Leaf, Wheat, Mountain } from 'lucide-react';
import { useSubdomain } from '../context/SubdomainContext';
import './Footer.css';

export default function Footer() {
  const { switchTenant } = useSubdomain();

  return (
    <footer className="footer" id="footer">
      <div className="footer__glow-line" />

      <div className="container">
        <div className="footer__grid">
          {/* Brand Column */}
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <div className="footer__logo-icon">
                <img src="/logo.png" alt="BioLink Logo" className="footer__logo-img" />
              </div>
              <div>
                <span className="footer__logo-brand">BioLink</span>
                <span className="footer__logo-sub">Agritech Solutions</span>
              </div>
            </Link>
            <p className="footer__desc">
              India's premier institutional network for lab-certified Fermented Organic Manure (FOM), distillery DDGS &amp; molasses feedstock, and high-altitude Himalayan botanicals.
            </p>
            <div className="footer__socials">
              <a href="#" className="footer__social" aria-label="LinkedIn"><Globe size={16} /></a>
              <a href="mailto:info@biolinkagri.in" className="footer__social" aria-label="Email"><Mail size={16} /></a>
              <a href="https://wa.me/919006847527" target="_blank" rel="noreferrer" className="footer__social" aria-label="WhatsApp"><Send size={16} /></a>
            </div>
            <div style={{ marginTop: '1rem', fontSize: '0.78rem', color: 'var(--text-tertiary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={14} style={{ color: 'var(--neon-cyan)' }} />
              <span>Resend Verified Transactional Domain</span>
            </div>
          </div>

          {/* Dedicated Subdomain Portals */}
          <div className="footer__col">
            <h4 className="footer__col-title">Dedicated Sector Spaces</h4>
            <button onClick={() => switchTenant('corporate')} className="footer__link" style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Globe size={13} style={{ color: '#2563eb' }} /> Corporate Gateway (biolinkagri.in)
            </button>
            <button onClick={() => switchTenant('manure')} className="footer__link" style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Leaf size={13} style={{ color: '#059669' }} /> Organic Manure (manure.biolinkagri.in)
            </button>
            <button onClick={() => switchTenant('feed')} className="footer__link" style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Wheat size={13} style={{ color: '#d97706' }} /> Industrial DDGS (feed.biolinkagri.in)
            </button>
            <button onClick={() => switchTenant('seabuckthorn')} className="footer__link" style={{ background: 'none', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Mountain size={13} style={{ color: '#ea580c' }} /> Sea Buckthorn (seabuckthorn.biolinkagri.in)
            </button>
            <Link to="/lab-reports" className="footer__link" style={{ marginTop: '6px' }}>NABL Certification Vault</Link>
          </div>

          {/* Quick Links */}
          <div className="footer__col">
            <h4 className="footer__col-title">Operations &amp; Desks</h4>
            <Link to="/sample" className="footer__link">Order Lab Sample (20/30/50kg)</Link>
            <Link to="/institutional" className="footer__link">15+ MT Institutional Desk</Link>
            <Link to="/logistics" className="footer__link">Dharma Kanta Logistics Tracking</Link>
            <Link to="/partner" className="footer__link">Strategic Partner Portal (KJ01)</Link>
            <Link to="/about" className="footer__link">Corporate Governance</Link>
            <Link to="/contact" className="footer__link">Contact Desk</Link>
          </div>

          {/* Contact */}
          <div className="footer__col">
            <h4 className="footer__col-title">Corporate Dispatch Desk</h4>
            <div className="footer__contact-item">
              <Mail size={14} />
              <span>info@biolinkagri.in</span>
            </div>
            <div className="footer__contact-item">
              <Phone size={14} />
              <span>Calls: +91 8581868466</span>
            </div>
            <div className="footer__contact-item">
              <Phone size={14} style={{ opacity: 0.7 }} />
              <span>WhatsApp: +91 9006847527</span>
            </div>
            <div className="footer__contact-item">
              <MapPin size={14} />
              <span>Patna, Bihar &bull; Pan-India Dispatch</span>
            </div>
            <Link to="/institutional" className="btn btn-outline footer__cta" style={{ marginTop: '0.8rem' }}>
              Request Bulk Allocation <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer__bottom">
          <p className="footer__copy">
            &copy; 2026 BioLink Agritech Solutions. All rights reserved. Operating under Small-Business MSME Tax-Exempt Framework.
          </p>
          <div className="footer__legal">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/lab-reports">FCO 1985 Compliance</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
