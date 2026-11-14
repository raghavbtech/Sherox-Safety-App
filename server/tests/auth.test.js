const request = require('supertest');
const app = require('../src/app');
require('./setup');

describe('Auth & Security API', () => {
  it('GET /health returns 200 and ok status', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.timestamp).toBeDefined();
  });

  describe('POST /api/signup', () => {
    it('creates a new user with hashed password and returns 201', async () => {
      const res = await request(app)
        .post('/api/signup')
        .send({
          name: 'Jane Doe',
          email: 'jane@example.com',
          password: 'password123',
        });

      expect(res.status).toBe(201);
      expect(res.body.message).toBe('User created successfully');
    });

    it('rejects duplicate email with 400', async () => {
      await request(app).post('/api/signup').send({
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password123',
      });

      const res = await request(app).post('/api/signup').send({
        name: 'Jane Another',
        email: 'JANE@EXAMPLE.COM',
        password: 'password456',
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('User already exists');
    });

    it('validates minimum password length with 400', async () => {
      const res = await request(app).post('/api/signup').send({
        name: 'Jane Doe',
        email: 'short@example.com',
        password: '123',
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/at least 6 characters/i);
    });

    it('validates invalid email format with 400', async () => {
      const res = await request(app).post('/api/signup').send({
        name: 'Jane Doe',
        email: 'not-an-email',
        password: 'password123',
      });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/Invalid email/i);
    });
  });

  describe('POST /api/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/signup').send({
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password123',
      });
    });

    it('logs in successfully and returns JWT token and user info', async () => {
      const res = await request(app).post('/api/login').send({
        email: 'jane@example.com',
        password: 'password123',
      });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
      expect(res.body.user).toEqual({
        name: 'Jane Doe',
        email: 'jane@example.com',
      });
      // Ensure passwordHash is not leaked
      expect(res.body.user.passwordHash).toBeUndefined();
      expect(res.body.passwordHash).toBeUndefined();
    });

    it('returns 401 for wrong password', async () => {
      const res = await request(app).post('/api/login').send({
        email: 'jane@example.com',
        password: 'wrongpassword',
      });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Invalid credentials');
    });

    it('returns 401 for unknown email', async () => {
      const res = await request(app).post('/api/login').send({
        email: 'unknown@example.com',
        password: 'password123',
      });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Invalid credentials');
    });
  });

  describe('JWT Middleware Verification', () => {
    let token;

    beforeEach(async () => {
      await request(app).post('/api/signup').send({
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'password123',
      });

      const loginRes = await request(app).post('/api/login').send({
        email: 'jane@example.com',
        password: 'password123',
      });
      token = loginRes.body.token;
    });

    it('rejects protected route without token with 401', async () => {
      const res = await request(app).get('/api/contacts');
      expect(res.status).toBe(401);
      expect(res.body.message).toMatch(/Unauthorized/i);
    });

    it('rejects protected route with invalid token with 401', async () => {
      const res = await request(app)
        .get('/api/contacts')
        .set('Authorization', 'Bearer invalid-token-string');
      expect(res.status).toBe(401);
      expect(res.body.message).toMatch(/Unauthorized/i);
    });

    it('allows protected route with valid Bearer token', async () => {
      const res = await request(app)
        .get('/api/contacts')
        .set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });
});
