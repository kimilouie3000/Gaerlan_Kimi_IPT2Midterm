import mongoose from "mongoose";

const budgetEntrySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required."],
    trim: true,
    maxlength: [100, "Title cannot exceed 100 characters."]
  },
  category: {
    type: String,
    required: [true, "Category is required."],
    enum: ["Operations", "Supplies", "Payroll", "Travel", "Marketing", "Utilities", "Equipment", "Other"],
    default: "Other"
  },
  type: {
    type: String,
    required: true,
    enum: ["income", "expense"]
  },
  amount: {
    type: Number,
    required: [true, "Amount is required."],
    min: [0.01, "Amount must be greater than zero."]
  },
  date: {
    type: Date,
    required: [true, "Date is required."],
    default: Date.now
  },
  paymentMethod: {
    type: String,
    trim: true,
    maxlength: [60, "Payment method cannot exceed 60 characters."],
    default: "Other"
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, "Notes cannot exceed 500 characters."],
    default: ""
  }
}, { timestamps: true, versionKey: false });

export default mongoose.model("BudgetEntry", budgetEntrySchema);
