const avionController = require('../controllers/avionController.js');
const vueloController = require('../controllers/vueloController.js');
const express = require('express');
const avionRouter = express.Router();

avionRouter
  .route('/')
  .get(
    avionController.getAllAviones
  )
  .post(
    avionController.createAvion
  )
  .delete(
    avionController.deleteAvion
  )
  .patch(
    avionController.patchAvion
  );

avionRouter.route('/reportar/').post(avionController.reportarUbicacion);
avionRouter.route('/despegar/').post(avionController.despegar);
avionRouter.route('/aterrizar/').post(avionController.aterrizar);

module.exports = avionRouter;
