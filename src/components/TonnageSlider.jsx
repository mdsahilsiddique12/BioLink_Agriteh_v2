import { useState } from 'react';
import { Truck, Scale, ShieldCheck, ArrowRight, Zap, MapPin, Calculator, Sparkles, CheckCircle2 } from 'lucide-react';
import { useSubdomain } from '../context/SubdomainContext';
import './TonnageSlider.css';

export default function TonnageSlider({ defaultTonnage = 25, onSelectTonnage, sector = 'manure' }) {
  const { tenant } = useSubdomain();
  const [tonnage, setTonnage] = useState(defaultTonnage);
  const [destinationState, setDestinationState] = useState('Bihar');

  // Sector-specific pricing baselines per MT / Unit
  const sectorConfig = {
    manure: {
      title: 'Bulk Fermented Organic Manure (FOM)',
      unit: 'Metric Tons (MT)',
      basePricePerTon: 3600,
      packaging: '50kg HDPE Polypropylene Bags or Loose Tipper',
      minTon: 15,
      maxTon: 500,
      step: 5,
      truckCapacity: 25, // MT per multi-axle Taurus truck
      sampleNotice: 'Looking for 20-50kg farm trial bags? Visit our Sample Order desk.',
    },
    feed: {
      title: 'Bulk Corn / Rice DDGS Animal Nutrition & Molasses',
      unit: 'Metric Tons (MT)',
      basePricePerTon: 24500,
      packaging: '50kg PP Laminated Bags / Bulk Tipper / Insulated Tankers',
      minTon: 20,
      maxTon: 600,
      step: 10,
      truckCapacity: 30,
      sampleNotice: 'Lab samples available with complete NABL Certificate of Analysis.',
    },
    seabuckthorn: {
      title: 'Himalayan Supercritical CO₂ Oil / Soluble Powder',
      unit: 'Kilograms / Litres',
      basePricePerTon: 14500,
      packaging: 'Food-Grade 25L Nitrogen-Flushed Stainless/HDPE Drums',
      minTon: 5,
      maxTon: 500,
      step: 5,
      truckCapacity: 50,
      sampleNotice: 'Pilot trial packages start at 5 Litres / 5 Kilograms.',
    },
    corporate: {
      title: 'All-Sector Consolidated Bulk Supply Allocation',
      unit: 'Metric Tons (MT)',
      basePricePerTon: 4200,
      packaging: 'Custom Intermodal Freight (Bags/Bulk/Tanker)',
      minTon: 15,
      maxTon: 500,
      step: 10,
      truckCapacity: 25,
      sampleNotice: 'Enterprise contracts include custom multi-state freight routing.',
    },
  };

  const currentSector = sectorConfig[sector] || sectorConfig.manure;

  // Tiered volume discount
  const getVolumeDiscount = (mt) => {
    if (mt >= 300) return 350; // ₹350 per MT discount
    if (mt >= 150) return 250;
    if (mt >= 50) return 120;
    return 0;
  };

  const discountPerTon = getVolumeDiscount(tonnage);
  const effectivePricePerTon = currentSector.basePricePerTon - discountPerTon;
  const baseSubtotal = effectivePricePerTon * tonnage;

  // Estimated Freight Matrix per MT based on destination corridor
  const stateFreight = {
    'Bihar': 650,
    'West Bengal': 1100,
    'Uttar Pradesh': 950,
    'Assam': 1850,
    'Jharkhand': 700,
    'Odisha': 1250,
    'Other (Pan-India)': 1400,
  };

  const freightPerTon = stateFreight[destinationState] || 1200;
  const totalFreight = freightPerTon * tonnage;
  const grandTotal = baseSubtotal + totalFreight;

  // Number of trucks calculation
  const truckCount = Math.max(1, Math.ceil(tonnage / currentSector.truckCapacity));

  return (
    <div className="neu-tonnage-card neu-card">
      <div className="tonnage-card-top">
        <div className="neu-pill">
          <Calculator size={14} /> Real-Time Allocation &amp; Freight Engine
        </div>
        <h3 className="tonnage-heading">
          Interactive Consignment <span className="text-gradient">Freight &amp; Route Estimator</span>
        </h3>
        <p className="tonnage-sub">
          Slide to your desired volume. Our automated algorithm calculates truckload logistics, multi-axle freight clearance, and instant volume discounting.
        </p>
      </div>

      {/* Main Interactive Slider Display */}
      <div className="tonnage-slider-block">
        <div className="tonnage-metric-display">
          <div className="tonnage-number-wrap">
            <span className="tonnage-number">{tonnage}</span>
            <span className="tonnage-unit">{currentSector.unit}</span>
          </div>
          <div className="tonnage-tag">
            {tonnage >= 300 ? (
              <span className="neu-tier-badge tier-mega"><Sparkles size={13} /> Tier 3 Mega Contract (Max Savings)</span>
            ) : tonnage >= 100 ? (
              <span className="neu-tier-badge tier-bulk"><Zap size={13} /> Tier 2 Bulk Allocation</span>
            ) : (
              <span className="neu-tier-badge tier-std"><Truck size={13} /> Tier 1 Dedicated FTL Allocation</span>
            )}
          </div>
        </div>

        <div className="slider-range-wrap">
          <div className="neu-slider-track neu-inset">
            <input
              type="range"
              min={currentSector.minTon}
              max={currentSector.maxTon}
              step={currentSector.step}
              value={tonnage}
              onChange={(e) => {
                const val = Number(e.target.value);
                setTonnage(val);
                if (onSelectTonnage) onSelectTonnage(val);
              }}
              className="neu-range-input"
              aria-label="Tonnage Volume Slider"
            />
          </div>
          <div className="slider-ticks">
            <span>{currentSector.minTon} {currentSector.unit}</span>
            <span>50 MT</span>
            <span>150 MT</span>
            <span>300 MT</span>
            <span>{currentSector.maxTon}+ {currentSector.unit}</span>
          </div>
        </div>
      </div>

      {/* Logistics & Route Quick Selector */}
      <div className="tonnage-selector-row">
        <div className="selector-group">
          <label className="selector-label"><MapPin size={13} /> Destination State Corridor</label>
          <div className="select-wrapper neu-inset">
            <select
              value={destinationState}
              onChange={(e) => setDestinationState(e.target.value)}
              className="neu-select-field"
            >
              <option value="Bihar">Bihar (Intrastate Gate - Lowest Freight Corridor)</option>
              <option value="West Bengal">West Bengal (Tea Estates &amp; Farmlands)</option>
              <option value="Uttar Pradesh">Uttar Pradesh (Sugarcane / Grain Belt)</option>
              <option value="Assam">Assam (Brahmaputra Valley Tea Corridor)</option>
              <option value="Jharkhand">Jharkhand (Chota Nagpur Basin)</option>
              <option value="Odisha">Odisha (Coastal Agricultural Plains)</option>
              <option value="Other (Pan-India)">Other Pan-India Logistics Node</option>
            </select>
          </div>
        </div>

        <div className="truckload-spec-pill neu-inset">
          <div className="truckload-icon">
            <Truck size={22} />
          </div>
          <div className="truckload-text">
            <strong>{truckCount} x Multi-Axle Taurus Trucks</strong>
            <span>Estimated payload: ~{currentSector.truckCapacity} MT / carrier vehicle</span>
          </div>
        </div>
      </div>

      {/* Real-Time Financial & Freight Matrix Breakdown (3 Neumorphic Inset Tiles) */}
      <div className="tonnage-breakdown-grid">
        <div className="breakdown-stat-box neu-inset">
          <span className="breakdown-label">Base Ex-Factory Rate</span>
          <span className="breakdown-val">₹{effectivePricePerTon.toLocaleString('en-IN')}<small> / MT</small></span>
          {discountPerTon > 0 ? (
            <span className="breakdown-discount">-₹{discountPerTon}/MT Volume Rebate Applied</span>
          ) : (
            <span className="breakdown-sub">Standard Factory Price</span>
          )}
        </div>

        <div className="breakdown-stat-box neu-inset">
          <span className="breakdown-label">Interstate Freight Estimate</span>
          <span className="breakdown-val">₹{totalFreight.toLocaleString('en-IN')}</span>
          <span className="breakdown-sub">~₹{freightPerTon}/MT direct to {destinationState}</span>
        </div>

        <div className="breakdown-stat-box breakdown-stat-box--highlight neu-card">
          <span className="breakdown-label">Estimated Delivered Total</span>
          <span className="breakdown-val-highlight">₹{grandTotal.toLocaleString('en-IN')}</span>
          <span className="breakdown-sub" style={{ color: 'var(--theme-accent)', fontWeight: 700 }}>
            Includes 72-Hour Gate Escrow Protection
          </span>
        </div>
      </div>

      {/* Trust & Weighbridge Certification Notice */}
      <div className="tonnage-footer-strip">
        <div className="weighbridge-notice">
          <ShieldCheck size={18} className="text-accent" />
          <span>
            <strong>Dharma Kanta Weighbridge Guarantee:</strong> Certified Gross-Minus-Tare slip issued at loading gate and verified on arrival before escrow settlement.
          </span>
        </div>

        <a
          href={`/institutional?tonnage=${tonnage}&sector=${sector}&state=${encodeURIComponent(destinationState)}`}
          className="neu-btn neu-btn-primary btn-tonnage-cta"
        >
          <span>Lock In Bulk Allocation ({tonnage} MT)</span>
          <ArrowRight size={16} />
        </a>
      </div>
    </div>
  );
}
