import { Router } from 'express';
import { addClient, editClient, getAllClients, deleteClient } from '../controllers/clientController.js';

const clientRouter = Router();
// Add client
clientRouter.post('/', addClient);

// Edit client
clientRouter.put('/:id', editClient);

// Get all clients
clientRouter.get('/', getAllClients);

// Delete client
clientRouter.delete('/:id', deleteClient);

export default clientRouter;