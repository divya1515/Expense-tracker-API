import {Expense} from '../models/index.js';
import redisClient from '../utils/redisClient.js';
import {Sequelize} from 'sequelize'

export const addExpense=async(req,res)=>{
    const {amount,category,description}=req.body;
    const userId=req.user.id;
    try{
        const expense=await Expense.create({amount,category,description,userId})
        await redisClient.del(`expenses:${userId}:all:all`)
        res.status(201).json({ message: 'Expense added successfully', expense });
    
    }catch(error){
        res.status(500).json({
            message: 'Error adding expense', 
            error: error.message 
        })
    }
}

export const getExpenses=async(req,res)=>
{
    const userId=req.user.id;
    const {startDate,endDate}=req.query
    const cacheKey=`expenses:${userId}:${startDate|| 'all'}:${endDate || 'all'}`;
    try{
        const cachedData=await redisClient.get(cacheKey);
        if(cachedData){
            return res.status(200)
            .json({
                expenses:JSON.parse(cachedData)
            })
        }
        const query={where:{userId}}
        if(startDate && endDate){
            query.where.createdAt={
                [Sequelize.Op.between]:[startDate,endDate],
            };
        }
        const expenses=await Expense.findAll(query);
        await redisClient.setEx(cacheKey,300,JSON.stringify(expenses));
        res.status(200).json({ expenses });

    }catch(error){
        res.status(500).json({ message: 'Error fetching expenses', error: error.message });
    }
}

export const updateExpense=async(req,res)=>{
    const userId=req.user.id;
    const {expenseId,amount,category,description}=req.body;
    try{
        const expense=await Expense.findOne({where:{id:expenseId,userId}});
        if(!expense)
        {
            return res.status(404).json({ message: 'Expense not found' });
        }
        expense.amount=amount || expense.amount;
        expense.category = category || expense.category;
        expense.description = description || expense.description;
        await expense.save();
        await redisClient.del(`expenses:${userId}:all:all`)
        res.status(200).json({ message: 'Expense updated successfully', expense });


    }catch(error){
        res.status(500).json({ message: 'Error updating expense', error: error.message });
    }
}

export const deleteExpense=async(req,res)=>{
    const {expenseId}=req.body;
    const userId=req.user.id;
    try{
        const expense=await Expense.findOne({where:{id:expenseId,userId}});
        if(!expense)
        {
            return res.status(404).json({ message: 'Expense not found' });
        }
        await expense.destroy();
        await redisClient.del(`expenses:${userId}:all:all`)
        res.status(200).json({ message: 'Expense deleted successfully' });

    }catch(error){
        res.status(500).json({ message: 'Error deleting expense', error: error.message });

    }
}


