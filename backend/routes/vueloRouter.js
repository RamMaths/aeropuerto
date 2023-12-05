const vueloController = require('../controllers/vueloController.js');
const pasajeroController = require('../controllers/pasajeroController.js');
const express = require('express');
const vueloRouter = express.Router();

vueloRouter
  .route('/')
  .get(
    vueloController.getAllVuelos
  )
  .post(
    vueloController.createAvion
  )
  .delete(
    vueloController.deleteAvion
  )
  .patch(
    vueloController.patchAvion
  );

vueloRouter.route('/pasajero').post(pasajeroController.createPasajero);

module.exports = vueloRouter;
