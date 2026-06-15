import express, { type Request, type Response, type NextFunction } from 'express';
import { requestLogger } from './middlewares/logger.js';
import { requireApiKey } from './middlewares/auth.js';

const app = express();
const port = 3000;

app.use(express.json());
app.use(requestLogger);

app.get('/health', (req: Request, res: Response) => {
  res.json(
        {
            code: 200,
            status: "API Iniciador",
            date: new Date().toISOString() 
        }     
    )
})

app.use(requireApiKey);       
app.use((_err: Error, _req: Request, res: Response, _next: NextFunction) => {
  res.status(500).json({ error: 'Error interno del servidor' });
});


app.listen(port, () => {
    console.log("Servidor Iniciando")
})