import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, unique: true, required: true, lowercase: true, trim: true, maxlength: 180 },
    password: { type: String, required: true, minlength: 8 },
    role: { type: String, enum: ['buyer', 'supplier', 'plant_partner', 'partner', 'admin'], required: true },
    phone: { type: String, trim: true, maxlength: 30 },
    companyName: { type: String, trim: true, maxlength: 180 },
    gstin: { type: String, trim: true, uppercase: true, maxlength: 20 },
    vertical: { type: String, enum: ['manure', 'feed', 'seabuckthorn', 'corporate'], default: 'corporate' },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) {
    next();
    return;
  }

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
