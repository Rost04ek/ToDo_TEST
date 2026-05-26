const express = require('express')
const cors = require('cors')
require('dotenv').config()

const { sequelize } = require('./models')
const authRoutes = require('./routes/auth')
const todoRoutes = require('./routes/todos')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ ok: true })
})

app.use('/api/auth', authRoutes)
app.use('/api/todos', todoRoutes)

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

const port = process.env.PORT || 5000

const start = async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync()

    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`)
    })
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  start()
}

module.exports = app