import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import cookieParser from 'cookie-parser';

dotenv.config();
const app=express();
app.use(express.json());
app.use(cookieParser())
app.use('/api/auth',authRoutes);
app.use('/api/expenses',expenseRoutes);

export default app;