const { getHealthCheck } = require('../src/HealthCheck/HealthCheckController');

describe('getHealthCheck function', () => {
  it('should return status code 200 for a GET request with less than or equal to 6 headers', async () => {
    // Mock request and response objects
    const req = { method: 'GET', headers: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      end: jest.fn(),
    };

    // Call the function
    await getHealthCheck(req, res);

    // Verify the response
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.set).toHaveBeenCalledWith('Cache-Control', 'no-cache');
    expect(res.end).toHaveBeenCalled();
  });

  it('should return status code 405 for non-GET requests', async () => {
    // Mock request and response objects for a non-GET request
    const req = { method: 'POST', headers: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      end: jest.fn(),
    };

    // Call the function
    await getHealthCheck(req, res);

    // Verify the response
    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.set).toHaveBeenCalledWith('Cache-Control', 'no-cache');
    expect(res.end).toHaveBeenCalled();
  });

  it('should return status code 400 for requests with more than 6 headers', async () => {
    // Mock request and response objects with more than 6 headers
    const req = { method: 'GET', headers: { header1: 'value1', header2: 'value2', header3: 'value3', header4: 'value4', header5: 'value5', header6: 'value6', header7: 'value7' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      end: jest.fn(),
    };

    // Call the function
    await getHealthCheck(req, res);

    // Verify the response
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.set).toHaveBeenCalledWith('Cache-Control', 'no-cache');
    expect(res.end).toHaveBeenCalled();
  });
});
