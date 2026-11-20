import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  ShieldCheck, Search, CheckCircle2, QrCode, FileText, Beaker,
  Building, Calendar, Clock, AlertCircle, Download, ExternalLink, Sparkles, Lock
} from 'lucide-react';
import { api } from '../lib/api';
import ParticleField from '../components/ParticleField';
import FloatingObjects from '../components/FloatingObjects';
import './VerificationCentrePage.css';

export default function VerificationCentrePage() {
  const [searchParams] = useSearchParams();
  const queryBatchId = searchParams.get('batchId') || '';

  const [inputBatchId, setInputBatchId] = useState(queryBatchId || 'BL-FOM-2026-000125');
  const [activeBatch, setActiveBatch] = useState(null);
  const [allBatches, setAllBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    loadAllBatches();
    if (queryBatchId) {
      handleLookup(queryBatchId);
    } else {
      handleLookup('BL-FOM-2026-000125');
    }
  }, [queryBatchId]);

  const loadAllBatches = async () => {
    try {
      const res = await api.getAllBatches();
      if (res.batches) setAllBatches(res.batches);
    } catch (err) {
      console.warn('Batch list fetch note:', err.message);
    }
  };

  const handleLookup = async (idToSearch) => {
    const id = (idToSearch || inputBatchId).trim().toUpperCase();
    if (!id) return;
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await api.getBatchPassport(id);
      if (res.batch) {
        setActiveBatch(res.batch);
      }
    } catch (err) {
      setErrorMsg(`Batch record "${id}" was not found or is awaiting final laboratory accreditation sign-off.`);
      setActiveBatch(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-page">
      <FloatingObjects sector="corporate" />
      <ParticleField count={30} color="#2563eb" />

      <div className="container verify-container">
        {/* Page Header */}
        <div className="verify-header">
          <div className="neu-pill">
            <ShieldCheck size={14} className="text-accent" />
            <span>Central Laboratory &amp; Quality Management System (LIMS)</span>
          </div>
          <h1 className="verify-title">Digital Batch Verification Centre</h1>
          <p className="verify-subtitle">
            Scan QR code or enter Batch Passport ID to verify original laboratory analysis, NABL/SGS test certificates, producer provenance, and FCO regulatory compliance.
          </p>
        </div>

        {/* Search Bar */}
        <div className="batch-search-card neu-card">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLookup(inputBatchId);
            }}
            className="search-form-row"
          >
            <div className="search-input-wrap">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                className="search-batch-input"
                value={inputBatchId}
                onChange={(e) => setInputBatchId(e.target.value.toUpperCase())}
                placeholder="Enter Batch ID (e.g. BL-FOM-2026-000125, BL-DDGS-2026-000042)"
                required
              />
            </div>
            <button type="submit" className="neu-btn neu-btn-primary search-btn" disabled={loading}>
              {loading ? 'Verifying Laboratory Signature...' : 'Verify Batch Passport →'}
            </button>
          </form>

          {/* Quick Select Buttons */}
          <div className="quick-batches-strip">
            <span className="quick-label">Active Batch Samples:</span>
            {allBatches.map((b) => (
              <button
                key={b.batchId}
                type="button"
                className={`quick-pill ${activeBatch?.batchId === b.batchId ? 'is-current' : ''}`}
                onClick={() => {
                  setInputBatchId(b.batchId);
                  handleLookup(b.batchId);
                }}
              >
                <ShieldCheck size={12} /> {b.batchId} ({b.vertical.toUpperCase()})
              </button>
            ))}
          </div>
        </div>

        {errorMsg && (
          <div className="verify-alert-error neu-card">
            <AlertCircle size={18} /> {errorMsg}
          </div>
        )}

        {/* ── BATCH PASSPORT CERTIFICATE CARD ── */}
        {activeBatch && (
          <div className="batch-passport-certificate neu-card">
            {/* Certificate Header Strip */}
            <div className="cert-top-strip">
              <div className="cert-brand-id">
                <div className="cert-logo-circle">
                  <ShieldCheck size={28} className="text-accent" />
                </div>
                <div>
                  <span className="cert-type-pill">BIOLINK DIGITAL BATCH PASSPORT</span>
                  <h2 className="cert-batch-id">{activeBatch.batchId}</h2>
                  <span className="cert-product-name">{activeBatch.productName}</span>
                </div>
              </div>

              {/* QR Verification Seal */}
              <div className="cert-qr-seal neu-inset">
                <div className="qr-box">
                  <QrCode size={64} className="text-primary" />
                </div>
                <div className="qr-caption">
                  <span className="qr-valid-badge">
                    <CheckCircle2 size={12} /> TAMPER-PROOF LIMS
                  </span>
                  <small>Scan to verify original record</small>
                </div>
              </div>
            </div>

            {/* Provenance & Testing Lab Metadata */}
            <div className="cert-meta-grid neu-inset">
              <div className="meta-cell">
                <span className="meta-lbl">Verified Producer / Facility</span>
                <strong className="meta-val">{activeBatch.producerName}</strong>
                <span className="meta-sub">{activeBatch.facilityLocation}</span>
              </div>

              <div className="meta-cell">
                <span className="meta-lbl">Accredited Testing Laboratory</span>
                <strong className="meta-val">{activeBatch.testingLab}</strong>
                <span className="meta-sub">{activeBatch.accreditationScope}</span>
              </div>

              <div className="meta-cell">
                <span className="meta-lbl">Laboratory Report Number</span>
                <strong className="meta-val font-mono">{activeBatch.reportNumber}</strong>
                <span className="meta-sub">Sampling Date: {new Date(activeBatch.samplingDate).toLocaleDateString('en-IN')}</span>
              </div>

              <div className="meta-cell">
                <span className="meta-lbl">Validity &amp; Verification Status</span>
                <strong className="meta-val text-accent">ACTIVE &amp; VERIFIED</strong>
                <span className="meta-sub">Valid Until: {new Date(activeBatch.validUntil).toLocaleDateString('en-IN')}</span>
              </div>
            </div>

            {/* Chemical & Quality Parameter Analysis Table */}
            <div className="cert-parameters-section">
              <h3 className="params-heading">
                <Beaker size={18} className="text-accent" /> Laboratory Parameter Screening Results
              </h3>

              <div className="params-table-wrap">
                <table className="params-table">
                  <thead>
                    <tr>
                      <th>Test Parameter</th>
                      <th>Tested Batch Value</th>
                      <th>Regulatory / FCO Standard</th>
                      <th>Compliance Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeBatch.parameters.map((param, idx) => (
                      <tr key={idx}>
                        <td><strong>{param.parameter}</strong></td>
                        <td className="tested-val-cell">{param.testedValue}</td>
                        <td className="std-val-cell">{param.standardRequirement}</td>
                        <td>
                          <span className={`status-pill ${param.status.toLowerCase()}`}>
                            <CheckCircle2 size={12} /> {param.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom Actions & Trust Seal */}
            <div className="cert-bottom-bar">
              <div className="escrow-assurance-note">
                <Lock size={15} className="text-accent" />
                <span>
                  All physical dispatches under <strong>{activeBatch.batchId}</strong> carry sealed sample envelopes matching this digital profile and are backed by the <strong>BioLink 72-Hour Gate Escrow guarantee</strong>.
                </span>
              </div>

              <div className="cert-btn-actions">
                <button
                  onClick={() => window.print()}
                  className="neu-btn neu-btn-glass btn-sm"
                >
                  <Download size={14} /> Print / Export PDF
                </button>
                <Link to={`/buyer?rfq=&vertical=${activeBatch.vertical}`} className="neu-btn neu-btn-primary btn-sm">
                  Request RFQ for this Batch &rarr;
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
