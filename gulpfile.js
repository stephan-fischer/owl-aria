'use strict';
 
const gulp = require('gulp');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const minify = require('gulp-minifier');
const source =  'src/js/**';
const dist = 'dist/js/';

gulp.task('dist', () =>
{
    return gulp.src(source)
    .pipe(sourcemaps.init())
    .pipe(concat('owl.carousel.aria.js'), {
      newLine: '\n;'
    })
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(gulp.dest(dist))
    .pipe(rename('owl.carousel.aria.min.js'))
    .pipe(minify({
        minify: true,
        minifyJS: {
          sourceMap: false
        }
    }))
    .pipe(gulp.dest(dist));
});






gulp.task('default', ['dist']);