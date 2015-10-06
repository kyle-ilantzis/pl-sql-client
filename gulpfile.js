var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var react = require('gulp-react');
var shell = require('gulp-shell');
var fs = require('fs');
var runSequence = require('run-sequence');
var environments = require('gulp-environments');
var substituter = require('gulp-substituter');
var NwBuilder = require('nw-builder');
var mkdirp = require('mkdirp');

var devMode = environments.development;
var prodMode = environments.production;

var cfg = !fs.existsSync('gulpconfig.json') ? {} : JSON.parse( fs.readFileSync('gulpconfig.json', {encoding: 'utf8'}) );
var appInfo = JSON.parse( fs.readFileSync('package.json', {encoding: 'utf8'}) );

var bootstrap = path.join(__dirname, 'vendor', 'bootstrap-3.3.5', 'less');
var bootswatch = path.join(__dirname, 'vendor', 'bootswatch');
var nw = cfg.nw || './node_modules/nw/bin/nw';

function output_dir(){
  if (devMode()){
    return "./build/debug";
  }

  if (prodMode()){
    return "./build/release";
  }

  throw new Error('Unhandled environment!');
}

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
  return gulp.src('node_modules/**/**')
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

gulp.task('serve', shell.task([
  nw + ' ' + output_dir() + ' --debug'
]));

gulp.task('copy-index', function(){
  if (devMode()){
    console.log('In development mode, including watch statement.');
    var watchStatement = fs.readFileSync('src/html/watch.html', {encoding: 'utf8'});

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

gulp.task('watch', function(){
  gulp.watch('./src/js/**', ['jsx']);
  gulp.watch('./src/less/**', ['theme']);
});

gulp.task('start', ['copy-index', 'copy-appInfo', 'copy-vendor', 'themes', 'jsx', 'watch'], function(done){
  runSequence(
    'serve',
    done
  );
});

gulp.task('package', function(){
  var nw = new NwBuilder({
    files: output_dir() + '/**/**',
    platforms: [/*'osx64', 'win64',*/ 'linux64'],
    version: appInfo.dependencies.nw,
    buildDir: 'dist',
    cacheDir: '.cache',
    buildType: 'versioned',
  });

  nw.build().then(function () {
     console.log('Packaging done!');
  }).catch(function (error) {
      console.error(error);
  });

});

gulp.task('set-prod-mode', function(){
  environments.current(prodMode);
});

gulp.task('dist', function(cb){
    runSequence('set-prod-mode', ['set-prod-mode', 'copy-index', 'copy-appInfo', 'copy-vendor', 'copy-deps', 'themes', 'jsx'], 'package', cb);
});

gulp.task('default', ['start']);
