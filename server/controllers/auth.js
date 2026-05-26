const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { User } = require('../models')

const signToken = (user) =>
  jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    process.env.JWT_SECRET || 'dev-secret',
    { expiresIn: '1d' },
  )

const register = async (req, res) => {
  const { username, email, password } = req.body

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'username, email and password are required' })
  }

  const existingUser = await User.findOne({ where: { email } })
  if (existingUser) {
    return res.status(409).json({ message: 'User already exists' })
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const user = await User.create({ username, email, password: hashedPassword })
  const token = signToken(user)

  return res.status(201).json({
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
  })
}

const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'email and password are required' })
  }

  const user = await User.findOne({ where: { email } })
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const passwordMatches = await bcrypt.compare(password, user.password)
  if (!passwordMatches) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const token = signToken(user)

  return res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
  })
}

module.exports = {
  register,
  login,
}