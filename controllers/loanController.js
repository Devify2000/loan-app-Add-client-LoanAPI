import Loan from '../models/Loan.js';

// Add a new loan
const addLoan = async (req, res) => {
  try {
    const loan = new Loan(req.body);
    await loan.save();
    res.status(201).json({ message: "Loan added successfully", loan });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Edit an existing loan
const editLoan = async (req, res) => {
  try {
    const loan = await Loan.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }
    res.json({ message: "Loan updated successfully", loan });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all loans
const getAllLoans = async (req, res) => {
  try {
    const loans = await Loan.find().populate('client');
    res.json(loans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a loan
const deleteLoan = async (req, res) => {
  try {
    const loan = await Loan.findByIdAndDelete(req.params.id);
    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }
    res.json({ message: "Loan deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  addLoan,
  editLoan,
  getAllLoans,
  deleteLoan,
};
