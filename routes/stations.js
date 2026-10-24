import express from 'express';
import Station from '../models/Station.js';

const router = express.Router();

// 1. CREATE — Створити нову станцію
router.post('/', async (req, res) => {
    try {
        const { name, city, latitude, longitude } = req.body;

        if (!name || !city || latitude === undefined || longitude === undefined) {
            return res.status(400).json({ success: false, error: 'Відсутні обов\'язкові поля' });
        }

        const newStation = new Station({ name, city, latitude, longitude });
        await newStation.save();

        res.status(201).json({ success: true, data: newStation });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 2. READ (ALL) — Отримати всі станції
router.get('/', async (req, res) => {
    try {
        const stations = await Station.find();
        res.json({ success: true, data: stations, meta: { count: stations.length } });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 3. READ (ONE) — Отримати станцію за ID
router.get('/:id', async (req, res) => {
    try {
        const station = await Station.findById(req.params.id);
        if (!station) {
            return res.status(404).json({ success: false, error: 'Станцію не знайдено' });
        }
        res.json({ success: true, data: station });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 4. UPDATE — Оновити станцію за ID
router.put('/:id', async (req, res) => {
    try {
        const updatedStation = await Station.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedStation) {
            return res.status(404).json({ success: false, error: 'Станцію не знайдено' });
        }

        res.json({ success: true, data: updatedStation });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// 5. DELETE — Видалити станцію за ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedStation = await Station.findByIdAndDelete(req.params.id);

        if (!deletedStation) {
            return res.status(404).json({ success: false, error: 'Станцію не знайдено' });
        }

        res.json({ success: true, message: 'Станцію успішно видалено' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;