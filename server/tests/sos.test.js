const request = require('supertest');
const app = require('../src/app');
const EmergencyAlert = require('../src/models/EmergencyAlert');
require('./setup');

describe('SOS & Emergency Alert Flow', () => {
  let userToken;

  beforeEach(async () => {
    await request(app).post('/api/signup').send({
      name: 'Safety User',
      email: 'safety@example.com',
      password: 'password123',
    });

    const loginRes = await request(app).post('/api/login').send({
      email: 'safety@example.com',
      password: 'password123',
    });
    userToken = loginRes.body.token;
  });

  it('rejects POST /api/contacts/send-sos without auth with 401', async () => {
    const res = await request(app).post('/api/contacts/send-sos').send({
      message: 'Help me!',
    });
    expect(res.status).toBe(401);
  });

  it('returns 404 if user triggers SOS without any trusted contacts', async () => {
    const res = await request(app)
      .post('/api/contacts/send-sos')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        message: 'Help!',
      });

    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/No contacts found/i);
  });

  it('sends SOS SMS to all registered contacts of the user with plate number and maps link', async () => {
    // Add two contacts
    await request(app)
      .post('/api/contacts')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Contact 1', number: '9111111111' });

    await request(app)
      .post('/api/contacts')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Contact 2', number: '9222222222' });

    const res = await request(app)
      .post('/api/contacts/send-sos')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        message: '🚨 Emergency! Need immediate assistance.',
        plate_number: 'DL01AB1234',
      });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('SMS sent');
    expect(res.body.details).toBeDefined();
    // Verify mock SMS delivery recorded the right numbers and message
    expect(res.body.details.numbers).toBe('9111111111,9222222222');
    expect(res.body.details.content).toContain('DL01AB1234');
    expect(res.body.details.content).toContain('Emergency');
  });

  it('POST /api/emergency-alert stores alert record and dispatches alert SMS', async () => {
    await request(app)
      .post('/api/contacts')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Guardian', number: '9333333333' });

    const res = await request(app)
      .post('/api/emergency-alert')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        plateNumber: 'KA02CD5678',
        safescore: 8,
        source: 'voice_screaming',
        location: { lat: 28.6139, lng: 77.209 },
      });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('Emergency SMS sent to Safety Circle');
    expect(res.body.alertId).toBeDefined();

    // Verify stored in MongoDB
    const alertInDb = await EmergencyAlert.findById(res.body.alertId);
    expect(alertInDb).not.toBeNull();
    expect(alertInDb.plateNumber).toBe('KA02CD5678');
    expect(alertInDb.source).toBe('voice_screaming');
    expect(alertInDb.location.coordinates).toEqual([77.209, 28.6139]);

    // Verify SMS payload
    expect(res.body.details.numbers).toBe('9333333333');
    expect(res.body.details.content).toContain('Safety User');
    expect(res.body.details.content).toContain('KA02CD5678');
  });

  it('verifies open SMS endpoint /api/test-sms was removed (returns 404)', async () => {
    const res = await request(app).post('/api/test-sms').send({
      phone: '9999999999',
      message: 'Test',
    });

    expect(res.status).toBe(404);
  });
});
