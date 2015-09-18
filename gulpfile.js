var gulp = require('gulp');
var ui5preload = require('gulp-ui5-preload');
var uglify = require('gulp-uglify');
var prettydata = require('gulp-pretty-data');
var gulpif = require('gulp-if');
var rename = require('gulp-rename');
var del = require('del');
var runSequence = require('run-sequence');

var preloadSrc = ['src/**/*.+(js|xml)', '!src/test/**'];
var dbgSrc = ['src/**/*.js', '!src/test/**'];
var uglifySrc = ['src/**/*.js', '!src/test/**'];
var copyoverSrc = ['src/**/*', '!src/**/*.js','!src/test/**', '!src/test/'];

// clean dist
gulp.task('cleandist', function(){
    return del(['dist/**']);
});

// copy source code from src/ to dist/
gulp.task('src2dist', function(){
    return gulp.src(copyoverSrc)
            .pipe(gulp.dest('dist'));
});


// create Component preload
gulp.task('ui5preload', function() {
    return gulp.src(preloadSrc)
        .pipe(gulpif('**/*.js', uglify())) //only pass .js files to uglify 
        .pipe(gulpif('**/*.xml', prettydata({
            type: 'minify'
        }))) // only pass .xml to prettydata  
        .pipe(ui5preload({
            base: 'src',
            namespace: 'sap.ui.demo.wt'
        }))
        .pipe(gulp.dest('dist'));
});


// create dbg version of js source code
gulp.task('dbg', function() {
    return gulp.src(dbgSrc)
        .pipe(rename(function(path){
            path.basename += '-dbg';
        }))
        .pipe(gulp.dest('dist'));
});

// uglify js source code into compressed version
gulp.task('compress', function() {
  return gulp.src(uglifySrc)
    .pipe(uglify())
    .pipe(gulp.dest('dist'));
});

gulp.task('build', function(callback) {
  runSequence('cleandist',
                'src2dist',
                'ui5preload',
                'dbg',
                'compress',
              callback);
});
// gulp.task('default', ['cleandist', 'src2dist', 'ui5preload', 'dbg', 'compress']);