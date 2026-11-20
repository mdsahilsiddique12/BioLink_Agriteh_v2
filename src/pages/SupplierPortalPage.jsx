import { useState, useEffect } from 'react';
import {
  Factory, Shield, FileText, CheckCircle2, AlertTriangle, Truck,
  Upload, Scale, Plus, Building, Clock, Check, ChevronRight, Lock
} from 'lucide-react';
import { api } from '../lib/api';
import ParticleField from '../components/ParticleField';
import FloatingObjects from '../components/FloatingObjects';
import './SupplierPortalPage.css';

export default function SupplierPortalPage() {
  const [activeTab, setActiveTab] = useState('onboard'); // 'onboard', 'capacity', 'rfqs', 'dispatch'

  // Onboarding Form
  const [facilityName, setFacilityName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [facilityType, setFacilityType] = useState('CBG_PLANT');
  const [vertical, setVertical] = useState('manure');
  const [gstin, setGstin] = useState('');
  const [pan, setPan] = useState('');
  const [state, setState] = useState('Bihar');
  const [pincode, setPincode] = useState('842001');
  const [facilityAddress, setFacilityAddress] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [authorizedSignatory, setAuthorizedSignatory] = useState('');
  const [monthlyCapacityMT, setMonthlyCapacityMT] = useState(1200);
  const [currentAvailableMT, setCurrentAvailableMT] = useState(350);
  const [fcoLicense, setFcoLicense] = useState('');
  const [satatAllotment, setSatatAllotment] = useState('');
  const [pcbNoc, setPcbNoc] = useState('');

  // Dispatch / Slip Form
  const [dispatchOrderRef, setDispatchOrderRef] = useState('BL-MANURE-2026-9912');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [driverPhone, setDriverPhone] = useState('');
  const [grossWeightKg, setGrossWeightKg] = useState('42500');
  const [tareWeightKg, setTareWeightKg] = useState('17500');
  const [ewayBillNumber, setEwayBillNumber] = useState('');

  // UI state
  const [suppliersList, setSuppliersList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      const res = await api.getSupplierList();
      if (res.suppliers) setSuppliersList(res.suppliers);
    } catch (err) {
      console.warn('Supplier list note:', err.message);
    }
  };

  const handleRegisterSupplier = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await api.registerSupplier({
        companyName: companyName || facilityName,
        facilityName,
        facilityType,
        vertical,
        gstin,
        pan,
        facilityAddress,
        state,
        pincode,
        contactEmail,
        contactPhone,
        authorizedSignatory,
        monthlyCapacityMT: Number(monthlyCapacityMT),
        currentAvailableMT: Number(currentAvailableMT),
        kycLicenseNumbers: {
          fco: fcoLicense,
          satat: satatAllotment,
          pcb: pcbNoc,
        },
      });

      setSuccessMsg(res.message || 'Facility registered and verified successfully!');
      loadSuppliers();
      setActiveTab('capacity');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to register facility.');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadDispatch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await api.uploadDispatchSlip({
        orderTrackingId: dispatchOrderRef,
        vehicleNumber,
        driverPhone,
        grossWeightKg: Number(grossWeightKg),
        tareWeightKg: Number(tareWeightKg),
        ewayBillNumber,
      });

      setSuccessMsg(res.message || 'Weighbridge slip recorded and truck dispatched!');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit dispatch record.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="supplier-portal-page">
      <FloatingObjects sector="manure" />
      <ParticleField count={30} color="#059669" />

      <div className="container supplier-portal-container">
        {/* Header */}
        <div className="supplier-portal-header">
          <div className="neu-pill">
            <Factory size={14} className="text-accent" />
            <span>Producer &amp; Facility Network Desk</span>
          </div>
          <h1 className="portal-title">Supplier &amp; Producer Operations Portal</h1>
          <p className="portal-subtitle">
            Onboard certified Compressed Biogas (CBG) manure plants, grain distillery DDGS mills, and botanical clusters. Upload batch COAs, allocate FTL quantities, and record Dharma Kanta weighbridge slips.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="portal-tabs-bar neu-inset">
          <button
            className={`portal-tab-btn ${activeTab === 'onboard' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('onboard')}
          >
            <Building size={16} /> 1. Facility Onboarding &amp; KYC
          </button>
          <button
            className={`portal-tab-btn ${activeTab === 'capacity' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('capacity')}
          >
            <Scale size={16} /> 2. Live Capacity &amp; Batch COAs
          </button>
          <button
            className={`portal-tab-btn ${activeTab === 'dispatch' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('dispatch')}
          >
            <Truck size={16} /> 3. Weighbridge &amp; Dispatch Slips
          </button>
        </div>

        {successMsg && (
          <div className="portal-alert-success neu-card">
            <CheckCircle2 size={18} /> {successMsg}
          </div>
        )}

        {errorMsg && (
          <div className="portal-alert-error neu-card">
            <AlertTriangle size={18} /> {errorMsg}
          </div>
        )}

        {/* ── TAB 1: FACILITY ONBOARDING & KYC ── */}
        {activeTab === 'onboard' && (
          <div className="portal-card neu-card">
            <div className="card-header-row">
              <div>
                <h3 className="card-section-title">Producer Facility Registration &amp; KYC</h3>
                <span className="card-section-sub">
                  BioLink verifies FCO Schedule IV compliance, SATAT allotment licenses, and pollution control NOCs before activating allocation routes.
                </span>
              </div>
              <span className="compliance-shield-tag">
                <Shield size={14} /> FCO &amp; SATAT Compliant
              </span>
            </div>

            <form onSubmit={handleRegisterSupplier} className="supplier-form">
              <div className="form-section-title">A. Enterprise &amp; Plant Identification</div>
              <div className="form-grid-3">
                <div className="form-field">
                  <label>Facility Name</label>
                  <input
                    type="text"
                    className="portal-input"
                    value={facilityName}
                    onChange={(e) => setFacilityName(e.target.value)}
                    placeholder="e.g. Muzaffarpur SATAT CBG Bio-Hub"
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Operating Entity / Company</label>
                  <input
                    type="text"
                    className="portal-input"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. GreenEnergy Bio-CBG Pvt Ltd"
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Plant Category</label>
                  <select
                    className="portal-input"
                    value={facilityType}
                    onChange={(e) => setFacilityType(e.target.value)}
                  >
                    <option value="CBG_PLANT">Compressed Biogas (CBG / SATAT) Plant</option>
                    <option value="GRAIN_DISTILLERY">Grain Distillery (Corn / Rice DDGS)</option>
                    <option value="SUGAR_MILL">Sugar Mill (Heavy Cane Molasses)</option>
                    <option value="EXTRACTION_LAB">Himalayan Supercritical Extraction Lab</option>
                  </select>
                </div>
              </div>

              <div className="form-grid-4" style={{ marginTop: '12px' }}>
                <div className="form-field">
                  <label>GSTIN</label>
                  <input
                    type="text"
                    maxLength={15}
                    className="portal-input"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value.toUpperCase())}
                    placeholder="10AAACG9988D1Z2"
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Permanent Account Number (PAN)</label>
                  <input
                    type="text"
                    maxLength={10}
                    className="portal-input"
                    value={pan}
                    onChange={(e) => setPan(e.target.value.toUpperCase())}
                    placeholder="AAACG9988D"
                  />
                </div>
                <div className="form-field">
                  <label>Monthly Production Capacity (MT)</label>
                  <input
                    type="number"
                    className="portal-input"
                    value={monthlyCapacityMT}
                    onChange={(e) => setMonthlyCapacityMT(e.target.value)}
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Live Ready Stock (MT)</label>
                  <input
                    type="number"
                    className="portal-input"
                    value={currentAvailableMT}
                    onChange={(e) => setCurrentAvailableMT(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-section-title">B. Regulatory Licenses &amp; Compliance Checks</div>
              <div className="form-grid-3">
                <div className="form-field">
                  <label>FCO Schedule IV Manufacturing License #</label>
                  <input
                    type="text"
                    className="portal-input"
                    value={fcoLicense}
                    onChange={(e) => setFcoLicense(e.target.value)}
                    placeholder="FCO-BIH-CBG-2024-912"
                  />
                </div>
                <div className="form-field">
                  <label>SATAT / Oil Marketing Co (OMC) Allotment ID</label>
                  <input
                    type="text"
                    className="portal-input"
                    value={satatAllotment}
                    onChange={(e) => setSatatAllotment(e.target.value)}
                    placeholder="SATAT-IOCL-BIH-004"
                  />
                </div>
                <div className="form-field">
                  <label>Pollution Control Board (PCB) NOC / CTO #</label>
                  <input
                    type="text"
                    className="portal-input"
                    value={pcbNoc}
                    onChange={(e) => setPcbNoc(e.target.value)}
                    placeholder="BSPCB-CTE-NOC-4491"
                  />
                </div>
              </div>

              <div className="form-section-title">C. Facility Location &amp; Dispatch Desk</div>
              <div className="form-grid-3">
                <div className="form-field">
                  <label>State</label>
                  <input
                    type="text"
                    className="portal-input"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                  />
                </div>
                <div className="form-field">
                  <label>PIN Code</label>
                  <input
                    type="text"
                    maxLength={6}
                    className="portal-input"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Factory Gate Address &amp; Bay Clearance</label>
                  <input
                    type="text"
                    className="portal-input"
                    value={facilityAddress}
                    onChange={(e) => setFacilityAddress(e.target.value)}
                    placeholder="NH-28 Industrial Corridor (Multi-Axle Access)"
                    required
                  />
                </div>
              </div>

              <div className="form-grid-3" style={{ marginTop: '12px' }}>
                <div className="form-field">
                  <label>Dispatch Desk Official Email</label>
                  <input
                    type="email"
                    className="portal-input"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Dispatch Desk Phone / Mobile</label>
                  <input
                    type="tel"
                    className="portal-input"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Authorized Signatory Officer</label>
                  <input
                    type="text"
                    className="portal-input"
                    value={authorizedSignatory}
                    onChange={(e) => setAuthorizedSignatory(e.target.value)}
                    placeholder="Plant General Manager"
                    required
                  />
                </div>
              </div>

              <div className="rfq-actions-row">
                <button type="submit" className="neu-btn neu-btn-primary" disabled={loading}>
                  {loading ? 'Submitting Facility KYC...' : 'Complete Producer Onboarding →'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── TAB 2: LIVE CAPACITY & COAS ── */}
        {activeTab === 'capacity' && (
          <div className="portal-card neu-card">
            <div className="card-header-row">
              <div>
                <h3 className="card-section-title">Verified Production Facilities &amp; Capacity Declarations</h3>
                <span className="card-section-sub">
                  Live availability is matched against incoming buyer RFQs for automated landed-cost quotations.
                </span>
              </div>
              <button onClick={() => setActiveTab('onboard')} className="neu-btn neu-btn-glass btn-sm">
                <Plus size={14} /> Add Another Facility
              </button>
            </div>

            <div className="facilities-grid">
              {suppliersList.map((sup) => (
                <div key={sup.id} className="facility-card neu-inset">
                  <div className="fac-top">
                    <div>
                      <h4 className="fac-name">{sup.facilityName}</h4>
                      <span className="fac-loc">{sup.facilityAddress} &bull; PIN {sup.pincode}</span>
                    </div>
                    <span className="verified-status-pill">
                      <CheckCircle2 size={13} /> {sup.verificationStatus}
                    </span>
                  </div>

                  <div className="fac-metrics-row">
                    <div className="fac-metric">
                      <span>Monthly Output</span>
                      <strong>{sup.monthlyCapacityMT} MT</strong>
                    </div>
                    <div className="fac-metric">
                      <span>Live Available Stock</span>
                      <strong className="text-accent">{sup.currentAvailableMT} MT</strong>
                    </div>
                    <div className="fac-metric">
                      <span>Reliability Score</span>
                      <strong style={{ color: '#059669' }}>{sup.reliabilityScore}%</strong>
                    </div>
                  </div>

                  <div className="fac-kyc-strip">
                    <span className="kyc-label">Verified Certifications:</span>
                    <div className="kyc-pills">
                      {sup.kycDocuments.map((doc, idx) => (
                        <span key={idx} className="kyc-pill">
                          <Check size={12} className="text-accent" /> {doc.docType}: {doc.docNumber}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 3: WEIGHBRIDGE & DISPATCH SLIPS ── */}
        {activeTab === 'dispatch' && (
          <div className="portal-card neu-card">
            <div className="card-header-row">
              <div>
                <h3 className="card-section-title">Factory Dharma Kanta Weighbridge &amp; Dispatch Upload</h3>
                <span className="card-section-sub">
                  Record Gross Weight and Tare Weight slips before truck departure to trigger live transit tracking.
                </span>
              </div>
              <span className="escrow-pill">
                <Scale size={14} /> Dharma Kanta Certified
              </span>
            </div>

            <form onSubmit={handleUploadDispatch} className="supplier-form">
              <div className="form-grid-3">
                <div className="form-field">
                  <label>Order Tracking Reference</label>
                  <input
                    type="text"
                    className="portal-input"
                    value={dispatchOrderRef}
                    onChange={(e) => setDispatchOrderRef(e.target.value)}
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Truck Registration Plate #</label>
                  <input
                    type="text"
                    className="portal-input"
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                    placeholder="e.g. BR-01-GB-4412"
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Driver Contact Mobile</label>
                  <input
                    type="tel"
                    className="portal-input"
                    value={driverPhone}
                    onChange={(e) => setDriverPhone(e.target.value)}
                    placeholder="+91 98310 11200"
                    required
                  />
                </div>
              </div>

              <div className="form-grid-3" style={{ marginTop: '16px' }}>
                <div className="form-field">
                  <label>Factory Gross Weight (Kg)</label>
                  <input
                    type="number"
                    className="portal-input"
                    value={grossWeightKg}
                    onChange={(e) => setGrossWeightKg(e.target.value)}
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Truck Tare (Empty) Weight (Kg)</label>
                  <input
                    type="number"
                    className="portal-input"
                    value={tareWeightKg}
                    onChange={(e) => setTareWeightKg(e.target.value)}
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Net Payload Dispatched</label>
                  <input
                    type="text"
                    className="portal-input"
                    value={`${((Number(grossWeightKg || 0) - Number(tareWeightKg || 0)) / 1000).toFixed(2)} MT`}
                    readOnly
                    style={{ background: '#f1f5f9', fontWeight: 800, color: 'var(--theme-accent)' }}
                  />
                </div>
              </div>

              <div className="form-grid-2" style={{ marginTop: '16px' }}>
                <div className="form-field">
                  <label>E-Way Bill Number</label>
                  <input
                    type="text"
                    className="portal-input"
                    value={ewayBillNumber}
                    onChange={(e) => setEwayBillNumber(e.target.value)}
                    placeholder="e.g. EWB-2026-9901412"
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Attach Dharma Kanta Weighment Slip Scan / Photo</label>
                  <input
                    type="file"
                    className="portal-input"
                    accept="image/*,.pdf"
                  />
                </div>
              </div>

              <div className="rfq-actions-row">
                <button type="submit" className="neu-btn neu-btn-primary" disabled={loading}>
                  {loading ? 'Uploading Dispatch Record...' : 'Confirm Factory Dispatch & Notify Buyer →'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
