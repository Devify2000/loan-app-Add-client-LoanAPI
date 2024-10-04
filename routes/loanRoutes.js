import { Router } from 'express';
import { addLoan, editLoan, getAllLoans, deleteLoan, getLoanById } from '../controllers/loanController.js';

const loanRouter = Router()

// Add loan
loanRouter.post('/', addLoan);

// Edit loan
loanRouter.put('/:id', editLoan);

// Get all loans
loanRouter.get('/', getAllLoans);

// Get loan by Id
loanRouter.get('/:id', getLoanById);

// Delete loan
loanRouter.delete('/:id', deleteLoan);

export default loanRouter;
