const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Device = sequelize.define('Device', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  category: {
    type: DataTypes.ENUM('Kompyuter', 'Monitor', 'Printer', 'Scanner', 'Telefon', 'Boshqa'),
    allowNull: false,
    defaultValue: 'Kompyuter'
  },
  purchaseDate: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  assignedTo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Faol', 'Ta\'mirda', 'Ishlamayapti'),
    allowNull: false,
    defaultValue: 'Faol'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'devices',
  timestamps: true,
  indexes: [
    {
      fields: ['assignedTo']
    },
    {
      fields: ['status']
    },
    {
      fields: ['purchaseDate']
    }
  ]
});

module.exports = Device;