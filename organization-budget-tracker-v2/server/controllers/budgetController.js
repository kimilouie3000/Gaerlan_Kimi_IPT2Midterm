import mongoose from "mongoose";
import BudgetEntry from "../models/BudgetEntry.js";

const allowedCategories = ["Operations", "Supplies", "Payroll", "Travel", "Marketing", "Utilities", "Equipment", "Other"];
const validId = (id) => mongoose.isValidObjectId(id);

export async function getEntries(req, res, next) {
  try {
    const { search = "", type = "all", category = "all" } = req.query;
    const filter = {};
    if (type !== "all") {
      if (!["income", "expense"].includes(type)) return res.status(400).json({ message: "Invalid type filter." });
      filter.type = type;
    }
    if (category !== "all") {
      if (!allowedCategories.includes(category)) return res.status(400).json({ message: "Invalid category filter." });
      filter.category = category;
    }
    if (search.trim()) {
      const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(escaped, "i");
      filter.$or = [{ title: regex }, { category: regex }, { paymentMethod: regex }, { notes: regex }];
    }
    const entries = await BudgetEntry.find(filter).sort({ date: -1, createdAt: -1 }).lean();
    res.json(entries);
  } catch (error) { next(error); }
}

export async function getEntry(req, res, next) {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ message: "Invalid entry ID." });
    const entry = await BudgetEntry.findById(req.params.id).lean();
    if (!entry) return res.status(404).json({ message: "Budget entry not found." });
    res.json(entry);
  } catch (error) { next(error); }
}

export async function createEntry(req, res, next) {
  try {
    const entry = await BudgetEntry.create(req.body);
    res.status(201).json(entry);
  } catch (error) { next(error); }
}

export async function updateEntry(req, res, next) {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ message: "Invalid entry ID." });
    const entry = await BudgetEntry.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true, lean: true
    });
    if (!entry) return res.status(404).json({ message: "Budget entry not found." });
    res.json(entry);
  } catch (error) { next(error); }
}

export async function deleteEntry(req, res, next) {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ message: "Invalid entry ID." });
    const entry = await BudgetEntry.findByIdAndDelete(req.params.id);
    if (!entry) return res.status(404).json({ message: "Budget entry not found." });
    res.json({ message: "Budget entry deleted successfully.", id: entry._id });
  } catch (error) { next(error); }
}
