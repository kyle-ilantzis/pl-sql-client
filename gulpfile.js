var fs = require('fs');
var path = require('path');

var gulp = require('gulp');
var less = require('gulp-less');
var react = require('gulp-react');
var shell = require('gulp-shell');
var environments = require('gulp-environments');
var substituter = require('gulp-substituter');
var gulpFilter = require('gulp-filter');
var runSequence = require('run-sequence');

var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var semver = require('semver');
var NwBuilder = require('nw-builder');
var NwVersions = require('nw-builder/lib/versions');

function readAll(file) {
  return !fs.existsSync(file) ? null : fs.readFileSync(file, {encoding: 'utf8'});
}
function readAllJSON(file) {
  var read = readAll(file);
  return read === null ? {} : JSON.parse( read );
}

var devMode = environments.development;
var prodMode = environments.production;

var cfg = readAllJSON('gulpconfig.json');
var appInfo = readAllJSON('package.json');

if (! appInfo.dependencies) {
  throw new Error('Invalid package.json');
}

var base_output_dir = './build';
var bootstrap = path.join(__dirname, 'vendor', 'bootstrap-3.3.5', 'less');
var bootswatch = path.join(__dirname, 'vendor', 'bootswatch');
var nwDownloadUrl = 'http://dl.nwjs.io/';
var nw = cfg.nw || './node_modules/nw/bin/nw';

function output_dir(){
  if (devMode()){
    return path.join(base_output_dir, 'debug');
  }

  if (prodMode()){
    return path.join(base_output_dir, 'release');
  }

  throw new Error('Unhandled environment!');
}

function findNwVersion(version) {

  return new Promise(function(resolve, reject) {

    NwVersions.getVersions(nwDownloadUrl)
      .then(function(versions) {

          var satisfying = semver.maxSatisfying(versions,version);

          if (satisfying !== null) {
            resolve(satisfying);
          }
          else {
            reject('No nw version for ' + version + ' found in ' + versions);
          }
      })
      .catch(function(err) {
        reject(err);
      });
  });
}

gulp.task('copy-index', function(){
  if (devMode()){
    console.log('In development mode, including watch statement.');
    var watchStatement = readAll('src/html/watch.html');

    return gulp.src('src/html/index.html')
      .pipe(substituter({
          watch: watchStatement
      }))
      .pipe(gulp.dest(output_dir()));
  } else {
    console.log('Not in development mode, skipping watch statement.');
    return gulp.src('src/html/index.html')
      .pipe(gulp.dest(output_dir()));
  }
});

gulp.task('copy-appInfo', function(){
  mkdirp(output_dir(), function(err){
    if (err) throw err;
    fs.writeFileSync(output_dir() + '/package.json', JSON.stringify(appInfo, null, 2));
  });
});

gulp.task('copy-vendor', function() {
  return gulp.src('vendor/**/**')
    .pipe(gulp.dest(output_dir() + '/vendor'));
});

gulp.task('copy-deps', function() {

  var deps = Object.keys( appInfo.dependencies );

  var filter = gulpFilter(function(file) {
    var parts = file.relative.split(path.sep);
    var dep = parts[0];
    return deps.indexOf( dep ) >= 0;
  });

  return gulp.src('node_modules/**/**')
    .pipe(filter)
    .pipe(gulp.dest(output_dir() + '/node_modules'));
});

gulp.task('themes', function() {
  return gulp.src('./src/less/theme-*.less')
        .pipe(less({
          paths: [ bootstrap, bootswatch ],
          relativeUrls: true
        }))
        .pipe(gulp.dest(output_dir()));
});

gulp.task('jsx', function(){
  return gulp.src('./src/js/**')
        .pipe(react())
        .pipe(gulp.dest(output_dir()));
});

gulp.task('watch', function(){
  gulp.watch('./src/js/**', ['jsx']);
  gulp.watch('./src/less/**', ['theme']);
});

gulp.task('set-prod-mode', function(){
  environments.current(prodMode);
});

gulp.task('clean', function() {
  rimraf.sync(base_output_dir);
});

gulp.task('compile', ['copy-index', 'copy-appInfo', 'copy-vendor', 'copy-deps', 'themes', 'jsx']);

gulp.task('package', function(cb){
  var nw = new NwBuilder({
    files: output_dir() + '/**/**',
    platforms: ['osx64', 'win64', 'linux64'],
    version: appInfo.devDependencies.nw,
    buildDir: 'dist',
    cacheDir: '.cache',
    buildType: 'versioned',
  });

  nw.build().then(function () {
     console.log('Packaging done!');
     cb();
  }).catch(function (error) {
      cb(error);
  });

});

gulp.task('dist', function(cb){
    runSequence('set-prod-mode', ['set-prod-mode', 'compile'], 'package', cb);
});

gulp.task('start', ['compile', 'watch'], function(done){
  runSequence(
    'serve',
    done
  );
});

gulp.task('serve', shell.task([
  nw + ' ' + output_dir() + ' --debug'
]));

gulp.task('default', ['start']);

/**
 * Tests for findNwVersion
 * $> gulp test-nwversions
 */
gulp.task('test-nwversions', function() {

  var test = function(v) {
    return function(x) { console.log("version",v,"result",x); };
  };

  findNwVersion("apple").then(test("apple"),test("apple"));
  findNwVersion("0.11.5").then(test("0.11.5"),test("0.11.5"));
  findNwVersion("^0.11.5").then(test("^0.11.5"),test("^0.11.5"));
  findNwVersion("0.12.3").then(test("0.12.3"),test("0.12.3"));
  findNwVersion("^0.12.3").then(test("^0.12.3"),test("^0.12.3"));
});
