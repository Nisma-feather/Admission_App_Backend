const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

const createUser = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Account already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      ...(name && { name }), // 👈 only added if provided
    });

    return res.status(201).json({
      message: "User created successfully",
      user: {
        _id: user._id,
        email: user.email,
        name: user.name ?? null,
      },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: "Can't create user",
    });
  }
};

const login = async (req, res) => {
  try {
    console.log("Login function")
    console.log(req.body);
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log("matching");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("matching");
      return res.status(401).json({ message: "Invalid credentials" });
    }
    console.log("matching")

    // 🔐 JWT Payload
    const payload = {
      id: user._id,
      role: user.role, // admin / user / college
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        role: user.role,
        email: user.email,
        username: user.username,
      },
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Login failed" });
  }
};
const forgotPassword= async (req, res) => {
  try {
    const { email, password } = req.body;

    // validate
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and new password are required",
      });
    }

    // check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // update password
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Failed to reset password",
    });
  }
};




module.exports = {createUser,login,forgotPassword}