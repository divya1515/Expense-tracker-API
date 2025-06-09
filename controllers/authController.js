import {User} from '../models/index.js';

export const register=async(req,res)=>{
    const {username,email,password}=req.body;
    try{
        const existingUser=await User.findOne({where:{email}});
        if(existingUser){
            return res.status(400).json({message:'User already exist'})

        }
        const newUser=await User.create({username,email,password});
        res.status(201).json({message:'User created successfully',user:newUser});


    }catch(error){
        res.status(500).json({message:'Error in register user',error:error.message})
    }
};

export const login=async(req,res)=>{
    const {email,password}=req.body;
    try{
        const user=await User.findOne({where:{email}});
        if(!user){
            return res.status(404).json({message:'User with this email does not exist'})
        }
        const isPasswordValid=user.isPasswordCorrect(password)
        if(!isPasswordValid){
            return res.status(400).json({message:'Password is not valid'})
        }
        const accessToken=user.generateAccessToken();
        const refreshToken=user.genrateRefreshToken();
        user.refreshToken=refreshToken;
        await user.save();
        //send tokens as cookies (optional) or in response
        res
            .cookie("accessToken",accessToken,{
                httpOnly:true,
                secure:process.env.NODE_ENV=="production",
                maxAge:60*60*1000
            })
            .cookie("refreshToken",refreshToken,{
                httpOnly:true,
                secure:process.env.NODE_ENV=="production",
                maxAge:7*24*60*60*1000

            })
            .status(200)
            .json({message:"Login Successful"})

    }catch(error){
        res.status(500).json({message:'Error in login user',error:error.message})
    }
};

export const logout=async(req,res)=>{
    try{
    const refreshToken=req.cookies?.refreshToken;
    if(!refreshToken){
        return res.status(204).json({message:'No referesh token found'})
    }
    const user=await User.findOne({where:{refreshToken}});
        if (!user) {
            // Clear cookies anyway for security
            return res
              .clearCookie('accessToken')
              .clearCookie('refreshToken')
              .status(200)
              .json({ message: 'User already logged out or token invalid' });
          }
      
    user.refreshToken=null;
    await user.save();
    res
    .clearCookie('accessToken')
    .clearCookie('refreshToken')
    .status(200)
    .json({message:'Logout successful'})
}
    catch (error) {
        res.status(500).json({ message: 'Error during logout', error: error.message });
      }
}