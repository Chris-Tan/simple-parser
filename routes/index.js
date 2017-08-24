'use strict';
const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
  return res.send(200);
});
module.exports = router;