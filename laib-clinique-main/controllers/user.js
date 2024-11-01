const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
require('dotenv').config();  // Load .env file

const getMe = async (req,res)=>{
  try {
    const username=req.user.username
    const user = await User.findOne({ username }).select('-password');
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
}



// Register a new user
const register = async (req, res) => {
  try {
    const { username, password, usertype } = req.body;

    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the usertype
    const user = new User({
      username,
      password: hashedPassword,
      usertype, // Include usertype here
    });

    await user.save();

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id, username: user.username, usertype }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ 
      message: 'User registered successfully',
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};


// Login user
const login = async (req, res) => {
  try {
    // Log the request body for debugging
    console.log("Request Body:", req.body);

    const { username, password } = req.body;

    // Ensure both username and password are provided
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Find the user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Compare the password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '24h' });

    // Respond with success and token
    res.status(200).json({ 
      message: 'Login successful',
      token
    });

  } catch (error) {
    console.error('Error during login:', error); // Log the error to get more details
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

// Logout user (invalidate the token on the client side)
const logout = (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = { register, login, logout,getMe };
