var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var react = require('gulp-react');
var shell = require('gulp-shell');
var fs = require('fs');

var cfg = !fs.existsSync('gulpconfig.json') ? {} : JSON.parse( fs.readFileSync('gulpconfig.json', {encoding: 'utf8'}) );

var bootstrap = path.join(__dirname, 'vendor', 'bootstrap-3.3.5', 'less');
var bootswatch = path.join(__dirname, 'vendor', 'bootswatch');
var nw = cfg.nw || './node_modules/nw/bin/nw';

gulp.task('themes', function() {
  return gulp.src('./src/less/theme-*.less')
        .pipe(less({
          paths: [ bootstrap, bootswatch ],
          relativeUrls: true
        }))
        .pipe(gulp.dest('./build'));
});

gulp.task('jsx', function(){
  return gulp.src('./src/js/**')
        .pipe(react())
        .pipe(gulp.dest('build'));
});

gulp.task('serve', shell.task([
  nw + ' . --debug'
]));

gulp.task('watch', function(){
  console.log('watching you');
  gulp.watch('./src/js/**', ['jsx']);
  gulp.watch('./src/less/**', ['theme']);
});

gulp.task('start', ['themes', 'jsx', 'watch', 'serve']);

gulp.task('default', ['start']);
