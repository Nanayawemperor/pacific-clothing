const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const createError = require('http-errors');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const GithubStrategy = require('passport-github2').Strategy;
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const mongodb = require('./data/database');

const app = express();
const port = process.env.PORT || 10000;

// ✅ Swagger Setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Pacific Clothing API',
      version: '1.0.0',
      description: 'API for managing Pacific Clothing data',
    },
    servers: [{ url: `http://localhost:${port}` }],
    components: {
      schemas: {
            Department: {
          type: 'object',
          properties: {
            departmentName: {
              type: 'string'
            },
            manager: {
              type: 'string'
            },
            totalEmployees: {
              type: 'integer'
            },
            location: {
              type: 'string'
            }
          }
        },
        Employee: {
          type: 'object',
          properties: {
            fullName: {
              type: 'string'
            },
            phoneNumber: {
              type: 'string'
            },
            hireDate: {
              type: "string"
            },
            department: {
              type: 'string'
            },
            employmentStatus: {
              type: 'string'
            },
            role: {
              type: 'string'
            },
            address: {
              type: 'string'
            }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js'],
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// ✅ Passport GitHub OAuth Setup
passport.use(new GithubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

// ✅ Middleware
app
  .use(bodyParser.json())
  .use(cors({ methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'], origin: '*' }))
  .use(session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  }))
  .use(passport.session())
  .use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Z-Key');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
  })
  .use('/', require('./routes'));

// ✅ Routes
app.get('/', (req, res) => {
  res.send(req.session.user !== undefined
    ? `Logged in as ${req.session.user.displayName}`
    : "Logged Out");
});

app.get('/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/api-docs',
    session: false
  }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect('/');
  }
);

// ✅ 404 Handler
app.use((req, res, next) => {
  next(createError(404, 'Route not found'));
});

// ✅ Global Error Handler
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
      console.log(`🚀 Server running at http://localhost:${port}`);
    });
  }
});
