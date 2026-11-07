import { createContext, useContext, useState, useEffect } from 'react';
import { TENANTS, detectTenant } from '../config/tenants';

const SubdomainContext = createContext();

export function SubdomainProvider({ children }) {
  const [tenant, setTenant] = useState(() => detectTenant());

  // Inject Neumorphic & Theme variables dynamically
  useEffect(() => {
    if (!tenant) return;
    const root = document.documentElement;
    const palette = tenant.colorPalette;

    root.style.setProperty('--theme-primary', palette.primary);
    root.style.setProperty('--theme-accent', palette.accent);
    root.style.setProperty('--theme-accent-glow', palette.accentGlow);
    root.style.setProperty('--theme-secondary', palette.secondary);
    root.style.setProperty('--bg-base', palette.bgBase);
    root.style.setProperty('--bg-inset', palette.insetBase);

    // Update document title & favicon
    document.title = `${tenant.name} — ${tenant.tagline}`;
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', palette.primary);
    }
  }, [tenant]);

  const switchTenant = (tenantId) => {
    const targetTenant = TENANTS[tenantId];
    if (targetTenant) {
      setTenant(targetTenant);
      const url = new URL(window.location.href);
      url.searchParams.set('tenant', tenantId);
      window.history.pushState({}, '', url.toString());
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getSectorUrl = (tenantId, path = '/') => {
    const isLocalhost = window.location.hostname.includes('localhost') || 
                        window.location.hostname.includes('127.0.0.1') || 
                        window.location.hostname.includes('netlify.app') ||
                        window.location.hostname.includes('v2.biolinkagri.in');

    const targetTenant = TENANTS[tenantId];
    if (!targetTenant) return path;

    if (isLocalhost) {
      if (tenantId === 'corporate') return path;
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
