import 'dotenv/config';
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../app.js';

const NO_SUCH_ID = '64a1b2c3d4e5f6789abcdef0';
let stationId;
let measurementId;

before(async () => {
    const uri = process.env.MONGO_URI_TEST;
    await mongoose.connect(uri);
    await mongoose.connection.dropDatabase();
});

after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
});

test('POST /api/stations створює станцію (201)', async () => {
    const res = await request(app).post('/api/stations').send({
        name: 'Тестова', city: 'Київ', latitude: 50.45, longitude: 30.52
    });
    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    stationId = res.body.data._id;
});

test('POST /api/stations без тіла (400)', async () => {
    const res = await request(app).post('/api/stations');
    assert.equal(res.status, 400);
});

test('POST /api/stations з широтою поза діапазоном (400)', async () => {
    const res = await request(app).post('/api/stations').send({
        name: 'X', city: 'Y', latitude: 200, longitude: 30
    });
    assert.equal(res.status, 400);
});

test('GET /api/stations повертає масив (200)', async () => {
    const res = await request(app).get('/api/stations');
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body.data));
    assert.equal(res.body.meta.count, 1);
});

test('GET /api/stations/:id (200)', async () => {
    const res = await request(app).get(`/api/stations/${stationId}`);
    assert.equal(res.status, 200);
    assert.equal(res.body.data.city, 'Київ');
});

test('GET /api/stations/abc (400)', async () => {
    const res = await request(app).get('/api/stations/abc');
    assert.equal(res.status, 400);
});

test('GET неіснуючої станції (404)', async () => {
    const res = await request(app).get(`/api/stations/${NO_SUCH_ID}`);
    assert.equal(res.status, 404);
});

test('PUT /api/stations/:id оновлює дані (200)', async () => {
    const res = await request(app).put(`/api/stations/${stationId}`).send({ city: 'Львів' });
    assert.equal(res.status, 200);
    assert.equal(res.body.data.city, 'Львів');
});

test('POST /api/air-quality створює вимірювання (201)', async () => {
    const res = await request(app).post('/api/air-quality').send({
        station: stationId, pm25: 25.3, pm10: 35.2
    });
    assert.equal(res.status, 201);
    measurementId = res.body.data._id;
});

test('POST /api/air-quality з неіснуючою станцією (400)', async () => {
    const res = await request(app).post('/api/air-quality').send({
        station: NO_SUCH_ID, pm25: 10
    });
    assert.equal(res.status, 400);
});

test('PUT /api/air-quality/:id (200)', async () => {
    const res = await request(app).put(`/api/air-quality/${measurementId}`).send({ pm25: 30.1 });
    assert.equal(res.status, 200);
    assert.equal(res.body.data.pm25, 30.1);
});

test('DELETE /api/air-quality/:id (200), повторно (404)', async () => {
    const first = await request(app).delete(`/api/air-quality/${measurementId}`);
    assert.equal(first.status, 200);
    const second = await request(app).delete(`/api/air-quality/${measurementId}`);
    assert.equal(second.status, 404);
});

test('DELETE /api/stations/:id (200)', async () => {
    const res = await request(app).delete(`/api/stations/${stationId}`);
    assert.equal(res.status, 200);
});