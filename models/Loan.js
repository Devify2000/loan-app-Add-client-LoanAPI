import { Schema, model } from "mongoose";

const loanSchema = new Schema(
  {
    clients: [
      {
        _id: false,
        client: {
          type: Schema.Types.ObjectId,
          ref: "Client",
          required: true,
        },
        hasPaid: {
          type: Boolean,
          default: false,
        }
      }
    ],
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    capital: {
      type: Number,
      required: true,
    },
    monthlyInterest: {
      type: Number,
      required: true,
    },
    annualInterest: {
      type: Number,
    }, 
    timeline: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    legalExpenses: {
      type: Number,
      required: true,
    },
    totalProfit: {
      type: Number,
    }, 
    status: {
      type: String,
      enum: ["Active", "Foreclosure", "Finished"],
      default: "Active",
    },
  },
  { timestamps: true }
);

export default model("Loan", loanSchema);
