import Client from '../models/Client.js';
import User from '../models/User.js';

// Add a new client
const addClient = async (req, res) => {
  try {
    // Destructure and validate request body
    const {
      firstName,
      lastName,
      gender,
      country,
      state,
      address,
      zipCode,
      idNumber,
      hasPaid,
      userId,
    } = req.body;

    // Basic validation for required fields
    if (!firstName || !gender || !country || !state || !address || !zipCode || !idNumber || !userId) {
      return res.status(400).json({ message: "All required fields must be provided." });
    }

    // Validate the user ID
    const validUser = await User.findById(userId);
    if (!validUser) {
      return res.status(400).json({ message: "Invalid user ID." });
    }

    // Create a new client instance
    const client = new Client({
      firstName,
      lastName,
      gender,
      country,
      state,
      address,
      zipCode,
      idNumber,
      hasPaid,
      userId,
    });

    // Save the client to the database
    await client.save();

    // Respond with the created client
    res.status(201).json({ message: "Client added successfully", client });

  } catch (error) {
    // Handle any errors during the process
    res.status(400).json({ message: "Error adding client", error: error.message });
  }
};

// Edit an existing client
const editClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    res.json({ message: "Client updated successfully", client });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all clients
const getAllClients = async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a client
const deleteClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }
    res.json({ message: "Client deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  addClient,
  editClient,
  getAllClients,
  deleteClient,
};

