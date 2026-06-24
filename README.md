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

## Validación del contrato OpenAPI

El archivo `openapi.yaml` fue validado con Redocly CLI antes de cada commit:

```bash
npx @redocly/cli lint openapi.yaml
```

**Resultado:**

El único warning corresponde a la regla `no-server-example.com`, que advierte sobre el uso de `localhost` en `servers.url`. Es esperado en un entorno de desarrollo local y no representa un error de contrato.

![Validación de openapi.yaml con Redocly CLI](docs/screenshots/validacionRedocly.png)

## Versionado con Git Tags

Se crearon dos tags para marcar las versiones del contrato:

```bash
git tag -a v1.0.0 -m "Contrato original: estudianteId, materias, periodoId"
git tag -a v2.0.0 -m "BREAKING: payment_method requerido en v2"
git push origin --tags
```

- **v1.0.0**: contrato original de `/v1/inscripciones`. Pide `estudianteId`, `materias` y `periodoId`. Si falta alguno, responde 400.
- **v2.0.0**: agrega `payment_method` como campo obligatorio en `/v2/inscripciones` (valores permitidos: `debit`, `credit`, `scholarship`). Es un breaking change porque si un cliente manda el body de v1 sin ese campo, le devuelve 400. Por eso se hizo como ruta nueva y no se modificó `/v1/inscripciones`, así los que ya usaban v1 no se ven afectados.

![Tags en GitHub](docs/screenshots/05-git-tags.png)

README.md — sección Pruebas (Markdown):
## Pruebas de los endpoints

Servidor corriendo en `http://localhost:3000`. Autenticacion: header `x-api-key: secreto-demo`.

### Escenario 1 — POST /v1/inscripciones con campos válidos (esperado: 201)

![v1 201 Created](docs/screenshots/01-v1-201.png)

### Escenario 2 — POST /v2/inscripciones con payment_method válido (esperado: 201)

![v2 201 Created](docs/screenshots/02-v2-201.png)

### Escenario 3 — POST /v2/inscripciones sin payment_method (esperado: 400)

![v2 400 campo faltante](docs/screenshots/03-v2-400-faltante.png)

### Escenario 4 — POST /v2/inscripciones con payment_method inválido (esperado: 400)

![v2 400 valor inválido](docs/screenshots/04-v2-400-inválido.png)

### Validación del contrato OpenAPI

Se ejecutó `npx @redocly/cli lint openapi.yaml` para validar el documento. 
El resultado final no presenta errores ni warnings:

![Validación Redocly sin errores](docs/screenshots/06-validacion-redocly-sin-errores.png)

### Versionado

El contrato se implementó con dos versiones activas: `/v1/inscripciones` y 
`/v2/inscripciones`, donde v2 agrega el campo `metodo_pago`. Cada versión 
está además marcada con un tag de Git (`v1.0.0`, `v2.0.0`), visibles en 
el repositorio remoto:

![Tags de Git](docs/screenshots/05-git-tags.png)

### Reflexión

Si otro equipo empezara a consumir esta API mañana, el primer cambio sería definir una política de versionado clara, ya que actualmente v1 y v2 coexisten sin indicar si v1 será deprecada. También se mejorarían los mensajes de error, que hoy son genéricos por ejemplo "campo requerido" o "método de pago inválido" y no especifican qué campo falló exactamente. Por último, se revisaría que la documentación refleje con precisión el comportamiento real de cada endpoint, ya que cualquier inconsistencia entre lo documentado y el código puede generar errores de integración para equipos que dependen únicamente del contrato.
