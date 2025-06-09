import {DataTypes} from 'sequelize';
import sequelize from '../config/db.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

const User=sequelize.define('User',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true

    },
    username:{
        type:DataTypes.STRING,
        unique:true,
        allowNull:false
    },
    email:{
        type:DataTypes.STRING,
        unique:true,
        allowNull:false
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    },
    refreshToken:{
        type:DataTypes.TEXT
    }
},
{
    hooks:{
        beforeCreate:async(user)=>{
            if(user.password){
                const salt= await bcrypt.genSalt(10);
                user.password=await bcrypt.hash(user.password,salt)
            }
        },
        beforeUpdate:async(user)=>{
            if(user.changed('password')){
                const salt=await bcrypt.genSalt(10);
                user.password=await bcrypt.hash(user.password,salt)
            }
        }
    }
});
//Instance method to compare passwords
User.prototype.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password);
}

//Instance method to generate access token 
User.prototype.generateAccessToken =function(){
    return jwt.sign(
        {
            userId:this.id,
            email:this.email,
            username:this.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY||'15m'
        }
    )
}

//Instance method to genrate referesh tokem
User.prototype.genrateRefreshToken=function(){
    return jwt.sign(
        {
            userId:this.id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY || '7d'
        }
    )
}

export default User;