const { Sequelize } = require('sequelize')
const path = require('path')

const storagePath = process.env.SQLITE_STORAGE || path.join(__dirname, '..', 'todo.sqlite')

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: storagePath,
  logging: false,
})

module.exports = sequelize