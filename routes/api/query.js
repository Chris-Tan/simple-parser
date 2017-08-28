'use strict';
const _ = require("lodash");
const QueryService = require('../../services/QueryService')();

const addRoutes = function(router) {
  router.get('/query/format', function(req, res) {
    return res.json(QueryService.format(req.query.q));
  });

  // TODO clean up tests or move to a proper testing framework
  router.get('/query/test', function(req, res) {
    var result = {};

    // importing Test Data
    const testData1 = require('../../test/testData1');
    const testData2 = require('../../test/testData2');
    const testData3 = require('../../test/testData3');
    const testData4 = require('../../test/testData4');
    const testData5 = require('../../test/testData5');
    const testData6 = require('../../test/testData6');
    const testData7 = require('../../test/testData7');
    const testData8 = require('../../test/testData8');
    const testData9 = require('../../test/testData9');
    const testData10 = require('../../test/testData10');
    const testData11 = require('../../test/testData11');
    const testData12 = require('../../test/testData12');

    result.a = _.isEqual(QueryService.format(testData1.command), testData1.jsonValue);
    result.b = _.isEqual(QueryService.format(testData2.command), testData2.jsonValue);
    result.c = _.isEqual(QueryService.format(testData3.command), testData3.jsonValue);
    result.d = _.isEqual(QueryService.format(testData4.command), testData4.jsonValue);
    result.e = _.isEqual(QueryService.format(testData5.command), testData5.jsonValue);
    result.f = _.isEqual(QueryService.format(testData6.command), testData6.jsonValue);
    result.g = _.isEqual(QueryService.format(testData7.command), testData7.jsonValue);
    result.h = !_.isEqual(QueryService.format(testData8.command), testData8.jsonValue); // expecting unequal
    result.i = !_.isEqual(QueryService.format(testData9.command), testData9.jsonValue); // expecting unequal
    result.j = _.isEqual(QueryService.format(testData10.command), testData10.jsonValue);
    result.k = _.isEqual(QueryService.format(testData11.command), testData11.jsonValue);
    result.l = _.isEqual(QueryService.format(testData12.command), testData12.jsonValue);
    
    return res.json(result);
  });
};

module.exports = {
  addRoutes: addRoutes
};
