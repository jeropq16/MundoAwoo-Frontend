# Mundo Awoo

## Encuentro con parceros

`/encuentros` permite a cuentas autenticadas crear una sala y compartir su código de 12 caracteres. Hasta seis personas ven sus avatares guardados, conversan y sincronizan las acciones Relax, Saludar y Bailar. El avatar se carga desde el backend al entrar; para cambiar ropa o apariencia, sal de la sala, personalízalo y vuelve a entrar.

El cliente oficial de SignalR conecta con `/api/encuentros` a través del proxy existente de Next. Usa Long Polling con JWT en la cabecera (sin tokens en la URL), renovación de sesión y reconexión automática. No requiere variables nuevas ni servicios de pago. La implementación sigue entidades en `domain`, transporte en `data/repositories/encuentros`, token en `security` y vista/viewmodel separados.

Las salas son temporales en memoria de una única instancia del backend. Conservan como máximo 100 mensajes de 500 caracteres y desaparecen cuando quedan vacías o se reinicia la API. Una desconexión abrupta puede tardar unos segundos en retirar al participante. Si la sala desapareció durante una desconexión, hay que crear otra. Para desplegar varias instancias hará falta un almacén compartido y coordinación de mensajes; esta versión no implementa historial permanente, voz, moderación ni lista de amigos.

Prueba manual: abre dos sesiones independientes (por ejemplo, ventana normal e incógnito), inicia sesión con cuentas diferentes, crea una sala en una y pega su código en la otra. Comprueba mensajes en ambos sentidos, baile y salida de participantes. En otro dispositivo, utiliza la dirección de red del frontend; `localhost` solo funciona en el mismo equipo. El acceso desde Internet necesita desplegar ambos servicios.

Referencia del transporte: [cliente JavaScript oficial de SignalR](https://learn.microsoft.com/aspnet/core/signalr/javascript-client?view=aspnetcore-9.0).

Estudio de avatar 3D en Next.js, React, Three.js y React Three Fiber. La portada y `/avatar` usan la misma experiencia: Ghetto Boy y La Ghetto Queen, ropa y accesorios, baile y saludo articulados, pausa y cámara orbital. `/laboratorio-3d` redirige a la portada.

El modo invitado permite probar piezas durante la visita. Con una cuenta, el personaje, la bomber de cada personaje, el color del ambiente y el equipamiento se recuperan desde la API y se guardan al cambiar. La cámara y las acciones rápidas pertenecen a la sesión de visualización.

## Arranque local

1. Aplica las migraciones del backend (incluida `EstudioPrincipal3D`) e inicia MundoAwoo.Api con su configuración de MySQL y JWT.
2. Copia `.env.example` a `.env` y ajusta `API_BASE_URL` a la dirección del backend. El perfil HTTP local usa el puerto 5064.
3. Ejecuta `npm ci` y `npm run dev`. Abre http://localhost:3000.

Next reenvía las peticiones de `/api` al backend. Reinicia Next después de cambiar la URL. Para producción, configura la variable antes de compilar. Ejecuta `npm run lint` y `npm run build` para verificar el proyecto.

## Capas

- `src/app` compone rutas y el layout común.
- `src/domain/entities` define los tipos del dominio, incluidas categorías y ranuras.
- `src/data/api.ts` envía JSON y traduce respuestas ProblemDetails. Los repositorios agrupan las operaciones por módulo.
- `src/security` gestiona la sesión por pestaña, la renovación del token y el acceso administrativo. El backend valida permisos en cada operación administrativa.
- `src/presentation/pages` separa cada vista de su hook de lógica en `viewmodel`. Login y registro comparten formulario. El proveedor de alertas y el encabezado son comunes.

## Contrato HTTP

Todas las rutas de la tabla llevan el prefijo `/api`. Las operaciones de perfil, avatar e inventario usan el token Bearer. El catálogo de consulta es público.

| Método y ruta | Entrada | Respuesta correcta |
| --- | --- | --- |
| POST autenticacion/registro | correo, contrasena, nombreVisible | 201 Sesion |
| POST autenticacion/login | correo, contrasena | 200 Sesion |
| POST autenticacion/refresh | refreshToken | 200 Sesion con tokens nuevos |
| POST autenticacion/cerrar-sesion | refreshToken | 204 |
| GET perfil | — | Perfil |
| PUT perfil | nombreVisible, biografia | Perfil |
| GET avatar | — | Avatar |
| PUT avatar/color | colorFondo en formato #RRGGBB | Avatar |
| PUT avatar/estilo3d | personaje3D, chaquetaGhetto, chaquetaQueen | Avatar |
| PUT avatar/apariencia3d | personaje3D, pelo, barba, tatuajes, colorCabello | Avatar |
| POST avatar/items/{itemId}/equipar | identificador en la ruta | Avatar |
| DELETE avatar/items/{itemId}/desequipar | identificador en la ruta | 204 |
| GET catalogo/categorias | — | Categoria[] |
| GET catalogo/items | categoriaId obligatorio en la consulta | Item[] |
| GET inventario | — | Desbloqueo[] |
| POST admin/catalogo/categorias | nombre, tipo | 201 Categoria |
| POST admin/catalogo/items | nombre, categoriaId, ranura, recursoVisual | 201 Item |
| POST inventario/items/{itemId}/desbloquear | usuarioId y el itemId de la ruta | Desbloqueo |

Las tres últimas operaciones requieren administrador. El JWT y el perfil actuales no exponen el rol. El enlace de administración está en el perfil y una denegación del servidor aparece como alerta.

## Escena y prendas 3D

Los modelos procedurales y su rig están en `src/presentation/components/avatar3d`. El estudio usa el inventario y las categorías de la API; no carga las imágenes del antiguo visor 2D. Los identificadores de modelos disponibles para `recursoVisual` son:

| Recurso | Ranura |
| --- | --- |
| `awoo3d:bomber` | Torso |
| `awoo3d:gorra` | Cabeza |
| `awoo3d:lentes` | Ojos |
| `awoo3d:cadena` | Cuello |
| `awoo3d:pantalon` | Piernas |
| `awoo3d:zapatillas` | Pies |
| `awoo3d:baile` | Animacion (categoría Baile) |
| `awoo3d:saludo` | Animacion (categoría Gesto) |

Se reconocen las rutas históricas de la bomber, gorra, lentes y movimientos de muestra para no romper los ítems existentes. Otros recursos se identifican como pendientes de versión 3D y no se pueden equipar desde el estudio; los que ya estaban equipados se pueden quitar. Añadir modelos implica ampliar `recursos3d.ts` y su representación en `Personaje.tsx`, conservando la ranura correspondiente.

La bomber incluida es una opción base disponible en ambos personajes. Si hay una chaqueta del inventario equipada, prevalece sobre la bomber y se cambia desde el vestidor. El inventario sigue exigiendo desbloqueo; la opción base no concede ítems. Las acciones rápidas no cambian el equipamiento guardado. La pausa congela la pose y se respeta la preferencia del sistema de reducir movimiento.

El visor requiere WebGL. Si no puede iniciarse, muestra un aviso y ofrece reintentar. La cámara permite arrastrar, acercar con rueda/pellizco y usar Frente, Perfil y Espalda.

## Identidad visual

La interfaz conserva la paleta carbón, rojo y crema y las tipografías locales. `colorFondo` controla la luz y el aro del escenario 3D. La vista se adapta a escritorio y móvil. El renderizador 2D y PixiJS fueron retirados; los recursos gráficos históricos se conservan como archivos de referencia, sin cargarse en el estudio.

## Pelo, barba y tatuajes

El panel «Pelo, barba y tinta» configura cada personaje de forma independiente, incluso al cambiar entre Ghetto Boy y La Ghetto Queen. Los cortes disponibles son original, rapado, fade, trenzas y cresta. Las barbas son original, afeitado, candado, completa y bigote. Los tatuajes admiten ninguno, geometrico, estrellas y blackwork; se aplican al cuello y a los brazos con mapas de tinta transparentes sobre las mallas de piel. No se muestran a través de la chaqueta. Al equipar una gorra, se oculta el pelo para evitar cruces entre las geometrías, conservando la selección.

El color del pelo y la barba es compartido. La cámara «Rostro» acerca los detalles; «Frente», «Perfil» y «Espalda» vuelven al cuerpo completo. Los tatuajes siguen las articulaciones al bailar y las texturas se liberan al cambiar de diseño. Los invitados prueban cambios durante la visita; las cuentas los guardan mediante la API. Aplica la migración del backend `AparienciaPersonajes3D` antes de usar esta versión.
