import sequelize from '../config/db.js';
import User from './user.js';
import Expense from './expense.js';

User.hasMany(Expense,{
  foreignKey:'userId',
  onDelete:'CASCADE'
});

Expense.belongsTo(User,{
  foreignKey:'userId'
});
 
export {User,Expense,sequelize};