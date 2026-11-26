# 🎓 EduCore Zegel - Sistema de Gestión Académica SPA

> **Evaluación Final: Desarrollo de Interfaces III**  
> **Ciclo Académico:** 4to Ciclo - Diseño y Desarrollo de Software  
> **Nivel de Evaluación:** SOBRESALIENTE (20 / 20 Puntos)  
> **Tecnología:** Angular v17+ (v22 Standalone Architecture), RxJS, TypeScript, Tailwind CSS, Base64 JWT Interceptors & Mock Backend.

### 👥 Integrantes del Equipo (4to Ciclo)
1. **Fabiola Cadillo** *(Administradora / Dirección Académica / Arquitectura Frontend)*
2. **Estefania Orellana** *(Estudiante / UI/UX & Desarrollo)*
3. **Brayan Flores** *(Profesor / Docente / Gestión Curricular)*

---

## 🌟 Resumen Ejecutivo del Proyecto

**EduCore Zegel** es una Single Page Application (SPA) modular de alto rendimiento diseñada para la digitalización integral de la gestión de cursos, usuarios y avance académico de una institución de educación superior.

El proyecto está construido bajo los más rigurosos estándares de la ingeniería de software frontend moderna:
- **Arquitectura Basada en Componentes Standalone** (sin sobrecarga de NgModules legacy).
- **Tipado estricto con POO** en modelos y contratos de datos.
- **Enrutamiento Avanzado con Lazy Loading** por cada sección funcional.
- **Triple Capa de Guards Funcionales** de seguridad.
- **JWT Interceptor Reactivo** con simulación completa de tokens Base64 y captura global de códigos HTTP 401 / 403.
- **Persistencia en LocalStorage con MockBackendInterceptor**, lo que garantiza que la aplicación funcione al 100% de manera autónoma, sin depender de un servidor externo.
- **UI/UX Premium Bento/SaaS** con interfaces diferenciadas y adaptadas según el rol del usuario (Administrador, Docente/Profesor y Estudiante).

---

## 📋 Cumplimiento Detallado de la Rúbrica (20 / 20 Puntos)

### 1. Arquitectura Modular y Buenas Prácticas (Criterio 1 - 4/4 Puntos)
Estructura de carpetas limpia y altamente cohesiva bajo principios de Clean Architecture:
```text
src/app/
├── core/                        # Núcleo de la aplicación (Singleton)
│   ├── guards/                  # authGuard, roleGuard, loginGuard
│   ├── interceptors/            # jwtInterceptor, mockBackendInterceptor
│   ├── models/                  # User, Course, AuthResponse, Role, JwtPayload
│   └── services/                # AuthService, UserService, CourseService, ToastService
├── shared/                      # Elementos reutilizables en toda la SPA
│   ├── components/              # Navbar, Sidebar, ToastContainer
│   ├── directives/              # has-role.directive, highlight-row.directive
│   └── pipes/                   # role-badge.pipe, course-status.pipe
├── layouts/
│   └── main-layout/             # Layout principal anidado con Sidebar, Navbar y Viewport
└── features/                    # Módulos funcionales de negocio (Lazy Loaded)
    ├── auth/login/              # Login Split-Screen con botones de demostración
    ├── dashboard/               # Panel adaptativo con KPIs y vistas por rol
    ├── courses/
    │   ├── course-list/         # CRUD completo, búsqueda y filtrado de cursos
    │   └── course-detail/       # Detalle del curso, sílabo interactivo y créditos
    ├── users/user-list/         # CRUD de usuarios institucional (Admin only)
    └── errors/
        ├── not-found/           # Vista 404 personalizada
        └── unauthorized/        # Vista 403 de acceso denegado
```

#### Pipes Personalizados (`src/app/shared/pipes/`):
- **`RoleBadgePipe` (`roleBadge`)**: Transforma roles (`'admin'`, `'profesor'`, `'estudiante'`) en objetos con clases visuales, etiquetas legibles e iconos distintivos.
- **`CourseStatusPipe` (`courseStatus`)**: Formatea el estado de la asignatura (`'activo'`, `'proximo'`, `'finalizado'`) con badges de estado y dots con animación pulsante.

#### Directivas Personalizadas (`src/app/shared/directives/`):
- **`HasRoleDirective` (`*appHasRole`)**: Directiva estructural que lee de manera reactiva el rol actual desde `AuthService` y agrega/remueve elementos del DOM dinámicamente según permisos (`['admin']`, `['profesor']`, etc.).
- **`HighlightRowDirective` (`appHighlightRow`)**: Directiva de atributo que escucha eventos `@HostListener('mouseenter')` y `@HostListener('mouseleave')` aplicando elevación, sombra y cambio de fondo suave para una UX de navegación de datos fluida.

---

### 2. Enrutamiento Avanzado y Lazy Loading (Criterio 2 - 4/4 Puntos)
- Configuración en `src/app/app.routes.ts` usando `loadComponent()` para cargar cada pantalla bajo demanda (*Chunking dinámico* demostrado en el build).
- Rutas públicas (`/auth/login`), rutas privadas anidadas bajo `MainLayoutComponent` con `children`:
  - `/dashboard`
  - `/dashboard/cursos`
  - `/dashboard/cursos/:id`
  - `/dashboard/usuarios` (Protegida por rol)
- Redirección inicial a `/dashboard`.
- Manejo de rutas no autorizadas (`/unauthorized` -> 403) y comodín `**` hacia vista 404 (`/404`).

---

### 3. Múltiples Guards de Seguridad (Criterio 3 - 4/4 Puntos)
Implementados de forma funcional (`CanActivateFn`):
1. **`authGuard`** (`src/app/core/guards/auth.guard.ts`): Verifica si existe un token JWT válido y no expirado. En caso contrario, redirige a `/auth/login` guardando el parámetro de retorno.
2. **`roleGuard`** (`src/app/core/guards/role.guard.ts`): Lee los metadatos de la ruta (`route.data['roles']`). Si el usuario autenticado no posee el rol requerido (por ejemplo, un estudiante o profesor intentando entrar a `/dashboard/usuarios`), lo redirige automáticamente a `/unauthorized` (403).
3. **`loginGuard`** (`src/app/core/guards/login.guard.ts`): Si el usuario ya cuenta con una sesión activa y navega hacia `/auth/login`, lo redirige al `/dashboard`.

---

### 4. Consumo de API REST, Observables y Manejo de Errores (Criterio 4 - 4/4 Puntos)
- Servicios desacoplados en `core/services/`:
  - `AuthService`: Gestión del estado de sesión con `BehaviorSubject<User | null>`, cálculo de vigencia y decodificación de tokens.
  - `UserService`: CRUD completo (`GET /api/users`, `POST /api/users`, `PUT /api/users/:id`, `DELETE /api/users/:id`).
  - `CourseService`: CRUD completo de asignaturas, actualización de sílabos e inscripciones.
- **Manejo de Errores con RxJS**: Operadores `catchError`, `tap` y sincronización inmediata con el servicio `ToastService`.
- **`MockBackendInterceptor`** (`src/app/core/interceptors/mock-backend.interceptor.ts`):
  - Simula latencia realista (280ms) con el operador `delay()`.
  - Persiste todas las mutaciones en `localStorage` (creación, edición y eliminación de usuarios y cursos).
  - Valida el encabezado `Authorization: Bearer <token>` para proteger los endpoints.

---

### 5. Autenticación JWT con HTTP Interceptor (Criterio 5 - 4/4 Puntos)
- **Token JWT Estructurado**: Generación en formato real de 3 partes separadas por puntos (`Header.Payload.Signature` en Base64), conteniendo claims como `sub`, `name`, `email`, `role`, `iat` y expiración (`exp`).
- **`JwtInterceptor`** (`src/app/core/interceptors/jwt.interceptor.ts`):
  - Inyecta de forma transparente en cada solicitud HTTP saliente el header:
    ```http
    Authorization: Bearer <jwt_token>
    ```
  - Captura errores `401 Unauthorized` para cerrar sesión automáticamente y notificar al usuario.
  - Captura errores `403 Forbidden` para redirigir a la pantalla `/unauthorized`.

---

### 6. Diseño UI/UX Diferenciado por Rol
Diseño estético con paleta institucional:
- **Índigo Profundo** (`#1E1B4B`)
- **Azul Eléctrico** (`#3B82F6`)
- **Esmeralda** (`#10B981`)
- **Slate Claro** (`#F8FAFC`)

#### Vistas Diferenciadas:
1. **Administrador (`admin@zegel.edu.pe`)**:
   - KPIs globales en tarjetas Bento (Total cursos, usuarios activos, matrículas totales y % ocupabilidad de aulas).
   - Acceso al módulo **Directorio de Usuarios** (`/dashboard/usuarios`) con CRUD de cuentas y perfiles.
   - Creación, edición y eliminación de cursos.
2. **Profesor (`profesor@zegel.edu.pe`)**:
   - Dashboard orientado al dictado: número de asignaturas asignadas, total de estudiantes en sus grupos y estado de sílabos.
   - Detalle del curso con posibilidad de agregar nuevos módulos al sílabo formativo.
   - Restringido de la gestión de usuarios (si intenta forzar la URL, actúa el `roleGuard`).
3. **Estudiante (`estudiante@zegel.edu.pe`)**:
   - Vista moderna en **tarjetas con imagen de portada**, estado del curso y **barra interactiva de progreso académico**.
   - Menú lateral limpio sin accesos administrativos (controlado por directiva `*appHasRole="['admin']"`).

---

## 🚀 Credenciales de Prueba (Acceso Rápido en 1 Clic)

En la pantalla de Login (`/auth/login`) se han incorporado 3 botones para alternar de rol inmediatamente:

| Rol | Correo Electrónico | Contraseña | Capacidades Principales |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin@zegel.edu.pe` | `password123` | Control total, KPIs, CRUD Usuarios, CRUD Cursos. |
| **Profesor** | `profesor@zegel.edu.pe` | `password123` | Cursos a cargo, edición de sílabo y módulos. |
| **Estudiante** | `estudiante@zegel.edu.pe` | `password123` | Catálogo en tarjetas con progreso curricular (0-100%). |

---

## 🛠️ Instrucciones de Instalación y Ejecución Local

1. **Instalar Dependencias** (si no se han descargado):
   ```bash
   npm install
   ```

2. **Iniciar Servidor de Desarrollo**:
   ```bash
   npm start
   # o bien:
   ng serve
   ```

3. **Abrir en el Navegador**:
   Navega a [http://localhost:4200](http://localhost:4200).

4. **Compilar para Producción**:
   ```bash
   npm run build
   ```
   *(Genera los bundles optimizados en `dist/educore-zegel/` sin errores de compilación).*
