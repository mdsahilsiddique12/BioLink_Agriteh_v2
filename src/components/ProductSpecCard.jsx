import { useState } from 'react';
import { ShieldCheck, FileText, CheckCircle2, Package, ArrowRight, ExternalLink, Sparkles } from 'lucide-react';
import './ProductSpecCard.css';

export default function ProductSpecCard({ product, sector = 'manure', onSelectSample }) {
  const [showSpecsModal, setShowSpecsModal] = useState(false);

  return (
    <div className="product-spec-card glass-card">
      {/* Header Badge */}
      <div className="product-spec-header">
        <span className={`spec-badge spec-badge--${product.badgeType || 'green'}`}>
          {product.badge || 'Verified Standard'}
        </span>
        {product.npk && (
          <span className="spec-metric-tag">{product.npk}</span>
        )}
      </div>

      {/* Title & Tagline */}
      <h3 className="product-spec-title">{product.name}</h3>
      <p className="product-spec-tagline">{product.tagline || product.description}</p>

      {/* Structural Data Sheet (Crisp Low-Border Key-Value Grid) */}
      <div className="product-datasheet-grid">
        {product.specs ? (
          Object.entries(product.specs).slice(0, 4).map(([key, val]) => (
            <div key={key} className="datasheet-item">
              <span className="datasheet-key">{key.replace(/([A-Z])/g, ' $1').toUpperCase()}</span>
              <span className="datasheet-val">{val}</span>
            </div>
          ))
        ) : (
          <>
            <div className="datasheet-item">
              <span className="datasheet-key">ORGANIC CARBON</span>
              <span className="datasheet-val">&gt; 16.0% Minimum</span>
            </div>
            <div className="datasheet-item">
              <span className="datasheet-key">MOISTURE CONTENT</span>
              <span className="datasheet-val">&lt; 30.0% Max Cap</span>
            </div>
            <div className="datasheet-item">
              <span className="datasheet-key">C:N RATIO</span>
              <span className="datasheet-val">&lt; 20:1 Ideal</span>
            </div>
            <div className="datasheet-item">
              <span className="datasheet-key">STERILIZATION</span>
              <span className="datasheet-val">Thermophilic Heat Screened</span>
            </div>
          </>
        )}
      </div>

      {/* Key Features List */}
      <div className="spec-features-list">
        {(product.features || product.applications || ['Lab Certified', 'Zero Pathogens', 'Direct Dispatch']).slice(0, 3).map((feat, idx) => (
          <div key={idx} className="spec-feature-bullet">
            <CheckCircle2 size={14} className="text-accent" />
            <span>{feat}</span>
          </div>
        ))}
      </div>

      {/* Card Action Footer */}
      <div className="product-spec-footer">
        <div className="spec-footer-actions">
          <a
            href={sector === 'feed' ? '/contact?product=' + encodeURIComponent(product.id) : '/sample'}
            className="btn btn-primary btn-sm"
          >
            <Package size={14} /> Request Allocation / Sample
          </a>
          <a
            href="/lab-reports"
            className="btn btn-outline btn-sm spec-coa-btn"
          >
            <FileText size={14} /> View COA
          </a>
        </div>
      </div>
    </div>
  );
}
