import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Building2, FileText, CheckCircle2, ShieldCheck, Scale, AlertCircle,
  Truck, ArrowRight, Download, Clock, ChevronRight, FileCheck, Search,
  Sparkles, Check, Lock, ExternalLink
} from 'lucide-react';
import { api } from '../lib/api';
import ParticleField from '../components/ParticleField';
import FloatingObjects from '../components/FloatingObjects';
import './BuyerPortalPage.css';

export default function BuyerPortalPage() {
  const [searchParams] = useSearchParams();
  const initialRfqNumber = searchParams.get('rfq') || '';

  // Tab State: 'rfq' (Create RFQ), 'compare' (Compare Quotes), 'agreement' (Sign Contract), 'tracking' (Live Orders)
  const [activeTab, setActiveTab] = useState(initialRfqNumber ? 'compare' : 'rfq');

  // Lightweight RFQ Form State
  const [vertical, setVertical] = useState('manure');
  const [productType, setProductType] = useState('FCO Solid Fermented Organic Manure (FOM)');
  const [quantityMT, setQuantityMT] = useState(30);
  const [deliveryPincode, setDeliveryPincode] = useState('800001');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [gstin, setGstin] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [moistureCap, setMoistureCap] = useState('< 25.0%');
  const [specialNotes, setSpecialNotes] = useState('');

  // Loaded RFQ State
  const [currentRfq, setCurrentRfq] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Agreement State
  const [signatoryName, setSignatoryName] = useState('');
  const [designation, setDesignation] = useState('Procurement Manager');
  const [termsAgreed, setTermsAgreed] = useState(false);

  // Dispute / Inspection Form State
  const [disputeReason, setDisputeReason] = useState('');
  const [disputeSubmitted, setDisputeSubmitted] = useState(false);

  useEffect(() => {
    if (initialRfqNumber) {
      loadRfqData(initialRfqNumber);
    }
  }, [initialRfqNumber]);

  const loadRfqData = async (rfqNum) => {
    setLoading(true);
    try {
      const res = await api.getRfq(rfqNum);
      if (res.rfq) {
        setCurrentRfq(res.rfq);
      }
    } catch (err) {
      console.warn('Could not load specific RFQ:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRfqSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await api.createRfq({
        vertical,
        productType,
        targetQuantityMT: Number(quantityMT),
        deliveryPincode,
        deliveryAddress: deliveryAddress || `PIN ${deliveryPincode}`,
        contactPerson,
        companyName: companyName || `${contactPerson} Enterprises`,
        gstin,
        email,
        phone,
        qualitySpecs: {
          moistureCap,
          specialNotes,
        },
      });

      if (res.rfq) {
        setCurrentRfq(res.rfq);
        setSuccessMsg(`RFQ ${res.rfqNumber} generated! Verified supplier quotes are ready for review.`);
        setActiveTab('compare');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit RFQ.');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptQuote = async (quoteId) => {
    if (!currentRfq) return;
    setLoading(true);
    try {
      const res = await api.acceptRfqQuote(currentRfq.rfqNumber, { quoteId });
      setCurrentRfq(res.rfq);
      setSuccessMsg('Quotation approved! Proceed to review and sign the Commercial Purchase Agreement.');
      setActiveTab('agreement');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to accept quote.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignAgreement = async (e) => {
    e.preventDefault();
    if (!currentRfq) return;
    setLoading(true);
    try {
      const res = await api.signRfqAgreement(currentRfq.rfqNumber, {
        signatureName: signatoryName,
        designation,
        termsAgreed,
      });
      setCurrentRfq(res.rfq);
      setSuccessMsg(`Agreement executed! Order tracking active: ${res.trackingId}`);
      setActiveTab('tracking');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to execute agreement.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="buyer-portal-page">
      <FloatingObjects sector="corporate" />
      <ParticleField count={30} color="#2563eb" />

      <div className="container buyer-portal-container">
        {/* Header Title */}
        <div className="buyer-portal-header">
          <div className="neu-pill">
            <Building2 size={14} className="text-accent" />
            <span>Institutional Procurement Portal</span>
          </div>
          <h1 className="portal-title">Buyer RFQ &amp; Contract Management Desk</h1>
          <p className="portal-subtitle">
            Request initial quotations without mandatory pre-registration. Compare verified supplier landed costs, inspect batch laboratory COAs, and execute escrow-backed purchase agreements.
          </p>
        </div>

        {/* Portal Navigation Tabs */}
        <div className="portal-tabs-bar neu-inset">
          <button
            className={`portal-tab-btn ${activeTab === 'rfq' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('rfq')}
          >
            <FileText size={16} /> 1. Request RFQ (Enquiry)
          </button>
          <button
            className={`portal-tab-btn ${activeTab === 'compare' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('compare')}
          >
            <Scale size={16} /> 2. Compare Quotes &amp; COAs
            {currentRfq && <span className="tab-badge">Active</span>}
          </button>
          <button
            className={`portal-tab-btn ${activeTab === 'agreement' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('agreement')}
          >
            <FileCheck size={16} /> 3. Purchase Agreement
          </button>
          <button
            className={`portal-tab-btn ${activeTab === 'tracking' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('tracking')}
          >
            <Truck size={16} /> 4. Order Tracking &amp; Escrow
          </button>
        </div>

        {successMsg && (
          <div className="portal-alert-success neu-card">
            <CheckCircle2 size={18} /> {successMsg}
          </div>
        )}

        {errorMsg && (
          <div className="portal-alert-error neu-card">
            <AlertCircle size={18} /> {errorMsg}
          </div>
        )}

        {/* ── TAB 1: LIGHTWEIGHT RFQ ENQUIRY WIZARD ── */}
        {activeTab === 'rfq' && (
          <div className="portal-card neu-card">
            <div className="card-header-row">
              <div>
                <h3 className="card-section-title">Submit Institutional Sourcing RFQ</h3>
                <span className="card-section-sub">
                  No account registration required to submit inquiry. Commercial verification takes place prior to contract signing.
                </span>
              </div>
              <span className="escrow-pill">
                <ShieldCheck size={14} /> 72-Hour Gate Escrow Protected
              </span>
            </div>

            <form onSubmit={handleRfqSubmit} className="rfq-wizard-form">
              <div className="form-section-title">A. Commodity &amp; Volume Specification</div>
              <div className="form-grid-3">
                <div className="form-field">
                  <label>Sourcing Vertical</label>
                  <select
                    value={vertical}
                    onChange={(e) => {
                      setVertical(e.target.value);
                      if (e.target.value === 'manure') setProductType('FCO Solid Fermented Organic Manure (FOM)');
                      else if (e.target.value === 'feed') setProductType('High Protein Corn DDGS (28-30%)');
                      else setProductType('Pure Supercritical CO2 Sea Buckthorn Oil');
                    }}
                    className="portal-input"
                  >
                    <option value="manure">Bio-Organic Manure (CBG Origin)</option>
                    <option value="feed">Industrial Feed (DDGS &amp; Molasses)</option>
                    <option value="seabuckthorn">Himalayan Botanicals (Sea Buckthorn)</option>
                  </select>
                </div>

                <div className="form-field">
                  <label>Product Formulation</label>
                  <input
                    type="text"
                    className="portal-input"
                    value={productType}
                    onChange={(e) => setProductType(e.target.value)}
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Target Quantity (Metric Tons)</label>
                  <input
                    type="number"
                    min="15"
                    max="1000"
                    step="5"
                    className="portal-input"
                    value={quantityMT}
                    onChange={(e) => setQuantityMT(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-section-title">B. Destination &amp; Quality Tolerance</div>
              <div className="form-grid-3">
                <div className="form-field">
                  <label>Destination PIN Code</label>
                  <input
                    type="text"
                    maxLength={6}
                    className="portal-input"
                    value={deliveryPincode}
                    onChange={(e) => setDeliveryPincode(e.target.value)}
                    placeholder="e.g. 800001"
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Moisture Cap Requirement</label>
                  <select
                    className="portal-input"
                    value={moistureCap}
                    onChange={(e) => setMoistureCap(e.target.value)}
                  >
                    <option value="< 20.0%">&lt; 20.0% Extra Dry</option>
                    <option value="< 25.0%">&lt; 25.0% FCO Standard</option>
                    <option value="< 30.0%">&lt; 30.0% Strict Bulk Gate</option>
                  </select>
                </div>

                <div className="form-field">
                  <label>Unloading Facility Address / Landmark</label>
                  <input
                    type="text"
                    className="portal-input"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Factory Gate or Dharma Kanta site"
                  />
                </div>
              </div>

              <div className="form-section-title">C. Commercial Entity &amp; Contact Details</div>
              <div className="form-grid-4">
                <div className="form-field">
                  <label>Contact Person Name</label>
                  <input
                    type="text"
                    className="portal-input"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="Procurement Head"
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Company / Estate Title</label>
                  <input
                    type="text"
                    className="portal-input"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. ITC Agro Division"
                  />
                </div>

                <div className="form-field">
                  <label>GSTIN (Optional for initial RFQ)</label>
                  <input
                    type="text"
                    maxLength={15}
                    className="portal-input"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value.toUpperCase())}
                    placeholder="22AAAAA0000A1Z5"
                  />
                </div>

                <div className="form-field">
                  <label>Official Email</label>
                  <input
                    type="email"
                    className="portal-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="buyer@company.com"
                    required
                  />
                </div>
              </div>

              <div className="form-grid-2" style={{ marginTop: '12px' }}>
                <div className="form-field">
                  <label>Direct Mobile / WhatsApp</label>
                  <input
                    type="tel"
                    className="portal-input"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Specific Formulations / Crop Type</label>
                  <input
                    type="text"
                    className="portal-input"
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    placeholder="Special requirements (e.g. Nitrogen > 1.8%, Palmitoleic > 32%)"
                  />
                </div>
              </div>

              <div className="rfq-actions-row">
                <button type="submit" className="neu-btn neu-btn-primary" disabled={loading}>
                  {loading ? 'Processing Sourcing Request...' : 'Generate Competitive Supplier RFQ →'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── TAB 2: QUOTATIONS & COA COMPARISON ── */}
        {activeTab === 'compare' && (
          <div className="portal-card neu-card">
            <div className="card-header-row">
              <div>
                <h3 className="card-section-title">
                  {currentRfq ? `Quotes Received for ${currentRfq.rfqNumber}` : 'Compare Verified Supplier Quotes'}
                </h3>
                <span className="card-section-sub">
                  Inspect itemized landed costs, dispatch facility locations, and batch quality test certificates.
                </span>
              </div>
              {currentRfq && (
                <div className="rfq-summary-pill">
                  <span>{currentRfq.targetQuantityMT} MT</span> &bull; <span>PIN {currentRfq.deliveryPincode}</span>
                </div>
              )}
            </div>

            {currentRfq && currentRfq.quotations && currentRfq.quotations.length > 0 ? (
              <div className="quotes-comparison-table-wrap neu-inset">
                <table className="quotes-table">
                  <thead>
                    <tr>
                      <th>Verified Facility / Mill</th>
                      <th>Batch COA Ref</th>
                      <th>Ex-Factory Rate</th>
                      <th>Freight</th>
                      <th>Taxes</th>
                      <th>Landed Cost / MT</th>
                      <th>Total ({currentRfq.targetQuantityMT} MT)</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentRfq.quotations.map((q) => (
                      <tr key={q.id || q._id} className={currentRfq.acceptedQuoteId === (q.id || q._id) ? 'row-accepted' : ''}>
                        <td>
                          <div className="facility-cell">
                            <strong>{q.supplierName}</strong>
                            <span>{q.facilityLocation}</span>
                          </div>
                        </td>
                        <td>
                          <Link to={`/verify?batchId=${q.batchId}`} target="_blank" className="batch-pill-link">
                            <ShieldCheck size={13} /> {q.batchId}
                          </Link>
                        </td>
                        <td>₹{q.baseRatePerMT.toLocaleString('en-IN')}</td>
                        <td>₹{q.freightPerMT.toLocaleString('en-IN')}</td>
                        <td>₹{q.taxesPerMT.toLocaleString('en-IN')}</td>
                        <td className="landed-rate-cell">₹{q.landedCostPerMT.toLocaleString('en-IN')}</td>
                        <td className="total-cost-cell">₹{q.totalCost.toLocaleString('en-IN')}</td>
                        <td>
                          {currentRfq.acceptedQuoteId === (q.id || q._id) ? (
                            <span className="accepted-badge">
                              <Check size={14} /> Approved
                            </span>
                          ) : (
                            <button
                              onClick={() => handleAcceptQuote(q.id || q._id)}
                              className="neu-btn neu-btn-primary btn-sm"
                              disabled={loading}
                            >
                              Approve &amp; Contract &rarr;
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-quotes-state neu-inset">
                <Search size={36} className="text-muted" />
                <h4>No active RFQ selected for quotation comparison</h4>
                <p>Submit a lightweight RFQ above to automatically match eligible suppliers.</p>
                <button onClick={() => setActiveTab('rfq')} className="neu-btn neu-btn-glass">
                  Create New RFQ Now
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 3: COMMERCIAL PURCHASE AGREEMENT ── */}
        {activeTab === 'agreement' && (
          <div className="portal-card neu-card">
            <div className="card-header-row">
              <div>
                <h3 className="card-section-title">Commercial Purchase Agreement &amp; Escrow Deposit</h3>
                <span className="card-section-sub">
                  Digital B2B contract governed by standard FCO compliance and BioLink 72-Hour Gate Escrow terms.
                </span>
              </div>
              <span className="escrow-pill">
                <Lock size={14} /> Legal Contract Execution
              </span>
            </div>

            <div className="agreement-paper neu-inset">
              <div className="agreement-header">
                <h4>BIOLINK INDUSTRIAL SOURCING AGREEMENT</h4>
                <span>Reference: {currentRfq?.rfqNumber || 'RFQ-2026-ACTIVE'}</span>
              </div>

              <div className="agreement-clauses">
                <p><strong>1. PARTIES:</strong> Executed between BioLink Agritech Solutions Pvt Ltd (Logistics &amp; Escrow Platform) and <strong>{currentRfq?.companyName || 'Institutional Buyer'}</strong>.</p>
                <p><strong>2. COMMODITY &amp; TONNAGE:</strong> Allocated <strong>{currentRfq?.targetQuantityMT || 30} Metric Tons</strong> of {currentRfq?.productType || 'Bio-Input'}.</p>
                <p><strong>3. ESCROW MECHANISM:</strong> Funds are held by RBI-compliant payment partner in an escrow facility. Funds are strictly released to the supplier only upon destination weighbridge tare verification and quality clearance.</p>
                <p><strong>4. WEIGHBRIDGE DISCREPANCIES:</strong> Buyer is entitled to raise an instant dispute if site tare weight deviates &gt; 1.5% or moisture deviates from certified COA cap.</p>
              </div>

              <form onSubmit={handleSignAgreement} className="sign-form">
                <div className="form-grid-2">
                  <div className="form-field">
                    <label>Authorized Signatory Full Name</label>
                    <input
                      type="text"
                      className="portal-input"
                      value={signatoryName}
                      onChange={(e) => setSignatoryName(e.target.value)}
                      placeholder="e.g. Rameshwar Gupta"
                      required
                    />
                  </div>
                  <div className="form-field">
                    <label>Designation / Title</label>
                    <input
                      type="text"
                      className="portal-input"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      placeholder="Director / VP Procurement"
                      required
                    />
                  </div>
                </div>

                <label className="checkbox-row">
                  <input
                    type="checkbox"
                    checked={termsAgreed}
                    onChange={(e) => setTermsAgreed(e.target.checked)}
                    required
                  />
                  <span>
                    I confirm authority to execute this B2B purchase agreement on behalf of <strong>{currentRfq?.companyName || 'Buyer Enterprise'}</strong> and accept 72-Hour Gate Escrow terms.
                  </span>
                </label>

                <div className="sign-btn-row">
                  <button type="submit" className="neu-btn neu-btn-primary" disabled={loading || !termsAgreed || !signatoryName}>
                    {loading ? 'Executing Contract...' : 'Sign Agreement & Lock Escrow Allocation →'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── TAB 4: ORDER TRACKING & ESCROW DISPATCH ── */}
        {activeTab === 'tracking' && (
          <div className="portal-card neu-card">
            <div className="card-header-row">
              <div>
                <h3 className="card-section-title">Order Lifecycle &amp; 72-Hour Gate Escrow</h3>
                <span className="card-section-sub">
                  Live tracking ID: <strong>{currentRfq?.orderTrackingId || 'BL-MANURE-2026-9912'}</strong>
                </span>
              </div>
              <span className="escrow-pill">
                <ShieldCheck size={14} /> Escrow Funds Secured
              </span>
            </div>

            {/* Visual Milestone Tracker */}
            <div className="milestone-tracker neu-inset">
              <div className="milestone-step step-done">
                <div className="step-num"><Check size={14} /></div>
                <span className="step-lbl">1. Escrow Deposited</span>
                <span className="step-time">Completed</span>
              </div>
              <div className="milestone-line line-done" />
              <div className="milestone-step step-done">
                <div className="step-num"><Check size={14} /></div>
                <span className="step-lbl">2. Mill Allocation</span>
                <span className="step-time">Completed</span>
              </div>
              <div className="milestone-line line-done" />
              <div className="milestone-step step-active">
                <div className="step-num">3</div>
                <span className="step-lbl">3. Factory Weighbridge</span>
                <span className="step-time">In Progress</span>
              </div>
              <div className="milestone-line" />
              <div className="milestone-step">
                <div className="step-num">4</div>
                <span className="step-lbl">4. Transit Corridors</span>
                <span className="step-time">Pending</span>
              </div>
              <div className="milestone-line" />
              <div className="milestone-step">
                <div className="step-num">5</div>
                <span className="step-lbl">5. Destination Escrow Release</span>
                <span className="step-time">Pending</span>
              </div>
            </div>

            {/* Dispatch Documentation */}
            <div className="docs-download-grid">
              <div className="doc-box neu-inset">
                <FileText size={24} className="text-accent" />
                <div className="doc-info">
                  <strong>Tax Invoice (GST)</strong>
                  <span>Inv #BL-INV-2026-4401</span>
                </div>
                <button className="download-btn" onClick={() => alert('Downloading GST Tax Invoice...')}>
                  <Download size={14} /> Download
                </button>
              </div>

              <div className="doc-box neu-inset">
                <ShieldCheck size={24} className="text-accent" />
                <div className="doc-info">
                  <strong>NABL Batch Certificate (COA)</strong>
                  <span>Batch BL-FOM-2026-000125</span>
                </div>
                <Link to="/verify?batchId=BL-FOM-2026-000125" target="_blank" className="download-btn">
                  <ExternalLink size={14} /> Verify
                </Link>
              </div>

              <div className="doc-box neu-inset">
                <Truck size={24} className="text-accent" />
                <div className="doc-info">
                  <strong>E-Way Bill &amp; Lorry Receipt</strong>
                  <span>EWB-0912440188</span>
                </div>
                <button className="download-btn" onClick={() => alert('Downloading E-Way Bill & LR...')}>
                  <Download size={14} /> Download
                </button>
              </div>
            </div>

            {/* Site Inspection & Dispute Option */}
            <div className="inspection-action-box">
              <h4 className="inspection-title">Destination Quality Inspection &amp; Dispute Filing</h4>
              <p className="inspection-sub">
                Upon vehicle arrival at your destination Dharma Kanta, compare the gross and tare weight with the factory dispatch slip. If moisture exceeds contract tolerance or weight deviates &gt; 1.5%, submit a dispute below to immediately freeze escrow release.
              </p>

              {disputeSubmitted ? (
                <div className="portal-alert-error">
                  <AlertCircle size={18} /> Dispute logged successfully. Escrow funds locked. An arbitration officer will review weighbridge slips within 4 business hours.
                </div>
              ) : (
                <div className="dispute-form-row">
                  <input
                    type="text"
                    className="portal-input"
                    value={disputeReason}
                    onChange={(e) => setDisputeReason(e.target.value)}
                    placeholder="Describe discrepancy (e.g. Destination tare weight shortage 1.2 MT or high moisture)"
                  />
                  <button
                    onClick={() => {
                      if (!disputeReason) return alert('Please enter reason for discrepancy.');
                      setDisputeSubmitted(true);
                    }}
                    className="neu-btn neu-btn-glass"
                    style={{ color: '#dc2626' }}
                  >
                    Raise Quality Dispute
                  </button>
                  <button
                    onClick={() => alert('Weighbridge tare verified! Escrow funds marked for authorized supplier settlement.')}
                    className="neu-btn neu-btn-primary"
                  >
                    Authorize Escrow Release &rarr;
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
