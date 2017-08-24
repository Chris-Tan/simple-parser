'use strict';
const express = require('express');
const router = express.Router();

// routes
const query = require('./query');
query.addRoutes(router);

// default
router.get('/', function(req, res) {
  return res.send("/api");
});

module.exports = router;