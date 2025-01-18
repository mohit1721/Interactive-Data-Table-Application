
const User = require('../models/User');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 626 ms
exports.register = async (req, res) => {
  try {
    const {username, email, password } = req.body;
    if (
        !username ||
        
        !email ||
        !password 
      ) {
        return res.status(403).json({
          success: false,
          message: "All fields are required",
        });
      }
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const user = await User.create({username, email, password: hashedPassword });

    const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });
// Save token to user document in database
user.token = token; //toObject....need
user.password = undefined;

// 
// console.log("token in backend storage afetr signUp ", token)

//create cookie and send response.. // Set cookie for token and return success response
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Only set cookies over HTTPS in production
        sameSite: 'None',  // Allow cross-origin cookies (important for cross-origin requests)

      }
     return res.cookie("token", token, options).status(200).json({
        success: true,
        token : token,
        user,
        message:  `User registered Successfully`,
      })




  } catch (err) {
    return res.status(500).json({
success: false,
 message: 'Registration failed'


    })
    
  }
};


exports.login = async (req, res) => {
    // console.log("FE se login call aa rha");
    try {
      const { username, password } = req.body;
  // console.log("FE se login details", username, password);
      // Validate Required Fields
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: 'All fields are required, please try again',
        });
      }
  
      // Find User by Email
      const user = await User.findOne({ username }).select('+password'); // Ensure password is selected explicitly
      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'User is not registered, please signup first',
        });
      }
  
      // Compare Passwords
      const isMatch = await bcryptjs.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'Invalid credentials',
        });
      }
  
      // Generate Token
      const token = jwt.sign(
        { email: user.email, id: user._id,username: user.username},
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
  
      // Clear Sensitive Data
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;
  
      // Set Cookie Options
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      };
  
      // Send Response with Token
      return res
        .cookie('token', token, options)
        .status(200)
        .json({
          success: true,
          token,
          user: userWithoutPassword,
          message: 'User Login Success',
        });
    } catch (err) {
      console.error('Login Error:', err.message);
      return res.status(500).json({
        success: false,
        message: err.message || 'Login failed',
      });
    }
  };
  
  
  // ✅ Logout Controller
  exports.logout = async (req, res) => {
    try {
      const token =  req.header('Authorization')?.replace("Bearer ", "") || req.cookies.token || req.body.token;
  // console.log("token in logout", token)
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'No token provided. Please log in first.',
            });
        }
   // ✅ Clear token cookie
   res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'None',
    secure: true, // Ensure secure flag is set for production (HTTPS)
  });
  
        return res.status(200).json({
            success: true,
            message: 'Logout successful.',
        });
    } catch (error) {
        console.error('Logout Error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Failed to logout. Please try again later.',
        });
    }
  };