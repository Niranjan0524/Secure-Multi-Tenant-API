const request = require('supertest');
const app = require('../src/app'); // Adjust the path if necessary
const mongoose = require('mongoose');

beforeAll(async () => {
    // Connect to the test database
    await mongoose.connect(process.env.TEST_DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterAll(async () => {
    // Close the database connection
    await mongoose.connection.close();
});

beforeEach(async () => {
    // Clear the database before each test
    await mongoose.connection.db.dropDatabase();
});

module.exports = {
    request,
    app,
};