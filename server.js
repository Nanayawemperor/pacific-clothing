const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config(); // Ensure dotenv is configured
const createError = require('http-errors');

const app = express();
const mongodb = require('./data/database');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const port = process.env.PORT || 10000;

// ✅ Swagger Setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Pacific Clothing API',
      version: '1.0.0',
      description: 'API for managing Pacific Clothing data'
    },
    servers: [
      { url: `http://localhost:${port}` }
    ]
  },
  apis: ['./routes/*.js'],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// ✅ Middleware
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Z-Key'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// ✅ Mount routes
app.use('/', require('./routes'));

// ✅ 404 handler
app.use((req, res, next) => {
  next(createError(404, 'Route not found'));
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    status: err.status || 500,
    message: err.message || 'Internal Server Error'
  });
});

// ✅ Start server and DB connection
mongodb.initDb(err => {
  if (err) {
    console.error('❌ Database connection failed:', err);
  } else {
    app.listen(port, () => {
      console.log(`🚀 Server running at ${port}`);
    });
  }
});
