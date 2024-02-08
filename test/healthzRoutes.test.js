const { getHealthCheck } = require('../src/HealthCheck/HealthCheckController');

// Mock the dependencies
const req = { method: 'GET', headers: {} };
const res = { set: jest.fn().mockReturnThis(), status: jest.fn().mockReturnThis(), end: jest.fn() };

describe('getHealthCheck', () => {
    test('should return 200 status for GET request', async () => {
        await getHealthCheck(req, res);

        expect(res.set).toHaveBeenCalledWith('Cache-Control', 'no-cache');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.end).toHaveBeenCalled();
    });
});
