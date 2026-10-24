import 'dotenv/config';
import mongoose from 'mongoose';
import app from './app.js';

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Успішно підключено до MongoDB');
        app.listen(PORT, () => console.log(`HTTP сервер прослуховує порт ${PORT}`));
    })
    .catch((err) => {
        console.error('Помилка підключення до MongoDB:', err.message);
        process.exit(1);
    });