const request = require('supertest');
const app = require('../src/app');
const VehicleScan = require('../src/models/VehicleScan');
const SafeRouteData = require('../src/models/SafeRouteData');
require('./setup');

describe('Scans and Safe Route API', () => {
  let userToken;

  beforeEach(async () => {
    await request(app).post('/api/signup').send({
      name: 'Scan User',
      email: 'scan@example.com',
      password: 'password123',
    });

    const loginRes = await request(app).post('/api/login').send({
      email: 'scan@example.com',
      password: 'password123',
    });
    userToken = loginRes.body.token;
  });

  describe('POST /api/log-scan', () => {
    it('rejects unauthenticated request with 401', async () => {
      const res = await request(app).post('/api/log-scan').send({
        plate_number: 'DL01XY9999',
      });
      expect(res.status).toBe(401);
    });

    it('logs vehicle scan with GeoJSON point and safeScore', async () => {
      const res = await request(app)
        .post('/api/log-scan')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          plate_number: 'hr26dk8371',
          location_lat: 28.4595,
          location_lng: 77.0266,
          safescore: 7.5,
        });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Scan logged');
      expect(res.body.scanId).toBeDefined();

      const scanInDb = await VehicleScan.findById(res.body.scanId);
      expect(scanInDb).not.toBeNull();
      expect(scanInDb.plateNumber).toBe('HR26DK8371');
      expect(scanInDb.safeScore).toBe(7.5);
      expect(scanInDb.location.type).toBe('Point');
      expect(scanInDb.location.coordinates).toEqual([77.0266, 28.4595]);
    });
  });

  describe('POST /api/route/safest', () => {
    it('rejects unauthenticated request with 401', async () => {
      const res = await request(app).post('/api/route/safest').send({
        origin: { lat: 28.6139, lng: 77.209 },
        destination: { lat: 28.7041, lng: 77.1025 },
      });
      expect(res.status).toBe(401);
    });

    it('returns 400 when origin or destination is missing', async () => {
      const res = await request(app)
        .post('/api/route/safest')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          origin: { lat: 28.6139, lng: 77.209 },
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/Missing source or destination/i);
    });

    it('calculates safety score and traffic level for given route', async () => {
      const res = await request(app)
        .post('/api/route/safest')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          origin: { lat: 28.6139, lng: 77.209 },
          destination: { lat: 28.7041, lng: 77.1025 },
        });

      expect(res.status).toBe(200);
      expect(res.body.safety_score).toBeDefined();
      expect(res.body.traffic_level).toBeDefined();
    });

    it('incorporates seeded SafeRouteData geospatial records into score', async () => {
      // Seed SafeRouteData points near origin [77.209, 28.6139]
      await SafeRouteData.create([
        {
          location: { type: 'Point', coordinates: [77.2091, 28.614] },
          crimeScore: 2.0,
          lightingScore: 4.0,
        },
        {
          location: { type: 'Point', coordinates: [77.2095, 28.6145] },
          crimeScore: 1.0,
          lightingScore: 5.0,
        },
      ]);

      const res = await request(app)
        .post('/api/route/safest')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          origin: { lat: 28.6139, lng: 77.209 },
          destination: { lat: 28.7041, lng: 77.1025 },
        });

      expect(res.status).toBe(200);
      expect(typeof res.body.safety_score).toBe('number');
      expect(res.body.safety_score).toBeGreaterThanOrEqual(1);
      expect(res.body.safety_score).toBeLessThanOrEqual(10);
    });
  });
});
