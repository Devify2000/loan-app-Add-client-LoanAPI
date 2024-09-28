import Client from '../models/Client.js';

// Add a new client
const addClient = async (req, res) => {
  try {
    const client = new Client(req.body);
    await client.save();
    res.status(201).json({ message: "Client added successfully", client });
  } catch (error) {
    res.status(400).json({ error: error.message });
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

