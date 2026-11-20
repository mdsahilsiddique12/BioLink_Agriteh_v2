import { useState } from 'react';
import { MapPin, Factory, Shield, Truck, ArrowRight, CheckCircle2, Sparkles, Navigation } from 'lucide-react';
import { Link } from 'react-router-dom';
import './IndiaCorridorMap.css';

const corridors = [
  {
    id: 'bihar-up',
    name: 'Bihar-UP Bio-Energy & Sugar Belt',
    region: 'Eastern Corridor',
    hubCity: 'Muzaffarpur & Bihta, Patna',
    activePlants: 42,
    readyCapacityMT: '18,500 MT',
    commodities: ['FCO Solid Fermented Organic Manure (FOM)', 'High Protein Corn DDGS', 'Heavy Cane Molasses (80°+ Brix)'],
    avgLeadTime: '24 - 48 Hours',
    coverageStates: ['Bihar', 'Uttar Pradesh', 'West Bengal', 'Jharkhand', 'Assam'],
    description: 'Premier cluster of operational SATAT Compressed Biogas (CBG) plants and state-of-the-art grain distilleries delivering certified organic inputs and protein-rich animal feeds.',
    dotCoordinates: { top: '44%', left: '68%' },
  },
  {
    id: 'punjab-haryana',
    name: 'Punjab-Haryana Agritech Corridor',
    region: 'Northern Corridor',
    hubCity: 'Karnal & Ludhiana',
    activePlants: 38,
    readyCapacityMT: '22,000 MT',
    commodities: ['Rice & Corn DDGS (28-45% Protein)', 'CBG Bio-Manure Pellets', 'Distillery Byproducts'],
    avgLeadTime: '24 Hours',
    coverageStates: ['Punjab', 'Haryana', 'Delhi NCR', 'Rajasthan', 'Uttarakhand'],
    description: 'Dense agro-industrial corridor supplying FTL bulk allocations for dairy farms, poultry feed integrators, and commercial agriculture.',
    dotCoordinates: { top: '28%', left: '42%' },
  },
  {
    id: 'western-peninsular',
    name: 'Maharashtra-Karnataka Molasses Hub',
    region: 'Peninsular Corridor',
    hubCity: 'Kolhapur & Pune',
    activePlants: 34,
    readyCapacityMT: '16,200 MT',
    commodities: ['Heavy Cane Molasses', 'Enriched Bio-Potash Manure', 'Grain Distillery Meal'],
    avgLeadTime: '48 Hours',
    coverageStates: ['Maharashtra', 'Karnataka', 'Gujarat', 'Goa', 'Telangana'],
    description: 'Specialized heavy tanker and multi-axle corridor for bulk industrial ethanol byproducts and high-brix fermentation inputs.',
    dotCoordinates: { top: '64%', left: '44%' },
  },
  {
    id: 'himalayan-valley',
    name: 'Ladakh High-Altitude Botanical Valley',
    region: 'Himalayan Ridge',
    hubCity: 'Leh & Nubra Valley (11,000+ ft)',
    activePlants: 8,
    readyCapacityMT: '350 MT',
    commodities: ['Supercritical CO2 Sea Buckthorn Seed Oil', 'Deep Ruby Berry Pulp Oil', 'Cryo Freeze-Dried Powders'],
    avgLeadTime: '3 - 5 Days',
    coverageStates: ['All India Pan-Direct', 'Direct Pharma/Cosmetic Export Ports'],
    description: 'Pristine wild-harvest botanical extraction facilities delivering pharmaceutical-grade Omega-7 (>32% Palmitoleic Acid) with zero solvent residue.',
    dotCoordinates: { top: '16%', left: '48%' },
  },
];

export default function IndiaCorridorMap() {
  const [selectedCorridor, setSelectedCorridor] = useState(corridors[0]);

  return (
    <div className="india-corridor-section">
      <div className="corridor-top-header">
        <div className="corridor-badge">
          <Navigation size={14} className="text-accent" />
          <span>Pan-India Agricultural Logistics Infrastructure</span>
        </div>
        <h3 className="corridor-heading">Interactive Sourcing Corridors &amp; Dispatch Nodes</h3>
        <p className="corridor-subheading">
          Explore vetted manufacturing facilities, live dispatch capacity, and delivery coverage across India’s core industrial agricultural corridors.
        </p>
      </div>

      <div className="corridor-interactive-layout">
        {/* Interactive Map Visual */}
        <div className="corridor-map-canvas neu-card">
          <div className="map-radar-grid" />
          
          {/* Schematic SVG Map of India with Corridor Connections */}
          <svg viewBox="0 0 600 700" className="india-schematic-svg">
            <defs>
              <linearGradient id="mapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(37, 99, 235, 0.08)" />
                <stop offset="100%" stopColor="rgba(5, 150, 105, 0.08)" />
              </linearGradient>
            </defs>

            {/* Stylized Geographic Outline */}
            <path
              d="M 300,50 L 340,90 L 360,140 L 390,170 L 420,230 L 460,280 L 470,320 L 450,350 L 410,380 L 420,440 L 370,510 L 340,580 L 300,650 L 280,590 L 250,520 L 230,440 L 200,380 L 170,340 L 190,290 L 230,240 L 260,190 L 260,130 L 280,80 Z"
              fill="url(#mapGradient)"
              stroke="var(--glass-border)"
              strokeWidth="2"
              strokeDasharray="4 4"
            />

            {/* Corridor Interconnection Arteries */}
            <line x1="288" y1="112" x2="252" y2="196" stroke="var(--theme-accent)" strokeWidth="2" strokeDasharray="3 3" opacity="0.6" />
            <line x1="252" y1="196" x2="408" y2="308" stroke="var(--theme-accent)" strokeWidth="2" strokeDasharray="3 3" opacity="0.6" />
            <line x1="408" y1="308" x2="264" y2="448" stroke="var(--theme-accent)" strokeWidth="2" strokeDasharray="3 3" opacity="0.6" />
          </svg>

          {/* Hotspot Dots */}
          {corridors.map((c) => {
            const isSelected = selectedCorridor.id === c.id;
            return (
              <button
                key={c.id}
                className={`corridor-hotspot-pin ${isSelected ? 'is-active' : ''}`}
                style={{ top: c.dotCoordinates.top, left: c.dotCoordinates.left }}
                onClick={() => setSelectedCorridor(c)}
                title={c.name}
              >
                <span className="pin-pulse" />
                <span className="pin-dot" />
                <span className="pin-tooltip">{c.name}</span>
              </button>
            );
          })}

          <div className="map-legend-box neu-inset">
            <div className="legend-item">
              <span className="legend-dot green" />
              <span>Operational CBG &amp; SATAT Facilities</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot amber" />
              <span>Grain Distillery &amp; DDGS Mills</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot orange" />
              <span>High-Altitude Botanical Labs</span>
            </div>
          </div>
        </div>

        {/* Selected Corridor Intelligence Card */}
        <div className="corridor-detail-card neu-card">
          <div className="detail-header">
            <span className="region-pill">{selectedCorridor.region}</span>
            <span className="active-badge">
              <span className="live-dot" /> Live Allocation Active
            </span>
          </div>

          <h4 className="detail-title">{selectedCorridor.name}</h4>
          <p className="detail-desc">{selectedCorridor.description}</p>

          <div className="detail-stats-grid">
            <div className="neu-detail-stat">
              <span className="stat-label">Production Hub</span>
              <span className="stat-val">{selectedCorridor.hubCity}</span>
            </div>
            <div className="neu-detail-stat">
              <span className="stat-label">Active Nodes</span>
              <span className="stat-val">{selectedCorridor.activePlants} Plants</span>
            </div>
            <div className="neu-detail-stat">
              <span className="stat-label">Ready Capacity</span>
              <span className="stat-val text-accent">{selectedCorridor.readyCapacityMT}</span>
            </div>
            <div className="neu-detail-stat">
              <span className="stat-label">Avg. Mill Lead Time</span>
              <span className="stat-val">{selectedCorridor.avgLeadTime}</span>
            </div>
          </div>

          <div className="commodities-box">
            <span className="box-title">Supported Commodities:</span>
            <div className="commodity-tags">
              {selectedCorridor.commodities.map((item, idx) => (
                <span key={idx} className="commodity-tag">
                  <CheckCircle2 size={12} className="text-accent" /> {item}
                </span>
              ))}
            </div>
          </div>

          <div className="coverage-box">
            <span className="box-title">Direct Freight Delivery Coverage:</span>
            <div className="coverage-states">
              {selectedCorridor.coverageStates.map((st, idx) => (
                <span key={idx} className="state-pill">{st}</span>
              ))}
            </div>
          </div>

          <div className="detail-action-strip">
            <Link to="/buyer" className="neu-btn neu-btn-primary">
              Request RFQ on this Corridor <ArrowRight size={15} />
            </Link>
            <Link to="/verify" className="neu-btn neu-btn-glass">
              <Shield size={15} /> View Batch Passports
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
