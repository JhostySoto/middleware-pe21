## (a) Sin API key -> esperado: 401
-- curl http://localhost:3000/health
### Salida
-- {"error":"API key inválida o ausente"}
### Explicación
-- La petición fue denegada debido a que no se incluyó la cabecera x-api-key exigida por el middleware de autenticación.
## (b) Con clave válida -> esperado: 200
-- curl -H "x-api-key: secreto-demo" http://localhost:3000/health
### salida
-- {"code":200,"status":"API Iniciador","date":"2026-06-11T14:40:41.503Z"}
### Explicación
-- La verificación de autenticación se completó con éxito y el servidor respondió de manera adecuada mostrando el estado de la API
## (c) Ruta inexistente -> esperado: 404
-- curl -H "x-api-key: secreto-demo" http://localhost:3000/noexiste
### Salida
-- La autenticación se realizó correctamente, pero la ruta solicitada no está disponible, por lo que el servidor retorna un error 404
## comando 
-- npx tsc --noEmit
### salida
-- No existen errores

## Testing

### Ejecución de pruebas

Las pruebas unitarias fueron implementadas utilizando Jest y ts-jest para validar el comportamiento de los middlewares `requestLogger` y `requireApiKey` sin necesidad de levantar el servidor.

#### Comando de ejecución

```bash
npm test
```

#### Salida obtenida

```text
PASS  src/middlewares/auth.test.ts
PASS  src/middlewares/logger.test.ts

Test Suites: 2 passed, 2 total
Tests:       5 passed, 5 total
Snapshots:   0 total
Time:        0.507 s
Ran all test suites.
```

#### Casos probados

##### Middleware Logger (`requestLogger`)

* Verifica que se invoque `next()` al recibir una petición.
* Verifica que se registre el método y la ruta mediante el evento `finish`.

##### Middleware API Key (`requireApiKey`)

* Header `x-api-key` ausente → responde con código 401.
* API key incorrecta → responde con código 401.
* API key válida → invoca `next()` correctamente.
