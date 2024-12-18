'use strict';
const {
  DataTypes
} = require('sequelize');
const sequelize = require('../connections/database');
module.exports = sequelize.define('users',  {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
        notNull: {
          msg: "username cannot be null",
        },
        notEmpty: {
          msg: "username cannot be empty",
        },
      },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
        notNull: {
          msg: "email cannot be null",
        },
        notEmpty: {
          msg: "email cannot be empty",
        },
      },
  },
  password: {
    type: DataTypes.STRING,
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  deletedAt: {
    type: DataTypes.DATE
  }
}, {
  paranoid: true,
  freezeTableName: true,
  modelName: 'users'
})