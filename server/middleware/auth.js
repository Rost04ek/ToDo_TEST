const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
  const header = req.headers.authorization || ''
  const [type, token] = header.split(' ')

  if (type !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Missing authorization token' })
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret')
    return next()
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

module.exports = authMiddleware