const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const VuelosModel = require('../models/VuelosModel');
const AvionModel = require('../models/AvionModel');
const PasajeroModel = require('../models/PasajeroModel');
const pool = require('../utils/dbConnection');

exports.createPasajero = catchAsync(async(req, res, next) => {
  if(
    !req.body.id_vuelo ||
    !req.body.nombre ||
    !req.body.apellido_paterno ||
    !req.body.apellido_materno
  ) return next(new AppError('Debes ingresar los datos mencionados', 400));

  const vuelo = await VuelosModel.findOne('id_vuelo', req.body.id_vuelo);
  const avion = await AvionModel.findOne('id_avion', vuelo[0].id_avion);

  if(
    avion[0].volando
  ) return next(new AppError('No se puede reservar, el avión está volando'));

  if(
    (vuelo[0].asientos_ocupados) >= avion[0].capacidad
  ) return next(new AppError('No se puede reservar, el vuelo está lleno'));

  let result;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    
    result = await PasajeroModel.create({
      id_vuelo: req.body.id_vuelo,
      nombre: req.body.nombre,
      apellido_paterno: req.body.apellido_paterno,
      apellido_materno: req.body.apellido_materno
    });

    await VuelosModel.updateAField({
      field: 'asientos_ocupados',
      value: vuelo[0].asientos_ocupados + 1,
      id: req.body.id_vuelo,
      type: 'integer'
    });

    await client.query('COMMIT');
    await client.release();
  } catch(e) {
    await client.query('ROLLBACK');
    await client.release();
    return next(e);
  }

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
