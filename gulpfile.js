var gulp = require('gulp');
var less = require('gulp-less');
var path = require('path');
var react = require('gulp-react');
var shell = require('gulp-shell');

var bootstrap = path.join(__dirname, 'vendor', 'bootstrap-3.3.5', 'less');

function less_theme(file){
  return gulp.src('./less/src/' + file + '.less')
    .pipe(less({
      paths: [ bootstrap ]
    }))
    .pipe(gulp.dest('./build'));
}

gulp.task('less-dark', function(){
  return less_theme('main-dark');
});

gulp.task('less-light', function(){
  return less_theme('main-light');
});

gulp.task('theme', ['less-dark', 'less-light']);

gulp.task('jsx', function(){
  return gulp.src('./js/src/**')
        .pipe(react())
        .pipe(gulp.dest('build'));
});

gulp.task('start', shell.task([
  './node_modules/nw/bin/nw . --debug'
]));

gulp.task('watch', function(){
  gulp.watch('./js/src/**', ['jsx']);
  gulp.watch('./less/src/**', ['theme']);
});

gulp.task('default', ['theme', 'jsx', 'watch', 'start']);