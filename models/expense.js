import {DataTypes} from 'sequelize';
import sequelize from '../config/db.js'

const Expense=sequelize.define('Expense',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    amount:{
        type:DataTypes.FLOAT,
        allowNull:false
    },
    description:{
        type:DataTypes.STRING
    },
    category:{
        type:DataTypes.ENUM(
            'Groceries','Leisure','Electronics','Utilities','Clothing','Health','Others'
        ),
        allowNull:false
    },
    date:{
        type:DataTypes.DATEONLY,
        defaultValue:DataTypes.NOW,
    }

});

export default Expense