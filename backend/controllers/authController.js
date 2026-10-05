import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

export async function register(req, res) {
  const { name, email, password, city } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email and password are required' })
  }

  const existing = await User.findOne({ email })
  if (existing) {
    return res.status(409).json({ message: 'Email already in use' })
  }

  const hashed = await bcrypt.hash(password, 10)
  const user = await User.create({ name, email, password: hashed, city })

  res.status(201).json({
    token: signToken(user._id),
    user: { id: user._id, name: user.name, email: user.email, city: user.city },
  })
}

export async function login(req, res) {
  const { email, password } = req.body

  const user = await User.findOne({ email })
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' })
  }

  const match = await bcrypt.compare(password, user.password)
  if (!match) {
    return res.status(401).json({ message: 'Invalid email or password' })
  }

  res.json({
    token: signToken(user._id),
    user: { id: user._id, name: user.name, email: user.email, city: user.city },
  })
}
