const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'VolleyFund API',
    version: '1.0.0',
    description: 'API REST para sistema de gestión financiera de equipos de volleyball',
    contact: {
      name: 'VolleyFund Team',
      email: 'support@voleyfund.com'
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT'
    }
  },
  servers: [
    {
      url: 'http://localhost:3001',
      description: 'Servidor de desarrollo'
    },
    {
      url: 'https://voleyapi.somee.com',
      description: 'Servidor de producción'
    }
  ],
  tags: [
    {
      name: 'Transactions',
      description: 'Operaciones relacionadas con transacciones financieras'
    }
  ]
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'], // Rutas donde están las definiciones de Swagger
};

const swaggerSpec = swaggerJSDoc(options);

const swaggerUiOptions = {
  explorer: true,
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .info .title { color: #2c3e50; }
    .swagger-ui .scheme-container { background: #f8f9fa; padding: 20px; border-radius: 5px; }
  `,
  customSiteTitle: "VolleyFund API Documentation",
  customfavIcon: "/assets/favicon.ico"
};

module.exports = {
  swaggerSpec,
  swaggerUi,
  swaggerUiOptions
};
