import mongoose from 'mongoose';

const AirQualitySchema = new mongoose.Schema({
    station: { type: mongoose.Schema.Types.ObjectId, ref: 'Station', required: true },
    pm25: { type: Number, required: true, min: 0 },
    pm10: { type: Number, min: 0 },
    no2: { type: Number, min: 0 },
    temperature: { type: Number },
    humidity: { type: Number, min: 0, max: 100 },
    source: {
        type: String,
        enum: ['SaveEcoBot', 'OpenAQ', 'data.gov.ua', 'manual'],
        default: 'manual'
    },
    measured_at: { type: Date, default: Date.now }
});

export default mongoose.model('AirQuality', AirQualitySchema);