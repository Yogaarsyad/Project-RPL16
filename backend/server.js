const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Impor semua routes
const userRoutes = require('./src/routes/userRoutes');
const foodLogRoutes = require('./src/routes/foodLogRoutes');
const sleepLogRoutes = require('./src/routes/sleepLogRoutes');
const exerciseLogRoutes = require('./src/routes/exerciseLogRoutes');
const reportRoutes = require('./src/routes/reportRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Gunakan semua routes
app.use('/api/users', userRoutes);
app.use('/api/food-logs', foodLogRoutes);
app.use('/api/sleep-logs', sleepLogRoutes);
app.use('/api/exercise-logs', exerciseLogRoutes);
app.use('/api/laporan', reportRoutes);

app.get('/', (req, res) => {
  res.send('API LifeMon Berjalan...');
});

app.listen(PORT, () => {
  console.log(`🚀 Server LifeMon aktif di http://localhost:${PORT}`);
});