# MundoAwoo Frontend

Proyecto Next.js con React y TypeScript. Esta primera entrega contiene únicamente el proyecto base y la estructura de carpetas. No hay consumo de API, vistas funcionales, autenticación ni lógica de negocio.

## Organización

- `src/app`: rutas de Next.js agrupadas en públicas, privadas y administrativas. Las rutas futuras están vacías; solo `/` tiene una página provisional para comprobar que el proyecto arranca.
- `src/domain/entities`: espacio para las entidades del negocio.
- `src/data/dto`: espacio para los tipos de entrada y respuesta de la API.
- `src/data/repositories`: espacio para el acceso a los endpoints, separado por módulo.
- `src/data/api.ts`: lugar reservado para el cliente HTTP compartido.
- `src/presentation/pages`: cada página tendrá `view` para la interfaz y `viewmodel` para la lógica.
- `src/presentation/components`: componentes comunes, de alertas y de layout.
- `src/presentation/hooks`, `providers` y `layouts`: responsabilidades compartidas de la presentación.
- `src/security`: futuro manejo de sesión, acceso y roles.
- `src/styles`: estilos compartidos para mantener una misma línea visual y facilitar el diseño adaptable.

## Módulos previstos según el backend

| Módulo | Endpoints del backend |
| --- | --- |
| Autenticación | registro, login, refresh, cerrar sesión |
| Perfil | consultar, actualizar |
| Avatar | consultar, cambiar color, equipar, desequipar |
| Catálogo | categorías, ítems |
| Inventario | consultar, desbloquear ítem (administrador) |
| Administración del catálogo | crear categoría, crear ítem |

La URL base de la API está preparada en `.env.example`. Copia ese archivo a `.env.local` si necesitas otra URL local. Ninguna petición se realiza todavía.

## Arranque

```bash
npm install
npm run dev
```
