import { useState } from 'react';
import { ShieldCheck, FileText, CheckCircle2, Package, ArrowRight, Sparkles } from 'lucide-react';
import './ProductSpecCard.css';

export default function ProductSpecCard({ product, sector = 'manure' }) {
  // Sector-specific request route
  const getRequestLink = () => {
    if (sector === 'feed') {
      return `/institutional?sector=feed&product=${encodeURIComponent(product.id)}`;
    }
    if (sector === 'seabuckthorn') {
      return `/contact?sector=seabuckthorn&product=${encodeURIComponent(product.id)}`;
    }
    return `/sample`;
  };

  const getRequestText = () => {
    if (sector === 'feed') return 'Request Mill Allocation';
    if (sector === 'seabuckthorn') return 'Request Pilot Pack (5L/10kg)';
    return 'Order Sample (20/30/50kg)';
  };

  return (
    <div className="neu-spec-card neu-card">
      {/* Top Header Badge Row */}
      <div className="spec-card-top">
        <span className="spec-badge-pill">
          {product.badge || 'Verified Standard'}
        </span>
        {product.npk && (
          <span className="spec-npk-tag">{product.npk}</span>
        )}
      </div>

      {/* Title & Tagline */}
      <div className="spec-title-area">
        <h3 className="spec-card-title">{product.name}</h3>
        <p className="spec-card-sub">{product.tagline || product.description}</p>
      </div>

      {/* Structural Neumorphic Key-Value Inset Datasheet */}
      <div className="spec-datasheet-inset neu-inset">
        {product.specs ? (
          Object.entries(product.specs).slice(0, 4).map(([key, val]) => (
            <div key={key} className="spec-stat-cell">
              <span className="stat-key">{key.replace(/([A-Z])/g, ' $1').toUpperCase()}</span>
              <span className="stat-val">{val}</span>
            </div>
          ))
        ) : (
          <>
            <div className="spec-stat-cell">
              <span className="stat-key">ORGANIC CARBON</span>
              <span className="stat-val">&gt; 16.0% Minimum</span>
            </div>
            <div className="spec-stat-cell">
              <span className="stat-key">MOISTURE CAP</span>
              <span className="stat-val">&lt; 30.0% Hard Limit</span>
            </div>
            <div className="spec-stat-cell">
              <span className="stat-key">C:N RATIO</span>
              <span className="stat-val">&lt; 20:1 Ideal</span>
            </div>
            <div className="spec-stat-cell">
              <span className="stat-key">HEAVY METALS</span>
              <span className="stat-val">Negative (NABL Tested)</span>
            </div>
          </>
        )}
      </div>

      {/* Features Bullet List */}
      <div className="spec-bullets-list">
        {(product.features || product.applications || ['Lab Certified', 'Zero Pathogens', 'Direct Dispatch']).slice(0, 3).map((feat, idx) => (
          <div key={idx} className="spec-bullet-row">
            <CheckCircle2 size={14} className="text-accent" />
            <span>{feat}</span>
          </div>
        ))}
      </div>

      {/* Action Footer */}
      <div className="spec-card-footer">
        <a href={getRequestLink()} className="neu-btn neu-btn-primary spec-action-btn">
          <Package size={14} /> {getRequestText()}
        </a>
        <a href="/lab-reports" className="neu-btn neu-btn-glass spec-coa-btn" title="View Certificate of Analysis">
          <FileText size={14} />
        </a>
      </div>
    </div>
  );
}
