'use strict';
module.exports = function (app) {
  const hospitalController = require('../controllers/hospitalController');
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'

  app.route('/hospital/closest').get(hospitalController.calculateTime);
};
