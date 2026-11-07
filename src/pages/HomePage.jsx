import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Truck, Factory, Clock, Shield, Star, ChevronRight, 
  Leaf, Droplets, Beaker, Package, Zap, Globe, ExternalLink, 
  Handshake, Award, Sparkles, CheckCircle2, ChevronDown, Mountain, 
  Sun, Layers, Droplet, Wheat, FileText, Check, ShieldCheck, Scale
} from 'lucide-react';
import ParticleField from '../components/ParticleField';
import SeaBuckthornModal from '../components/SeaBuckthornModal';
import TonnageSlider from '../components/TonnageSlider';
import ProductSpecCard from '../components/ProductSpecCard';
import { useSubdomain } from '../context/SubdomainContext';
import { useScrollReveal, useCountUp } from '../hooks/useAnimations';
import { testimonials, stats, certifications, supplyHubs } from '../data/testimonials';
import { products } from '../data/products';
import { feedProducts } from '../data/feedProducts';
import { seaBuckthornProducts } from '../data/seaBuckthornProducts';
import './HomePage.css';

const iconMap = { Truck, Factory, Clock, Shield };

function StatCard({ stat, index }) {
  const { containerRef, countRef } = useCountUp(stat.value, 2000);
  const Icon = iconMap[stat.icon] || Shield;

  return (
    <div className="stat-card reveal" ref={containerRef} style={{ transitionDelay: `${index * 120}ms` }}>
      <div className="stat-card__icon">
        <Icon size={22} />
      </div>
      <div className="stat-card__value">
        {stat.prefix && <span>{stat.prefix}</span>}
        <span ref={countRef}>0</span>
        {stat.suffix && <span>{stat.suffix}</span>}
      </div>
      <p className="stat-card__label">{stat.label}</p>
    </div>
  );
}

export default function HomePage() {
  const { tenant, switchTenant } = useSubdomain();
  const revealRef = useScrollReveal();
  const tickerRef = useRef(null);
  const [isSampleDropdownOpen, setIsSampleDropdownOpen] = useState(false);
  const [isSbtModalOpen, setIsSbtModalOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsSampleDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const heroData = tenant.hero || {};

  return (
    <main className="home" ref={revealRef}>
      {/* ═══ SEA BUCKTHORN MODAL ═══ */}
      <SeaBuckthornModal isOpen={isSbtModalOpen} onClose={() => setIsSbtModalOpen(false)} />

      {/* ═══ B2B HIGH-IMPACT HERO SECTION ═══ */}
      <section className="hero" id="hero-section">
        <ParticleField count={70} />

        {/* Ambient Glow Orbs tailored to active theme */}
        <div className="orb orb-green" style={{ width: 450, height: 450, top: '-12%', right: '-5%' }} />
        <div className="orb orb-cyan" style={{ width: 350, height: 350, bottom: '5%', left: '-8%' }} />

        {/* Precision HUD Corner Brackets */}
        <div className="hero__hud-corner hero__hud-corner--tl" />
        <div className="hero__hud-corner hero__hud-corner--tr" />
        <div className="hero__hud-corner hero__hud-corner--bl" />
        <div className="hero__hud-corner hero__hud-corner--br" />

        <div className="hero__content container">
          {/* Eyebrow / Badges */}
          <div className="hero__badge-row">
            <div className="hero__badge badge" id="satat-badge">
              <Globe size={13} style={{ color: 'var(--neon-cyan)', marginRight: '6px' }} /> 
              {heroData.eyebrow || 'Verified SATAT Plant Partner (Govt of India Initiative)'}
            </div>
            {tenant.id !== 'seabuckthorn' && (
              <button
                onClick={() => switchTenant('seabuckthorn')}
                className="hero__badge badge badge--sbt-highlight"
                id="sbt-badge-hero"
              >
                <Sparkles size={13} style={{ marginRight: '6px' }} /> 
                NEW: Himalayan Sea Buckthorn B2B Sourcing →
              </button>
            )}
          </div>

          {/* Dynamic Sleek Hero Typography */}
          <h1 className="hero__title">
            <span className="hero__title-line">{heroData.titleLine1 || '100% Heat-Sterilized Bulk Supplies.'}</span>
            <span className="hero__title-line text-glow-hero">{heroData.titleHighlight || '72-Hour Gate Escrow Dispatch.'}</span>
          </h1>

          <p className="hero__subtitle">
            {heroData.subtitle || 'Direct factory gate allotments from certified Compressed Biogas (CBG) facilities and industrial processors. Zero logistics hassle. 100% traceable supply chains.'}
          </p>

          {/* Hero CTAs */}
          <div className="hero__actions">
            <div className="sample-dropdown-container" ref={dropdownRef}>
              <button
                className="btn btn-primary btn-lg"
                id="hero-cta-sample-dropdown"
                onClick={() => setIsSampleDropdownOpen(!isSampleDropdownOpen)}
              >
                <Package size={18} />
                <span>Order Trial / Sample</span>
                <ChevronDown size={16} className={`dropdown-chevron ${isSampleDropdownOpen ? 'rotated' : ''}`} />
              </button>

              {isSampleDropdownOpen && (
                <div className="sample-dropdown-menu glass-card">
                  <Link to="/sample" className="sample-dropdown-item" onClick={() => setIsSampleDropdownOpen(false)}>
                    <div className="sample-dropdown-icon" style={{ background: '#ecfdf5', color: '#059669' }}>
                      <Leaf size={18} />
                    </div>
                    <div>
                      <span className="sample-dropdown-title">Fermented Organic Manure (FOM)</span>
                      <span className="sample-dropdown-sub">20kg / 30kg / 50kg Lab Tested Bags</span>
                    </div>
                  </Link>

                  <button
                    className="sample-dropdown-item sample-dropdown-item--feed"
                    onClick={() => {
                      setIsSampleDropdownOpen(false);
                      switchTenant('feed');
                    }}
                  >
                    <div className="sample-dropdown-icon" style={{ background: '#fffbeb', color: '#d97706' }}>
                      <Wheat size={18} />
                    </div>
                    <div>
                      <span className="sample-dropdown-title" style={{ color: '#d97706' }}>Industrial DDGS &amp; Molasses</span>
                      <span className="sample-dropdown-sub">High-Protein Feedstock Specifications</span>
                    </div>
                  </button>

                  <button
                    className="sample-dropdown-item sample-dropdown-item--sbt"
                    onClick={() => {
                      setIsSampleDropdownOpen(false);
                      setIsSbtModalOpen(true);
                    }}
                  >
                    <div className="sample-dropdown-icon" style={{ background: '#fff7ed', color: '#ea580c' }}>
                      <Sparkles size={18} />
                    </div>
                    <div>
                      <span className="sample-dropdown-title" style={{ color: '#ea580c' }}>Himalayan Sea Buckthorn Extracts</span>
                      <span className="sample-dropdown-sub">CO₂ Seed Oil, Pulp Oil &amp; Soluble Powder</span>
                    </div>
                  </button>
                </div>
              )}
            </div>

            <Link to="/institutional" className="btn btn-outline btn-lg" id="hero-cta-quote">
              Get Bulk Allocation Quote <ArrowRight size={16} />
            </Link>
          </div>

          {/* Dynamic 4-Point Data Strip */}
          <div className="hero__data-strip">
            <div className="hero__data-item">
              <span className="hero__data-value">{heroData.stat1?.value || '1,200+'}</span>
              <span className="hero__data-label">{heroData.stat1?.label || 'Tons Capacity'}</span>
            </div>
            <div className="hero__data-divider" />
            <div className="hero__data-item">
              <span className="hero__data-value">{heroData.stat2?.value || '72-Hr'}</span>
              <span className="hero__data-label">{heroData.stat2?.label || 'Escrow QA Gate'}</span>
            </div>
            <div className="hero__data-divider" />
            <div className="hero__data-item">
              <span className="hero__data-value">{heroData.stat3?.value || '6 States'}</span>
              <span className="hero__data-label">{heroData.stat3?.label || 'Corridor Network'}</span>
            </div>
            <div className="hero__data-divider" />
            <div className="hero__data-item">
              <span className="hero__data-value">{heroData.stat4?.value || '100%'}</span>
              <span className="hero__data-label">{heroData.stat4?.label || 'Dharma Kanta Traceable'}</span>
            </div>
          </div>
        </div>

        <div className="hero__scanline" />
      </section>

      {/* ═══ LIVE PAN-INDIA SUPPLY TICKER ═══ */}
      <section className="ticker-section" id="supply-ticker">
        <div className="ticker-section__glow" />
        <div className="ticker-track" ref={tickerRef}>
          <div className="ticker-content">
            {[...supplyHubs, ...supplyHubs].map((hub, i) => (
              <div key={i} className="ticker-item">
                <span className={`ticker-dot ${hub.status === 'active' ? 'ticker-dot--active' : 'ticker-dot--limited'}`} />
                <span className="ticker-state">{hub.state} Corridor</span>
                <span className="ticker-tons">{hub.tons} MT Ready For Allocation</span>
                <span className="ticker-coord">{hub.lat}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ INTERACTIVE TONNAGE SLIDER SECTION ═══ */}
      <section className="section tonnage-interactive-section" id="tonnage-calculator">
        <div className="container">
          <TonnageSlider sector={tenant.id} defaultTonnage={tenant.id === 'feed' ? 30 : 25} />
        </div>
      </section>

      {/* ═══ DEDICATED SECTOR HIGHLIGHT CARDS (3 SPACES) ═══ */}
      <section className="section sector-spaces-section" id="sectors-overview">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Enterprise Multi-Sector Portfolio</span>
            <h2 className="section-title text-glow">Three Dedicated Industrial Spaces</h2>
            <p className="section-subtitle">
              Engineered as independent multi-tonne spaces to eliminate branding clutter and deliver precision specifications for your commercial vertical.
            </p>
          </div>

          <div className="sector-spaces-grid">
            {/* Sector 1: Organic Manure Space */}
            <div className={`sector-space-card glass-card ${tenant.id === 'manure' ? 'sector-space-card--active' : ''}`}>
              <div className="sector-space-header" style={{ borderColor: 'rgba(5, 150, 105, 0.3)' }}>
                <div className="sector-space-icon" style={{ background: '#ecfdf5', color: '#059669' }}>
                  <Leaf size={24} />
                </div>
                <div>
                  <span className="sector-subdomain-tag">manure.biolinkagri.in</span>
                  <h3 className="sector-space-title">Organic Manure Space</h3>
                </div>
              </div>
              <p className="sector-space-desc">
                Government-certified Fermented Organic Manure (FOM) and concentrated bio-slurry from SATAT CBG plants. FCO 1985 tested with strict moisture &lt; 30%.
              </p>
              <ul className="sector-feature-bullets">
                <li><Check size={14} className="text-accent" /> Granulated &amp; Powdered FOM</li>
                <li><Check size={14} className="text-accent" /> High Organic Carbon (&gt; 16%)</li>
                <li><Check size={14} className="text-accent" /> 15-500 MT Direct Multi-Axle Dispatch</li>
              </ul>
              <div className="sector-space-footer">
                <button
                  onClick={() => switchTenant('manure')}
                  className="btn btn-outline btn-sm"
                  style={{ width: '100%' }}
                >
                  Enter Manure Portal <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Sector 2: Industrial Feed Space (DDGS & Molasses) */}
            <div className={`sector-space-card glass-card ${tenant.id === 'feed' ? 'sector-space-card--active' : ''}`}>
              <div className="sector-space-header" style={{ borderColor: 'rgba(217, 119, 6, 0.3)' }}>
                <div className="sector-space-icon" style={{ background: '#fffbeb', color: '#d97706' }}>
                  <Wheat size={24} />
                </div>
                <div>
                  <span className="sector-subdomain-tag">feed.biolinkagri.in</span>
                  <h3 className="sector-space-title">Industrial Feed Space</h3>
                </div>
              </div>
              <p className="sector-space-desc">
                Bulk Corn &amp; Rice DDGS and 80°+ Brix heavy cane molasses for commercial dairy integrators, poultry mills, and aquaculture plants across India.
              </p>
              <ul className="sector-feature-bullets">
                <li><Check size={14} style={{ color: '#d97706' }} /> Corn DDGS (28-32% Crude Protein)</li>
                <li><Check size={14} style={{ color: '#d97706' }} /> Rice DDGS (40-45% Crude Protein)</li>
                <li><Check size={14} style={{ color: '#d97706' }} /> Heavy Mill Molasses (80°+ Brix Tankers)</li>
              </ul>
              <div className="sector-space-footer">
                <button
                  onClick={() => switchTenant('feed')}
                  className="btn btn-outline btn-sm"
                  style={{ width: '100%', borderColor: '#d97706', color: '#d97706' }}
                >
                  Enter Feed Portal <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Sector 3: Premium Botanicals Space (Sea Buckthorn) */}
            <div className={`sector-space-card glass-card ${tenant.id === 'seabuckthorn' ? 'sector-space-card--active' : ''}`}>
              <div className="sector-space-header" style={{ borderColor: 'rgba(234, 88, 12, 0.3)' }}>
                <div className="sector-space-icon" style={{ background: '#fff7ed', color: '#ea580c' }}>
                  <Mountain size={24} />
                </div>
                <div>
                  <span className="sector-subdomain-tag">seabuckthorn.biolinkagri.in</span>
                  <h3 className="sector-space-title">Premium Botanicals</h3>
                </div>
              </div>
              <p className="sector-space-desc">
                Himalayan wild-harvested Sea Buckthorn extracts from Leh-Ladakh clusters. Solvent-free Supercritical CO₂ seed oil, pulp oil, and 100% soluble freeze-dried powders.
              </p>
              <ul className="sector-feature-bullets">
                <li><Check size={14} style={{ color: '#ea580c' }} /> &gt; 32% Rare Omega-7 (Palmitoleic)</li>
                <li><Check size={14} style={{ color: '#ea580c' }} /> CO₂ Supercritical Seed Oil Purity</li>
                <li><Check size={14} style={{ color: '#ea580c' }} /> Pilot Packs (5L / 10kg) Available</li>
              </ul>
              <div className="sector-space-footer">
                <button
                  onClick={() => switchTenant('seabuckthorn')}
                  className="btn btn-outline btn-sm"
                  style={{ width: '100%', borderColor: '#ea580c', color: '#ea580c' }}
                >
                  Enter Botanicals Portal <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CURRENT SECTOR PRODUCT SPECIFICATION CARDS ═══ */}
      <section className="section product-specs-section" id="product-specifications">
        <div className="container">
          <div className="section-header">
            <span className="section-label">{tenant.name} Specifications</span>
            <h2 className="section-title text-glow">Lab-Certified Commercial Formulations</h2>
            <p className="section-subtitle">
              Low-border glassmorphism technical sheets with laboratory NPK, protein, and purity benchmarks.
            </p>
          </div>

          <div className="product-specs-grid">
            {tenant.id === 'feed' ? (
              feedProducts.map((p) => (
                <ProductSpecCard key={p.id} product={p} sector="feed" />
              ))
            ) : tenant.id === 'seabuckthorn' ? (
              seaBuckthornProducts.map((p) => (
                <ProductSpecCard key={p.id} product={p} sector="seabuckthorn" />
              ))
            ) : (
              products.map((p) => (
                <ProductSpecCard key={p.id} product={p} sector="manure" />
              ))
            )}
          </div>
        </div>
      </section>

      {/* ═══ NPK & MOISTURE LAB QUALITY CHECK HOOKS ═══ */}
      <section className="section npk-hooks" id="npk-hooks">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Real-Time Quality Check</span>
            <h2 className="section-title text-glow">NPK &amp; Moisture Lab Testing Protocols</h2>
            <p className="section-subtitle">
              Every batch undergoes strict moisture testing (&lt; 30%) and organic matter calibration at accredited GOBARdhan facility labs.
            </p>
          </div>

          <div className="npk-grid">
            <div className="npk-video glass-card reveal-left">
              <div className="video-player-mock">
                <div className="video-overlay">
                  <div className="play-button-glow">
                    <div className="play-button-inner">▶</div>
                  </div>
                  <span className="video-length">02:15 Min</span>
                  <span className="video-title">CBG Plant Batch Analysis - Moisture Check (Target &lt; 30%)</span>
                </div>
                <div className="video-placeholder-bg" />
              </div>
            </div>

            <div className="npk-details reveal-right">
              <h3 className="npk-details__title">Radical Analytical Integrity</h3>
              <p className="npk-details__text">
                Every batch dispatched under the BioLink network includes an accredited Certificate of Analysis (COA) specifying nitrogen, organic carbon, moisture, and zero pathogen certification.
              </p>

              <ul className="npk-specs">
                <li className="npk-spec-item">
                  <span className="npk-spec-label">Total Nitrogen (N)</span>
                  <span className="npk-spec-value">&gt; 1.5% - 2.2%</span>
                </li>
                <li className="npk-spec-item">
                  <span className="npk-spec-label">Phosphorus (P2O5)</span>
                  <span className="npk-spec-value">&gt; 1.0%</span>
                </li>
                <li className="npk-spec-item">
                  <span className="npk-spec-label">Potassium (K2O)</span>
                  <span className="npk-spec-value">&gt; 1.0%</span>
                </li>
                <li className="npk-spec-item">
                  <span className="npk-spec-label">Moisture Content</span>
                  <span className="npk-spec-value" style={{ color: 'var(--neon-cyan)', fontWeight: 'bold' }}>&lt; 30.0% Hard Cap</span>
                </li>
              </ul>

              <Link to="/lab-reports" className="btn btn-outline" style={{ marginTop: 'var(--space-md)' }}>
                <FileText size={16} /> Open NABL Certification Vault
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section className="section stats-section" id="stats-section">
        <div className="container">
          <div className="stats-grid stagger-children">
            {stats.map((stat, i) => (
              <StatCard key={stat.label} stat={stat} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TRUST & CERTIFICATIONS ═══ */}
      <section className="section trust-section" id="trust-section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Verified Standards</span>
            <h2 className="section-title text-glow">Regulatory Compliance &amp; Standards</h2>
          </div>

          <div className="cert-grid stagger-children">
            {certifications.map((cert) => (
              <div key={cert.name} className="cert-card glass-card reveal">
                <Shield size={24} className="cert-card__icon" />
                <h4 className="cert-card__name">{cert.name}</h4>
                <p className="cert-card__desc">{cert.description}</p>
              </div>
            ))}
          </div>

          {/* Testimonials */}
          <div className="testimonials reveal">
            <div className="section-header" style={{ marginBottom: 'var(--space-xl)' }}>
              <span className="section-label">Procurement Officers &amp; Planters</span>
              <h2 className="section-title text-glow">Trusted Nationwide</h2>
            </div>
            <div className="testimonial-grid stagger-children">
              {testimonials.slice(0, 3).map((t) => (
                <div key={t.id} className="testimonial-card glass-card reveal">
                  <div className="testimonial-card__stars">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} size={14} fill="#fbbf24" color="#fbbf24" />
                    ))}
                  </div>
                  <p className="testimonial-card__text">"{t.text}"</p>
                  <div className="testimonial-card__author">
                    <div className="testimonial-card__avatar">{t.name.charAt(0)}</div>
                    <div>
                      <h4 className="testimonial-card__name">{t.name}</h4>
                      <p className="testimonial-card__role">{t.role}</p>
                    </div>
                  </div>
                  <span className="badge badge-cyan">{t.tons}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STRATEGIC PARTNERS MARQUEE ═══ */}
      <section className="partners-circle-section" id="partners-section">
        <div className="partners-circle-header">
          <span className="partners-circle-label">
            <Handshake size={14} /> Strategic Agro-Industrial Ecosystem
          </span>
          <h2 className="partners-circle-title">Connected Industry Leaders</h2>
          <p className="partners-circle-subtitle">
            Partnered with India's premier agritech networks, distillery co-product processors, and clean energy initiatives.
          </p>
        </div>

        <div className="partners-circle-container">
          <div className="partners-circle-track">
            {[1, 2, 3].flatMap(() => [
              {
                id: 'krishakjan',
                name: 'KrishakJan',
                subtitle: 'Strategic Input & Farmer Network',
                logoImg: '/krishakjan-logo.png',
                url: 'https://krishakjan.com/',
              },
              {
                id: 'satat',
                name: 'SATAT CBG Network',
                subtitle: 'Govt. of India Clean Energy',
                emblemClass: 'circle-logo-emblem--indigo',
                logoText: 'SATAT\nCBG',
                url: 'https://satat.co.in/',
              },
              {
                id: 'biolink',
                name: 'BioLink Agritech',
                subtitle: 'Supply Chain & Lab Backbone',
                emblemClass: 'circle-logo-emblem--green',
                logoText: 'BioLink\nAgri',
                url: 'https://biolinkagri.in/',
              },
              {
                id: 'gobardhan',
                name: 'GOBARdhan Initiative',
                subtitle: 'Organic Inputs & Clean Energy',
                emblemClass: 'circle-logo-emblem--gold',
                logoText: 'GOBAR\ndhan',
                url: 'https://gobardhan.co.in/',
              },
              {
                id: 'nabard',
                name: 'NABARD Farmers Club',
                subtitle: 'Agri Development Network',
                emblemClass: 'circle-logo-emblem--indigo',
                logoText: 'NABARD\nClub',
                url: 'https://www.nabard.org/',
              },
            ]).map((item, idx) => (
              <div key={`${item.id}-${idx}`} className="circle-partner-item">
                <div className="circle-logo-badge">
                  {item.logoImg ? (
                    <img src={item.logoImg} alt={item.name} className="circle-logo-img" />
                  ) : (
                    <div className={`circle-logo-emblem ${item.emblemClass}`}>
                      {item.logoText.split('\n').map((line, i) => (
                        <span key={i}>{line}</span>
                      ))}
                    </div>
                  )}
                </div>
                <h4 className="circle-partner-name">{item.name}</h4>
                {item.url ? (
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="circle-partner-link">
                    <span>Visit Website</span>
                    <ExternalLink size={12} />
                  </a>
                ) : (
                  <span className="circle-partner-sub">{item.subtitle}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA BANNER ═══ */}
      <section className="section cta-banner" id="cta-banner">
        <div className="cta-banner__bg">
          <ParticleField count={40} color="var(--neon-cyan)" speed={0.15} />
        </div>
        <div className="container cta-banner__content reveal-scale">
          <h2 className="cta-banner__title">
            Ready to Lock In Your <span className="text-glow">Consignment Allotment</span>?
          </h2>
          <p className="cta-banner__subtitle">
            Get your verified institutional freight quote in under 60 seconds. Direct ex-factory pricing with 72-hour escrow protection.
          </p>
          <div className="cta-banner__actions">
            <Link to="/institutional" className="btn btn-primary btn-lg">
              Get Bulk Quote Now <ArrowRight size={16} />
            </Link>
            <Link to="/contact" className="btn btn-outline btn-lg">
              Speak with Logistics Officer
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
