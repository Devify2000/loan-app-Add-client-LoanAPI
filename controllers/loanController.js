import Loan from '../models/Loan.js';
import Client from '../models/Client.js';
import User from '../models/User.js'
import {calculateTotalProfit} from '../utils/extras.js'

// Add a new loan
const addLoan = async (req, res) => {
  try {
    // Destructure and validate request body
    const {
      clients,
      userId,
      capital,
      monthlyInterest,
      annualInterest,
      timeline,
      currency,
      legalExpenses,
      totalProfit,
      status,
    } = req.body;

    // Basic validation
    if (!clients || !userId || !capital || !monthlyInterest || !timeline || !currency || !legalExpenses) {
      return res.status(400).json({ message: "All required fields must be provided." });
    }

    // Optionally validate the existence of client and user (you can also handle this with middleware)
    const validClients = await Promise.all(clients.map(async (client) => {
      const validClient = await Client.findById(client);
      if (!validClient) {
        return false;
      }
      return true;
    }));
    if (validClients.includes(false)) {
      return res.status(400).json({ message: "Invalid client ID." });
    }

    const validUser = await User.findById(userId);
    if (!validUser) {
      return res.status(400).json({ message: "Invalid user ID." });
    }

    // Create a new loan instance
    const loan = new Loan({
      clients,
      userId,
      capital,
      monthlyInterest,
      annualInterest: annualInterest || (monthlyInterest * 12), // Calculate annualInterest if not provided
      timeline,
      currency,
      legalExpenses,
      totalProfit: totalProfit || calculateTotalProfit(capital, monthlyInterest, timeline), // Optional calculation for totalProfit
      status,
    });

    // Save the loan to the database
    await loan.save();

    // Respond with the created loan
    res.status(201).json({ message: "Loan added successfully", loan });

  } catch (error) {
    // Handle any errors during the process
    res.status(400).json({ message: "Error adding loan", error: error.message });
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
    const loans = await Loan.find().populate('clients');
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
