import { Globe, Leaf, Wheat, Mountain, ChevronRight, Sparkles } from 'lucide-react';
import { useSubdomain } from '../context/SubdomainContext';
import './SectorSwitcher.css';

export default function SectorSwitcher() {
  const { tenant, switchTenant, allTenants } = useSubdomain();

  const sectorIcons = {
    corporate: Globe,
    manure: Leaf,
    feed: Wheat,
    seabuckthorn: Mountain,
  };

  return (
    <div className="sector-switcher-bar" id="sector-navigation-bar">
      <div className="container sector-switcher-inner">
        <div className="sector-switcher-label">
          <span className="live-pulse-dot" />
          <span className="switcher-title">BioLink Multi-Sector Network:</span>
        </div>

        <div className="sector-tabs-wrap">
          {Object.values(allTenants).map((t) => {
            const Icon = sectorIcons[t.id] || Globe;
            const isActive = tenant.id === t.id;

            return (
              <button
                key={t.id}
                onClick={() => switchTenant(t.id)}
                className={`sector-tab-btn ${isActive ? 'sector-tab-btn--active' : ''}`}
                id={`sector-tab-${t.id}`}
                title={`Switch to ${t.name} (${t.themeName} Theme)`}
              >
                <Icon size={14} className="sector-tab-icon" />
                <span className="sector-tab-name">{t.shortName}</span>
                {t.id === 'seabuckthorn' && <span className="sector-mini-badge">NEW</span>}
                {isActive && <span className="active-glow-indicator" />}
              </button>
            );
          })}
        </div>

        <div className="subdomain-indicator-pill">
          <span className="subdomain-text">
            Active Subdomain: <strong>{tenant.subdomain ? `${tenant.subdomain}.biolinkagri.in` : 'biolinkagri.in'}</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
