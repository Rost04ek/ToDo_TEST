const sequelize = require('../config/db')
const createUserModel = require('./User')
const createToDoModel = require('./ToDo')

const User = createUserModel(sequelize)
const ToDo = createToDoModel(sequelize)

User.hasMany(ToDo, {
  foreignKey: 'userId',
  onDelete: 'CASCADE',
})

ToDo.belongsTo(User, {
  foreignKey: 'userId',
})

module.exports = {
  sequelize,
  User,
  ToDo,
}