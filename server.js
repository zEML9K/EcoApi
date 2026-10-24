import express from 'express';
import mongoose from 'mongoose';
import stationRoutes from './routes/stations.js'; // Імпорт маршрутів з кроку 5

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Підключення до MongoDB
mongoose.connect('mongodb://localhost:27017/ecological_monitoring')
    .then(() => console.log('Успішно підключено до MongoDB'))
    .catch((err) => console.error('Помилка підключення до MongoDB:', err));

// Реєстрація маршрутів
app.use('/api/stations', stationRoutes);

// Запуск сервера
app.listen(PORT, () => {
    console.log(`HTTP сервер прослуховує на порті ${PORT}`);
});