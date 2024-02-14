const request = require('supertest');
const app = require('../HealthCheckServer'); // Assuming your server instance is exported from 'HealthCheckServer.js'

describe('User Endpoint Integration Tests', () => {

  afterEach(() => {
    app.close(); // Close the server
  });

  it('Test 1 - Create an account and validate account exists', async () => {
    // Generate a unique username
    const username = `user_${Date.now()}`;

    // Create an account
    const createUserRes = await request(app)
      .post('/v1/user')
      .send({
        firstName: 'Siya',
        lastName: 'Ram',
        userName: `${username}@gmail.com`, // Use the generated username
        password: 'test45'
      });

    // Validate account creation
    expect(createUserRes.status).toEqual(201);

    // Validate account existence by getting the user
    const getUserRes = await request(app)
      .get('/v1/user/self')
      .set('Authorization', `Basic ${Buffer.from(`${username}@gmail.com:test45`).toString('base64')}`);
    expect(getUserRes.status).toEqual(200);
    expect(getUserRes.body.userName).toEqual(`${username}@gmail.com`);
  });

  it('Test 2 - Update the account and validate account was updated', async () => {
    // Generate a unique username
    const username = `user_${Date.now()}`;

    // Create an account with the generated username
    const createUserRes = await request(app)
      .post('/v1/user')
      .send({
        firstName: 'Siya',
        lastName: 'Ram',
        userName: `${username}@gmail.com`,
        password: 'test45'
      });

    // Validate account creation
    expect(createUserRes.status).toEqual(201);

    // Update the account with the generated username
    const updateUserRes = await request(app)
      .put('/v1/user/self')
      .set('Authorization', `Basic ${Buffer.from(`${username}@gmail.com:test45`).toString('base64')}`)
      .send({
        firstName: 'Siya Updated',
        lastName: 'Ram Updated'
      });

    // Validate account update
    expect(updateUserRes.status).toEqual(204);

    // Validate account update by getting the user
    const getUserRes = await request(app)
      .get('/v1/user/self')
      .set('Authorization', `Basic ${Buffer.from(`${username}@gmail.com:test45`).toString('base64')}`);
    expect(getUserRes.status).toEqual(200);
    expect(getUserRes.body.firstName).toEqual('Siya Updated');
    expect(getUserRes.body.lastName).toEqual('Ram Updated');
  });
});

