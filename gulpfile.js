/**
 * Created by Administrator on 3/25/2016.
 */
var gulp = require('gulp');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var csso = require('gulp-csso');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var templateCache = require('gulp-angular-templatecache');

//compile and minify the style.sass to style.css
gulp.task('sass', function () {
    gulp.src('public/stylesheets/style.scss')
        .pipe(plumber())
        .pipe(sass())
        .pipe(csso())
        .pipe(gulp.dest('public/stylesheets'));
});

//concatenate and minify js files into one file
gulp.task('compress', function() {
    gulp.src([
        'public/javascripts/*.js'
    ])
    .pipe(concat('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public'));
});

//watch changes and auto perform tasks
gulp.task('watch', function () {
    gulp.watch('public/stylesheets/*.scss', ['sass']);
    gulp.watch(['public/**/*.js', '!public/app.min.js', '!public/templates.js', '!public/vendor'], ['compress']);
});

//run tasks
gulp.task('default', ['sass', 'compress', 'watch']);