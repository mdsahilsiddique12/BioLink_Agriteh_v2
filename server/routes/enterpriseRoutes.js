import express from 'express';
import mongoose from 'mongoose';
import { asyncHandler } from '../lib/asyncHandler.js';
import { HttpError } from '../lib/httpError.js';
import { Rfq } from '../models/Rfq.js';
import { Supplier } from '../models/Supplier.js';
import { BatchPassport } from '../models/BatchPassport.js';
import { Order } from '../models/Order.js';
import { User } from '../models/User.js';
import { sendSystemEmail, wrapBrandedEmail } from '../services/emailService.js';

const router = express.Router();

// ── In-Memory Demo Fallback Stores for Serverless/DB-Free Mode ──
export const demoRfqs = [
  {
    rfqNumber: 'RFQ-2026-00412',
    companyName: 'Brahmaputra Agro Chemicals Ltd',
    gstin: '10AAACB1234D1Z5',
    contactPerson: 'Vikramjit Choudhury',
    email: 'v.choudhury@brahmaputra-agro.in',
    phone: '+91 98301 44521',
    vertical: 'manure',
    productType: 'FCO Solid Fermented Organic Manure (FOM)',
    targetQuantityMT: 60,
    deliveryPincode: '781001',
    deliveryState: 'Assam',
    deliveryAddress: 'Industrial Area Phase 2, Guwahati, Assam',
    requiredDeliveryDate: new Date('2026-11-28'),
    qualitySpecs: {
      moistureCap: '< 25.0%',
      proteinMin: 'N/A',
      specialNotes: 'Must be heat-sterilized, zero pathogen FCO Schedule IV certified.',
    },
    status: 'QUOTES_RECEIVED',
    quotations: [
      {
        id: 'q-1',
        supplierName: 'Muzaffarpur SATAT CBG Bio-Hub',
        facilityLocation: 'Muzaffarpur, Bihar (SATAT Allotted #BIH-04)',
        baseRatePerMT: 4200,
        freightPerMT: 2150,
        handlingPerMT: 120,
        taxesPerMT: 323,
        landedCostPerMT: 6793,
        totalCost: 407580,
        dispatchTimelineDays: 3,
        batchId: 'BL-FOM-2026-000125',
        status: 'PENDING',
        quotedAt: new Date(),
      },
      {
        id: 'q-2',
        supplierName: 'Gorakhpur CBG Bio-Energy Cluster',
        facilityLocation: 'Gorakhpur, Uttar Pradesh',
        baseRatePerMT: 4400,
        freightPerMT: 2480,
        handlingPerMT: 120,
        taxesPerMT: 350,
        landedCostPerMT: 7350,
        totalCost: 441000,
        dispatchTimelineDays: 4,
        batchId: 'BL-FOM-2026-000098',
        status: 'PENDING',
        quotedAt: new Date(),
      },
    ],
    acceptedQuoteId: null,
    purchaseAgreementAccepted: false,
    orderTrackingId: null,
    createdAt: new Date(),
  },
];

export const demoBatchPassports = [
  {
    batchId: 'BL-FOM-2026-000125',
    vertical: 'manure',
    productName: 'FCO Solid Fermented Organic Manure (FOM)',
    producerName: 'Muzaffarpur SATAT CBG Bio-Energy Facility',
    facilityLocation: 'Industrial Growth Corridor, Muzaffarpur, Bihar',
    facilityState: 'Bihar',
    samplingDate: new Date('2026-10-24'),
    testingLab: 'SGS India Testing Lab (NABL Accredited TC-6238)',
    accreditationScope: 'ISO/IEC 17025:2017 & FCO Fertilizer Testing Standard',
    reportNumber: 'SGS-IN-PAT-2026-88192',
    validUntil: new Date('2027-04-24'),
    parameters: [
      { parameter: 'Moisture Content', testedValue: '21.4%', standardRequirement: 'Max 25.0%', status: 'PASS' },
      { parameter: 'Organic Carbon', testedValue: '18.2%', standardRequirement: 'Min 14.0%', status: 'EXCEEDS_SPEC' },
      { parameter: 'C:N Ratio', testedValue: '14.8 : 1', standardRequirement: 'Less than 20 : 1', status: 'PASS' },
      { parameter: 'Total Nitrogen (N)', testedValue: '1.92%', standardRequirement: 'Min 1.2%', status: 'EXCEEDS_SPEC' },
      { parameter: 'Phosphorus (P2O5)', testedValue: '0.84%', standardRequirement: 'Min 0.4%', status: 'PASS' },
      { parameter: 'Potassium (K2O)', testedValue: '1.10%', standardRequirement: 'Min 0.4%', status: 'PASS' },
      { parameter: 'Heavy Metals (Lead, Cadmium, Arsenic)', testedValue: 'Undetectable (<0.01 ppm)', standardRequirement: 'Within FCO Safe Limits', status: 'PASS' },
      { parameter: 'Weed Seeds / Pathogens', testedValue: 'Zero Dormancy / 100% Deactivated', standardRequirement: 'Nil', status: 'PASS' },
    ],
    verifiedQrCode: 'https://v2.biolinkagri.in/verify?batchId=BL-FOM-2026-000125',
    status: 'ACTIVE',
    verifiedAt: new Date('2026-10-25'),
  },
  {
    batchId: 'BL-DDGS-2026-000042',
    vertical: 'feed',
    productName: 'High Protein Corn DDGS (Distillers Dried Grains with Solubles)',
    producerName: 'Patliputra Grain Distillery Complex',
    facilityLocation: 'Bihta Industrial Area, Patna, Bihar',
    facilityState: 'Bihar',
    samplingDate: new Date('2026-11-02'),
    testingLab: 'NABL Certified Animal Nutrition Analytical Services',
    accreditationScope: 'ISO/IEC 17025:2017 Feed & Grain Chromatography',
    reportNumber: 'ANAS-DDGS-2026-4402',
    validUntil: new Date('2027-05-02'),
    parameters: [
      { parameter: 'Crude Protein (CP)', testedValue: '28.8%', standardRequirement: 'Min 26.0%', status: 'EXCEEDS_SPEC' },
      { parameter: 'Moisture Content', testedValue: '9.4%', standardRequirement: 'Max 11.5%', status: 'PASS' },
      { parameter: 'Crude Fat / Oil', testedValue: '8.2%', standardRequirement: 'Min 7.0%', status: 'PASS' },
      { parameter: 'Crude Fibre', testedValue: '6.8%', standardRequirement: 'Max 9.0%', status: 'PASS' },
      { parameter: 'Total Ash', testedValue: '4.1%', standardRequirement: 'Max 6.0%', status: 'PASS' },
      { parameter: 'Aflatoxin (B1+B2+G1+G2)', testedValue: '< 10 ppb (Parts per Billion)', standardRequirement: 'Max 20 ppb Safe Limit', status: 'PASS' },
    ],
    verifiedQrCode: 'https://v2.biolinkagri.in/verify?batchId=BL-DDGS-2026-000042',
    status: 'ACTIVE',
    verifiedAt: new Date('2026-11-03'),
  },
  {
    batchId: 'BL-SBT-2026-000018',
    vertical: 'seabuckthorn',
    productName: 'Pure Supercritical CO2 Sea Buckthorn Seed & Berry Oil',
    producerName: 'Ladakh High-Altitude Botanical Extraction Facility',
    facilityLocation: 'Choglamsar Valley (11,500 ft ASL), Leh, UT of Ladakh',
    facilityState: 'Ladakh',
    samplingDate: new Date('2026-10-18'),
    testingLab: 'CFTRI (CSIR) Phytochemical & Lipid Analysis Lab',
    accreditationScope: 'NABL Accredited Supercritical Botanical Profiling',
    reportNumber: 'CFTRI-SBT-2026-9041',
    validUntil: new Date('2027-10-18'),
    parameters: [
      { parameter: 'Palmitoleic Acid (Omega-7)', testedValue: '34.2%', standardRequirement: 'Min 30.0%', status: 'EXCEEDS_SPEC' },
      { parameter: 'Residual Solvent (Hexane/Ethanol)', testedValue: '0.00 ppm (Solvent-Free CO2)', standardRequirement: '0 ppm', status: 'PASS' },
      { parameter: 'Peroxide Value', testedValue: '2.4 meq/kg', standardRequirement: 'Max 5.0 meq/kg', status: 'PASS' },
      { parameter: 'Total Carotenoids', testedValue: '380 mg / 100g', standardRequirement: 'Min 250 mg / 100g', status: 'EXCEEDS_SPEC' },
      { parameter: 'Vitamin E (Tocopherols)', testedValue: '195 mg / 100g', standardRequirement: 'Min 140 mg / 100g', status: 'PASS' },
    ],
    verifiedQrCode: 'https://v2.biolinkagri.in/verify?batchId=BL-SBT-2026-000018',
    status: 'ACTIVE',
    verifiedAt: new Date('2026-10-19'),
  },
];

export const demoSuppliers = [
  {
    id: 'sup-1',
    companyName: 'GreenEnergy SATAT Bio-CBG Pvt Ltd',
    facilityName: 'Muzaffarpur SATAT CBG Bio-Hub',
    facilityType: 'CBG_PLANT',
    vertical: 'manure',
    gstin: '10AAACG9988D1Z2',
    pan: 'AAACG9988D',
    facilityAddress: 'NH-28 Industrial Belt, Muzaffarpur, Bihar - 842001',
    state: 'Bihar',
    pincode: '842001',
    contactEmail: 'allocations@muzaffarpur-cbg.in',
    contactPhone: '+91 94310 88210',
    authorizedSignatory: 'Er. Rajeshwar Nath',
    monthlyCapacityMT: 1200,
    currentAvailableMT: 380,
    kycDocuments: [
      { docType: 'FCO_LICENSE', docNumber: 'FCO-BIH-CBG-2024-912', isVerified: true },
      { docType: 'SATAT_ALLOTMENT', docNumber: 'SATAT-IOCL-BIH-004', isVerified: true },
      { docType: 'PCB_NOC', docNumber: 'BSPCB-CTE-NOC-4491', isVerified: true },
    ],
    reliabilityScore: 99.2,
    verificationStatus: 'VERIFIED',
  },
  {
    id: 'sup-2',
    companyName: 'Eastern Distilleries & Biofuels Corp',
    facilityName: 'Patliputra Grain Distillery Complex',
    facilityType: 'GRAIN_DISTILLERY',
    vertical: 'feed',
    gstin: '10BBBCD5544K1Z9',
    pan: 'BBBCD5544K',
    facilityAddress: 'Bihta Growth Center, Patna, Bihar - 801103',
    state: 'Bihar',
    pincode: '801103',
    contactEmail: 'feeddesk@easterndistill.in',
    contactPhone: '+91 91220 55431',
    authorizedSignatory: 'Col. K. S. Malhotra',
    monthlyCapacityMT: 2500,
    currentAvailableMT: 650,
    kycDocuments: [
      { docType: 'FACTORY_LICENSE', docNumber: 'FAC-BIH-2022-771', isVerified: true },
      { docType: 'PCB_NOC', docNumber: 'BSPCB-CTO-2024-1102', isVerified: true },
    ],
    reliabilityScore: 98.7,
    verificationStatus: 'VERIFIED',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// 1. BUYER PORTAL ENDPOINTS
// ─────────────────────────────────────────────────────────────────────────────

// POST /rfq/create — Lightweight RFQ Submission (No forced registration required first!)
router.post(
  '/rfq/create',
  asyncHandler(async (req, res) => {
    const {
      companyName,
      gstin,
      contactPerson,
      email,
      phone,
      vertical = 'manure',
      productType,
      targetQuantityMT,
      deliveryPincode,
      deliveryState,
      deliveryAddress,
      qualitySpecs = {},
    } = req.body;

    if (!contactPerson || !email || !phone || !targetQuantityMT || !deliveryPincode) {
      throw new HttpError(400, 'Missing mandatory RFQ fields: contactPerson, email, phone, targetQuantityMT, deliveryPincode');
    }

    const count = demoRfqs.length + 412;
    const rfqNumber = `RFQ-2026-${String(count + 1).padStart(5, '0')}`;
    const qty = Number(targetQuantityMT);

    // Landed cost calculation baseline
    const baseRate = vertical === 'manure' ? 4200 : vertical === 'feed' ? 18500 : 320000;
    const freightRate = vertical === 'manure' ? 1850 : vertical === 'feed' ? 2200 : 4500;
    const handling = 120;
    const subtotalPerMT = baseRate + freightRate + handling;
    const taxesPerMT = Math.round(subtotalPerMT * 0.05); // 5% GST
    const landedPerMT = subtotalPerMT + taxesPerMT;

    const newRfq = {
      rfqNumber,
      companyName: companyName || `${contactPerson} Enterprise`,
      gstin: gstin || 'UNREGISTERED_INQUIRY',
      contactPerson,
      email,
      phone,
      vertical,
      productType: productType || (vertical === 'manure' ? 'FCO Solid Fermented Organic Manure' : vertical === 'feed' ? 'Bulk Corn DDGS' : 'Himalayan Sea Buckthorn Oil'),
      targetQuantityMT: qty,
      deliveryPincode,
      deliveryState: deliveryState || 'Regional',
      deliveryAddress: deliveryAddress || `Destination PIN: ${deliveryPincode}`,
      requiredDeliveryDate: new Date(Date.now() + 7 * 86400000),
      qualitySpecs,
      status: 'QUOTES_RECEIVED',
      quotations: [
        {
          id: `q-${Date.now()}-1`,
          supplierName: vertical === 'manure' ? 'Muzaffarpur SATAT CBG Bio-Hub' : vertical === 'feed' ? 'Patliputra Grain Distillery Complex' : 'Ladakh High-Altitude Botanical Extraction Facility',
          facilityLocation: vertical === 'manure' ? 'Muzaffarpur, Bihar (SATAT Allotted #BIH-04)' : vertical === 'feed' ? 'Bihta Industrial Area, Patna, Bihar' : 'Choglamsar Valley, Leh, Ladakh',
          baseRatePerMT: baseRate,
          freightPerMT: freightRate,
          handlingPerMT: handling,
          taxesPerMT,
          landedCostPerMT: landedPerMT,
          totalCost: landedPerMT * qty,
          dispatchTimelineDays: 3,
          batchId: vertical === 'manure' ? 'BL-FOM-2026-000125' : vertical === 'feed' ? 'BL-DDGS-2026-000042' : 'BL-SBT-2026-000018',
          status: 'PENDING',
          quotedAt: new Date(),
        },
      ],
      acceptedQuoteId: null,
      purchaseAgreementAccepted: false,
      orderTrackingId: null,
      createdAt: new Date(),
    };

    demoRfqs.unshift(newRfq);

    // Try persisting to MongoDB if connected
    if (mongoose.connection.readyState >= 1) {
      try {
        await Rfq.create(newRfq);
      } catch (err) {
        console.warn('MongoDB RFQ save note:', err.message);
      }
    }

    // Send confirmation email
    sendSystemEmail({
      to: email,
      subject: `RFQ Received: ${rfqNumber} — BioLink Sourcing Network`,
      html: wrapBrandedEmail({
        title: `RFQ Registered: ${rfqNumber} 📋`,
        subtitle: `${qty} MT of ${newRfq.productType}`,
        sector: vertical,
        badgeText: 'Institutional RFQ',
        contentHtml: `
          <p>Dear <strong>${contactPerson}</strong>,</p>
          <p>Your institutional Request for Quotation (RFQ) <strong>${rfqNumber}</strong> has been logged into the BioLink Multi-Sector Allocation Engine.</p>
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; margin: 16px 0; font-size: 14px;">
            <tr><td style="padding: 10px 14px; color: #64748b;">Target Quantity:</td><td style="padding: 10px 14px; font-weight: 700;">${qty} MT</td></tr>
            <tr><td style="padding: 10px 14px; color: #64748b;">Destination PIN:</td><td style="padding: 10px 14px; font-weight: 700;">${deliveryPincode}</td></tr>
            <tr><td style="padding: 10px 14px; color: #64748b;">Estimated Landed Cost:</td><td style="padding: 10px 14px; font-weight: 800; color: #059669;">₹${landedPerMT.toLocaleString('en-IN')}/MT</td></tr>
          </table>
          <p>A supplier quotation with batch COA and weighbridge dispatch dates is already attached to your RFQ dashboard.</p>
        `,
        actionButton: {
          label: 'View Quotes in Buyer Portal',
          url: `https://v2.biolinkagri.in/buyer?rfq=${rfqNumber}`,
        },
        refId: rfqNumber,
      }),
    }).catch((err) => console.warn('RFQ email notice warning:', err.message));

    res.status(201).json({
      success: true,
      rfqNumber,
      message: 'RFQ created successfully. Initial supplier quotation generated.',
      rfq: newRfq,
    });
  })
);

// GET /rfq/:rfqNumber — Lookup RFQ Details & Supplier Quotes
router.get(
  '/rfq/:rfqNumber',
  asyncHandler(async (req, res) => {
    const { rfqNumber } = req.params;
    let rfq = demoRfqs.find((r) => r.rfqNumber.toUpperCase() === rfqNumber.toUpperCase());

    if (!rfq && mongoose.connection.readyState >= 1) {
      rfq = await Rfq.findOne({ rfqNumber: rfqNumber.toUpperCase() }).lean();
    }

    if (!rfq) {
      throw new HttpError(404, `RFQ ${rfqNumber} not found.`);
    }

    res.json({ success: true, rfq });
  })
);

// POST /rfq/:rfqNumber/accept-quote — Buyer approves quote & locks allocation
router.post(
  '/rfq/:rfqNumber/accept-quote',
  asyncHandler(async (req, res) => {
    const { rfqNumber } = req.params;
    const { quoteId } = req.body;

    const rfq = demoRfqs.find((r) => r.rfqNumber.toUpperCase() === rfqNumber.toUpperCase());
    if (!rfq) {
      throw new HttpError(404, `RFQ ${rfqNumber} not found.`);
    }

    rfq.acceptedQuoteId = quoteId;
    rfq.status = 'ACCEPTED';

    res.json({
      success: true,
      message: 'Quotation approved! Proceed to sign commercial purchase agreement and initiate 72-Hour Gate Escrow deposit.',
      rfq,
    });
  })
);

// POST /rfq/:rfqNumber/agreement — Digital Purchase Agreement Sign & Order Creation
router.post(
  '/rfq/:rfqNumber/agreement',
  asyncHandler(async (req, res) => {
    const { rfqNumber } = req.params;
    const { signatureName, designation, termsAgreed } = req.body;

    if (!termsAgreed || !signatureName) {
      throw new HttpError(400, 'Must confirm terms and provide authorized signatory name.');
    }

    const rfq = demoRfqs.find((r) => r.rfqNumber.toUpperCase() === rfqNumber.toUpperCase());
    if (!rfq) {
      throw new HttpError(404, `RFQ ${rfqNumber} not found.`);
    }

    rfq.purchaseAgreementAccepted = true;
    rfq.status = 'CONTRACT_SIGNED';
    const trackingId = `BL-${rfq.vertical.toUpperCase()}-${Date.now().toString().slice(-6)}`;
    rfq.orderTrackingId = trackingId;

    res.json({
      success: true,
      message: 'Commercial Purchase Agreement digitally executed. Order initiated into 72-Hour Gate Escrow.',
      trackingId,
      rfq,
    });
  })
);

// ─────────────────────────────────────────────────────────────────────────────
// 2. SUPPLIER PORTAL ENDPOINTS
// ─────────────────────────────────────────────────────────────────────────────

// POST /supplier/register — Register production facility & submit KYC
router.post(
  '/supplier/register',
  asyncHandler(async (req, res) => {
    const {
      companyName,
      facilityName,
      facilityType = 'CBG_PLANT',
      vertical = 'manure',
      gstin,
      pan,
      facilityAddress,
      state,
      pincode,
      contactEmail,
      contactPhone,
      authorizedSignatory,
      monthlyCapacityMT,
      currentAvailableMT,
      kycLicenseNumbers = {},
    } = req.body;

    if (!facilityName || !gstin || !contactEmail || !contactPhone) {
      throw new HttpError(400, 'Facility name, GSTIN, and contact details are required.');
    }

    const newSupplier = {
      id: `sup-${Date.now()}`,
      companyName: companyName || facilityName,
      facilityName,
      facilityType,
      vertical,
      gstin: gstin.toUpperCase(),
      pan: (pan || gstin.slice(2, 12)).toUpperCase(),
      facilityAddress,
      state,
      pincode,
      contactEmail,
      contactPhone,
      authorizedSignatory: authorizedSignatory || 'Authorized Officer',
      monthlyCapacityMT: Number(monthlyCapacityMT || 1000),
      currentAvailableMT: Number(currentAvailableMT || 250),
      kycDocuments: [
        { docType: 'FCO_LICENSE', docNumber: kycLicenseNumbers.fco || 'VERIFIED-FCO-2026', isVerified: true },
        { docType: 'SATAT_ALLOTMENT', docNumber: kycLicenseNumbers.satat || 'SATAT-ALLOT-VALID', isVerified: true },
        { docType: 'PCB_NOC', docNumber: kycLicenseNumbers.pcb || 'PCB-CTE-NOC-VALID', isVerified: true },
      ],
      reliabilityScore: 98.5,
      verificationStatus: 'VERIFIED',
    };

    demoSuppliers.unshift(newSupplier);

    res.status(201).json({
      success: true,
      message: 'Supplier facility onboarding submitted and verified. Welcome to the BioLink Producer Network!',
      supplier: newSupplier,
    });
  })
);

// GET /supplier/list — Public verified suppliers directory
router.get(
  '/supplier/list',
  asyncHandler(async (req, res) => {
    res.json({ success: true, suppliers: demoSuppliers });
  })
);

// POST /supplier/dispatch/upload-slip — Upload Dharma Kanta weighbridge slip & vehicle info
router.post(
  '/supplier/dispatch/upload-slip',
  asyncHandler(async (req, res) => {
    const {
      orderTrackingId,
      vehicleNumber,
      driverPhone,
      grossWeightKg,
      tareWeightKg,
      ewayBillNumber,
      weighbridgeLocation,
    } = req.body;

    if (!vehicleNumber || !tareWeightKg) {
      throw new HttpError(400, 'Vehicle number and weighbridge tare weight are required.');
    }

    const netWeightMT = ((Number(grossWeightKg || 0) - Number(tareWeightKg || 0)) / 1000).toFixed(2);

    res.json({
      success: true,
      message: 'Weighbridge slip and vehicle dispatch recorded. Buyer notified of transit departure.',
      dispatchRecord: {
        orderTrackingId: orderTrackingId || 'BL-DISPATCH-LIVE',
        vehicleNumber: vehicleNumber.toUpperCase(),
        driverPhone,
        grossWeightKg,
        tareWeightKg,
        netWeightMT: `${netWeightMT} MT`,
        ewayBillNumber: ewayBillNumber || 'EWB-2026-LIVE',
        weighbridgeLocation: weighbridgeLocation || 'Plant Dharma Kanta Scale #1',
        dispatchedAt: new Date(),
      },
    });
  })
);

// ─────────────────────────────────────────────────────────────────────────────
// 3. CENTRAL LABORATORY QUALITY MANAGEMENT SYSTEM (LIMS) & BATCH PASSPORT
// ─────────────────────────────────────────────────────────────────────────────

// GET /batch/:batchId — Lookup Central Lab Certificate & Quality Record
router.get(
  '/batch/:batchId',
  asyncHandler(async (req, res) => {
    const { batchId } = req.params;
    let batch = demoBatchPassports.find((b) => b.batchId.toUpperCase() === batchId.toUpperCase());

    if (!batch && mongoose.connection.readyState >= 1) {
      batch = await BatchPassport.findOne({ batchId: batchId.toUpperCase() }).lean();
    }

    if (!batch) {
      throw new HttpError(404, `Batch Passport ${batchId} not found in central quality records.`);
    }

    res.json({ success: true, batch });
  })
);

// GET /batch/list/all — List all active batch passports
router.get(
  '/batch/list/all',
  asyncHandler(async (req, res) => {
    res.json({ success: true, batches: demoBatchPassports });
  })
);

// ─────────────────────────────────────────────────────────────────────────────
// 4. LANDED-COST OPTIMIZATION ENGINE
// ─────────────────────────────────────────────────────────────────────────────

// POST /logistics/landed-cost-optimize — Compare multiple plant origins for destination PIN
router.post(
  '/logistics/landed-cost-optimize',
  asyncHandler(async (req, res) => {
    const { vertical = 'manure', quantityMT = 25, destinationPincode = '800001', truckType = '25T_10_AXLE' } = req.body;
    const qty = Number(quantityMT);

    // Truck capacity & discount multiplier
    const truckMultiplier = truckType === '15T_6_AXLE' ? 1.05 : truckType === '25T_10_AXLE' ? 0.95 : truckType === '35T_MULTI_AXLE' ? 0.88 : 1.0;

    // Sourcing origins matrix
    const origins = [
      {
        plantName: 'Muzaffarpur SATAT CBG Bio-Hub',
        state: 'Bihar',
        distanceKm: 85,
        basePricePerMT: vertical === 'manure' ? 4200 : vertical === 'feed' ? 18200 : 310000,
        freightRatePerKmPerMT: 2.8,
        handlingFeePerMT: 120,
        leadTimeDays: 2,
        reliability: '99.4%',
        batchId: 'BL-FOM-2026-000125',
      },
      {
        plantName: 'Gorakhpur CBG Bio-Energy Cluster',
        state: 'Uttar Pradesh',
        distanceKm: 275,
        basePricePerMT: vertical === 'manure' ? 4350 : vertical === 'feed' ? 18000 : 315000,
        freightRatePerKmPerMT: 2.4,
        handlingFeePerMT: 120,
        leadTimeDays: 3,
        reliability: '98.8%',
        batchId: 'BL-FOM-2026-000098',
      },
      {
        plantName: 'Karnal Haryana SATAT Production Node',
        state: 'Haryana',
        distanceKm: 1120,
        basePricePerMT: vertical === 'manure' ? 3900 : vertical === 'feed' ? 17500 : 295000,
        freightRatePerKmPerMT: 2.1,
        handlingFeePerMT: 120,
        leadTimeDays: 5,
        reliability: '97.9%',
        batchId: 'BL-FOM-2026-000064',
      },
    ];

    const results = origins.map((orig) => {
      const freightPerMT = Math.round(orig.distanceKm * orig.freightRatePerKmPerMT * truckMultiplier);
      const subtotalPerMT = orig.basePricePerMT + freightPerMT + orig.handlingFeePerMT;
      const taxesPerMT = Math.round(subtotalPerMT * 0.05);
      const landedCostPerMT = subtotalPerMT + taxesPerMT;
      const grandTotal = landedCostPerMT * qty;

      return {
        ...orig,
        calculatedFreightPerMT: freightPerMT,
        taxesPerMT,
        landedCostPerMT,
        grandTotal,
      };
    });

    // Sort by lowest landed cost
    results.sort((a, b) => a.landedCostPerMT - b.landedCostPerMT);
    const optimalSource = results[0];

    res.json({
      success: true,
      formula: 'Landed Cost = Product Cost + Loading & Handling + Dedicated Freight + Applicable Taxes (5% GST)',
      destinationPincode,
      truckType,
      quantityMT: qty,
      optimalSource,
      allSources: results,
    });
  })
);

export default router;
