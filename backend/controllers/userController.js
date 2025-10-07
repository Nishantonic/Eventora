// controllers/userController.js
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return res.status(400).json({ msg: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, role: role || "user" },
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET); // role removed
    res.json({ token, user });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(400).json({ msg: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ msg: "Invalid credentials" });

  const token = jwt.sign({ id: user.id}, process.env.JWT_SECRET);
  res.json({ token, user });
};

export const getUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No token provided' });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, name: true, email: true, role: true } 
    });
    
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      username: user.name, 
      email: user.email,
      role: user.role || 'user', 
    });
  } catch (err) {
    console.error('Error fetching user:', err.message);
    
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const getMe = async (req, res) => {
  try {
    const userId = req.user.id; 
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error('Error fetching current user:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllUsers = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });
  
  const token = authHeader.split(' ')[1];
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    

    const requestingUser = await prisma.user.findUnique({ where: { id: decoded.id } });
    
    if (requestingUser.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin required.' });
    }

    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      }
    });

    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching all users:', err);
    res.status(500).json({ message: 'Server error: Invalid token or database issue.' });
  }
};
