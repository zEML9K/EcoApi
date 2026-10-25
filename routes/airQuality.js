import express from 'express';
import AirQuality from '../models/AirQuality.js';
import Station from '../models/Station.js';
import { handleError } from '../utils/handleError.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const body = req.body ?? {};
        if (!body.station || body.pm25 === undefined) {
            return res.status(400).json({ success: false, error: 'Відсутні обов\'язкові поля' });
        }

        const stationExists = await Station.exists({ _id: body.station });
        if (!stationExists) {
            return res.status(400).json({ success: false, error: 'Вказана станція не існує' });
        }

        const item = await AirQuality.create(body);
        res.status(201).json({ success: true, data: item });
    } catch (error) {
        handleError(res, error);
    }
});

router.get('/', async (req, res) => {
    try {
        const { station, limit = 50 } = req.query;
        const filter = {};
        if (station) filter.station = station;

        const data = await AirQuality.find(filter)
            .populate('station', 'name city')
            .sort({ measured_at: -1 })
            .limit(parseInt(limit) || 50);

        res.json({ success: true, data, meta: { count: data.length } });
    } catch (error) {
        handleError(res, error);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const item = await AirQuality.findById(req.params.id).populate('station', 'name city');
        if (!item) {
            return res.status(404).json({ success: false, error: 'Вимірювання не знайдено' });
        }
        res.json({ success: true, data: item });
    } catch (error) {
        handleError(res, error);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const item = await AirQuality.findByIdAndUpdate(
            req.params.id,
            req.body ?? {},
            { returnDocument: 'after', runValidators: true }
        );
        if (!item) {
            return res.status(404).json({ success: false, error: 'Вимірювання не знайдено' });
        }
        res.json({ success: true, data: item });
    } catch (error) {
        handleError(res, error);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const item = await AirQuality.findByIdAndDelete(req.params.id);
        if (!item) {
            return res.status(404).json({ success: false, error: 'Вимірювання не знайдено' });
        }
        res.json({ success: true, message: 'Вимірювання видалено' });
    } catch (error) {
        handleError(res, error);
    }
});

export default router;