const Device = require('../models/Device');
const { Op } = require('sequelize');

// Get all devices
const getAllDevices = async (req, res) => {
  try {
    const { search, status, startDate, endDate } = req.query;
    
    let whereClause = {};
    
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { assignedTo: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    if (status && status !== 'all') {
      whereClause.status = status;
    }
    
    if (startDate && endDate) {
      whereClause.purchaseDate = {
        [Op.between]: [startDate, endDate]
      };
    }
    
    const devices = await Device.findAll({
      where: whereClause,
      order: [['purchaseDate', 'DESC']]
    });
    
    res.json({
      success: true,
      count: devices.length,
      data: devices
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Qurilmalarni yuklashda xatolik',
      error: error.message
    });
  }
};

// Get device by ID
const getDeviceById = async (req, res) => {
  try {
    const device = await Device.findByPk(req.params.id);
    
    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Qurilma topilmadi'
      });
    }
    
    res.json({
      success: true,
      data: device
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Qurilmani yuklashda xatolik',
      error: error.message
    });
  }
};

// Create device
const createDevice = async (req, res) => {
  try {
    const { name, category, purchaseDate, price, assignedTo, status, notes } = req.body;
    
    const device = await Device.create({
      name,
      category,
      purchaseDate,
      price,
      assignedTo,
      status,
      notes
    });
    
    res.status(201).json({
      success: true,
      message: 'Qurilma muvaffaqiyatli qo\'shildi',
      data: device
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Qurilma qo\'shishda xatolik',
      error: error.message
    });
  }
};

// Update device
const updateDevice = async (req, res) => {
  try {
    const device = await Device.findByPk(req.params.id);
    
    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Qurilma topilmadi'
      });
    }
    
    await device.update(req.body);
    
    res.json({
      success: true,
      message: 'Qurilma muvaffaqiyatli yangilandi',
      data: device
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Qurilmani yangilashda xatolik',
      error: error.message
    });
  }
};

// Delete device
const deleteDevice = async (req, res) => {
  try {
    const device = await Device.findByPk(req.params.id);
    
    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Qurilma topilmadi'
      });
    }
    
    await device.destroy();
    
    res.json({
      success: true,
      message: 'Qurilma muvaffaqiyatli o\'chirildi'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Qurilmani o\'chirishda xatolik',
      error: error.message
    });
  }
};

// Get statistics
const getStatistics = async (req, res) => {
  try {
    const total = await Device.count();
    const active = await Device.count({ where: { status: 'Faol' } });
    const repair = await Device.count({ where: { status: 'Ta\'mirda' } });
    const broken = await Device.count({ where: { status: 'Ishlamayapti' } });
    
    const totalValue = await Device.sum('price') || 0;
    
    res.json({
      success: true,
      data: {
        total,
        active,
        repair,
        broken,
        totalValue: parseFloat(totalValue)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Statistikani yuklashda xatolik',
      error: error.message
    });
  }
};

// MUHIM: Barcha funksiyalarni export qilish
module.exports = {
  getAllDevices,
  getDeviceById,
  createDevice,
  updateDevice,
  deleteDevice,
  getStatistics
};