/**
 * BioLink Agritech Solutions — Multi-Tenant Sector Configuration
 * Defines branding, design tokens, product lines, and routing for:
 * 1. Corporate Gateway (biolinkagri.in) - Sapphire Corporate
 * 2. Organic Manure Sector (manure.biolinkagri.in) - Bio-Organic Earth
 * 3. Industrial Feed Sector (feed.biolinkagri.in) - Industrial Harvest
 * 4. Premium Botanicals (seabuckthorn.biolinkagri.in) - Himalayan Premium
 */

export const TENANTS = {
  corporate: {
    id: 'corporate',
    subdomain: '',
    name: 'BioLink Agritech Solutions',
    shortName: 'BioLink Hub',
    tagline: 'Enterprise Agricultural Infrastructure & Clean Supply Chains',
    themeName: 'Sapphire Corporate',
    badge: 'Enterprise Gateway',
    colorPalette: {
      primary: '#0f172a',        // Dark Slate / Midnight
      primaryGlow: '#1e3a8a',    // Deep Royal Blue
      accent: '#2563eb',         // Sapphire Trust Blue
      accentHover: '#1d4ed8',
      secondary: '#0284c7',      // Sky Cyan
      bgVoid: '#f8fafc',         // Pristine Platinum
      bgCard: 'rgba(255, 255, 255, 0.92)',
      bgSurface: '#ffffff',
      borderSubtle: '#e2e8f0',
      borderGlow: 'rgba(37, 99, 235, 0.25)',
      textPrimary: '#0f172a',
      textSecondary: '#475569',
      heroGradient: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #2563eb 100%)',
      btnPrimaryBg: 'linear-gradient(135deg, #1e40af, #2563eb)',
      btnPrimaryGlow: '0 0 24px rgba(37, 99, 235, 0.4)',
    },
    hero: {
      eyebrow: 'Verified SATAT Network & Industrial Co-Product Alliance',
      titleLine1: 'India’s Precision B2B Network for',
      titleHighlight: 'Sustainable Agritech & Industrial Feed',
      subtitle: 'Unifying government-certified Fermented Organic Manure (FOM), high-protein DDGS & molasses feedstock, and high-altitude Himalayan botanicals under rigorous lab traceability.',
      stat1: { value: '1,200+', label: 'Monthly MT Dispatched' },
      stat2: { value: '72-Hr', label: 'Escrow QA Gate' },
      stat3: { value: '6 States', label: 'Processing Corridors' },
      stat4: { value: '100%', label: 'Weighbridge Traceability' },
    },
    defaultSector: 'all',
  },

  manure: {
    id: 'manure',
    subdomain: 'manure',
    name: 'BioLink Organic Manure',
    shortName: 'FOM Manure Portal',
    tagline: 'Bulk Fermented Organic Manure (FOM) & Bio-Inputs',
    themeName: 'Bio-Organic Earth',
    badge: 'Govt. Verified SATAT Plant Partner',
    colorPalette: {
      primary: '#064e3b',        // Forest Green
      primaryGlow: '#065f46',    // Deep Emerald
      accent: '#059669',         // Emerald Green
      accentHover: '#047857',
      secondary: '#78350f',      // Warm Soil Brown
      bgVoid: '#f8faf9',         // Soft Earth Cream
      bgCard: 'rgba(255, 255, 255, 0.93)',
      bgSurface: '#ffffff',
      borderSubtle: '#e2e8f0',
      borderGlow: 'rgba(5, 150, 105, 0.25)',
      textPrimary: '#0f172a',
      textSecondary: '#334155',
      heroGradient: 'linear-gradient(135deg, #022c22 0%, #064e3b 50%, #059669 100%)',
      btnPrimaryBg: 'linear-gradient(135deg, #10b981, #059669)',
      btnPrimaryGlow: '0 0 24px rgba(16, 185, 129, 0.4)',
    },
    hero: {
      eyebrow: 'FCO 1985 Standard Compliant & GOBARdhan Verified',
      titleLine1: '100% Heat-Sterilized Bulk Supplies.',
      titleHighlight: '72-Hour Gate Escrow Dispatch.',
      subtitle: 'Direct factory gate allotments from certified Compressed Biogas (CBG) facilities. Guaranteed moisture < 30%, organic carbon > 16%, and strict zero heavy-metal certification.',
      stat1: { value: '15-500', label: 'MT Capacity per Truck' },
      stat2: { value: '< 30%', label: 'Strict Moisture Cap' },
      stat3: { value: '> 16%', label: 'Organic Carbon Ratio' },
      stat4: { value: 'Dharma Kanta', label: 'Weighbridge Certified' },
    },
    defaultSector: 'manure',
  },

  feed: {
    id: 'feed',
    subdomain: 'feed',
    name: 'BioLink Industrial Feed',
    shortName: 'DDGS & Molasses Portal',
    tagline: 'Bulk Corn/Rice DDGS & Heavy Molasses for Dairy, Poultry & Aquafeed',
    themeName: 'Industrial Harvest',
    badge: 'Industrial Feedstock Allocation',
    colorPalette: {
      primary: '#78350f',        // Deep Amber / Molasses
      primaryGlow: '#92400e',    // Rich Amber
      accent: '#d97706',         // Sun-ripened Corn Gold
      accentHover: '#b45309',
      secondary: '#451a03',      // Matte Molasses Charcoal
      bgVoid: '#fafaf9',         // Warm Platinum Harvest
      bgCard: 'rgba(255, 255, 255, 0.92)',
      bgSurface: '#ffffff',
      borderSubtle: '#e7e5e4',
      borderGlow: 'rgba(217, 119, 6, 0.28)',
      textPrimary: '#1c1917',
      textSecondary: '#44403c',
      heroGradient: 'linear-gradient(135deg, #451a03 0%, #78350f 50%, #d97706 100%)',
      btnPrimaryBg: 'linear-gradient(135deg, #f59e0b, #d97706)',
      btnPrimaryGlow: '0 0 24px rgba(245, 158, 11, 0.4)',
    },
    hero: {
      eyebrow: 'Distillery-Direct High Protein Animal Nutrition Contracts',
      titleLine1: 'Bulk Corn & Rice DDGS.',
      titleHighlight: 'Heavy Molasses Rail & FTL Logistics.',
      subtitle: 'Guaranteed 28%-45% crude protein feedstocks, high energy density, and superior digestibility for cattle feeds, poultry integrators, and aquaculture plants across India.',
      stat1: { value: '28-45%', label: 'Crude Protein Content' },
      stat2: { value: '> 80°', label: 'Brix Heavy Molasses' },
      stat3: { value: '< 10%', label: 'Controlled Moisture' },
      stat4: { value: '24-48h', label: 'Direct Mill Clearance' },
    },
    defaultSector: 'feed',
  },

  seabuckthorn: {
    id: 'seabuckthorn',
    subdomain: 'seabuckthorn',
    name: 'BioLink Himalayan Botanicals',
    shortName: 'Sea Buckthorn Space',
    tagline: 'High-Altitude Leh-Ladakh Sea Buckthorn Oils & Active Extracts',
    themeName: 'Himalayan Premium',
    badge: 'Himalayan Superfruit Bio-Active Extracts',
    colorPalette: {
      primary: '#1e293b',        // Cold Slate
      primaryGlow: '#334155',    // Mountain Slate
      accent: '#ea580c',         // Alpine Orange
      accentHover: '#c2410c',
      secondary: '#f97316',      // Golden Berry
      bgVoid: '#fbfcfd',         // Pristine Snow White
      bgCard: 'rgba(255, 255, 255, 0.94)',
      bgSurface: '#ffffff',
      borderSubtle: '#e2e8f0',
      borderGlow: 'rgba(234, 88, 12, 0.28)',
      textPrimary: '#0f172a',
      textSecondary: '#475569',
      heroGradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #ea580c 100%)',
      btnPrimaryBg: 'linear-gradient(135deg, #f97316, #ea580c)',
      btnPrimaryGlow: '0 0 24px rgba(234, 88, 12, 0.45)',
    },
    hero: {
      eyebrow: 'Leh-Ladakh & Lahaul-Spiti Wild-Harvest Cluster Sourcing',
      titleLine1: 'CO₂ Supercritical Himalayan Extracts.',
      titleHighlight: 'Rare Omega-7 For Clinical Cosmetics & Wellness.',
      subtitle: 'Pure supercritical CO₂ seed oil, dark ruby pulp oil with > 30% Palmitoleic acid, and freeze-dried bioactive soluble berry powders for nutraceuticals and clean beauty.',
      stat1: { value: '> 30%', label: 'Omega-7 Palmitoleic' },
      stat2: { value: '100%', label: 'Supercritical CO₂ Purity' },
      stat3: { value: '11,000 ft', label: 'Wild Himalayan Origin' },
      stat4: { value: 'NABL Lab', label: 'Heavy Metal Screened' },
    },
    defaultSector: 'seabuckthorn',
  },
};

/**
 * Determine tenant based on current hostname or fallback query param
 */
export function detectTenant(hostname = window.location.hostname, search = window.location.search) {
  // 1. Check query parameter override for testing (e.g. ?sector=feed or ?tenant=manure)
  if (search) {
    const params = new URLSearchParams(search);
    const tenantParam = params.get('tenant') || params.get('sector');
    if (tenantParam && TENANTS[tenantParam.toLowerCase()]) {
      return TENANTS[tenantParam.toLowerCase()];
    }
  }

  // 2. Check path-based preview (e.g. /feed, /manure, /seabuckthorn)
  const pathname = window.location.pathname.toLowerCase();
  if (pathname.startsWith('/feed')) return TENANTS.feed;
  if (pathname.startsWith('/manure')) return TENANTS.manure;
  if (pathname.startsWith('/seabuckthorn') || pathname.startsWith('/wellness')) return TENANTS.seabuckthorn;

  // 3. Subdomain extraction from hostname (e.g. feed.biolinkagri.in or manure.localhost)
  const parts = hostname.split('.');
  if (parts.length >= 2) {
    const sub = parts[0].toLowerCase();
    if (sub === 'manure') return TENANTS.manure;
    if (sub === 'feed' || sub === 'ddgs') return TENANTS.feed;
    if (sub === 'seabuckthorn' || sub === 'wellness' || sub === 'botanicals') return TENANTS.seabuckthorn;
  }

  // Default to Corporate Gateway
  return TENANTS.corporate;
}
