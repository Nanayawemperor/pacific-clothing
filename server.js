const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const mongodb = require('./data/database');
const port = process.env.PORT || 3030;

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Pacific Clothing API',
      version: '1.0.0',
      description: 'API for managing Pacific Clothing data'
    },
    servers: [
      { url: `http://localhost:${port}` }  // Dynamic port based on environment
    ],
    components: {
      schemas: {
        Employee: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            position: { type: 'string' },
            department: { type: 'string' }
          },
          required: ['name', 'position', 'department']
        }
      }
    }
  },
  apis: ['./routes/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Mount routes
app.use('/', require('./routes'));

// Start server and DB connection
mongodb.initDb(err => {
  if (err) console.log(err);
  else app.listen(port, () => console.log(`Server running at http://localhost:${port} with DB`));
});
