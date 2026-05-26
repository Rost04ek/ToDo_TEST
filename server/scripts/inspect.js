const path = require('path')

// Load configured models
const { sequelize, ToDo, User } = require(path.join(__dirname, '..', 'models'))

;(async () => {
  try {
    await sequelize.authenticate()
    console.log('Connected to DB:', sequelize.options.storage)

    const users = await User.findAll({ order: [['id', 'ASC']], limit: 100 })
    const todos = await ToDo.findAll({ order: [['id', 'ASC']], limit: 200 })

    console.log('\n=== USERS ===')
    users.forEach((u) => console.log(u.toJSON()))

    console.log('\n=== TODOS ===')
    todos.forEach((t) => console.log(t.toJSON()))

    process.exit(0)
  } catch (err) {
    console.error('Failed to inspect DB:', err)
    process.exit(1)
  }
})()
