const gulp = require('gulp');

const jsmin = require('gulp-jsmin');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');

gulp.task('build', () => {
    gulp.src('./src/**/*.js')
        .pipe(jsmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist'));

    gulp.src('./src/**/*.scss')
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./dist'));
});

gulp.task('dev', () => {
    gulp.watch('./src/**/*', ['build']);
})