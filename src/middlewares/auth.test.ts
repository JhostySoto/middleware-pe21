import { requireApiKey } from './auth.js';

describe('requireApiKey middleware', () => {
  it('debe retornar 401 si no hay x-api-key', () => {
    const req = { headers: {} } as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
    const next = jest.fn();

    requireApiKey(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('debe retornar 401 si la clave es incorrecta', () => {
    const req = { headers: { 'x-api-key': 'mala-clave' } } as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
    const next = jest.fn();

    requireApiKey(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('debe llamar a next() si la clave es correcta', () => {
    const req = { headers: { 'x-api-key': 'secreto-demo' } } as any;
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
    const next = jest.fn();

    requireApiKey(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});