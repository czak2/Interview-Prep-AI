const User = require("../models/User");
const jwt = require("jsonwebtoken");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "90d",
  });
};

const register = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const newUser = await User.create({ fullName, email, password });
    const token = signToken(newUser._id);
    res.status(201).json({ status: "success", token, data: { user: newUser } });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      throw new Error("Please provide email and password");
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.correctPassword(password, user.password)))
      throw new Error("Incorrect email or password");
    const token = signToken(user._id);
    res.status(200).json({ status: "success", token, data: { user } });
  } catch (err) {
    res.status(401).json({ status: "error", message: err.message });
  }
};

const logout = (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ status: "success", data: { user } });
  } catch (err) {
    res.status(400).json({ status: "error", message: err.message });
  }
};

module.exports = { signToken, register, login, logout, getMe };
