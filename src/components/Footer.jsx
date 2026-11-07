import { Link } from 'react-router-dom';
import { 
  Mail, Phone, MapPin, ArrowUpRight, Globe, Send, ShieldCheck, 
  Leaf, Wheat, Mountain, FileText, CheckCircle2, Truck, ExternalLink 
} from 'lucide-react';
import { useSubdomain } from '../context/SubdomainContext';
import './Footer.css';

export default function Footer() {
  const { switchTenant } = useSubdomain();

  return (
    <footer className="neu-footer" id="footer">
      <div className="container">
        {/* Top Directory Grid (5 Advanced Columns) */}
        <div className="neu-footer-grid">
          {/* Column 1: Enterprise Brand & Infrastructure */}
          <div className="footer-col footer-col--brand">
            <div className="footer-brand-header">
              <div className="footer-logo-circle">
                <img src="/logo.png" alt="BioLink" className="footer-logo-img" />
              </div>
              <div>
                <span className="footer-brand-title">BioLink Agritech</span>
                <span className="footer-brand-sub">Solutions Pvt. Ltd.</span>
              </div>
            </div>
            <p className="footer-brand-desc">
              India's premier B2B digital infrastructure network for lab-certified organic bio-inputs, grain distillery high-protein animal feeds, and supercritical Himalayan botanicals.
            </p>
            <div className="footer-trust-chips">
              <div className="footer-chip">
                <ShieldCheck size={14} className="text-accent" />
                <span>72-Hr Gate Escrow</span>
              </div>
              <div className="footer-chip">
                <Truck size={14} className="text-accent" />
                <span>Dharma Kanta Certified</span>
              </div>
              <div className="footer-chip">
                <Mail size={14} className="text-accent" />
                <span>Resend Domain Verified</span>
              </div>
            </div>
          </div>

          {/* Column 2: Organic Manure Space (manure.biolinkagri.in) */}
          <div className="footer-col">
            <div className="footer-col-header" onClick={() => switchTenant('manure')} style={{ cursor: 'pointer' }}>
              <Leaf size={16} style={{ color: '#059669' }} />
              <h4>Organic Manure Space</h4>
            </div>
            <span className="footer-subdomain-pill">manure.biolinkagri.in</span>
            <ul className="footer-links-list">
              <li><button onClick={() => switchTenant('manure')} className="footer-link-btn">Ultra-Growth Solid FOM (Granulated)</button></li>
              <li><button onClick={() => switchTenant('manure')} className="footer-link-btn">Concentrated Liquid Bio-Slurry (LFOM)</button></li>
              <li><button onClick={() => switchTenant('manure')} className="footer-link-btn">VermiGold Synergistic Conditioner</button></li>
              <li><button onClick={() => switchTenant('manure')} className="footer-link-btn">Soil Revive Starter Balcony Packs</button></li>
              <li><Link to="/sample" className="footer-link">Order 20kg / 30kg / 50kg Test Bags</Link></li>
              <li><Link to="/lab-reports" className="footer-link">FCO 1985 Schedule IV COA Vault</Link></li>
              <li><Link to="/institutional" className="footer-link">Makhana &amp; Tea Estate FTL Allotment</Link></li>
            </ul>
          </div>

          {/* Column 3: Industrial Feed Space (feed.biolinkagri.in) */}
          <div className="footer-col">
            <div className="footer-col-header" onClick={() => switchTenant('feed')} style={{ cursor: 'pointer' }}>
              <Wheat size={16} style={{ color: '#d97706' }} />
              <h4>Industrial Feed Space</h4>
            </div>
            <span className="footer-subdomain-pill">feed.biolinkagri.in</span>
            <ul className="footer-links-list">
              <li><button onClick={() => switchTenant('feed')} className="footer-link-btn">Corn DDGS (28-32% Crude Protein)</button></li>
              <li><button onClick={() => switchTenant('feed')} className="footer-link-btn">Rice DDGS (40-45% Crude Protein)</button></li>
              <li><button onClick={() => switchTenant('feed')} className="footer-link-btn">Heavy Cane Molasses (80°+ Brix Tanker)</button></li>
              <li><button onClick={() => switchTenant('feed')} className="footer-link-btn">Wet Distillers Grains (DWG Tipper)</button></li>
              <li><Link to="/institutional?sector=feed" className="footer-link">Commercial Dairy Cattle TMR Feeds</Link></li>
              <li><Link to="/institutional?sector=feed" className="footer-link">Poultry Broiler &amp; Layer Pellets</Link></li>
              <li><Link to="/contact?sector=feed" className="footer-link">Direct Distillery Mill Tender Desk</Link></li>
            </ul>
          </div>

          {/* Column 4: Sea Buckthorn Space (seabuckthorn.biolinkagri.in) */}
          <div className="footer-col">
            <div className="footer-col-header" onClick={() => switchTenant('seabuckthorn')} style={{ cursor: 'pointer' }}>
              <Mountain size={16} style={{ color: '#ea580c' }} />
              <h4>Premium Botanicals</h4>
            </div>
            <span className="footer-subdomain-pill">seabuckthorn.biolinkagri.in</span>
            <ul className="footer-links-list">
              <li><button onClick={() => switchTenant('seabuckthorn')} className="footer-link-btn">Supercritical CO₂ Seed Oil (100% Pure)</button></li>
              <li><button onClick={() => switchTenant('seabuckthorn')} className="footer-link-btn">Ruby Pulp Oil (&gt;32% Omega-7)</button></li>
              <li><button onClick={() => switchTenant('seabuckthorn')} className="footer-link-btn">Freeze-Dried Soluble Berry Powder</button></li>
              <li><button onClick={() => switchTenant('seabuckthorn')} className="footer-link-btn">Wild Himalayan Dried Leaves (Tea Cut)</button></li>
              <li><Link to="/contact?sector=seabuckthorn" className="footer-link">Pilot Trial Packages (5L / 10kg Drums)</Link></li>
              <li><Link to="/contact?sector=seabuckthorn" className="footer-link">GC-MS Chromatography Analysis</Link></li>
              <li><Link to="/contact?sector=seabuckthorn" className="footer-link">Leh-Ladakh Harvest Cluster Desk</Link></li>
            </ul>
          </div>

          {/* Column 5: Pan-India Corridors & Corporate Governance */}
          <div className="footer-col">
            <div className="footer-col-header">
              <Globe size={16} className="text-accent" />
              <h4>Corridors &amp; Governance</h4>
            </div>
            <span className="footer-subdomain-pill">Operations Node</span>
            <ul className="footer-links-list">
              <li><Link to="/logistics" className="footer-link">Bihar Intrastate Gate Corridor</Link></li>
              <li><Link to="/logistics" className="footer-link">West Bengal Tea Garden Route</Link></li>
              <li><Link to="/logistics" className="footer-link">Uttar Pradesh Sugarcane &amp; Mill Belt</Link></li>
              <li><Link to="/logistics" className="footer-link">Assam Brahmaputra Freight Corridor</Link></li>
              <li><Link to="/partner" className="footer-link">Partner Portal (KrishakJan KJ01)</Link></li>
              <li><Link to="/terms" className="footer-link">Terms &amp; Gate Escrow Rules</Link></li>
              <li><Link to="/privacy" className="footer-link">Privacy &amp; Data Security</Link></li>
            </ul>
          </div>
        </div>

        {/* Pan-India Corridor Dispatch Strip */}
        <div className="neu-corridor-strip neu-card">
          <div className="corridor-title-group">
            <Truck size={18} className="text-accent" />
            <span>Pan-India Bulk Intermodal Dispatch Corridors:</span>
          </div>
          <div className="corridor-tags">
            <span className="corridor-tag">Patna Central Hub</span>
            <span className="corridor-tag">Siliguri Tea Node</span>
            <span className="corridor-tag">Kanpur Mill Corridor</span>
            <span className="corridor-tag">Guwahati Logistics Gateway</span>
            <span className="corridor-tag">Ranchi Mineral Basin</span>
            <span className="corridor-tag">Cuttack Coastal Plains</span>
          </div>
        </div>

        {/* Bottom Executive Legal & Direct Contact Bar */}
        <div className="neu-footer-bottom">
          <div className="footer-legal-copy">
            <p>&copy; 2026 BioLink Agritech Solutions Pvt. Ltd. All rights reserved.</p>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-light)', marginTop: '2px' }}>
              Operating as an asset-light digital trade coordinator under Small-Business MSME Tax-Exempt Framework.
            </p>
          </div>

          <div className="footer-direct-contacts">
            <a href="mailto:info@biolinkagri.in" className="footer-contact-link">
              <Mail size={13} /> info@biolinkagri.in
            </a>
            <a href="tel:+918581868466" className="footer-contact-link">
              <Phone size={13} /> +91 8581868466
            </a>
            <a href="https://wa.me/919006847527" target="_blank" rel="noreferrer" className="footer-contact-link">
              <Send size={13} /> WhatsApp: +91 9006847527
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
