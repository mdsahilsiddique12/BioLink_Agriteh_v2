import mongoose from 'mongoose';

const RfqSchema = new mongoose.Schema(
  {
    rfqNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    }, // e.g. RFQ-2026-00412
    buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    companyName: { type: String, required: true },
    gstin: { type: String, trim: true },
    contactPerson: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    vertical: {
      type: String,
      required: true,
      enum: ['manure', 'feed', 'seabuckthorn'],
      default: 'manure',
    },
    productType: { type: String, required: true }, // e.g. FOM Manure, Corn DDGS 28%, Sea Buckthorn Oil
    targetQuantityMT: { type: Number, required: true, min: 15 },
    deliveryPincode: { type: String, required: true },
    deliveryState: { type: String, required: true },
    deliveryAddress: { type: String },
    requiredDeliveryDate: { type: Date },
    qualitySpecs: {
      moistureCap: { type: String },
      proteinMin: { type: String },
      specialNotes: { type: String },
    },
    status: {
      type: String,
      enum: ['OPEN_FOR_QUOTES', 'QUOTES_RECEIVED', 'ACCEPTED', 'CONTRACT_SIGNED', 'CANCELLED'],
      default: 'OPEN_FOR_QUOTES',
    },
    quotations: [
      {
        supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        supplierName: { type: String, required: true },
        facilityLocation: { type: String, required: true },
        baseRatePerMT: { type: Number, required: true },
        freightPerMT: { type: Number, required: true },
        handlingPerMT: { type: Number, default: 120 },
        taxesPerMT: { type: Number, required: true },
        landedCostPerMT: { type: Number, required: true },
        totalCost: { type: Number, required: true },
        dispatchTimelineDays: { type: Number, default: 3 },
        batchId: { type: String },
        status: { type: String, enum: ['PENDING', 'ACCEPTED', 'DECLINED'], default: 'PENDING' },
        quotedAt: { type: Date, default: Date.now },
      },
    ],
    acceptedQuoteId: { type: String },
    purchaseAgreementAccepted: { type: Boolean, default: false },
    orderTrackingId: { type: String },
  },
  { timestamps: true }
);

export const Rfq = mongoose.models.Rfq || mongoose.model('Rfq', RfqSchema);
