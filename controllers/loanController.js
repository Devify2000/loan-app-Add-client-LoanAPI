import Loan from '../models/Loan.js';
import Client from '../models/Client.js';
import User from '../models/User.js'
import {calculateTotalProfit} from '../utils/extras.js'
import generateLoanPDF from '../utils/generatePdf.js'
import generateLoanExcel from '../utils/generateExcel.js'

// Add a new loan
const addLoan = async (req, res) => {
  try {
    const {
      loanName,
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

    // Basic validation of required fields
    if (!loanName || !clients || !userId || !capital || !monthlyInterest || !timeline || !currency || !legalExpenses) {
      return res.status(400).json({ message: "All required fields must be provided." });
    }

    // Validate clients and user
    const areClientsValid = await validateClients(clients);
    if (!areClientsValid) {
      return res.status(400).json({ message: "Invalid client ID." });
    }

    const isUserValid = await validateUser(userId);
    if (!isUserValid) {
      return res.status(400).json({ message: "Invalid user ID." });
    }

    // Map clients with status
    const clientStatusArray = mapClientsWithStatus(clients);

    // Create a new loan instance
    const loan = new Loan({
      loanName,
      clients: clientStatusArray,
      userId,
      capital,
      monthlyInterest,
      annualInterest: calculateAnnualInterest(monthlyInterest, annualInterest),
      timeline,
      currency,
      legalExpenses,
      totalProfit: totalProfit || calculateTotalProfit(capital, monthlyInterest, timeline),
      status,
    });

    // Save the loan to the database
    await loan.save();

    // Respond with the created loan
    res.status(201).json({ message: "Loan added successfully", loan });

  } catch (error) {
    // Handle errors during the process
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

const getLoanById = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id).populate({
      path: 'clients',
      populate: { path: 'client' },
    });
    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }
    res.json(loan);
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

const getLoanPdf = async (req, res) => {
  try {
    const loanId = req.params.id;
    const loan = await Loan.findById(loanId).populate('clients.client').populate('userId');

    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    const pdfPath = await generateLoanPDF(loan);

    res.download(pdfPath, `loan_${loanId}.pdf`, (err) => {
      if (err) {
        res.status(500).json({ message: 'Error downloading PDF', error: err.message });
      }
      // Optionally, delete the file after download
      // fs.unlinkSync(pdfPath);
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
}

const getLoanExcel = async(req, res) => {
  try {
    const loanId = req.params.id;
    const loan = await Loan.findById(loanId).populate('clients.client').populate('userId');

    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    const excelPath = await generateLoanExcel(loan);

    res.download(excelPath, `loan_${loanId}.xlsx`, (err) => {
      if (err) {
        res.status(500).json({ message: 'Error downloading Excel file', error: err.message });
      }
      // Optionally, delete the file after download
      // fs.unlinkSync(excelPath);
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
}

const validateClients = async (clientIds) => {
  const validClients = await Promise.all(clientIds.map(async (clientId) => {
    const validClient = await Client.findById(clientId);
    return !!validClient;
  }));
  return !validClients.includes(false);
};

// Validate if the user exists in the database
const validateUser = async (userId) => {
  const validUser = await User.findById(userId);
  return !!validUser;
};

// Map clients to include client ID and default status
const mapClientsWithStatus = (clients) => {
  return clients.map(clientId => ({
    client: clientId,
    hasPaid: false, // Default status
  }));
};

// Calculate the annual interest if not provided
const calculateAnnualInterest = (monthlyInterest, annualInterest) => {
  return annualInterest || (monthlyInterest * 12);
};

export {
  addLoan,
  editLoan,
  getAllLoans,
  deleteLoan,
  getLoanById,
  getLoanPdf,
  getLoanExcel
};
