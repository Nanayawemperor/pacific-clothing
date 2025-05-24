const swaggerAutogen = require('swagger-autogen')();

const doc ={
    info: {
        title: 'Employees Api',
        description: 'Employees Api'
    },
    host: 'localhost:3030',
    schemes: ['http', 'https']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js'];

//this will generate swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);