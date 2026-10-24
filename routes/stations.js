import express from 'express';
import Station from '../models/Station.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { name, city, latitude, longitude } = req.body ?? {};

        if (!name || !city || latitude === undefined || longitude === undefined) {
            return res.status(400).json({ success: false, error: 'Відсутні обов\'язкові поля' });
        }

        const newStation = new Station({ name, city, latitude, longitude });
        await newStation.save();

        res.status(201).json({ success: true, data: newStation });
    } catch (error) {
        handleError(res, error);
    }
});

router.get('/', async (req, res) => {
    try {
        const stations = await Station.find();
        res.json({ success: true, data: stations, meta: { count: stations.length } });
    } catch (error) {
        handleError(res, error);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const station = await Station.findById(req.params.id);
        if (!station) {
            return res.status(404).json({ success: false, error: 'Станція не знайдена' });
        }
        res.json({ success: true, data: station });
    } catch (error) {
        handleError(res, error);
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedStation = await Station.findByIdAndUpdate(
            req.params.id,
            req.body ?? {},
            { new: true, runValidators: true }
        );

        if (!updatedStation) {
            return res.status(404).json({ success: false, error: 'Станція не знайдена' });
        }

        res.json({ success: true, data: updatedStation });
    } catch (error) {
        handleError(res, error);
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedStation = await Station.findByIdAndDelete(req.params.id);

        if (!deletedStation) {
            return res.status(404).json({ success: false, error: 'Станція не знайдена' });
        }

        res.json({ success: true, message: 'Станція успішно видалена' });
    } catch (error) {
        handleError(res, error);
    }
});

function handleError(res, error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
        return res.status(400).json({ success: false, error: error.message });
    }
    res.status(500).json({ success: false, error: 'Помилка сервера' });
}

export default router;