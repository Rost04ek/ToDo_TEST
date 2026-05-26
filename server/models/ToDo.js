const { DataTypes } = require('sequelize')

module.exports = (sequelize) =>
  sequelize.define(
    'ToDo',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: '',
      },
      status: {
        type: DataTypes.ENUM('todo', 'in progress', 'done'),
        allowNull: false,
        defaultValue: 'todo',
      },
      seq: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: 'todos',
      timestamps: true,
    },
  )