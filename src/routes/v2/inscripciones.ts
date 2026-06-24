import { type Request, type Response, Router} from 'express';

const router = Router();

const METODO_PAGO = ['Efectivo', 'Transferencia', 'Debito', 'Credito']

//Post: EstudianteId, materias (Arreglo), periodoId, metodo de pago - Registrar matricula
router.post('/', (req: Request, res: Response, next) => {
    // cost body = req.body;
    const { estudianteId, materias, periodoId, metodo_pago } = req.body;

    if (!estudianteId || !materias?.length || !periodoId || !metodo_pago) {
         console.error("No existe el ID del estudiante")
         res.status(400).json( 
            {
                error: 'Campos requeridos: estudianteId, materias, periodoId, metodo_pago'
            }        
        )
    }
    if (!METODO_PAGO.includes(metodo_pago)){
        console.error('El metodo de pago no es válido')
        res.status(400).json(
            {
                error: 'El metodo de pago insetado debe ser: Efectivo, debito, credito o tranferencia'

            }
            
        )
    }
    res.status(201).json({
        version: 'v2',
        message: {
            estudianteId, materias, periodoId, metodo_pago
        }
    })
});

export default router;