/**
 * Dependencies
 */

var _ = require('underscore');
var expect = require('expect.js');
var fs = require('fs');
var sinon = require('sinon');
var sinonMocha = require('sinon-mocha');

/**
 * Test Helper - Unit
 */

/**
 * Global dependencies
 */
global.expect = expect;
global.sinon = sinon;
sinonMocha.enhance(sinon);

global.BASE_DIR = __dirname + '/../../';
global.TEST_BASE_DIR = BASE_DIR + 'test';
