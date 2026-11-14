const request = require('supertest');
const app = require('../src/app');
require('./setup');

describe('Contacts API & Access Control', () => {
  let user1Token;
  let user2Token;

  beforeEach(async () => {
    // Register & login User 1
    await request(app).post('/api/signup').send({
      name: 'User One',
      email: 'user1@example.com',
      password: 'password123',
    });
    const res1 = await request(app).post('/api/login').send({
      email: 'user1@example.com',
      password: 'password123',
    });
    user1Token = res1.body.token;

    // Register & login User 2
    await request(app).post('/api/signup').send({
      name: 'User Two',
      email: 'user2@example.com',
      password: 'password123',
    });
    const res2 = await request(app).post('/api/login').send({
      email: 'user2@example.com',
      password: 'password123',
    });
    user2Token = res2.body.token;
  });

  it('allows adding a trusted contact with valid 10-digit phone number', async () => {
    const res = await request(app)
      .post('/api/contacts')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        name: 'Mom',
        number: '9876543210',
      });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe('Contact added');
    expect(res.body.contact.name).toBe('Mom');
    expect(res.body.contact.number).toBe('9876543210');
    expect(res.body.contact.id).toBeDefined();
  });

  it('rejects adding contact with invalid phone number', async () => {
    const res = await request(app)
      .post('/api/contacts')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        name: 'Dad',
        number: '12345', // only 5 digits
      });

    expect(res.status).toBe(400);
  });

  it('enforces maximum 5 contacts limit per user', async () => {
    for (let i = 1; i <= 5; i++) {
      const res = await request(app)
        .post('/api/contacts')
        .set('Authorization', `Bearer ${user1Token}`)
        .send({
          name: `Contact ${i}`,
          number: `900000000${i}`,
        });
      expect(res.status).toBe(201);
    }

    // 6th contact should fail with 400
    const res6 = await request(app)
      .post('/api/contacts')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        name: 'Contact 6',
        number: '9000000006',
      });

    expect(res6.status).toBe(400);
    expect(res6.body.message).toMatch(/Max 5 trusted contacts/i);
  });

  it('User B cannot see User A contacts', async () => {
    // User 1 adds contact
    await request(app)
      .post('/api/contacts')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        name: 'User 1 Sister',
        number: '9876543210',
      });

    // User 2 gets contacts
    const res2 = await request(app)
      .get('/api/contacts')
      .set('Authorization', `Bearer ${user2Token}`);

    expect(res2.status).toBe(200);
    expect(res2.body.length).toBe(0);

    // User 1 gets contacts
    const res1 = await request(app)
      .get('/api/contacts')
      .set('Authorization', `Bearer ${user1Token}`);

    expect(res1.status).toBe(200);
    expect(res1.body.length).toBe(1);
    expect(res1.body[0].name).toBe('User 1 Sister');
  });

  it('User B cannot delete User A contact', async () => {
    // User 1 adds contact
    const addRes = await request(app)
      .post('/api/contacts')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        name: 'User 1 Brother',
        number: '9876543210',
      });
    const contactId = addRes.body.contact.id;

    // User 2 attempts to delete User 1 contact
    const deleteRes = await request(app)
      .delete(`/api/contacts/${contactId}`)
      .set('Authorization', `Bearer ${user2Token}`);

    expect(deleteRes.status).toBe(404);
    expect(deleteRes.body.message).toBe('Contact not found');

    // Verify contact still exists for User 1
    const verifyRes = await request(app)
      .get('/api/contacts')
      .set('Authorization', `Bearer ${user1Token}`);
    expect(verifyRes.body.length).toBe(1);
  });

  it('owner can successfully delete their own contact', async () => {
    const addRes = await request(app)
      .post('/api/contacts')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        name: 'To Delete',
        number: '9876543210',
      });
    const contactId = addRes.body.contact.id;

    const deleteRes = await request(app)
      .delete(`/api/contacts/${contactId}`)
      .set('Authorization', `Bearer ${user1Token}`);

    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.message).toBe('Contact deleted');

    const verifyRes = await request(app)
      .get('/api/contacts')
      .set('Authorization', `Bearer ${user1Token}`);
    expect(verifyRes.body.length).toBe(0);
  });

  it('GET /api/trusted-contacts/count returns accurate count for user', async () => {
    const countBefore = await request(app)
      .get('/api/trusted-contacts/count')
      .set('Authorization', `Bearer ${user1Token}`);
    expect(countBefore.status).toBe(200);
    expect(countBefore.body.count).toBe(0);

    await request(app)
      .post('/api/contacts')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        name: 'Friend',
        number: '9876543210',
      });

    const countAfter = await request(app)
      .get('/api/trusted-contacts/count')
      .set('Authorization', `Bearer ${user1Token}`);
    expect(countAfter.status).toBe(200);
    expect(countAfter.body.count).toBe(1);
  });
});
