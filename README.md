# Mundo Awoo

Estudio de avatar 2D en Next.js, React y PixiJS. En la portada se puede probar el lobo como invitado. Las piezas de muestra solo viven en esa vista. Al iniciar sesión, el estudio carga el avatar y el inventario de la cuenta.

## Arranque local

1. Inicia MundoAwoo.Api con su configuración de MySQL y JWT.
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
| POST avatar/items/{itemId}/equipar | identificador en la ruta | Avatar |
| DELETE avatar/items/{itemId}/desequipar | identificador en la ruta | 204 |
| GET catalogo/categorias | — | Categoria[] |
| GET catalogo/items | categoriaId obligatorio en la consulta | Item[] |
| GET inventario | — | Desbloqueo[] |
| POST admin/catalogo/categorias | nombre, tipo | 201 Categoria |
| POST admin/catalogo/items | nombre, categoriaId, ranura, recursoVisual | 201 Item |
| POST inventario/items/{itemId}/desbloquear | usuarioId y el itemId de la ruta | Desbloqueo |

Las tres últimas operaciones requieren administrador. El JWT y el perfil actuales no exponen el rol. El enlace de administración está en el perfil y una denegación del servidor aparece como alerta.

## Escena

El visor coloca las imágenes por ranura sobre el lobo. Para ropa y accesorios, usa una URL de imagen accesible desde el navegador o una ruta de un archivo servido por el frontend, como `/piezas/poncho.svg`. Si el recurso se aloja en otro origen, ese servidor debe permitir la carga de texturas mediante CORS. Los gestos y bailes usan movimientos locales por tipo y comparten la ranura Animacion. Los botones de acciones rápidas permiten probar movimientos sin cambiar el equipamiento guardado.
