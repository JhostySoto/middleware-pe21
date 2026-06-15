import { requestLogger } from './logger.js';

describe('requestLogger middleware', () => {
  it('debe llamar a next() al recibir una petición', () => {
    const req = { method: 'GET', path: '/health' } as any;
    const res = { on: jest.fn() } as any;
    const next = jest.fn();

    requestLogger(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('debe registrar el método y la ruta en el evento finish', () => {
    const req = { method: 'POST', path: '/users' } as any;
    const res = { on: jest.fn(), statusCode: 200 } as any;
    const next = jest.fn();

    requestLogger(req, res, next);

    expect(res.on).toHaveBeenCalledWith('finish', expect.any(Function));
  });
});