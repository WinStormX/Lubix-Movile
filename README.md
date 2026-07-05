# Lubix

Plataforma de comercio electrónico compuesta por una **app móvil** (React Native / Expo) y un **backend** (FastAPI + PostgreSQL).

Desarrollado por **El Equipo De Lubix**.

---

## 📱 Frontend Móvil — `Lubix-Page/`

App móvil desarrollada con **React Native** + **Expo SDK 54**, utilizando **Expo Router** para navegación basada en archivos.

### Tecnologías

| Tecnología | Uso |
|---|---|
| React Native 0.81 | Framework mobile |
| Expo ~54 | Plataforma y tooling |
| Expo Router 6 | Navegación file-based |
| TypeScript ~5.9 | Tipado estático |
| Axios | Cliente HTTP |
| AsyncStorage | Almacenamiento local de sesión |
| @expo/vector-icons | Iconografía (Ionicons) |

### Estructura

```
Lubix-Page/
├── app/                    # Pantallas (file-based routing)
│   ├── _layout.tsx         # Layout raíz con AuthProvider
│   ├── (tabs)/
│   │   ├── _layout.tsx     # Bottom tab navigator
│   │   └── Index.tsx       # Home / Landing
│   ├── Index.tsx           # Redirección a (tabs)/Index
│   ├── Login.tsx           # Inicio de sesión
│   ├── register.tsx        # Registro de usuario
│   ├── verify-code.tsx     # Verificación de correo
│   └── new-password.tsx    # Recuperación de contraseña
├── api/
│   └── axios.tsx           # Cliente Axios con interceptors JWT
├── components/             # Componentes reutilizables
├── constants/
│   └── theme.ts            # Colores y fuentes
├── context/
│   └── AuthContext.tsx      # Estado global de autenticación
└── types/
    └── auts.ts             # Interfaces TypeScript
```

### Funcionalidades

- Landing con catálogo de productos y categorías
- Registro de usuarios con validaciones
- Inicio de sesión con JWT
- Verificación de correo electrónico (código 6 dígitos)
- Recuperación de contraseña
- Sesión persistente con AsyncStorage
- Interceptor automático de token JWT en cada petición
- Diseño oscuro (dark mode) consistente

### Ejecutar

```bash
cd Lubix-Page
npm install
npx expo start
```

---

## 🖥️ Backend — `lubix-backend/`

API REST construida con **FastAPI** + **SQLAlchemy** + **PostgreSQL**, con autenticación JWT, almacenamiento en **MinIO** y envío de correos SMTP.

### Tecnologías

| Tecnología | Uso |
|---|---|
| Python 3.13 | Lenguaje principal |
| FastAPI | Framework REST |
| Uvicorn | Servidor ASGI |
| SQLAlchemy 2.0 | ORM |
| Alembic | Migraciones |
| PostgreSQL | Base de datos |
| Pydantic v2 | Validación de schemas |
| python-jose | JWT |
| bcrypt / Argon2 | Hash de contraseñas |
| MinIO | Almacenamiento de archivos |
| Docker / Compose | Contenerización |
| SMTP (Gmail) | Envío de correos |
| UV | Gestión de dependencias |

### Estructura

```
lubix-backend/
├── app/
│   ├── main.py                # Punto de entrada FastAPI
│   ├── Config.py              # Configuración central
│   ├── database/
│   │   └── Connection.py      # Conexión PostgreSQL
│   ├── middleware/
│   │   ├── AuthMiddleware.py  # Middleware de autenticación
│   │   └── CorsMiddleware.py  # CORS
│   ├── models/
│   │   ├── ModelUser.py
│   │   ├── ModelCompany.py
│   │   ├── ModelProduct.py
│   │   ├── ModelRole.py
│   │   ├── ModelCode.py
│   │   └── ModelRefreshToken.py
│   ├── routers/
│   │   ├── AuthRouters.py     # Auth (login, register, verify, forgot-password)
│   │   ├── CompanyRouter.py   # CRUD empresas/productos
│   │   ├── CardRouters.py     # Tarjetas
│   │   └── HealthRouter.py    # Health check
│   ├── schemas/
│   │   ├── SchemaAuthUser.py
│   │   ├── SchemaAuthCompany.py
│   │   ├── SchemaProduct.py
│   │   └── dashboard/
│   ├── services/
│   │   ├── authentication/
│   │   │   ├── AuthService.py
│   │   │   └── JWTService.py
│   │   ├── CompanyServices/
│   │   │   ├── Dasboard.py
│   │   │   └── Products.py
│   │   ├── email/
│   │   │   ├── EmailService.py
│   │   │   └── template/      # Templates HTML
│   │   └── NasService.py      # MinIO
│   └── utils/
│       ├── Security.py
│       ├── seed.py
│       └── Config.py
├── alembic/                   # Migraciones
├── docker-compose.yml
├── Dockerfile
└── pyproject.toml
```

### Funcionalidades

- CRUD completo de usuarios, empresas y productos
- Autenticación con JWT + Refresh Tokens
- Registro con verificación por correo electrónico
- Recuperación de contraseña
- Middleware de autenticación global
- Almacenamiento de archivos en MinIO (imágenes, documentos)
- Migraciones automáticas con Alembic
- Seed de datos para desarrollo
- Docker Compose con PostgreSQL + MinIO + Backend
- Documentación automática en `/docs`

### Ejecutar con Docker

```bash
cd lubix-backend
cp .env.example .env      # Configurar variables
docker compose build
docker compose up -d
docker compose exec backend uv run alembic upgrade head
```

Acceder a la documentación: [http://127.0.0.1:8001/docs](http://127.0.0.1:8001/docs)

---

## 🔗 Endpoints principales

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/auth/register-user` | Registro de usuario |
| POST | `/auth/login-user` | Inicio de sesión |
| POST | `/auth/verify-email-user` | Verificar código |
| POST | `/auth/forgot-password-user` | Recuperar contraseña |
| GET | `/health` | Health check |

---

## ⚙️ Variables de entorno (Backend)

```
DATABASE_URL=postgresql://user:pass@db:5432/lubix
SECRET_KEY=<jwt-secret>
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=tu-correo@gmail.com
SMTP_PASSWORD=tu-contraseña
MINIO_ROOT_USER=admin
MINIO_ROOT_PASSWORD=admin123
RUN_SEED=False
```
