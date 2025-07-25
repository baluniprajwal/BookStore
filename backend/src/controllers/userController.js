import express from "express"
import User from "../models/userModel.js";
import jwt from "jsonwebtoken"


const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "10d" });
};
export const register = async (req,res)=>{
    try {
        const {email,username,password} = req.body;
        if (!username || !email || !password){
            return res.status(400).json({message : "All fields are required"});
        }
        if (password.length < 5){
            return res.status(400).json({message : "Password should be at least 5 characters long"});
        }
        if (username.length < 4){
            return res.status(400).json({message : "username should be at least 4 characters long"});
        }
        
        const existingEmail = await User.findOne({email});
        if (existingEmail){
            return res.status(400).json({message : "Email already exists"});
        }
        const existingUsername = await User.findOne({username});
        if (existingUsername){
            return res.status(400).json({message : "Username already exists"});
        }

        const profileImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

        const user = new User({
            email,
            username,
            password,
            profileImage,
        })
        await user.save();
        const token = generateToken(user._id);
        res.status(201).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
                createdAt: user.createdAt,
            },
        });

    } catch (error) {
        console.log("Error in register route", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const login = async (req,res)=>{
    try {
        const { email, password } = req.body;

        if (!email || !password) return res.status(400).json({ message: "All fields are required" });
        
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });
        const isPasswordCorrect = await user.checkPassword(password);
        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

        const token = generateToken(user._id);
        res.status(200).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        console.log("Error in login route", error);
        res.status(500).json({ message: "Internal server error" });
    }
}