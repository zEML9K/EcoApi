import express from 'express';
import cors from 'cors';
import stationRoutes from './routes/stations.js';
import airQualityRoutes from './routes/airQuality.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/stations', stationRoutes);
app.use('/api/air-quality', airQualityRoutes);

app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: `Маршрут ${req.method} ${req.originalUrl} не знайдено`
    });
});

export default app;