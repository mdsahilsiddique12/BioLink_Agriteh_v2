import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Truck, Factory, Clock, Shield, Star, ChevronRight, 
  Leaf, Droplets, Beaker, Package, Zap, Globe, ExternalLink, 
  Handshake, Award, Sparkles, CheckCircle2, ChevronDown, Mountain, 
  Sun, Layers, Droplet, Wheat, FileText, Check, ShieldCheck, Scale, MapPin, Lock
} from 'lucide-react';
import ParticleField from '../components/ParticleField';
import FloatingObjects from '../components/FloatingObjects';
import TonnageSlider from '../components/TonnageSlider';
import ProductSpecCard from '../components/ProductSpecCard';
import { useSubdomain } from '../context/SubdomainContext';
import { useScrollReveal, useCountUp } from '../hooks/useAnimations';
import { supplyHubs } from '../data/testimonials';
import { products } from '../data/products';
import { feedProducts } from '../data/feedProducts';
import { seaBuckthornProducts } from '../data/seaBuckthornProducts';
import './HomePage.css';

export default function HomePage() {
  const { tenant, switchTenant } = useSubdomain();
  const revealRef = useScrollReveal();
  const tickerRef = useRef(null);

  // ════════════════════════════════════════════════════════════
  // 1. ORGANIC MANURE ISOLATED VIEW
  // ════════════════════════════════════════════════════════════
  if (tenant.id === 'manure') {
    return (
      <main className="home-neu-main" ref={revealRef}>
        {/* Manure Hero with 3D Floating Objects */}
        <section className="neu-hero" id="hero-section">
          <FloatingObjects sector="manure" />
          <ParticleField count={40} color="#059669" />
          <div className="neu-hero-glow" style={{ background: 'radial-gradient(circle, rgba(5, 150, 105, 0.18), transparent 70%)' }} />

          <div className="container neu-hero-content">
            <div className="hero-eyebrow-wrapper">
              <div className="neu-pill">
                <Leaf size={14} /> FCO 1985 Standard Compliant &bull; Govt. Verified SATAT Plant Partner
              </div>
            </div>

            <h1 className="neu-hero-title">
              <span>Bulk Fermented Organic Manure.</span>
              <span className="text-gradient">72-Hour Gate Escrow Dispatches.</span>
            </h1>

            <p className="neu-hero-sub">
              Direct factory gate allotments from certified Compressed Biogas (CBG) facilities across India. Guaranteed moisture &lt; 30%, organic carbon &gt; 16%, and strict zero heavy-metal certification.
            </p>

            <div className="neu-hero-actions">
              <Link to="/sample" className="neu-btn neu-btn-primary neu-btn-lg">
                <Package size={18} /> Order Lab Sample (20/30/50kg)
              </Link>
              <a href="#tonnage-calculator" className="neu-btn neu-btn-glass neu-btn-lg">
                Calculate Bulk Freight <ArrowRight size={16} />
              </a>
            </div>

            {/* Manure Stat Strip */}
            <div className="neu-stat-strip neu-card">
              <div className="neu-stat-cell">
                <span className="stat-number">&lt; 30.0%</span>
                <span className="stat-tag">Moisture Cap (Strict)</span>
              </div>
              <div className="neu-stat-cell">
                <span className="stat-number">&gt; 16.0%</span>
                <span className="stat-tag">Organic Carbon Ratio</span>
              </div>
              <div className="neu-stat-cell">
                <span className="stat-number">15 - 500 MT</span>
                <span className="stat-tag">Multi-Axle Truckloads</span>
              </div>
              <div className="neu-stat-cell">
                <span className="stat-number">100%</span>
                <span className="stat-tag">Weighbridge Escrow Protected</span>
              </div>
            </div>
          </div>
        </section>

        {/* Live Corridor Ticker */}
        <div className="neu-ticker-bar">
          <div className="ticker-track" ref={tickerRef}>
            <div className="ticker-content">
              {[...supplyHubs, ...supplyHubs].map((hub, i) => (
                <div key={i} className="neu-ticker-pill">
                  <span className="pulse-dot-green" />
                  <strong>{hub.state} CBG Corridor:</strong>
                  <span>{hub.tons} MT Ready For Allocation</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Manure Interactive Tonnage Calculator */}
        <section className="section" id="tonnage-calculator">
          <div className="container">
            <TonnageSlider sector="manure" defaultTonnage={25} />
          </div>
        </section>

        {/* Manure Product Specifications */}
        <section className="section" id="product-specifications">
          <div className="container">
            <div className="section-header">
              <span className="section-label">Fermented Organic Inputs</span>
              <h2 className="section-title">FCO 1985 Certified Organic Formulations</h2>
              <p className="section-subtitle">
                Thermophilically digested and deodorized bulk organic inputs sourced directly from operational CBG facilities.
              </p>
            </div>

            <div className="product-specs-grid">
              {products.map((p) => (
                <ProductSpecCard key={p.id} product={p} sector="manure" />
              ))}
            </div>
          </div>
        </section>

        {/* Client-Confidential Lab Testing Protocol Notice */}
        <section className="section" id="quality-lab-protocol">
          <div className="container">
            <div className="neu-lab-box neu-card">
              <div className="lab-box-grid">
                <div>
                  <div className="coming-soon-label-pill">
                    <Clock size={13} /> DIGITAL VAULT COMING SOON
                  </div>
                  <h3 style={{ fontSize: '1.8rem', margin: '0.6rem 0 0.8rem 0' }}>Client-Personal Laboratory Certifications</h3>
                  <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1.2rem' }}>
                    Full NABL-accredited batch test certificates (covering FCO Schedule IV primary nutrients, C:N calibration, and heavy-metal screening) <strong>are provided personally when we connect directly with our clients upon verified sourcing request</strong>.
                  </p>
                  <div className="lab-check-bullets">
                    <div className="check-item"><CheckCircle2 size={16} className="text-accent" /> Total Nitrogen (N): &gt; 1.5% - 2.2% Tested</div>
                    <div className="check-item"><CheckCircle2 size={16} className="text-accent" /> Maximum Moisture Content: &lt; 30.0% Hard Cap</div>
                    <div className="check-item"><CheckCircle2 size={16} className="text-accent" /> Zero Weed Seeds &amp; Zero Pathogens Guarantee</div>
                    <div className="check-item"><CheckCircle2 size={16} className="text-accent" /> Batch COA dispatched with Dharma Kanta Tare Slip</div>
                  </div>
                  <Link to="/contact" className="neu-btn neu-btn-primary" style={{ marginTop: '1.5rem' }}>
                    <Shield size={16} /> Request Allocation &amp; Personal COA
                  </Link>
                </div>
                <div className="lab-certificate-preview neu-inset">
                  <div className="cert-pill">
                    <Lock size={32} className="text-accent" />
                    <strong style={{ marginTop: '8px' }}>Client-Confidential Batch Vault</strong>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Delivered directly to your registered business email upon verified dispatch schedule.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // ════════════════════════════════════════════════════════════
  // 2. INDUSTRIAL FEED ISOLATED VIEW (DDGS & MOLASSES)
  // ════════════════════════════════════════════════════════════
  if (tenant.id === 'feed') {
    return (
      <main className="home-neu-main" ref={revealRef}>
        {/* Feed Hero with 3D Floating Objects */}
        <section className="neu-hero" id="hero-section">
          <FloatingObjects sector="feed" />
          <ParticleField count={40} color="#d97706" />
          <div className="neu-hero-glow" style={{ background: 'radial-gradient(circle, rgba(217, 119, 6, 0.18), transparent 70%)' }} />

          <div className="container neu-hero-content">
            <div className="hero-eyebrow-wrapper">
              <div className="neu-pill" style={{ color: '#d97706', borderColor: 'rgba(217, 119, 6, 0.3)' }}>
                <Wheat size={14} /> Grain Distillery Byproduct Allotment &bull; High Protein Nutrition
              </div>
            </div>

            <h1 className="neu-hero-title">
              <span>Bulk Corn &amp; Rice DDGS.</span>
              <span className="text-gradient">Heavy Molasses Tanker Logistics.</span>
            </h1>

            <p className="neu-hero-sub">
              High-protein grain byproducts (28%-45% crude protein) and 80°+ Brix heavy cane molasses dispatched directly from premier grain &amp; sugar distilleries for dairy herds, poultry integrators, and aquafeed mills nationwide.
            </p>

            <div className="neu-hero-actions">
              <Link to="/institutional?sector=feed" className="neu-btn neu-btn-primary neu-btn-lg">
                <Wheat size={18} /> Request Bulk Feed Contract
              </Link>
              <a href="#tonnage-calculator" className="neu-btn neu-btn-glass neu-btn-lg">
                Calculate Tonnage &amp; Freight <ArrowRight size={16} />
              </a>
            </div>

            {/* Feed Stat Strip */}
            <div className="neu-stat-strip neu-card">
              <div className="neu-stat-cell">
                <span className="stat-number">28 - 45%</span>
                <span className="stat-tag">Crude Protein (Dry Basis)</span>
              </div>
              <div className="neu-stat-cell">
                <span className="stat-number">&gt; 80.0°</span>
                <span className="stat-tag">Brix Heavy Molasses</span>
              </div>
              <div className="neu-stat-cell">
                <span className="stat-number">&lt; 10.0%</span>
                <span className="stat-tag">Controlled Moisture</span>
              </div>
              <div className="neu-stat-cell">
                <span className="stat-number">24 - 48h</span>
                <span className="stat-tag">Direct Mill Clearance</span>
              </div>
            </div>
          </div>
        </section>

        {/* Live Feed Dispatch Corridors */}
        <div className="neu-ticker-bar">
          <div className="ticker-track" ref={tickerRef}>
            <div className="ticker-content">
              {[
                { mill: 'Bihar Grain Distillery Hub', stock: 'Corn DDGS: 450 MT Available' },
                { mill: 'UP Sugarcane Belt Hub', stock: 'Heavy Cane Molasses: 600 MT Active Tankers' },
                { mill: 'Bengal Feed Logistics Corridor', stock: 'Rice DDGS 42% Protein: 350 MT' },
                { mill: 'Assam / Brahmaputra Feed Node', stock: 'Daily Rail & Multi-Axle Dispatches' },
              ].concat([
                { mill: 'Bihar Grain Distillery Hub', stock: 'Corn DDGS: 450 MT Available' },
                { mill: 'UP Sugarcane Belt Hub', stock: 'Heavy Cane Molasses: 600 MT Active Tankers' },
              ]).map((node, i) => (
                <div key={i} className="neu-ticker-pill" style={{ borderColor: 'rgba(217, 119, 6, 0.3)' }}>
                  <span className="pulse-dot-amber" />
                  <strong>{node.mill}:</strong>
                  <span>{node.stock}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feed Interactive Tonnage Calculator */}
        <section className="section" id="tonnage-calculator">
          <div className="container">
            <TonnageSlider sector="feed" defaultTonnage={30} />
          </div>
        </section>

        {/* Feed Product Specifications Grid */}
        <section className="section" id="product-specifications">
          <div className="container">
            <div className="section-header">
              <span className="section-label">Industrial Animal Feedstock</span>
              <h2 className="section-title">Crude Protein &amp; Brix Specifications</h2>
              <p className="section-subtitle">
                Distillery-direct quality parameters for commercial cattle feed manufacturers, poultry layer rations, and aquaculture feed pellets.
              </p>
            </div>

            <div className="product-specs-grid">
              {feedProducts.map((p) => (
                <ProductSpecCard key={p.id} product={p} sector="feed" />
              ))}
            </div>
          </div>
        </section>

        {/* Feed Client-Confidential Testing Protocol Notice */}
        <section className="section" id="feed-quality-protocol">
          <div className="container">
            <div className="neu-lab-box neu-card">
              <div className="lab-box-grid">
                <div>
                  <div className="coming-soon-label-pill" style={{ color: '#d97706', borderColor: 'rgba(217, 119, 6, 0.3)' }}>
                    <Clock size={13} /> FEED COA VAULT COMING SOON
                  </div>
                  <h3 style={{ fontSize: '1.8rem', margin: '0.6rem 0 0.8rem 0' }}>Client-Personal Nutritional Analysis Reports</h3>
                  <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1.2rem' }}>
                    Complete Kjeldahl crude protein verification, HPLC amino acid breakdowns, and aflatoxin screening test sheets (&lt; 20 ppb) <strong>are provided personally when we connect directly with our clients upon verified order initiation</strong>.
                  </p>
                  <div className="lab-check-bullets">
                    <div className="check-item"><CheckCircle2 size={16} style={{ color: '#d97706' }} /> Corn DDGS Crude Protein: 28% - 32% Verified</div>
                    <div className="check-item"><CheckCircle2 size={16} style={{ color: '#d97706' }} /> Rice DDGS Crude Protein: 40% - 45% Verified</div>
                    <div className="check-item"><CheckCircle2 size={16} style={{ color: '#d97706' }} /> Total Sugar Invert (Heavy Molasses): 46% - 50%</div>
                    <div className="check-item"><CheckCircle2 size={16} style={{ color: '#d97706' }} /> Aflatoxin B1/B2/G1/G2: Screened &lt; 20 ppb Safe Level</div>
                  </div>
                  <Link to="/contact?sector=feed" className="neu-btn neu-btn-primary" style={{ marginTop: '1.5rem', background: 'linear-gradient(135deg, #78350f, #d97706)' }}>
                    <Wheat size={16} /> Request Distillery Mill Proforma
                  </Link>
                </div>
                <div className="lab-certificate-preview neu-inset">
                  <div className="cert-pill">
                    <Lock size={32} style={{ color: '#d97706' }} />
                    <strong style={{ marginTop: '8px' }}>Confidential Mill Analysis</strong>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Certified batch COA sent with loading gate weighbridge records.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // ════════════════════════════════════════════════════════════
  // 3. SEA BUCKTHORN ISOLATED VIEW (HIMALAYAN BOTANICALS)
  // ════════════════════════════════════════════════════════════
  if (tenant.id === 'seabuckthorn') {
    return (
      <main className="home-neu-main" ref={revealRef}>
        {/* Sea Buckthorn Hero with 3D Floating Objects */}
        <section className="neu-hero" id="hero-section">
          <FloatingObjects sector="seabuckthorn" />
          <ParticleField count={40} color="#ea580c" />
          <div className="neu-hero-glow" style={{ background: 'radial-gradient(circle, rgba(234, 88, 12, 0.18), transparent 70%)' }} />

          <div className="container neu-hero-content">
            <div className="hero-eyebrow-wrapper">
              <div className="neu-pill" style={{ color: '#ea580c', borderColor: 'rgba(234, 88, 12, 0.3)' }}>
                <Mountain size={14} /> High-Altitude Leh-Ladakh &bull; Wild Superfruit Extraction
              </div>
            </div>

            <h1 className="neu-hero-title">
              <span>Pure Supercritical CO₂ Sea Buckthorn.</span>
              <span className="text-gradient">Rare Omega-7 For Clinical Formulations.</span>
            </h1>

            <p className="neu-hero-sub">
              Wild-harvested from 11,000+ ft Himalayan valleys. Pure supercritical CO₂ seed oil, deep ruby pulp oil with &gt; 32% natural Palmitoleic acid, and cryogenically freeze-dried soluble fruit powders for cosmetics and wellness brands.
            </p>

            <div className="neu-hero-actions">
              <Link to="/contact?sector=seabuckthorn" className="neu-btn neu-btn-primary neu-btn-lg" style={{ background: 'linear-gradient(135deg, #1e293b, #ea580c)' }}>
                <Sparkles size={18} /> Request Advance Lab Sample
              </Link>
              <a href="#product-specifications" className="neu-btn neu-btn-glass neu-btn-lg">
                Explore Botanical Specs <ArrowRight size={16} />
              </a>
            </div>

            {/* Sea Buckthorn Stat Strip */}
            <div className="neu-stat-strip neu-card">
              <div className="neu-stat-cell">
                <span className="stat-number">&gt; 32.0%</span>
                <span className="stat-tag">Omega-7 (Palmitoleic)</span>
              </div>
              <div className="neu-stat-cell">
                <span className="stat-number">100%</span>
                <span className="stat-tag">Supercritical CO₂ Purity</span>
              </div>
              <div className="neu-stat-cell">
                <span className="stat-number">11,000 ft</span>
                <span className="stat-tag">Wild Himalayan Origin</span>
              </div>
              <div className="neu-stat-cell">
                <span className="stat-number">NABL Lab</span>
                <span className="stat-tag">Heavy Metal Screened</span>
              </div>
            </div>
          </div>
        </section>

        {/* Supercritical Active Extract Highlights */}
        <section className="section" id="botanical-highlights">
          <div className="container">
            <div className="omega-highlight-grid">
              <div className="omega-card neu-card">
                <div className="omega-icon" style={{ background: '#fff7ed', color: '#ea580c' }}>
                  <Droplet size={24} />
                </div>
                <h4>Supercritical CO₂ Seed Oil</h4>
                <p>Pure solvent-free golden oil. Exceptional 1:1 balanced ratio of Omega-3 (Alpha-Linolenic) &amp; Omega-6 (Linoleic) for anti-aging skincare.</p>
              </div>

              <div className="omega-card neu-card">
                <div className="omega-icon" style={{ background: '#fff7ed', color: '#ea580c' }}>
                  <Sun size={24} />
                </div>
                <h4>Ruby Mesocarp Pulp Oil</h4>
                <p>Intense crimson-amber oil packing the world's richest natural source of Palmitoleic Acid (&gt; 32% Omega-7) for epithelial mucosal repair.</p>
              </div>

              <div className="omega-card neu-card">
                <div className="omega-icon" style={{ background: '#fff7ed', color: '#ea580c' }}>
                  <Layers size={24} />
                </div>
                <h4>Freeze-Dried Berry Powder</h4>
                <p>100% water-dispersible whole fruit powder retaining natural Vitamin C (&gt; 800mg/100g) and polyphenols for modern nutraceutical blends.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Sea Buckthorn Product Specifications Grid */}
        <section className="section" id="product-specifications">
          <div className="container">
            <div className="section-header">
              <span className="section-label" style={{ color: '#ea580c' }}>Himalayan Active Formulations</span>
              <h2 className="section-title">NABL-Tested Botanical Technical Sheets</h2>
              <p className="section-subtitle">
                GC-MS verified fatty acid profiles, peroxide value standards, and heavy metal screening for clinical cosmetics &amp; nutraceuticals.
              </p>
            </div>

            <div className="product-specs-grid">
              {seaBuckthornProducts.map((p) => (
                <ProductSpecCard key={p.id} product={p} sector="seabuckthorn" />
              ))}
            </div>
          </div>
        </section>

        {/* Sea Buckthorn Client-Confidential Lab Protocol Notice */}
        <section className="section" id="botanical-lab-protocol">
          <div className="container">
            <div className="neu-lab-box neu-card">
              <div className="lab-box-grid">
                <div>
                  <div className="coming-soon-label-pill" style={{ color: '#ea580c', borderColor: 'rgba(234, 88, 12, 0.3)' }}>
                    <Clock size={13} /> BOTANICAL VAULT COMING SOON
                  </div>
                  <h3 style={{ fontSize: '1.8rem', margin: '0.6rem 0 0.8rem 0' }}>Client-Personal Chromatography Reports</h3>
                  <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1.2rem' }}>
                    Authentic GC-MS fatty acid profile certificates and microbiological purity sheets <strong>are provided personally when we connect directly with formulation clients upon verified pilot pack inquiry</strong>.
                  </p>
                  <div className="lab-check-bullets">
                    <div className="check-item"><CheckCircle2 size={16} style={{ color: '#ea580c' }} /> Omega-7 Palmitoleic Acid: &gt; 32% Certified in Pulp Oil</div>
                    <div className="check-item"><CheckCircle2 size={16} style={{ color: '#ea580c' }} /> Heavy Metals (Lead, Mercury, Cadmium): Zero / NABL Negative</div>
                    <div className="check-item"><CheckCircle2 size={16} style={{ color: '#ea580c' }} /> 100% Supercritical CO₂ Fluid Extraction @ 35°C (Zero Solvents)</div>
                    <div className="check-item"><CheckCircle2 size={16} style={{ color: '#ea580c' }} /> Natural Vitamin E (Tocopherols): &gt; 220 mg / 100g</div>
                  </div>
                  <Link to="/contact?sector=seabuckthorn" className="neu-btn neu-btn-primary" style={{ marginTop: '1.5rem', background: 'linear-gradient(135deg, #1e293b, #ea580c)' }}>
                    <Sparkles size={16} /> Request Botanical COA &amp; Pilot Pack
                  </Link>
                </div>
                <div className="lab-certificate-preview neu-inset">
                  <div className="cert-pill">
                    <Lock size={32} style={{ color: '#ea580c' }} />
                    <strong style={{ marginTop: '8px' }}>Proprietary Extract Data</strong>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Complete COA documentation delivered with sample dispatch.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  // ════════════════════════════════════════════════════════════
  // 4. CORPORATE GATEWAY VIEW (biolinkagri.in)
  // ════════════════════════════════════════════════════════════
  return (
    <main className="home-neu-main" ref={revealRef}>
      {/* Corporate Hero with 3D Floating Objects */}
      <section className="neu-hero" id="hero-section">
        <FloatingObjects sector="corporate" />
        <ParticleField count={40} color="#2563eb" />
        <div className="neu-hero-glow" style={{ background: 'radial-gradient(circle, rgba(37, 99, 235, 0.15), transparent 70%)' }} />

        <div className="container neu-hero-content">
          <div className="hero-eyebrow-wrapper">
            <div className="neu-pill">
              <Globe size={14} /> India’s Precision Agricultural Infrastructure &amp; Supply Chain Corridor
            </div>
          </div>

          <h1 className="neu-hero-title">
            <span>Enterprise Agricultural Sourcing.</span>
            <span className="text-gradient">Three Dedicated Industrial Sectors.</span>
          </h1>

          <p className="neu-hero-sub">
            Operating as an asset-light technology platform matching government-verified Compressed Biogas (CBG) organic manure plants, grain distillery DDGS mills, and high-altitude Himalayan botanical clusters with commercial enterprises.
          </p>

          <div className="neu-hero-actions">
            <Link to="/institutional" className="neu-btn neu-btn-primary neu-btn-lg">
              Get Consolidated Quote <ArrowRight size={16} />
            </Link>
            <Link to="/about" className="neu-btn neu-btn-glass neu-btn-lg">
              Corporate Governance
            </Link>
          </div>

          {/* Corporate Stat Strip */}
          <div className="neu-stat-strip neu-card">
            <div className="neu-stat-cell">
              <span className="stat-number">1,200+</span>
              <span className="stat-tag">Monthly MT Dispatched</span>
            </div>
            <div className="neu-stat-cell">
              <span className="stat-number">72-Hour</span>
              <span className="stat-tag">Gate Escrow Clearance</span>
            </div>
            <div className="neu-stat-cell">
              <span className="stat-number">6 States</span>
              <span className="stat-tag">Transport Corridors</span>
            </div>
            <div className="neu-stat-cell">
              <span className="stat-number">100%</span>
              <span className="stat-tag">Weighbridge Traceability</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Dedicated Spaces Gateway Cards */}
      <section className="section" id="sectors-gateway">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Dedicated Enterprise Portals</span>
            <h2 className="section-title">Select Your Agricultural Sector</h2>
            <p className="section-subtitle">
              Each vertical operates as a dedicated space with custom laboratory parameters, freight algorithms, and dispatch corridors.
            </p>
          </div>

          <div className="corporate-sector-grid">
            {/* Sector 1: Organic Manure Space */}
            <div className="sector-gate-card neu-card">
              <div className="sector-gate-header">
                <div className="sector-gate-icon" style={{ background: '#ecfdf5', color: '#059669' }}>
                  <Leaf size={24} />
                </div>
                <div>
                  <span className="gate-subdomain">manure.biolinkagri.in</span>
                  <h3 className="gate-title">Organic Manure Space</h3>
                </div>
              </div>
              <p className="gate-desc">
                Government-certified Fermented Organic Manure (FOM) and bio-slurry from SATAT CBG plants. FCO 1985 tested with strict moisture &lt; 30%.
              </p>
              <button
                onClick={() => switchTenant('manure')}
                className="neu-btn neu-btn-primary"
                style={{ width: '100%', background: 'linear-gradient(135deg, #064e3b, #059669)' }}
              >
                Enter Manure Space <ArrowRight size={14} />
              </button>
            </div>

            {/* Sector 2: Industrial Feed Space */}
            <div className="sector-gate-card neu-card">
              <div className="sector-gate-header">
                <div className="sector-gate-icon" style={{ background: '#fffbeb', color: '#d97706' }}>
                  <Wheat size={24} />
                </div>
                <div>
                  <span className="gate-subdomain">feed.biolinkagri.in</span>
                  <h3 className="gate-title">Industrial Feed Space</h3>
                </div>
              </div>
              <p className="gate-desc">
                Bulk Corn &amp; Rice DDGS (28-45% Crude Protein) and 80°+ Brix heavy cane molasses for commercial dairy, poultry, and aquafeed operations.
              </p>
              <button
                onClick={() => switchTenant('feed')}
                className="neu-btn neu-btn-primary"
                style={{ width: '100%', background: 'linear-gradient(135deg, #78350f, #d97706)' }}
              >
                Enter Feed Space <ArrowRight size={14} />
              </button>
            </div>

            {/* Sector 3: Sea Buckthorn Space */}
            <div className="sector-gate-card neu-card">
              <div className="sector-gate-header">
                <div className="sector-gate-icon" style={{ background: '#fff7ed', color: '#ea580c' }}>
                  <Mountain size={24} />
                </div>
                <div>
                  <span className="gate-subdomain">seabuckthorn.biolinkagri.in</span>
                  <h3 className="gate-title">Premium Botanicals Space</h3>
                </div>
              </div>
              <p className="gate-desc">
                Himalayan wild-harvested Sea Buckthorn extracts. Solvent-free Supercritical CO₂ seed oil, ruby pulp oil with &gt; 32% Omega-7, and soluble berry powder.
              </p>
              <button
                onClick={() => switchTenant('seabuckthorn')}
                className="neu-btn neu-btn-primary"
                style={{ width: '100%', background: 'linear-gradient(135deg, #1e293b, #ea580c)' }}
              >
                Enter Botanicals Space <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Tonnage Calculator */}
      <section className="section" id="tonnage-calculator">
        <div className="container">
          <TonnageSlider sector="corporate" defaultTonnage={30} />
        </div>
      </section>

      {/* Corporate Governance & Trust Strip */}
      <section className="section" id="corporate-trust">
        <div className="container">
          <div className="neu-lab-box neu-card">
            <div className="lab-box-grid">
              <div>
                <span className="section-label">Institutional Assurance</span>
                <h3 style={{ fontSize: '1.8rem', marginBottom: '0.8rem' }}>The BioLink 72-Hour Gate Escrow Protocol</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '1.2rem' }}>
                  To protect bulk institutional buyers, all financial transactions are held securely in quality escrow. Funds are disbursed to supplying CBG plants and distilleries only after the consignment passes destination weighbridge checks and client inspection.
                </p>
                <div className="lab-check-bullets">
                  <div className="check-item"><CheckCircle2 size={16} className="text-accent" /> Dharma Kanta Certified Gross-Minus-Tare Verification</div>
                  <div className="check-item"><CheckCircle2 size={16} className="text-accent" /> Zero Middleman Direct-from-Plant Pricing</div>
                  <div className="check-item"><CheckCircle2 size={16} className="text-accent" /> Multi-Axle Intermodal Freight Network Across 6 States</div>
                  <div className="check-item"><CheckCircle2 size={16} className="text-accent" /> Resend Verified Custom Domain Transactional Tracking</div>
                </div>
                <Link to="/logistics" className="neu-btn neu-btn-glass" style={{ marginTop: '1.5rem' }}>
                  <MapPin size={16} /> Explore Pan-India Logistics Corridors
                </Link>
              </div>
              <div className="lab-certificate-preview neu-inset">
                <div className="cert-pill">
                  <ShieldCheck size={32} className="text-accent" />
                  <strong style={{ fontSize: '1.05rem', margin: '8px 0 4px' }}>Enterprise Asset-Light Logistics</strong>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Operating under Small-Business MSME Tax-Exempt Framework.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
