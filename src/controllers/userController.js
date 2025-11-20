const express = require("express");
const User = require("../models/userModel");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT Token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};
// Signup
const signup = async (req, res) => {
    try {
        const { user_name, user_email, user_password, role } = req.body;
        // Check if user already exists
        const existingUser = await User.findOne({ user_email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email" });
        }
        // Create new user
        const newUser = new User({
            user_name,
            user_email,
            user_password,
            role,
        });
        await newUser.save();
        // Generate token
        const token = generateToken(newUser._id);
        // Remove password from response
        const userResponse = {
            _id: newUser._id,
            user_name: newUser.user_name,
            user_email: newUser.user_email,
            role: newUser.role,
            createdAt: newUser.createdAt,
            updatedAt: newUser.updatedAt,
        };

        res.status(201).json({
            message: "User registered successfully",
            token,
            user: userResponse,
        });
    } catch (err) {
        res.status(400).json({ message: "Error in user registration", err });
    }
};
// Login
const login = async (req, res) => {
    try {
        const { user_email, user_password } = req.body;
        // Check if user exists
        const user = await User.findOne({ user_email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        // Check password
        const isPasswordValid = await user.comparePassword(user_password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        // Generate token
        const token = generateToken(user._id);

        // Remove password from response
        const userResponse = {
            _id: user._id,
            user_name: user.user_name,
            user_email: user.user_email,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
        res.status(200).json({
            message: "Login successful",
            token,
            user: userResponse,
        });
    } catch (err) {
        res.status(400).json({ message: "Error in login", err });
    }
};
// Get all users
const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-user_password');
        res.status(200).json({ message: "Users retrieved successfully", users });
    } catch (err) {
        res.status(400).json({ message: "Error in retrieving users", err });
    }
};
// Get user by ID
const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).select('-user_password');
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        res.status(200).json({ message: "User retrieved successfully", user });
    } catch (err) {
        res.status(400).json({ message: "Error in retrieving user", err });
    }
};
// Update user
const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const { user_name, user_email, user_password, role } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update fields
        if (user_name) user.user_name = user_name;
        if (user_email) user.user_email = user_email;
        if (role) user.role = role;
        
        // Update password if provided
        if (user_password) {
            user.user_password = user_password;
        }

        await user.save();

        // Remove password from response
        const userResponse = {
            _id: user._id,
            user_name: user.user_name,
            user_email: user.user_email,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };

        res.status(200).json({ message: "User updated successfully", user: userResponse });
    } catch (err) {
        res.status(400).json({ message: "Error in updating user", err });
    }
};
// Delete user
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findByIdAndDelete(userId);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(400).json({ message: "Error in deleting user", err });
    }
};

module.exports = {
    signup,
    login,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
};
