const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const movieRouter = require('./routes/movie');
const directorRouter = require('./routes/director')

const app = express();

//swagger-ui
const swaggerUi=require('swagger-ui-express');
//const swaggerDocument=require('./swagger.json');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  swaggerDefinition: {
    // Like the one described here: https://swagger.io/specification/#infoObject
    info: {
      title: 'Movie API Endpoints',
      version: '1.0.0',
      description: 'Movie API Endpoints definitions, parameters and endpoints',
    },
  },
  // List of files to be processes. You can also set globs './routes/*.js'
  apis: ['./routes/*.js']
};
const specs = swaggerJsdoc(options);

//config
const config=require('./config');
app.set('api_secret_key',config.api_secret_key);

//middleware
const verifyToken=require('./middleware/verify-token');

//db connection
const db = require('./helper/db')();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api',verifyToken);
app.use('/api/movies', movieRouter);
app.use('/api/directors', directorRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  //res.render('error');
  res.json({ error: { message: err.message, code: err.code } });
});

module.exports = app;
