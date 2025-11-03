const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Impor Routes
const userRoutes = require('./src/routes/userRoutes');
const foodLogRoutes = require('./src/routes/foodLogRoutes');
const sleepLogRoutes = require('./src/routes/sleepLogRoutes');
const exerciseLogRoutes = require('./src/routes/exerciseLogRoutes');
const reportRoutes = require('./src/routes/reportRoutes'); // Tambahkan ini

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Menggunakan Routes
app.use('/api/users', userRoutes);
app.use('/api/food-logs', foodLogRoutes);
app.use('/api/sleep-logs', sleepLogRoutes);
app.use('/api/exercise-logs', exerciseLogRoutes);


app.use('/api/laporan', reportRoutes); // Sekarang reportRoutes sudah didefinisikan

// Endpoint dasar
app.get('/', (req, res) => {
  res.send('API LifeMon Berjalan...');
});

app.listen(PORT, () => {
  console.log(`🚀 Server LifeMon aktif di http://localhost:${PORT}`);
});