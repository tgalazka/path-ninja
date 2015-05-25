/**
 * Dependencies
 */

var _ = require('underscore');
var path = require('path');

/**
 * Test Index
 */

describe("When working with path-ninja", function() {
  
  var indexPath = BASE_DIR + 'index.js';
  var cachePath = path.resolve(indexPath);
  var ninja = null;
 
  describe("when registering base directories", function() {
    //TJG: Need to unrequire module between tests to reset to blank-slate.
    beforeEach(function() {
      if(require.cache[cachePath])
        delete require.cache[cachePath]

      ninja = require(cachePath);
    });
  
    it("should register a base directory synchronously", function(done) {
      var expected = "";
      var result = ninja.getRegisteredBase();
      expect(result).to.equal(expected);


      expected = BASE_DIR;
      ninja.registerBase(BASE_DIR);
      result = ninja.getRegisteredBase();
      expect(result).to.equal(expected);
      done();
    });

    it("should register a base directory asynchronously", function(done) {
      var expected = "";
      ninja.getRegisteredBase(function(err, result) {
        expect(err).to.be(null);  
        expect(result).to.equal(expected);


        expected = BASE_DIR;
        ninja.registerBase(BASE_DIR, function(err, result) {
          expect(err).to.be(null);  
          expect(result).to.equal(expected);
            
          ninja.getRegisteredBase(function(err, base) {
            expect(err).to.be(null);  
            expect(result).to.equal(expected);
            done();
          });
        });
      });
    });
  });

  describe("when registering directories", function() {
    //TJG: Need to unrequire module between tests to reset to blank-slate.
    beforeEach(function() {
      if(require.cache[cachePath])
        delete require.cache[cachePath]

      ninja = require(cachePath);
      ninja.registerBase(TEST_BASE_DIR);
    });

    var PathsChecker = function(Paths, key, expected) {
      expect(Paths.hasOwnProperty(key)).to.equal(true);
      expect(_.isFunction(Paths[key])).to.equal(true);
      expect(_.isObject(Paths[key])).to.equal(true);
      expect(Paths[key]()).to.equal(expected);
    };

    it("should register a sinlge directory synchronously", function(done) {
      var dirs = 'single_sample';
      var expected = path.resolve(TEST_BASE_DIR + '/single_sample');
      ninja.register(dirs);
      
      PathsChecker(ninja.paths(), 'single_sample', expected);
      done();
    });

    it("should register a sinlge directory asynchronously", function(done) {
      var dirs = 'single_sample';
      var expected = path.resolve(TEST_BASE_DIR + '/single_sample');
      ninja.register(dirs, function(err, Paths) {
        expect(err).to.be(null);
        PathsChecker(Paths, 'single_sample', expected);
        done();
      });
    });

    it("should register a sinlge deep directory synchronously", function(done) {
      var dirs = 'deep_sample';
      var expectedDeep = path.resolve(TEST_BASE_DIR + '/deep_sample');
      var expectedWith = path.resolve(TEST_BASE_DIR + '/deep_sample/with');
      var expectedDirs = path.resolve(TEST_BASE_DIR + '/deep_sample/dirs');
      
      ninja.register(dirs);
      PathsChecker(ninja.paths(), 'deep_sample', expectedDeep)
      PathsChecker(ninja.paths()['deep_sample'], 'with', expectedWith)
      PathsChecker(ninja.paths()['deep_sample'], 'dirs', expectedDirs)
       done();
    });

    it("should register a sinlge deep directory asynchronously", function(done) {
      var dirs = 'deep_sample';
      var expectedDeep = path.resolve(TEST_BASE_DIR + '/deep_sample');
      var expectedWith = path.resolve(TEST_BASE_DIR + '/deep_sample/with');
      var expectedDirs = path.resolve(TEST_BASE_DIR + '/deep_sample/dirs');
     
      ninja.register(dirs, function(err, paths) {
        expect(err).to.be(null);
        PathsChecker(paths, 'deep_sample', expectedDeep)
        PathsChecker(paths['deep_sample'], 'with', expectedWith)
        PathsChecker(paths['deep_sample'], 'dirs', expectedDirs)
        done();
      });
    });

    it("should register multiple directories synchronously", function(done) {
      var dirs = ['single_sample', 'deep_sample'];
      var expectedSingle = path.resolve(TEST_BASE_DIR + '/single_sample');
      var expectedDeep = path.resolve(TEST_BASE_DIR + '/deep_sample');
      var expectedWith = path.resolve(TEST_BASE_DIR + '/deep_sample/with');
      var expectedDirs = path.resolve(TEST_BASE_DIR + '/deep_sample/dirs');
      
      ninja.register(dirs);
      PathsChecker(ninja.paths(), 'single_sample', expectedSingle)
      PathsChecker(ninja.paths(), 'deep_sample', expectedDeep)
      PathsChecker(ninja.paths()['deep_sample'], 'with', expectedWith)
      PathsChecker(ninja.paths()['deep_sample'], 'dirs', expectedDirs)
      done();
    });

    it("should register multiple directories asynchronously", function(done) {
      var dirs = ['single_sample', 'deep_sample'];
      var expectedSingle = path.resolve(TEST_BASE_DIR + '/single_sample');
      var expectedDeep = path.resolve(TEST_BASE_DIR + '/deep_sample');
      var expectedWith = path.resolve(TEST_BASE_DIR + '/deep_sample/with');
      var expectedDirs = path.resolve(TEST_BASE_DIR + '/deep_sample/dirs');
      
      ninja.register(dirs, function(err, paths) {
        expect(err).to.be(null);
        PathsChecker(paths, 'single_sample', expectedSingle)
        PathsChecker(paths, 'deep_sample', expectedDeep)
        PathsChecker(paths['deep_sample'], 'with', expectedWith)
        PathsChecker(paths['deep_sample'], 'dirs', expectedDirs)
        done();
      });
    });
  });

  describe("when using registerd directory options synchronously", function() {
    var Paths = null;
    beforeEach(function() {
      if(require.cache[cachePath])
        delete require.cache[cachePath]

      ninja = require(cachePath);
      ninja.registerBase(TEST_BASE_DIR);
      ninja.register(['single_sample', 'deep_sample']);
      Paths = ninja.paths();
    });

    it("should return the directory with no argument", function(done) {
      var expected = path.resolve(TEST_BASE_DIR + '/single_sample');
      var result = Paths['single_sample']();
      expect(result).to.equal(expected);
      done();
    });

    it("should return the directory with appended argument tested", function(done) {
      var expected = path.resolve(TEST_BASE_DIR + '/single_sample/something');
      var result = Paths['single_sample']('something');
      expect(result).to.equal(null);
      done();
    });

    it("should return list of all sub-items if it exists", function(done) {
      var opts = { recursive: true };
      var expected = [
        path.resolve(TEST_BASE_DIR + '/deep_sample'),
        path.resolve(TEST_BASE_DIR + '/deep_sample/dirs'),
        path.resolve(TEST_BASE_DIR + '/deep_sample/dirs/file.search.txt'),
        path.resolve(TEST_BASE_DIR + '/deep_sample/file.txt'),
        path.resolve(TEST_BASE_DIR + '/deep_sample/with'),
        path.resolve(TEST_BASE_DIR + '/deep_sample/with/file.search.txt'),
        path.resolve(TEST_BASE_DIR + '/deep_sample/with/file.txt')
      ];
      
      var result = Paths['deep_sample'](opts);
      expect(result).to.eql(expected);
      done();
    });

    it("should return list of all sub-items at given location if it exsts", function(done) {
      var opts = { recursive: true };
      var expected = [
        path.resolve(TEST_BASE_DIR + '/deep_sample/with'),
        path.resolve(TEST_BASE_DIR + '/deep_sample/with/file.search.txt'),
        path.resolve(TEST_BASE_DIR + '/deep_sample/with/file.txt'),
      ];
      
      var result = Paths['deep_sample']('with', opts);
      expect(result).to.eql(expected);
      done();
    });

    it("should return a list of files from the directory", function(done) {
      var opts = { recursive: true, isFile: true };
      var expected = [
        path.resolve(TEST_BASE_DIR + '/deep_sample/with/file.search.txt'),
        path.resolve(TEST_BASE_DIR + '/deep_sample/with/file.txt'),
      ];
      
      var result = Paths['deep_sample']('with', opts);
      expect(result).to.eql(expected);
      done();
    });
  });

  describe("when using registerd directory options asynchronously", function() {
    var Paths = null;
    beforeEach(function() {
      if(require.cache[cachePath])
        delete require.cache[cachePath]

      ninja = require(cachePath);
      ninja.registerBase(TEST_BASE_DIR);
      ninja.register(['single_sample', 'deep_sample']);
      Paths = ninja.paths();
    });

    it("should return the directory with no argument", function(done) {
      var expected = path.resolve(TEST_BASE_DIR + '/single_sample');
      var result = Paths['single_sample'](function(err, result) {
        expect(err).to.be(null);
        expect(result).to.equal(expected);
        done();
      });
    });

    it("should return the directory with appended argument tested", function(done) {
      var expected = path.resolve(TEST_BASE_DIR + '/single_sample/something');
      var result = Paths['single_sample']('something', function(err, result) {
        expect(err).to.be(null);
        expect(result).to.be(null);
        done();
      });
    });

    it("should return list of all sub-items if it exists", function(done) {
      var opts = { recursive: true };
      var expected = [
        path.resolve(TEST_BASE_DIR + '/deep_sample'),
        path.resolve(TEST_BASE_DIR + '/deep_sample/dirs'),
        path.resolve(TEST_BASE_DIR + '/deep_sample/dirs/file.search.txt'),
        path.resolve(TEST_BASE_DIR + '/deep_sample/file.txt'),
        path.resolve(TEST_BASE_DIR + '/deep_sample/with'),
        path.resolve(TEST_BASE_DIR + '/deep_sample/with/file.search.txt'),
        path.resolve(TEST_BASE_DIR + '/deep_sample/with/file.txt')
      ];
      
      var result = Paths['deep_sample'](opts, function(err, result) {
        expect(err).to.be(null);
        expect(result).to.eql(expected);
        done();
      });
    });

    it("should return list of all sub-items at given location if it exsts", function(done) {
      var opts = { recursive: true };
      var expected = [
        path.resolve(TEST_BASE_DIR + '/deep_sample/with'),
        path.resolve(TEST_BASE_DIR + '/deep_sample/with/file.search.txt'),
        path.resolve(TEST_BASE_DIR + '/deep_sample/with/file.txt'),
      ];
      
      var result = Paths['deep_sample']('with', opts, function(err, result) {
        expect(err).to.be(null);
        expect(result).to.eql(expected);
        done();
      });
    });

    it("should return a list of files from the directory", function(done) {
      var opts = { recursive: true, isFile: true };
      var expected = [
        path.resolve(TEST_BASE_DIR + '/deep_sample/with/file.search.txt'),
        path.resolve(TEST_BASE_DIR + '/deep_sample/with/file.txt'),
      ];
      
      var result = Paths['deep_sample']('with', opts, function(err, result) {
        expect(err).to.be(null);
        expect(result).to.eql(expected);
        done();
      });
    });
  });
});
