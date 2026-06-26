import express, { type Request, type Response, type NextFunction } from 'express';
import { createHmac, timingSafeEqual } from 'crypto';

// JSON WEB TOKEN - JWT
// Se deja el fallback directo por si process.env falla en la consola al inyectar el secreto
const JWT_SECRET = process.env.JWT_SECRET || 'secreto-demo-pe23';

function base64UrlDecode(str: string): string {
  return Buffer.from(
    str.replace(/-/g, '+').replace(/_/g, '/'),
    'base64'
  ).toString('utf8');
}

export function requireJwt(req: Request, res: Response, _next: NextFunction) {
  const authHeader = req.headers['authorization'] ?? '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

  if (!token) return res.status(401).json({ error: 'Token ausente' });

  const parts = token.split('.');
  if (parts.length !== 3) return res.status(401).json({ error: 'Token malformado' });

  const [headersB64, payloadB64, signatureB64] = parts;

  // Verificar que el algoritmo declarado es HS256 (Ataque alg: none mitigado)
  const header = JSON.parse(base64UrlDecode(headersB64 as string));
  if (header.alg !== 'HS256') return res.status(401).json({ error: 'Algoritmo no permitido' });

  // 1. Recalcular firma base esperada usando HMAC-SHA256
  const expectedSigBase = createHmac('sha256', JWT_SECRET)
    .update(`${headersB64}.${payloadB64}`)
    .digest('base64url');

  // 2. Normalizar estrictamente ambas firmas (Remover rellenos '=' y asegurar formato url)
  const cleanExpectedSig = expectedSigBase
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  const cleanClientSignature = (signatureB64 as string)
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  // 3. Convertir explícitamente a Buffers con codificación utf8
  const signatureBuffer = Buffer.from(cleanClientSignature, 'utf8');
  const expectedSigBuffer = Buffer.from(cleanExpectedSig, 'utf8');

  // 4. Validar longitudes idénticas antes de ejecutar el timingSafeEqual
  if (signatureBuffer.length !== expectedSigBuffer.length || 
      !timingSafeEqual(signatureBuffer, expectedSigBuffer)) {
    return res.status(401).json({ error: 'Firma invalida' });
  }

  const claims = JSON.parse(base64UrlDecode(payloadB64 as string));

  // Validar claims obligatorios y vigencias cronológicas
  const now = Math.floor(Date.now() / 1000);
  if (claims.exp && claims.exp < now) return res.status(401).json({ error: 'Token expirado' });
  if (!claims.sub) return res.status(401).json({ error: 'Claim sub ausente' });

  (req as Request & { user?: unknown }).user = { sub: claims.sub, scope: claims.scope ?? '' };
  _next();
}

export function requireApiKey(req: Request, res: Response, next: NextFunction): void {
  const key = req.headers['x-api-key'];
  if (key !== 'secreto-demo') {
    res.status(401).json({ error: 'API key inválida o ausente' });
    return;
  }
  next();
}