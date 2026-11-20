import mongoose from 'mongoose';

const BatchPassportSchema = new mongoose.Schema(
  {
    batchId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    }, // e.g. BL-FOM-2026-000125
    vertical: {
      type: String,
      required: true,
      enum: ['manure', 'feed', 'seabuckthorn'],
      default: 'manure',
    },
    productName: { type: String, required: true },
    producerName: { type: String, required: true },
    facilityLocation: { type: String, required: true },
    facilityState: { type: String, required: true },
    samplingDate: { type: Date, required: true },
    testingLab: { type: String, required: true }, // e.g. SGS India, NABL Accredited Hub, ICAR-IARI
    accreditationScope: { type: String, default: 'ISO/IEC 17025:2017 & NABL Chemical Testing' },
    reportNumber: { type: String, required: true },
    validUntil: { type: Date, required: true },
    parameters: [
      {
        parameter: { type: String, required: true }, // e.g. Moisture Content, Organic Carbon, C:N Ratio
        testedValue: { type: String, required: true },
        standardRequirement: { type: String, required: true },
        status: { type: String, enum: ['PASS', 'EXCEEDS_SPEC', 'FAIL'], default: 'PASS' },
      },
    ],
    verifiedQrCode: { type: String }, // verification URL / QR data
    status: { type: String, enum: ['ACTIVE', 'EXPIRED', 'FLAGGED'], default: 'ACTIVE' },
    certificatePdfUrl: { type: String },
    verifiedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const BatchPassport =
  mongoose.models.BatchPassport || mongoose.model('BatchPassport', BatchPassportSchema);
