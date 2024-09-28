import { Schema, model } from "mongoose";

const loanSchema = new Schema({
  client: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  capital: { type: Number, required: true },
  monthlyInterest: { type: Number, required: true },
  annualInterest: { type: Number },  // This can be auto-calculated
  timeline: { type: Number, required: true },
  currency: { type: String, required: true },
  legalExpenses: { type: Number, required: true },
  totalProfit: { type: Number },  // Auto-calculated based on capital and interest
  status: { type: String, enum: ['Active', 'Foreclosure', 'Finished'], default: 'Active' },
}, { timestamps: true });

export default model('Loan', loanSchema);
