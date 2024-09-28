import { Schema, model } from "mongoose";

const clientSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  gender: { type: String, required: true },
  country: { type: String, required: true },
  state: { type: String, required: true },
  address: { type: String, required: true },
  zipCode: { type: String, required: true },
  idNumber: { type: String, required: true, unique: true },
  isPaying: { type: Boolean, default: true }
}, { timestamps: true });

export default model('Client', clientSchema);
