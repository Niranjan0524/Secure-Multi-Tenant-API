const request = require('supertest');
const app = require('../src/app'); // Adjust the path as necessary
const mongoose = require('mongoose');
const User = require('../src/models/User');

beforeAll(async () => {
    await mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Authentication Tests', () => {
    let user;

    beforeEach(async () => {
        user = {
            name: 'Test User',
            email: 'testuser@example.com',
            password: 'password123',
            organizationId: 'org123',
            role: 'user'
        };
        await User.deleteMany({});
    });

    test('User registration', async () => {
        const response = await request(app)
            .post('/api/auth/register')
            .send(user);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('token');
        expect(response.body.user).toHaveProperty('email', user.email);
    });

    test('User login', async () => {
        await request(app)
            .post('/api/auth/register')
            .send(user);

        const response = await request(app)
            .post('/api/auth/login')
            .send({ email: user.email, password: user.password });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
        expect(response.body.user).toHaveProperty('email', user.email);
    });

    test('Login with incorrect password', async () => {
        await request(app)
            .post('/api/auth/register')
            .send(user);

        const response = await request(app)
            .post('/api/auth/login')
            .send({ email: user.email, password: 'wrongpassword' });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });

    test('Login with unregistered email', async () => {
        const response = await request(app)
            .post('/api/auth/login')
            .send({ email: 'notfound@example.com', password: 'password123' });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });
});