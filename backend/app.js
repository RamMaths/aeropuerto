const express = require('express');
const cors = require('cors');

//utils
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

//express
const app = express();
app.use(express.json());
app.use(cors());

//routes
const avionRouter = require('./routes/avionRouter.js');
const vueloRouter = require('./routes/vueloRouter.js');

app.use('/api/aviones', avionRouter);
app.use('/api/vuelos', vueloRouter);


app.all('*', (req, res, next) => {
  next(new AppError(`No se puede encontrar la ruta`, 404));
});
app.use(globalErrorHandler);

module.exports = app;
