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