import request from 'supertest';
import {app} from '../src/index'


describe('GET /api/health', () => {
  it('should return 200 and healthy message', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Healthy');
  });
});
