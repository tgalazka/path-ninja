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
var Module = module.exports = {};

Module.registerBase = function(base, callback) {
  BASE = base;
  return Module.getRegisteredBase(callback);
};

Module.getRegisteredBase = function(callback) {
  return callback ? callback(null, BASE) : BASE;
};

var include = function(dir, opts) {
  if(!fs.existsSync(dir))
    return null;

  if(!opts)
    return dir;

  var stat = fs.statSync(dir);
  if(opts && opts.isFile && !stat.isFile())
    return null;

  return dir;
};

//Applies the opts (optionally recursively) to the given node.
var pathy = function(dir, opts) {
  var results = [];
  results.push(include(dir, opts));

  //Apply the recursive rule.
  if(opts && opts.recursive) {
    var stat = fs.statSync(dir);
    if(stat.isDirectory()) {
      var subs = _.map(fs.readdirSync(dir), function(item) {
        var subDir = path.join(dir, item); 
        return pathy(subDir, opts)
      });
      results.push(subs);
    }
  }

  results = _.chain(results)
    .flatten()
    .compact()
    .sort()
    .uniq()
    .value();

  return results.length > 1 ? 
    results : 
    (_.first(results) || null);
};

//Builds the pathy function that opts can be applied to.
var pathify = function(base) {
  return function(item, opts, callback) {
    if(!_.isString(item)) {
      callback = opts;
      opts = item;
      item = null;
    }

    if(_.isFunction(opts)) {
      callback = opts;
      opts = null;
    }

    base = base || '';
    item = item || '';
    
    var dir = path.join(base, item);
    var result = pathy(dir, opts);
    return callback ? callback(null, result) : result;
  };
};

//Recusively calls pathify on given directory to build PATHS.
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

var checkCallback = function(args, cb) {
  var callback = Array.prototype.pop.call(args);
  var repush = null;
  if(callback && !_.isFunction(callback)) {
    repush = callback;
    callback = null;
  }

  if(repush)
    Array.prototype.push.call(args, repush);

  return cb(null, callback, args);
}

Module.register = function() {
  var args = arguments;
  checkCallback(args, function(err, callback, args) {
    register(PATHS, args, BASE);
    return callback ? callback(null, PATHS) : PATHS;
  });
};

Module.paths = function(callback) {
  return callback ? callback(null, PATHS) : PATHS;
};
