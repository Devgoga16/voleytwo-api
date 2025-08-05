# VolleyFund API

API REST para sistema de gestión financiera de equipos de volleyball desarrollada con Node.js, Express y MongoDB.

## 🚀 Características

- ✅ CRUD completo de transacciones financieras
- ✅ Validación robusta con express-validator
- ✅ Documentación automática con Swagger
- ✅ Manejo de errores centralizado
- ✅ Logging de requests
- ✅ Configuración CORS
- ✅ Paginación y filtros
- ✅ Estadísticas financieras

## 📋 Requisitos Previos

- Node.js (v14 o superior)
- MongoDB (local o MongoDB Atlas)
- npm o yarn

## 🛠️ Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone <repository-url>
   cd voleytwo-api
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno:**
   
   Copiar `.env` y configurar:
   ```env
   MONGODB_URI=mongodb://localhost:27017/voleyfund
   PORT=3000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   ```

4. **Iniciar MongoDB:**
   
   Si usas MongoDB local:
   ```bash
   mongod
   ```

5. **Ejecutar la aplicación:**
   
   Desarrollo:
   ```bash
   npm run dev
   ```
   
   Producción:
   ```bash
   npm start
   ```

## 📚 Documentación API

Una vez iniciado el servidor, accede a:
- **Swagger UI:** http://localhost:3000/api-docs
- **JSON Spec:** http://localhost:3000/api-docs.json

## 🔗 Endpoints Principales

### Transacciones

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/Transaction` | Crear nueva transacción |
| `GET` | `/api/Transaction/list` | Listar todas las transacciones |
| `GET` | `/api/Transaction/:id` | Obtener transacción por ID |
| `GET` | `/api/Transaction/stats/summary` | Obtener estadísticas |

### Otros

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `GET` | `/` | Información de la API |

## 📊 Ejemplos de Uso

### Crear Transacción

```bash
curl -X POST http://localhost:3000/api/Transaction \
  -H "Content-Type: application/json" \
  -d '{
    "createdAt": "2025-08-04T10:30:00.000Z",
    "transactionType": 1,
    "amount": 150.75,
    "details": "Pago de cuotas mensuales"
  }'
```

### Listar Transacciones

```bash
curl http://localhost:3000/api/Transaction/list?page=1&limit=10&sortBy=createdAt&order=desc
```

### Obtener Estadísticas

```bash
curl http://localhost:3000/api/Transaction/stats/summary
```

## 🏗️ Estructura del Proyecto

```
voleytwo-api/
├── config/
│   ├── database.js      # Configuración MongoDB
│   └── swagger.js       # Configuración Swagger
├── controllers/
│   └── transactionController.js
├── middleware/
│   ├── errorHandler.js  # Manejo de errores
│   └── validators.js    # Validaciones
├── models/
│   └── Transaction.js   # Modelo de transacción
├── routes/
│   └── transactions.js  # Rutas de transacciones
├── .env                 # Variables de entorno
├── package.json
├── server.js           # Punto de entrada
└── README.md
```

## 📱 Schema de Transacción

```javascript
{
  _id: ObjectId,          // Auto-generado
  createdAt: Date,        // Fecha de creación
  transactionType: Number, // 1=Ingreso, 2=Egreso
  amount: Number,         // Monto (decimal)
  details: String         // Descripción
}
```

## 🔧 Variables de Entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `MONGODB_URI` | URI de conexión MongoDB | `mongodb://localhost:27017/voleyfund` |
| `PORT` | Puerto del servidor | `3000` |
| `NODE_ENV` | Entorno de ejecución | `development` |
| `FRONTEND_URL` | URL del frontend para CORS | `http://localhost:3000` |

## 🚀 Despliegue

### Heroku

1. Crear aplicación en Heroku
2. Configurar variables de entorno
3. Conectar con MongoDB Atlas
4. Deploy desde Git

### Railway

1. Conectar repositorio
2. Configurar variables de entorno
3. Deploy automático

### Otros servicios

La API es compatible con cualquier servicio que soporte Node.js.

## 🧪 Testing

Para probar los endpoints puedes usar:
- **Postman:** Importa la colección desde Swagger
- **cURL:** Ejemplos incluidos en esta documentación
- **Swagger UI:** Interfaz web interactiva

## 🐛 Debugging

Los logs incluyen:
- Requests HTTP con timestamps
- Errores detallados en desarrollo
- Estado de conexión MongoDB
- Operaciones de base de datos

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 🆘 Soporte

Si tienes problemas:
1. Revisa los logs del servidor
2. Verifica la conexión a MongoDB
3. Consulta la documentación Swagger
4. Abre un issue en GitHub

---

Desarrollado con ❤️ para la comunidad de volleyball 🏐
