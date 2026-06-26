import express, { type Request, type Response, type NextFunction } from 'express';
import { requestLogger } from './middlewares/logger.js';
import { requireJwt } from './middlewares/auth.js';         
import { rateLimiter } from './middlewares/rateLimiter.js';   
import v1Inscripciones from './routes/v1/inscripciones.js';
import v2Inscripciones from './routes/v2/inscripciones.js';

const app = express();
const port = 3000;

app.use(express.json());
app.use(requestLogger);
    
app.get('/health', (req: Request, res: Response) => {
  res.json({
    code: 200,
    status: "API Iniciador",
    date: new Date().toISOString() 
  });
});


app.use('/v1/inscripciones', v1Inscripciones);
app.use('/v2/inscripciones', requireJwt, rateLimiter, v2Inscripciones);


app.use((_err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(_err); 
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(port, () => {
  console.log("Servidor Iniciando en el puerto " + port);
});