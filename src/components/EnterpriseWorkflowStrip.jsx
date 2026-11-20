import { useState } from 'react';
import { Factory, ShieldCheck, FileCheck, Truck, CheckCircle2, ChevronRight, Scale, Shield, Sparkles } from 'lucide-react';
import './EnterpriseWorkflowStrip.css';

const steps = [
  {
    step: '01',
    title: 'Source Verification',
    icon: Factory,
    tagline: 'SATAT & Mill Certification',
    description: 'Direct ex-factory allocation from vetted Compressed Biogas (CBG) plants, grain distilleries, and high-altitude Leh botanical clusters.',
    metrics: '140+ Audited Facilities',
  },
  {
    step: '02',
    title: 'Quality Lab Verification',
    icon: ShieldCheck,
    tagline: 'SGS & NABL Batch Passports',
    description: 'Every dispatch batch is sampled and tested for FCO Schedule IV parameters, crude protein, or active Omega-7 before gate release.',
    metrics: '100% Pre-Dispatch Tested',
  },
  {
    step: '03',
    title: 'Commercial Agreement',
    icon: FileCheck,
    tagline: 'Transparent Landed-Cost RFQ',
    description: 'Instant multi-source quotations with fixed delivered price per metric ton. Digital contract execution backed by 72-Hour Gate Escrow.',
    metrics: 'Zero Hidden Margins',
  },
  {
    step: '04',
    title: 'Logistics Coordination',
    icon: Truck,
    tagline: 'Dedicated Heavy Corridors',
    description: 'Dedicated 15T to 35T multi-axle freight and food-grade insulated tankers with live GPS corridor milestones and E-way bill generation.',
    metrics: '24-48h Mill Clearance',
  },
  {
    step: '05',
    title: 'Site Delivery & Release',
    icon: Scale,
    tagline: 'Dharma Kanta Escrow Release',
    description: 'Consignment arrives at buyer site. Escrow funds released only upon destination weighbridge tare verification and quality clearance.',
    metrics: '100% Escrow Protected',
  },
];

export default function EnterpriseWorkflowStrip() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="enterprise-workflow-wrap">
      <div className="workflow-header-pill">
        <Sparkles size={14} className="text-accent" />
        <span>End-to-End B2B Agricultural Procurement Architecture</span>
      </div>

      <div className="workflow-steps-grid">
        {steps.map((item, idx) => {
          const Icon = item.icon;
          const isActive = activeStep === idx;
          return (
            <div
              key={item.step}
              className={`workflow-step-card neu-card ${isActive ? 'is-active' : ''}`}
              onMouseEnter={() => setActiveStep(idx)}
              onClick={() => setActiveStep(idx)}
            >
              <div className="step-card-top">
                <span className="step-badge">{item.step}</span>
                <div className="step-icon-wrap">
                  <Icon size={20} />
                </div>
              </div>

              <h4 className="step-card-title">{item.title}</h4>
              <span className="step-card-tag">{item.tagline}</span>

              <p className="step-card-desc">{item.description}</p>

              <div className="step-card-metric">
                <CheckCircle2 size={13} className="text-accent" />
                <span>{item.metrics}</span>
              </div>

              {idx < steps.length - 1 && (
                <div className="step-connector-arrow">
                  <ChevronRight size={18} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
