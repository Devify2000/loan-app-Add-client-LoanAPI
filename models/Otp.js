import mongoose from 'mongoose';
import { sendEmail } from '../utils/emailUtils.js';

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,  
    expires: '5m', // The document will be deleted after 30 seconds
  },
});

// Send email when the OTP document is created
otpSchema.pre('save', async function (next) {
  if (this.isNew) {
    await sendEmail(this.email, "Verification OTP", `Your OTP code is: ${this.otp}`);
  }
  next();
});

const OTP = mongoose.model('OTP', otpSchema);
export default OTP;
