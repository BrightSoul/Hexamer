/// <binding BeforeBuild='build' />
var gulp = require('gulp');
var ts = require('gulp-typescript');
var rename = require('gulp-rename');

gulp.task('tsc', function () {
    return gulp.src('Scripts/**/*.ts')
        .pipe(ts({
            noImplicitAny: true,
            out: 'app.js',
            module: 'amd'
        }))
        .pipe(gulp.dest('wwwroot/js/'));
});
gulp.task('jquery', function () {
    return gulp
        .src('node_modules/jquery/dist/jquery.min.js')
        .pipe(gulp.dest('wwwroot/js'));
});
gulp.task('bootstrap', function () {
    return gulp
        .src('node_modules/bootstrap/dist/**/*')
        .pipe(gulp.dest('wwwroot'));
});
gulp.task('knockout', function () {
    return gulp
        .src('node_modules/knockout/build/output/knockout-latest.js')
        .pipe(rename("knockout.js"))
        .pipe(gulp.dest('wwwroot/js'));
});
gulp.task('knockout-amd-helpers', function () {
    return gulp
        .src('node_modules/knockout-amd-helpers/build/knockout-amd-helpers.min.js')
        .pipe(rename("knockout-amd-helpers.js"))
        .pipe(gulp.dest('wwwroot/js'));
});
gulp.task('requirejs', function () {
    return gulp
        .src('node_modules/requirejs/require.js')
        .pipe(gulp.dest('wwwroot/js'));
});
gulp.task('requirejs-text', function () {
    return gulp
        .src('node_modules/requirejs-text/text.js')
        .pipe(gulp.dest('wwwroot/js'));
});
gulp.task('requirejs-domready', function () {
    return gulp
        .src('node_modules/requirejs-domready/domReady.js')
        .pipe(gulp.dest('wwwroot/js'));
});
gulp.task('build', ['tsc', 'jquery', 'bootstrap', 'knockout', 'knockout-amd-helpers', 'requirejs', 'requirejs-text', 'requirejs-domready']);