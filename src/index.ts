import express, { type Request, type Response, type NextFunction } from 'express';
import { requestLogger } from './middlewares/logger.js';
import { requireApiKey } from './middlewares/auth.js';

const app = express();
app.use(express.json());
app.use(requestLogger);
app.use(requireApiKey);       


// const no se puede reasignar un valor es constante 
// let se puede stear el valor 
// var es para declalar globales

const port = 3000;

app.get('/health', (req: Request, res: Response) => {
  res.json(
        {
            code: 200,
            status: "API Iniciador",
            date: new Date().toISOString() 
        }     
    )
})
app.use((_err: Error, _req: Request, res: Response, _next: NextFunction) => {
  res.status(500).json({ error: 'Error interno del servidor' });
});


app.listen(port, () => {
    console.log("Servidor Iniciando")
})