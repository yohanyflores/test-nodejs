
# License

Nest is [MIT licensed](LICENSE).

# Ambiente.

Cree un archivo .env.development con la siguiente opciones

> Nota:  Los valores son dependientes de tu ambiente y configuracion de tu entorno.

```
#DATABASE CONNECTION
URI_MONGODB=mongodb://walter_user:secret@db:27017/walter_db

#JWT
JWT_SECRET=JWTP5d1&0MCEAz&poFt&12121212HH
EXPIRES_IN=12h

#API
APP_URL=https://backend.waltersoluciones.com
PORT=3000

# TWILIO:
TWILIO_STATE=ON
TWILIO_ACCOUNT_SID=*********
TWILIO_AUTH_TOKEN=**********
TWILIO_PHONE_FROM=+18454788189
```
### Descripcion:

* `URI_MONGODB`: String de Conexion para mongo.
* `JWT_SECRET`: Secret para generar y validar los Tokens Jwt.
* `EXPIRES_IN`: Tiempo de valides del token de autenticacion generado.
* `TWILIO_STATE`: `ON` | `OFF`, Si esta en OFF No se enviara el mensaje a travez de Twilio. Solo se imprimira en el log de la aplicacion.
* `TWILIO_ACCOUNT_SID`: SID de Twilio.
* `TWILIO_AUTH_TOKEN`: Auth Token de Twilio.
* `TWILIO_PHONE_FROM`: Numero Telefonico de Twilio desde donde se envia el mensaje.

# Ejecucion.

Luego dela configuracion se debe instalar los paquetes con:

```
yarn install
```

y ejecutar en modo de desarrollo con:

```
yarn run start:dev
```

Luego que arranque podemos ver la documentacion del API en:

> http://localhost:3000/api/docs/


# Problemas

En el codigo  inicial suministrado por https://drive.google.com/file/d/1e-C0dHt6t6rgTFrDIM5aWXzX6m2sz0Ar/view?usp=sharing. El modulo de autenticacion no funcionaba correctamente, si bien logro general los access token, el mismo access token no era verificado correctamente por el api. Luego de investigar las causas perdiendo tiempo aprovechable  se logro identificar la causa y corregirla. Una condicion de Carrera entre el modulo ConfigService de NestJS y el Modulo de Auth ocasionaba que las variables de entorno `JWT_SECRET` y `EXPIRES_IN` especificadas en el archivo `.env.development` no fueran leidas correctamente por el Modulo de auth `process.env.JWT_SECRET`. Ocasionando que las verificaciones fallaran. Se corrigio accesando directamente el servicio del `configService`.

# Pruebas

Para realizar las pruebas hay que preconfigurar un usuario, si no se tiene uno. Podemos hacer las pruebas con el comando `curl` como se mostrara en este documento, a travez de la pagina http://localhost:3000/api/docs/ o usando una herramienta sofisticada como **Postman**, o **Insonia**.

## Creacion del Usuario

Esta operacion la haremos con curl, tambien puede ejecutarla directamente en 

### Con Curl:
```shell
curl -X 'POST' \
  'http://localhost:3000/api/v1/auth/signup' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Chavo del 8",
    "username": "chavo",
    "email": "chavo@gmail.com",
    "password": "chavito"
}'
```

Tambien puedes ejecutarla directamenete desde el browser navegando hacia http://localhost:3000/api/docs/#/Authentication/AuthController_signUp y busca el boton `Try it out` de esa session. y enviando el contenido: 

### Con api/docs:

> url: http://localhost:3000/api/docs/#/Authentication/AuthController_signUp
```
{
    "name": "Chavo del 8",
    "username": "chavo",
    "email": "chavo@gmail.com",
    "password": "chavito"
}
```

## Crear y Registrar un Token por 12h

Luego que hallamos realizado con exito la creacion del usuario procedemos autenticarnos, debemos obtener un access token valido por 12h.

### Con Curl:
```shell
curl -X 'POST' \
  'http://localhost:3000/api/v1/auth/signin' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "username": "chavo",
  "password": "chavito"
}'
```


### Con api/docs:

> url: http://localhost:3000/api/docs/#/Authentication/AuthController_signIn
```
{
  "username": "chavo",
  "password": "chavito"
}
```

En ambos casos obtendremos un json con el access_token:

```json
{"access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImNoYXZvIiwic3ViIjoxMTExMTEsImlhdCI6MTYzNDUxMTg3NiwiZXhwIjoxNjM0NTU1MDc2LCJhdWQiOiJodHRwczovL2JhY2tlbmQud2FsdGVyc29sdWNpb25lcy5jb20ifQ.N1KvhDHk7CDF5rSpCUsbA9KDw_6lRcdndvwfqM8zjF4"}
```

Debemos tomar el valos del campo `access_token` y registrarlo en tu herramienta, para cada solicitud que hagas debes enviarlo en un Header Http:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImNoYXZvIiwic3ViIjoxMTExMTEsImlhdCI6MTYzNDUxMTg3NiwiZXhwIjoxNjM0NTU1MDc2LCJhdWQiOiJodHRwczovL2JhY2tlbmQud2FsdGVyc29sdWNpb25lcy5jb20ifQ.N1KvhDHk7CDF5rSpCUsbA9KDw_6lRcdndvwfqM8zjF4
```

Si usas `curl` guardalo en una variable de entorno. 

Si usas el browser registralo en http://localhost:3000/api/docs/#/ y busca el boton **Authorize** y copia alli el access token para que sea usado por las demas peticiones que requieran autenticacion.

Si usas otra herramienta utiliza una variable para almanarlo.

## CRUD de Ordenes

La documentacion y prueba estan en http://localhost:3000/api/docs/#/Orders 

Para los id se usan los objectid de mongo strings de 24 caracteres hexadecimales y que son reportados en la propiedad `_id`.

> Nota: No se puede manipular los tracking con esta api de ordenes. Sin embargo en caso de que alguna orden tenga tracking Las lecturas (GET) Mostraran adecuadamente la relacion.


## CRUD de Order Tracking

La documentacion y prueba estan en http://localhost:3000/api/docs/#/Orders%20Tracking .

Permite manipular los tracking de una orden. La orden se identifica por su _id de mongo. y los trackings tambien con un id unico asignado por mongo.

### OTP

Para el caso de OTP, Debido a que la entidad User no tiene el numero de telefono, En la solicitud se debe suministrar el numero de telefono al que se recibira e codigo.

En http://localhost:3000/api/docs/#/Authentication Se encuentra la documentacion y prueba para el envio y verificacion de OTP.

#### Solicitud de OTP

Ver la documentacion en: http://localhost:3000/api/docs/#/Authentication/AuthController_sendOtp clickeamos el boton `| Try it out |`

y colocamos en el Request body este json con el numero de telefono de prueba, la aplicacion validara que sean numeros colombianos.
> `POST http://localhost:3000/api/v1/auth/sendotp`
```json
{
  "phone": "3003835248"
}
```

Si activo Twilio en la configuracion le llegara un codigo a su celular. He notado que es un poquito lento la distribucion de mensajes y qu es posible que cuando llegue el otp halla vencido.

De todos modos el codigo es impreso en la consola de la aplicacion:

```
[Walter] 19983 es su código de verificación
```

asi como el resultado de la iteraccion con Twilio:

```javascript
{
  body: 'Sent from your Twilio trial account - [Walter] 19983 es su código de verificación',
  numSegments: '2',
  direction: 'outbound-api',
  from: '+18454788189',
  to: '+573003835248',
  dateUpdated: 2021-10-17T23:29:57.000Z,
  price: null,
  errorMessage: null,
  uri: '/2010-04-01/Accounts/ACf49ea2b7f899f006f123ce1be5512821/Messages/SM4a3ca16cd35c4ce79c8a864313953319.json',
  accountSid: 'ACf49ea2b7f899f006f123ce1be5512821',
  numMedia: '0',
  status: 'queued',
  messagingServiceSid: null,
  sid: 'SM4a3ca16cd35c4ce79c8a864313953319',
  dateSent: null,
  dateCreated: 2021-10-17T23:29:57.000Z,
  errorCode: null,
  priceUnit: 'USD',
  apiVersion: '2010-04-01',
  subresourceUris: {
    media: '/2010-04-01/Accounts/ACf49ea2b7f899f006f123ce1be5512821/Messages/SM4a3ca16cd35c4ce79c8a864313953319/Media.json'
  }
}
```

### Validacion de Codigo OTP

La documentacin esta en http://localhost:3000/api/docs/#/Authentication/AuthController_validateOtp 


Luego que obtengamos el codigo debemos validarlo:

Para ello enviamos un post:

> `POST http://localhost:3000/api/v1/auth/validateotp`
```json
{
  "code": "17415"
}
```

obteniendo:

```json
{
  "success": true,
  "message": "El codigo ha sido validado correctamente."
}
```


## Distancia entre Coordenadas GeoGraficas

Esta utilidad no requiere autenticacion. Su documentaion puede encontrarse en: http://localhost:3000/api/docs/#/Geo/UtilController_distance

Para probar las valoraiones del servicio se realiza un solicitud post.

### Formato de Coordenadas

Las coordenadas geograficas se representan como una Tupla de dos valores la longitud y la latitud geografica.

En el codigo intente representar lo mas apegado al RFC7946, que tambien es el estandar seguido por Mongo, en este estandar la tupla se interpreta con la longitud como primer valor y la latitud como segundo valor. Sin embargo Google Map, al copiar las cordenada, lo hace en formato inverso o sea la latitud seguida de la longitud. Por comodidad el APi maneja los dos Formatos mediante la propiedad **`format`** se debe especificar cual se usara. Sim embargo por defecto se usa RFC7946.

* RFC7946: `[longitud, latitud]`
* GOOGLE: `[latitud, longitud]`

### Incluir Retorno

Para el retorno existen 3 Methodos:

* `NA`: No aplica. Indica que solo se hará valoracion de la ruta. En este caso si se quiere valora el retorno se debe incluir en los puntos de coordenadas como un circuito o anillo.

* `DIRECTO`: En este caso el retorno se se hace con el recorrido directo desde el ultimo punto de la ruta, al primero.

* `REVERSO`: En este caso se supone que el retorno se hace por la misma ruta en sentido contrario. Lo que implica que se duplica la distancia.

### La ruta:

La ruta no es mas que un arreglo de coorenadas que se recorreran en el orden establecido, desde la primera hasta la ultima.

### Resultados.

Los campos ida, regreso y total son distancias y estan medidas en metros.

Los campos valorIda, valorRegreso, valorTotal estan en pesos colombianos.

```json
{
  "ida": 158.94315593904255,
  "valorIda": 635.7726237561702,
  "regreso": 0,
  "valorRegreso": 0,
  "total": 158.94315593904255,
  "valorTotal": 635.7726237561702
}
```

### Ejemplos:

#### Ejemplo 1

Vaoracion entre dos puntos ubicaso muy cerca.

> `POST http://localhost:3000/api/v1/util/geo/valoracion`

```json
{
  "ruta": [
    [ -75.61926018560465, 6.14602421083569 ],
    [ -75.6178654369789,  6.146370893726194]
  ],
  "retorno": "NA",
  "format": "RFC7946"
}
```

Resultado:

```json
{
  "ida": 158.94315593904255,
  "valorIda": 635.7726237561702,
  "regreso": 0,
  "valorRegreso": 0,
  "total": 158.94315593904255,
  "valorTotal": 635.7726237561702
}
```

#### Ejemplo 2

Distancia entre 7 puntos.

> `POST http://localhost:3000/api/v1/util/geo/valoracion`
```
{ 
  "ruta": [
	[6.153256870754677, -75.6180254998653],
	[6.155006259852561, -75.61394854234388],
	[6.15432357210934, -75.60978575413779],
	[6.158249014651819, -75.60871287057954],
	[6.16552674878321, -75.61286173491115],
	[6.16380158489308, -75.61878182164247],
	[6.159387169400164, -75.61694455334653]
  ],
  "format": "GOOGLE",
  "retorno": "NA"
}
```

Resultado:

```json
{
  "ida": 3553.086004805875,
  "valorIda": 14212.3440192235,
  "regreso": 0,
  "valorRegreso": 0,
  "total": 3553.086004805875,
  "valorTotal": 14212.3440192235
}
```

#### Ejemplo 3

Distancia entre 7 puntos, Con retorno directo

> `POST http://localhost:3000/api/v1/util/geo/valoracion`
```
{ 
  "ruta": [
	[6.153256870754677, -75.6180254998653],
	[6.155006259852561, -75.61394854234388],
	[6.15432357210934, -75.60978575413779],
	[6.158249014651819, -75.60871287057954],
	[6.16552674878321, -75.61286173491115],
	[6.16380158489308, -75.61878182164247],
	[6.159387169400164, -75.61694455334653]
  ],
  "format": "GOOGLE",
  "retorno": "DIRECTO"
}
```

Resultado:

```json
{
  "ida": 3553.086004805875,
  "valorIda": 14212.3440192235,
  "regreso": 692.0539343064313,
  "valorRegreso": 2768.215737225725,
  "total": 4245.139939112306,
  "valorTotal": 16980.559756449224
}
```

#### Ejemplo 4

Distancia entre 7 puntos, Con retorno reverso.

> `POST http://localhost:3000/api/v1/util/geo/valoracion`
```
{ 
  "ruta": [
	[6.153256870754677, -75.6180254998653],
	[6.155006259852561, -75.61394854234388],
	[6.15432357210934, -75.60978575413779],
	[6.158249014651819, -75.60871287057954],
	[6.16552674878321, -75.61286173491115],
	[6.16380158489308, -75.61878182164247],
	[6.159387169400164, -75.61694455334653]
  ],
  "format": "GOOGLE",
  "retorno": "REVERSO"
}
```

Resultado:

```json
{
  "ida": 3553.086004805875,
  "valorIda": 14212.3440192235,
  "regreso": 3553.086004805875,
  "valorRegreso": 14212.3440192235,
  "total": 7106.17200961175,
  "valorTotal": 28424.688038447
}
```

