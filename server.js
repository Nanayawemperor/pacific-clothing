const express = require('express');
const bodyParser = require('body-parser');
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
      { url: `http://localhost:${port}` }  // Make sure this port matches!
    ]
  },
  apis: ['./routes/*.js'],  // Adjust if your route docs are in a different folder
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));  // ✅ Swagger Route

// ✅ Body parser middleware
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

// ✅ Mount routes AFTER Swagger and middleware
app.use('/', require('./routes'));

// ✅ Start server and DB connection
mongodb.initDb(err => {
  if (err) console.log(err);
  else app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
});
