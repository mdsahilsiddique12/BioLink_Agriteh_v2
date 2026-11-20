import mongoose from 'mongoose';

const SupplierSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    companyName: { type: String, required: true },
    facilityName: { type: String, required: true },
    facilityType: {
      type: String,
      required: true,
      enum: ['CBG_PLANT', 'GRAIN_DISTILLERY', 'SUGAR_MILL', 'EXTRACTION_LAB', 'OTHER'],
      default: 'CBG_PLANT',
    },
    vertical: {
      type: String,
      required: true,
      enum: ['manure', 'feed', 'seabuckthorn', 'multi'],
      default: 'manure',
    },
    gstin: { type: String, required: true, uppercase: true, trim: true },
    pan: { type: String, required: true, uppercase: true, trim: true },
    facilityAddress: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    contactEmail: { type: String, required: true, lowercase: true, trim: true },
    contactPhone: { type: String, required: true, trim: true },
    authorizedSignatory: { type: String, required: true },
    monthlyCapacityMT: { type: Number, required: true, min: 0 },
    currentAvailableMT: { type: Number, required: true, min: 0 },
    kycDocuments: [
      {
        docType: {
          type: String,
          enum: ['FCO_LICENSE', 'SATAT_ALLOTMENT', 'PCB_NOC', 'PESO_LICENSE', 'FACTORY_LICENSE', 'GST_CERT'],
          required: true,
        },
        docNumber: { type: String, required: true },
        docUrl: { type: String },
        validUntil: { type: Date },
        isVerified: { type: Boolean, default: false },
      },
    ],
    weighbridgeDetails: {
      name: { type: String, default: 'Dharma Kanta Weighbridge Facility' },
      capacityTons: { type: Number, default: 60 },
      isCalibrated: { type: Boolean, default: true },
    },
    reliabilityScore: { type: Number, default: 98.4, min: 0, max: 100 },
    verificationStatus: {
      type: String,
      enum: ['PENDING', 'VERIFIED', 'DOCS_EXPIRED', 'SUSPENDED'],
      default: 'VERIFIED',
    },
  },
  { timestamps: true }
);

export const Supplier = mongoose.models.Supplier || mongoose.model('Supplier', SupplierSchema);
