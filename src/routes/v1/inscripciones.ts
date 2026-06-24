import { type Request, type Response, Router} from 'express';

const router = Router();

//Post: EstudianteId, materias (Arreglo), periodoId - Registrar matricula
router.post('/', (req: Request, res: Response, next) => {
    // cost body = req.body;
    const { estudianteId, materias, periodoId } = req.body;

    if (!estudianteId || !materias?.length || !periodoId) {
         console.error("No existe el ID del estudiante")
         res.status(400).json( 
            {
                error: 'Campos requeridos: estudianteId, materias, periodoId'
            }        
        )
    }
    res.status(201).json({
        version: 'v1',
        message: {
            estudianteId, materias, periodoId
        }
    })
});

export default router;