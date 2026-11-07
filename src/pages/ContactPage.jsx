import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Mail, MapPin, Send, CheckCircle, ArrowRight, Building, Scale, ShieldAlert, Phone, MessageSquare, Sparkles } from 'lucide-react';
import { useScrollReveal } from '../hooks/useAnimations';
import { useSubdomain } from '../context/SubdomainContext';
import { api } from '../lib/api';
import './ContactPage.css';

const initialForm = {
  clientName: '',
  companyTitle: '',
  clientEmail: '',
  subject: '',
  targetTonnage: '',
  description: '',
  productSector: 'Fermented Organic Manure (FOM)',
};

export default function ContactPage() {
  const [searchParams] = useSearchParams();
  const { tenant } = useSubdomain();
  const [formData, setFormData] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const revealRef = useScrollReveal();

  useEffect(() => {
    const productParam = searchParams.get('product');
    const tonnageParam = searchParams.get('tonnage');

    let defaultSector = 'Fermented Organic Manure (FOM)';
    if (tenant.id === 'feed' || productParam?.includes('ddgs') || productParam?.includes('molasses')) {
      defaultSector = 'Industrial Feed (Corn/Rice DDGS & Molasses)';
    } else if (tenant.id === 'seabuckthorn' || productParam?.includes('sbt')) {
      defaultSector = 'Himalayan Sea Buckthorn Extracts';
    }

    setFormData((prev) => ({
      ...prev,
      targetTonnage: tonnageParam || prev.targetTonnage || (tenant.id === 'feed' ? '30' : '25'),
      productSector: defaultSector,
    }));
  }, [searchParams, tenant]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await api.submitContactForm({
        name: formData.clientName,
        email: formData.clientEmail,
        phone: formData.targetTonnage ? `${formData.targetTonnage} tons inquiry` : '',
        enquiryType: `${formData.productSector} - ${formData.subject || 'Standard Procurement'}`,
        message: `Company: ${formData.companyTitle || 'N/A'}\nSector: ${formData.productSector}\nTarget Tonnage: ${formData.targetTonnage} MT\nDescription: ${formData.description}`,
        website: '',
      });
      setSubmitted(true);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main ref={revealRef} className="contact-page" style={{ paddingTop: 'calc(var(--navbar-height) + var(--space-xl))' }}>
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-label"><Mail size={12} /> Contact &amp; Allocation Node</span>
            <h1 className="section-title">Institutional Sourcing Portal</h1>
            <p className="section-subtitle">
              Initiate ex-factory dispatch allocations across our pan-India agricultural and industrial feed corridors.
            </p>
          </div>

          <div className="contact-grid">
            {/* LEFT-HAND COLUMN: Corporate Trust Markers */}
            <div className="contact-info reveal-left">
              <h3 className="contact-info__title">Corporate Trust Indicators</h3>
              <div className="contact-info__list">
                {/* Operating Hub */}
                <div className="contact-info__item glass-card">
                  <div className="contact-info__icon">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <span className="contact-info__label">Operating Hub</span>
                    <span className="contact-info__value">Patna, Bihar, India</span>
                  </div>
                </div>

                {/* Email Node */}
                <div className="contact-info__item glass-card">
                  <div className="contact-info__icon">
                    <Mail size={18} />
                  </div>
                  <div>
                    <span className="contact-info__label">Official Verified Inbound</span>
                    <a href="mailto:info@biolinkagri.in" className="contact-info__value text-glow-hover">
                      info@biolinkagri.in
                    </a>
                  </div>
                </div>

                {/* Call/Message Helpline */}
                <div className="contact-info__item glass-card">
                  <div className="contact-info__icon">
                    <Phone size={18} />
                  </div>
                  <div>
                    <span className="contact-info__label">Helpline (Direct Calling)</span>
                    <a href="tel:+918581868466" className="contact-info__value text-glow-hover">
                      +91 8581868466
                    </a>
                  </div>
                </div>

                {/* WhatsApp & Alternate */}
                <div className="contact-info__item glass-card">
                  <div className="contact-info__icon">
                    <MessageSquare size={18} />
                  </div>
                  <div>
                    <span className="contact-info__label">WhatsApp Procurement Desk</span>
                    <a href="https://wa.me/919006847527" target="_blank" rel="noreferrer" className="contact-info__value text-glow-hover">
                      +91 9006847527
                    </a>
                  </div>
                </div>

                {/* Regulatory Notice */}
                <div className="contact-info__item glass-card" style={{ alignItems: 'flex-start' }}>
                  <div className="contact-info__icon" style={{ marginTop: '3px' }}>
                    <ShieldAlert size={18} />
                  </div>
                  <div>
                    <span className="contact-info__label">Escrow Logistics Guarantee</span>
                    <p className="contact-info__value" style={{ fontSize: '0.78rem', lineHeight: '1.5', marginTop: '4px', color: 'var(--text-secondary)' }}>
                      All industrial allocations are protected by BioLink 72-Hour Gate Escrow. Consignments are verified at local Dharma Kanta weighbridges before final fund settlement.
                    </p>
                  </div>
                </div>
              </div>

              <div className="contact-trust-badge">
                <CheckCircle size={14} style={{ color: 'var(--neon-cyan)' }} />
                <span>100% Traceable Plant Dispatch &bull; Resend Verified</span>
              </div>
            </div>

            {/* RIGHT-HAND COLUMN: Lead-Capture Form */}
            <div className="contact-form-wrapper glass-card reveal-right">
              {!submitted ? (
                <>
                  <h3 className="contact-form__title">
                    <Send size={18} /> Multi-Sector B2B Intake Form
                  </h3>

                  <form onSubmit={handleSubmit} className="contact-form" id="contact-form">
                    {/* Sector Picker */}
                    <div className="form-group">
                      <label className="form-label">Target Product Sector</label>
                      <select
                        className="select-field"
                        value={formData.productSector}
                        onChange={(e) => setFormData({ ...formData, productSector: e.target.value })}
                        required
                        id="contact-product-sector"
                      >
                        <option value="Fermented Organic Manure (FOM)">Fermented Organic Manure (FOM Bulk 15-500 MT)</option>
                        <option value="Corn DDGS Bulk Sourcing (28-32% Protein)">Corn DDGS Bulk Sourcing (28-32% Protein)</option>
                        <option value="Rice DDGS Bulk Procurement (40-45% Protein)">Rice DDGS Bulk Procurement (40-45% Protein)</option>
                        <option value="Industrial Cane Molasses (80°+ Brix Tanker)">Industrial Cane Molasses (80°+ Brix Tanker Allotments)</option>
                        <option value="Himalayan Sea Buckthorn Extracts (CO₂ Oil / Powder)">Himalayan Sea Buckthorn Extracts (CO₂ Oil &amp; Bioactive Powder)</option>
                        <option value="Makhana Plantation Basin Sourcing">Makhana Plantation Basin Sourcing</option>
                        <option value="Tea Garden Annual Tonnage Procurement">Tea Garden Annual Tonnage Procurement</option>
                      </select>
                    </div>

                    {/* Full Name & Company */}
                    <div className="contact-form__row">
                      <div className="form-group">
                        <label className="form-label">Full Representative Name</label>
                        <div className="input-with-icon">
                          <input
                            type="text"
                            className="input-field"
                            placeholder="Your full name"
                            value={formData.clientName}
                            onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                            required
                            id="contact-client-name"
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Company / Estate Title</label>
                        <div className="input-with-icon">
                          <Building size={16} className="input-icon" style={{ left: '12px' }} />
                          <input
                            type="text"
                            className="input-field"
                            placeholder="Company/Estate name"
                            value={formData.companyTitle}
                            onChange={(e) => setFormData({ ...formData, companyTitle: e.target.value })}
                            style={{ paddingLeft: '2.2rem' }}
                            id="contact-company-title"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Email & Inquiry Node */}
                    <div className="contact-form__row">
                      <div className="form-group">
                        <label className="form-label">Business Email Address</label>
                        <input
                          type="email"
                          className="input-field"
                          placeholder="procurement@company.com"
                          value={formData.clientEmail}
                          onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                          required
                          id="contact-client-email"
                        />
                      </div>

                      <div className="form-group">
                        <label className="form-label">Contract Type</label>
                        <select
                          className="select-field"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          required
                          id="contact-subject"
                        >
                          <option value="">Select contract framework...</option>
                          <option value="Immediate Spot Dispatch (15-50 MT)">Immediate Spot Dispatch (15-50 MT)</option>
                          <option value="Quarterly Standing Allocation Contract">Quarterly Standing Allocation Contract</option>
                          <option value="Annual Plantation / Feed Mill Tender">Annual Plantation / Feed Mill Tender</option>
                          <option value="Pilot Test Consignment (Sample Trial)">Pilot Test Consignment (Sample Trial)</option>
                        </select>
                      </div>
                    </div>

                    {/* Target Tonnage */}
                    <div className="form-group">
                      <label className="form-label">Target Tonnage / Quantity (Metric Tonnes)</label>
                      <div className="input-with-icon">
                        <Scale size={16} className="input-icon" style={{ left: '12px' }} />
                        <input
                          type="number"
                          className="input-field"
                          placeholder="Minimum 15 MT (e.g. 15, 30, 60, 200)"
                          min="5"
                          value={formData.targetTonnage}
                          onChange={(e) => setFormData({ ...formData, targetTonnage: e.target.value })}
                          style={{ paddingLeft: '2.2rem' }}
                          required
                          id="contact-target-tonnage"
                        />
                      </div>
                      <span className="form-hint" style={{ marginTop: '4px', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                        Bulk dispatches are matched with nearest FTL carriers &amp; insulated tankers.
                      </span>
                    </div>

                    {/* Payload Specifications */}
                    <div className="form-group">
                      <label className="form-label">Payload Specifications (Quality/Schedule/NPK/Protein)</label>
                      <textarea
                        className="input-field contact-form__textarea"
                        placeholder="Detail moisture cap (e.g. <30%), crude protein specs, destination unloader address, weighbridge checking requests..."
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                        id="contact-description"
                      />
                    </div>

                    {/* Legal Checkbox */}
                    <div className="form-group checkbox-group" style={{ flexDirection: 'row', alignItems: 'flex-start', gap: '8px', marginTop: 'var(--space-md)' }}>
                      <input type="checkbox" id="contact-terms" required style={{ marginTop: '4px', cursor: 'pointer' }} />
                      <label htmlFor="contact-terms" className="form-label" style={{ fontSize: '0.78rem', textTransform: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                        I agree to the <a href="/terms" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}>Terms &amp; Conditions</a> and <a href="/privacy" target="_blank" rel="noreferrer" style={{ textDecoration: 'underline' }}>Privacy Policy</a>
                      </label>
                    </div>

                    {error && <p className="form-error">{error}</p>}

                    <button type="submit" className="btn btn-primary btn-lg contact-form__submit" id="contact-submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Routing Allocation via Resend API...' : 'Submit Institutional Sourcing Request'} <ArrowRight size={16} />
                    </button>
                  </form>
                </>
              ) : (
                <div className="contact-form__success">
                  <CheckCircle size={48} className="contact-form__success-icon" />
                  <h3 className="contact-form__success-title text-glow">Inquiry Transmitted</h3>
                  <p className="contact-form__success-desc">
                    Thank you, <strong>{formData.clientName}</strong>. Your inquiry for <strong>{formData.targetTonnage} MT</strong> of <strong>{formData.productSector}</strong> has been logged into our regional desk.
                  </p>
                  <p className="contact-form__success-desc" style={{ fontSize: '0.82rem', marginTop: '-10px' }}>
                    An auto-confirmation has been dispatched to <strong>{formData.clientEmail}</strong> via our verified domain sender. Our logistics coordinator will reach out via WhatsApp within 24 hours.
                  </p>
                  <button
                    className="btn btn-outline"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData(initialForm);
                    }}
                  >
                    Send Another Sourcing Request
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
