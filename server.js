const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const mongodb = require('./data/database');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const { auth, requiresAuth } = require('express-openid-connect');

const port = process.env.PORT || 10000;

// ✅ Check required environment variables
if (!process.env.SECRET || !process.env.BASE_URL || !process.env.CLIENT_ID || !process.env.ISSUER_BASE_URL) {
  console.error('❌ Missing required Auth0 environment variables. Please check your .env file.');
  process.exit(1);
}

// ✅ Auth0 configuration
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL || `http://localhost:${port}`,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
};

// ✅ Auth0 middleware
app.use(auth(config));

// ✅ Basic routes
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

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

// ✅ Start server and DB connection
mongodb.initDb(err => {
  if (err) {
    console.error('❌ Database connection failed:', err);
  } else {
    app.listen(port, () => {
      console.log(`🚀 Server running at ${config.baseURL}`);
      console.log(`📘 Swagger docs available at ${config.baseURL}/api-docs`);
    });
  }
});