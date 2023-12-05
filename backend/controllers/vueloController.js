const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const VuelosModel = require('../models/VuelosModel');
//
// hotels
exports.getAllVuelos = catchAsync(async(req, res, next) => {
  let estado;

  if(req.query.actuales) {
    estado = true;
  } else if (req.query.proximos) {
    estado = false
  }

  const result = await VuelosModel.vuelos(estado);

  res.status(200).json({
    status: 'success',
    data: result,
  });
});

exports.createAvion = catchAsync(async(req, res, next) => {
  if(
    !req.body.capacidad
  ) return next(new AppError('Debes ingresar los datos mencionados', 400));

  const result = await VuelosModel.create({
    capacidad: req.body.capacidad,
    latitud: req.body.latitud,
    longitud: req.body.longitud,
    volando: false
  });

  res.status(200).json({
    status: 'success',
    data: result
  });
});

exports.deleteAvion = catchAsync(async (req, res, next) => {
  const result = await VuelosModel.delete(req.body.arr);

  res.status(200).json({
    status: 'success',
    data: result
  });
});

exports.patchAvion = catchAsync(async (req, res, next) => {
  if(
    req.body.field === 'nombre' &&
    req.body.value.length > 50
  ) return next(new AppError('Debes proporcionar un nombre menor a 50 carteres', 400));

  if(
    req.body.field === 'direccion' &&
    req.body.value.length > 100
  ) return next(new AppError('La dirección que proporcionaste es demasiado larga. Usa solo 100 caracteres', 400));
  
  const result = await VuelosModel.updateAField({
    field: req.body.field,
    value: req.body.value,
    id: req.body.id,
    type: req.body.type
  });

  res.status(200).json({
    status: 'success',
    data: result
  });
});
