/**
 * Dependencies
 */

var _ = require('underscore');
var fs = require('fs');
var path = require('path');

/**
 * Path-Ninja
 */

var BASE = '';
var PATHS = {};
var pathify = function(base) {
  return function(item) {
    base = base || '';
    item = item || '';
    return path.join(base, item);
  };
};

var Module = module.exports = {};

Module.registerBase = function(base) {
  BASE = base;
};

var register = function(PATH, args, base) {
  args = _.chain(args)
    .flatten()
    .compact()
    .value();
    
  _.each(args, function(arg) {
    var dir = path.join(base, arg);
    if(fs.existsSync(dir)) {
      var stat = fs.statSync(dir);
      if(stat.isDirectory()) {
        PATH[arg] = {};
        PATH[arg] = pathify(dir);
        var dirs = fs.readdirSync(dir);
        register(PATH[arg], dirs, dir);
      }
    }
  });
};

Module.register = function() {
  var args = arguments;
  register(PATHS, args, BASE);
};

Module.paths = function() { return PATHS; };
