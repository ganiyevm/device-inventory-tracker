const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/database');
const deviceRoutes = require('./routes/deviceRoutes');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/favicon.ico', (req, res) => res.status(204).end());
app.get('/favicon.png', (req, res) => res.status(204).end());
// Routes
app.use('/api/devices', deviceRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'Device Inventory Tracker API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      devices: '/api/devices'
    }
  });
});

// Error handler
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint topilmadi'
  });
});

const PORT = process.env.PORT || 5000;

// Vercel uchun - faqat local development da listen qilish
const startServer = async () => {
  try {
    await connectDB();
    
    // Vercel serverless da app.listen ishlamaydi
    if (process.env.NODE_ENV !== 'production') {
      app.listen(PORT, () => {
        console.log(`Server ${PORT} portda ishlamoqda`);
      });
    }
  } catch (error) {
    console.error('Server ishga tushurishda xatolik:', error);
  }
};

// Local development uchun
if (require.main === module) {
  startServer();
}

// Vercel uchun export
module.exports = app;