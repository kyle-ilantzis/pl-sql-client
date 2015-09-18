var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var react = require('gulp-react');
var shell = require('gulp-shell');
var fs = require('fs');
var runSequence = require('run-sequence');
var environments = require('gulp-environments');
var substituter = require('gulp-substituter');

var devMode = environments.development();
var prodMode = environments.production();

var cfg = !fs.existsSync('gulpconfig.json') ? {} : JSON.parse( fs.readFileSync('gulpconfig.json', {encoding: 'utf8'}) );

var bootstrap = path.join(__dirname, 'vendor', 'bootstrap-3.3.5', 'less');
var nw = cfg.nw || './node_modules/nw/bin/nw';

gulp.task('theme', function() {
  return gulp.src('./src/less/main.less')
    .pipe(less({
      paths: [ bootstrap ],
      relativeUrls: true
    }))
    .pipe(gulp.dest('build'));
});

gulp.task('jsx', function(){
  return gulp.src('./src/js/**')
        .pipe(react())
        .pipe(gulp.dest('build'));
});

gulp.task('serve', shell.task([
  nw + ' . --debug'
]));

gulp.task('add-watch', function(){
  if (devMode){
    console.log('In development mode, including watch statement.');
    var watchStatement = fs.readFileSync('src/html/watch.html', {encoding: 'utf8'});

    return gulp.src('src/html/index.html')
      .pipe(substituter({
          watch: watchStatement
      }))
      .pipe(gulp.dest('build'));
  } else {
    console.log('Not in development mode, skipping watch statement.');
    return gulp.src('src/html/index.html')
      .pipe(gulp.dest('build'));
  }
});

gulp.task('watch', function(){
  gulp.watch('./src/js/**', ['jsx']);
  gulp.watch('./src/less/**', ['theme']);
});

gulp.task('start', ['add-watch', 'theme', 'jsx', 'watch'], function(done){
  runSequence(
    'serve',
    done
  );
});

gulp.task('default', ['start']);
