const pool = require('../utils/dbConnection');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const AvionModel = require('../models/AvionModel');
const VuelosModel = require('../models/VuelosModel');
const PasajeroModel = require('../models/PasajeroModel');
//
// hotels
exports.getAllAviones = catchAsync(async(req, res, next) => {
  let result = await AvionModel.find({
    filters: req.body.id && {
      id_avion: req.query.id
    }
  });

  res.status(200).json({
    status: 'success',
    data: result,
  });
});

exports.createAvion = catchAsync(async(req, res, next) => {
  if(
    !req.body.capacidad
  ) return next(new AppError('Debes ingresar los datos mencionados', 400));

  const result = await AvionModel.create({
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
  const result = await AvionModel.delete(req.body.arr);

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
  
  // console.log(req.body.field, req.body.value, req.body.id, req.body.type);

  const result = await AvionModel.updateAField({
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

exports.reportarUbicacion = catchAsync(async (req, res, next) => {
  if(
    !req.body.latitud ||
    !req.body.longitud
  ) return next(new AppError('Debes ingresar los datos mencionados', 400));

  //latitud
  await AvionModel.updateAField({
    field: 'latitud',
    value: req.body.latitud,
    id: req.body.id,
    type: 'integer'
  });

  //longitud
  await AvionModel.updateAField({
    field: 'longitud',
    value: req.body.longitud,
    id: req.body.id,
    type: 'integer'
  });

  res.status(200).json({
    status: 'success'
  });
});

exports.despegar = catchAsync(async (req, res, next) => {
  if(
    !req.body.id
  ) return next(new AppError('No has ingresado un avión'));

  //latitud
  await AvionModel.updateAField({
    field: 'volando',
    value: true,
    id: req.body.id,
    type: 'bool'
  });

  res.status(200).json({
    status: 'success'
  });
});

exports.aterrizar = catchAsync(async (req, res, next) => {
  if(
    !req.body.id
  ) return next(new AppError('No has ingresado un avión'));


  const client = await pool.connect();
  try {
    client.query('BEGIN');
    const vuelo = await VuelosModel.findOne('id_avion', req.body.id);
    //latitud
    await AvionModel.updateAField({
      field: 'volando',
      value: false,
      id: req.body.id,
      type: 'bool'
    });

    await VuelosModel.updateAField({
      field: 'asientos_ocupados',
      value: 0,
      id: vuelo[0].id_vuelo,
      type: 'integer'
    });

    await PasajeroModel.deleteWhere({
      field: 'id_vuelo',
      value: vuelo[0].id_vuelo
    });
    client.query('COMMIT');
    await client.release();
  } catch(e) {
    client.query('ROLLBACK');
    await client.release();
    return next(e);
  }
  res.status(200).json({
    status: 'success'
  });
});
