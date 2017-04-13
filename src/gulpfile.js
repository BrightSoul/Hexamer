/// <binding BeforeBuild='build' />
var gulp = require('gulp');
var ts = require('gulp-typescript');

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
        .src('bower_components/jquery/dist/jquery.min.js')
        .pipe(gulp.dest('wwwroot/js'));
});
gulp.task('bootstrap', function () {
    return gulp
        .src('bower_components/bootstrap/dist/**/*')
        .pipe(gulp.dest('wwwroot'));
});
gulp.task('knockout', function () {
    return gulp
        .src('bower_components/knockout/dist/knockout.js')
        .pipe(gulp.dest('wwwroot/js'));
});
gulp.task('require', function () {
    return gulp
        .src('bower_components/requirejs/require.js')
        .pipe(gulp.dest('wwwroot/js'));
});
gulp.task('build', ['tsc', 'jquery', 'bootstrap', 'knockout', 'require']);