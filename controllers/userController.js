import bcrypt from "bcrypt";
import { sendEmail } from "../utils/emailUtils.js";
import otpGenerator from "otp-generator";
import User from "../models/User.js";
import OTP from "../models/Otp.js";
import Loan from "../models/Loan.js";
import Client from "../models/Client.js";

// Helper Function: Check if user already exists
const checkExistingUser = async (email) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    if (existingUser.isActivated) {
      throw new Error("User already exists and is activated.");
    }
    return existingUser;
  }
  return null;
};

// Helper Function: Delete unactivated user
const deleteUnactivatedUser = async (email) => {
  await User.deleteOne({ email });
};

// Helper Function: Create new user
const createNewUser = async (userData) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const newUser = await User.create({
    ...userData,
    password: hashedPassword,
  });
  return newUser;
};

// Helper Function: Generate and send OTP
const generateAndSendOTP = async (email) => {
  const otp = otpGenerator.generate(6, { lowerCaseAlphabets:false, upperCaseAlphabets: false, specialChars: false });
  await OTP.create({ email, otp });
};

// Signup Controller
export const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, gender } = req.body;
    
    // Check if the user exists and delete unactivated one if needed
    const existingUser = await checkExistingUser(email);
    if (existingUser) await deleteUnactivatedUser(email);
    
    // Create a new user
    const newUser = await createNewUser({ firstName, lastName, email, password, phone, gender });

    // Generate and send OTP
    await generateAndSendOTP(email);

    res.status(201).json({ message: "Signup successful! Please verify your email." });
  } catch (error) {
    res.status(400).json({ message: error.message || "Error during signup." });
  }
};


// Login Controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found." });

    // Check if account is activated
    if (!user.isActivated) return res.status(403).json({ message: "Account not activated. Please verify your email." });

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    // const isMatch = password === user.password;

    if (!isMatch) return res.status(400).json({ message: "Invalid credentials." });

    await generateAndSendOTP(email);

    res.status(200).json({ message: "OTP sent to your email. Please verify the OTP to complete login." });
    
  } catch (error) {
    res.status(500).json({ message: "Error during login.", error });
  }
};

// OTP Verification Controller
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find the OTP record in the database
    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) return res.status(400).json({ message: "Invalid OTP." });

    // Find the user associated with the email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found." });

    // Activate the user's account if not activated
    if (!user.isActivated) {
      user.isActivated = true;
      await user.save();
    }

    // Delete OTP record after verification
    await OTP.deleteOne({ email });

    // Send the same success response for both signup and login
    res.status(200).json({ message: "OTP verified successfully!" });
    
  } catch (error) {
    res.status(500).json({ message: "Error during OTP verification.", error });
  }
};

export const getDashboardData = async (req, res) => {
  try {
    // Calculate total capital invested
    const totalCapital = await Loan.aggregate([
      { $group: { _id: null, total: { $sum: '$capital' } } }
    ]);

    // Calculate net monthly profit
    const netMonthlyProfit = await Loan.aggregate([
      {
        $group: {
          _id: null,
          totalProfit: { $sum: { $multiply: ['$capital', '$monthlyInterest'] } } // Example calculation
        }
      }
    ]);

    // Count clients who have paid and who have not paid
    const paidClientsCount = await Client.countDocuments({ hasPaid: true });
    const unpaidClientsCount = await Client.countDocuments({ hasPaid: false });

    // Prepare the response data
    const dashboardData = {
      totalCapital: totalCapital[0] ? totalCapital[0].total : 0,
      netMonthlyProfit: netMonthlyProfit[0] ? netMonthlyProfit[0].totalProfit : 0,
      clientsPaid: paidClientsCount,
      clientsNotPaid: unpaidClientsCount,
    };

    // Send the response
    res.status(200).json(dashboardData);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Error fetching dashboard data", error: error.message });
  }
};
