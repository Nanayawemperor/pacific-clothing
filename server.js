const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc')


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
      { url: `http://localhost:${port}` }
    ],
    components: {
      schemas: {
        Employee: {
          type: 'object',
          properties: {
            _id: { type: 'string', description: 'Employee ID' },
            name: { type: 'string', description: 'Employee name' },
            position: { type: 'string', description: 'Employee position' },
            department: { type: 'string', description: 'Employee department' }
          },
          required: ['name', 'position', 'department']
        }
      }
    }
  },
  apis: ['./routes/*.js']  // or adjust path if needed
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/', require('./routes'));


mongodb.initDb((err) => {
    if (err) {
        console.log(err);
    }
    else {
        app.listen(port, () => {console.log(`Database is listening and running on port ${port}`)});
    }
})