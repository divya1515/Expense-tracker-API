import express from 'express'
import {addExpense,getExpenses,updateExpense,deleteExpense} from '../controllers/expenseController.js';
import {authenticate} from '../middleware/authMiddleware.js';

const router=express.Router();

router.post('/create',authenticate,addExpense);
router.get('/get',authenticate,getExpenses);
router.put('/update',authenticate,updateExpense);
router.delete('/delete',authenticate,deleteExpense);

export default router;