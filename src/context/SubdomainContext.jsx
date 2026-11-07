import { createContext, useContext, useState, useEffect } from 'react';
import { TENANTS, detectTenant } from '../config/tenants';

const SubdomainContext = createContext();

export function SubdomainProvider({ children }) {
  const [tenant, setTenant] = useState(() => detectTenant());
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);

  // Apply theme tokens to CSS variables on tenant change
  useEffect(() => {
    if (!tenant) return;
    const root = document.documentElement;
    const palette = tenant.colorPalette;

    root.style.setProperty('--neon-green', palette.primary);
    root.style.setProperty('--neon-cyan', palette.accent);
    root.style.setProperty('--neon-gold', palette.secondary);
    root.style.setProperty('--text-glow', palette.primaryGlow);
    root.style.setProperty('--border-glow', palette.borderGlow);
    root.style.setProperty('--gradient-primary', palette.btnPrimaryBg);
    root.style.setProperty('--gradient-hero', palette.heroGradient);
    root.style.setProperty('--shadow-neon', palette.btnPrimaryGlow);
    root.style.setProperty('--bg-void', palette.bgVoid);
    root.style.setProperty('--bg-card', palette.bgCard);

    // Dynamic browser tab title and meta theme color
    document.title = `${tenant.name} — ${tenant.tagline}`;
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', palette.primary);
    }
  }, [tenant]);

  // Switch tenant in state and update browser URL without hard reloading
  const switchTenant = (tenantId) => {
    const targetTenant = TENANTS[tenantId];
    if (targetTenant) {
      setTenant(targetTenant);
      const url = new URL(window.location.href);
      url.searchParams.set('tenant', tenantId);
      window.history.pushState({}, '', url.toString());
    }
  };

  /**
   * Generates cross-domain URL for a given sector
   * In production: returns https://<subdomain>.biolinkagri.in<path>
   * In development: returns <path>?tenant=<tenantId>
   */
  const getSectorUrl = (tenantId, path = '/') => {
    const isLocalhost = window.location.hostname.includes('localhost') || 
                        window.location.hostname.includes('127.0.0.1') || 
                        window.location.hostname.includes('netlify.app');

    const targetTenant = TENANTS[tenantId];
    if (!targetTenant) return path;

    if (isLocalhost) {
      if (tenantId === 'corporate') {
        return path;
      }
      const sep = path.includes('?') ? '&' : '?';
      return `${path}${sep}tenant=${tenantId}`;
    }

    if (tenantId === 'corporate' || !targetTenant.subdomain) {
      return `https://biolinkagri.in${path}`;
    }
    return `https://${targetTenant.subdomain}.biolinkagri.in${path}`;
  };

  return (
    <SubdomainContext.Provider
      value={{
        tenant,
        setTenant,
        switchTenant,
        getSectorUrl,
        allTenants: TENANTS,
        isSimulatorOpen,
        setIsSimulatorOpen,
      }}
    >
      {children}
    </SubdomainContext.Provider>
  );
}

export function useSubdomain() {
  const context = useContext(SubdomainContext);
  if (!context) {
    throw new Error('useSubdomain must be used within a SubdomainProvider');
  }
  return context;
}
