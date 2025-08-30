const request = require('supertest');
const app = require('../src/app'); // Adjust the path as necessary
const mongoose = require('mongoose');
const User = require('../src/models/User');

beforeAll(async () => {
    // Connect to the test database
    await mongoose.connect(process.env.TEST_DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    // Clean up and close the database connection
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
});

describe('User Management', () => {
    let token;

    beforeEach(async () => {
        // Create a user and get a token for authentication
        const userResponse = await request(app)
            .post('/api/auth/register')
            .send({
                name: 'Test User',
                email: 'testuser@example.com',
                password: 'password123',
                organizationId: 'org123'
            });

        token = userResponse.body.token;
    });

    test('should create a new user', async () => {
        const response = await request(app)
            .post('/api/users')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'New User',
                email: 'newuser@example.com',
                password: 'password123',
                organizationId: 'org123'
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('user');
        expect(response.body.user.email).toBe('newuser@example.com');
    });

    test('should retrieve user details', async () => {
        const response = await request(app)
            .get('/api/users/me')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('user');
        expect(response.body.user.email).toBe('testuser@example.com');
    });

    test('should update user details', async () => {
        const response = await request(app)
            .put('/api/users/me')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Updated User'
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('user');
        expect(response.body.user.name).toBe('Updated User');
    });

    test('should delete a user', async () => {
        const response = await request(app)
            .delete('/api/users/me')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(204);
    });
});