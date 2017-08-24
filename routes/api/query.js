'use strict';
const QueryService = require('../../services/QueryService')();
const addRoutes = function(router) {
  router.get('/query/format', function(req, res) {
    return res.json(QueryService.format(req.query.q));
  });
};

module.exports = {
  addRoutes: addRoutes
};
