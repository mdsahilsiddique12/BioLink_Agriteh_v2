/**
 * BioLink Agritech Solutions — Multi-Tenant Sector Configuration
 * Defines strict sector isolation, Neumorphic Glass tokens, and sector-specific routing.
 */

export const TENANTS = {
  corporate: {
    id: 'corporate',
    subdomain: '',
    name: 'BioLink Agritech Enterprise',
    shortName: 'Corporate Hub',
    tagline: 'Agricultural Infrastructure, Bio-Inputs & Industrial Feed Logistics',
    themeName: 'Sapphire Corporate',
    badge: 'Enterprise Gateway',
    colorPalette: {
      primary: '#0b192c',        // Dark Corporate Midnight
      accent: '#2563eb',         // Trust Sapphire Blue
      accentGlow: 'rgba(37, 99, 235, 0.28)',
      secondary: '#0284c7',
      bgBase: '#edf2f7',         // Cool Platinum Neumorphic Base
      insetBase: '#e2e8f0',
      shadowTint: 'rgba(148, 163, 184, 0.35)',
    },
    hero: {
      eyebrow: 'Verified SATAT Network & Industrial Sourcing Alliance',
      titleLine1: 'India’s Precision B2B Network for',
      titleHighlight: 'Agri-Inputs, Industrial Feed & Extracts.',
      subtitle: 'Bridging certified Compressed Biogas (CBG) organic manure plants, grain distillery DDGS mills, and high-altitude Himalayan botanical clusters with pan-India commercial buyers.',
      stat1: { value: '1,200+', label: 'Monthly MT Dispatched' },
      stat2: { value: '72-Hour', label: 'Gate Escrow Clearance' },
      stat3: { value: '6 States', label: 'Active Transport Corridors' },
      stat4: { value: '100%', label: 'Dharma Kanta Verified' },
    },
    defaultSector: 'corporate',
  },

  manure: {
    id: 'manure',
    subdomain: 'manure',
    name: 'BioLink Organic Manure',
    shortName: 'Organic Manure Space',
    tagline: 'Lab-Certified Fermented Organic Manure (FOM) & Liquid Bio-Slurry',
    themeName: 'Bio-Organic Earth',
    badge: 'Govt. Verified SATAT / GOBARdhan Plant Network',
    colorPalette: {
      primary: '#064e3b',        // Deep Forest Green
      accent: '#059669',         // Vibrant Emerald
      accentGlow: 'rgba(5, 150, 105, 0.28)',
      secondary: '#78350f',      // Soil Earth
      bgBase: '#f1f6f2',         // Soft Earth Cream Neumorphic Base
      insetBase: '#e4ece6',
      shadowTint: 'rgba(140, 165, 148, 0.35)',
    },
    hero: {
      eyebrow: 'FCO 1985 Schedule IV Compliant & Heat-Sterilized',
      titleLine1: 'Bulk Fermented Organic Manure.',
      titleHighlight: '72-Hour Gate Escrow Dispatches.',
      subtitle: 'Direct factory gate dispatches from certified Compressed Biogas (CBG) facilities across India. Guaranteed moisture < 30%, organic carbon > 16%, and strict zero heavy-metal certification.',
      stat1: { value: '< 30.0%', label: 'Strict Moisture Cap' },
      stat2: { value: '> 16.0%', label: 'Organic Carbon Ratio' },
      stat3: { value: '15-500 MT', label: 'Multi-Axle Payload' },
      stat4: { value: '100%', label: 'Weighbridge Traceability' },
    },
    defaultSector: 'manure',
  },

  feed: {
    id: 'feed',
    subdomain: 'feed',
    name: 'BioLink Industrial Feed',
    shortName: 'Industrial Feed Space',
    tagline: 'High-Protein Corn/Rice DDGS & Heavy Blackstrap Cane Molasses',
    themeName: 'Industrial Harvest',
    badge: 'Distillery-Direct Industrial Animal Nutrition',
    colorPalette: {
      primary: '#5c2d0c',        // Deep Molasses Mahogany
      accent: '#d97706',         // Sun-ripened Corn Gold
      accentGlow: 'rgba(217, 119, 6, 0.30)',
      secondary: '#b45309',
      bgBase: '#f7f4ee',         // Warm Harvest Cream Neumorphic Base
      insetBase: '#ede8dd',
      shadowTint: 'rgba(180, 160, 140, 0.35)',
    },
    hero: {
      eyebrow: 'Direct Grain Distillery Co-Product Mill Allocations',
      titleLine1: 'Bulk Corn & Rice DDGS.',
      titleHighlight: 'Heavy Molasses Tanker Logistics.',
      subtitle: 'High-protein grain byproducts (28%-45% crude protein) and 80°+ Brix heavy cane molasses for commercial dairy herds, poultry integrators, and aquaculture feed mills nationwide.',
      stat1: { value: '28-45%', label: 'Crude Protein (Dry Basis)' },
      stat2: { value: '> 80.0°', label: 'Brix Heavy Molasses' },
      stat3: { value: '< 10.0%', label: 'Controlled Moisture' },
      stat4: { value: '24-48h', label: 'Direct Mill Clearance' },
    },
    defaultSector: 'feed',
  },

  seabuckthorn: {
    id: 'seabuckthorn',
    subdomain: 'seabuckthorn',
    name: 'BioLink Himalayan Botanicals',
    shortName: 'Sea Buckthorn Space',
    tagline: 'High-Altitude Leh-Ladakh Supercritical CO₂ Oils & Active Extracts',
    themeName: 'Himalayan Premium',
    badge: 'Leh-Ladakh Wild-Harvest Superfruit Extraction',
    colorPalette: {
      primary: '#1e293b',        // Cold Slate
      accent: '#ea580c',         // Alpine Orange
      accentGlow: 'rgba(234, 88, 12, 0.30)',
      secondary: '#f97316',
      bgBase: '#f4f6fa',         // Crisp Alpine Snow Neumorphic Base
      insetBase: '#e8edf5',
      shadowTint: 'rgba(150, 165, 185, 0.35)',
    },
    hero: {
      eyebrow: 'Wild-Harvested from 11,000+ ft High-Altitude Himalayan Clusters',
      titleLine1: 'Pure Supercritical CO₂ Sea Buckthorn.',
      titleHighlight: 'Rare Omega-7 For Clinical Cosmetics & Nutrition.',
      subtitle: 'Solvent-free supercritical CO₂ seed oil, deep ruby berry pulp oil (>32% Palmitoleic acid), and cryogenically freeze-dried soluble fruit powders for premium cosmetic and wellness brands.',
      stat1: { value: '> 32.0%', label: 'Omega-7 (Palmitoleic)' },
      stat2: { value: '100%', label: 'Supercritical CO₂ Purity' },
      stat3: { value: '> 800mg', label: 'Natural Vitamin C / 100g' },
      stat4: { value: 'NABL Lab', label: 'Heavy Metal Screened' },
    },
    defaultSector: 'seabuckthorn',
  },
};

/**
 * Detect tenant from hostname, query parameter, or path prefix
 */
export function detectTenant(hostname = window.location.hostname, search = window.location.search) {
  // 1. Query parameter override (e.g. ?tenant=feed or ?tenant=seabuckthorn)
  if (search) {
    const params = new URLSearchParams(search);
    const tenantParam = params.get('tenant') || params.get('sector');
    if (tenantParam && TENANTS[tenantParam.toLowerCase()]) {
      return TENANTS[tenantParam.toLowerCase()];
    }
  }

  // 2. Subdomain check from hostname
  const parts = hostname.split('.');
  if (parts.length >= 2) {
    const sub = parts[0].toLowerCase();
    if (sub === 'manure') return TENANTS.manure;
    if (sub === 'feed' || sub === 'ddgs') return TENANTS.feed;
    if (sub === 'seabuckthorn' || sub === 'wellness' || sub === 'botanicals') return TENANTS.seabuckthorn;
  }

  // 3. Path-based prefix check
  const pathname = window.location.pathname.toLowerCase();
  if (pathname.startsWith('/feed')) return TENANTS.feed;
  if (pathname.startsWith('/manure')) return TENANTS.manure;
  if (pathname.startsWith('/seabuckthorn') || pathname.startsWith('/wellness')) return TENANTS.seabuckthorn;

  // Default to Corporate
  return TENANTS.corporate;
}
