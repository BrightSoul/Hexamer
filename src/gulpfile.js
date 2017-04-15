/// <binding BeforeBuild='build' />
var gulp = require('gulp');
var ts = require('gulp-typescript');
var tsProject = ts.createProject('tsconfig.json');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var streamqueue = require('streamqueue');
var clean = require('gulp-clean');
var dotnet = require('gulp-dotnet');

gulp.task('app', function () {
    return tsProject.src()
        .pipe(tsProject())
        .js.pipe(gulp.dest("wwwroot/js"));
});
gulp.task('dotnet', function(cb) {
  return dotnet.build({ cwd: './' }, cb);
});
gulp.task('modules', function () {
    return streamqueue({ objectMode: true },
        gulp.src([
            'node_modules/requirejs-text/text.js',
            'node_modules/requirejs-domready/domReady.js',
            'node_modules/qs/dist/qs.js',
            //'node_modules/qs/dist/qs.js',
            //'node_modules/browser-cookies/src/browser-cookies.js',
        ]),
        gulp.src('node_modules/axios/dist/axios.min.js').pipe(rename('axios.js')),
        gulp.src('node_modules/js-cookie/src/js.cookie.js').pipe(rename('js-cookie.js')),
        gulp.src('node_modules/knockout-amd-helpers/build/knockout-amd-helpers.min.js').pipe(rename('knockout-amd-helpers.js'))
    ).pipe(gulp.dest('wwwroot/js'));
});
gulp.task('libs', function () {
    return streamqueue({ objectMode: true },
        gulp.src('node_modules/jquery/dist/jquery.min.js').pipe(rename('jquery.js')),
        gulp.src([
            'node_modules/requirejs/require.js',
            'Scripts/Config/require-config.js',
        ]),
        gulp.src('node_modules/bootstrap/dist/js/bootstrap.min.js').pipe(rename('bootstrap.js'))
    )
        .pipe(concat('libs.js'))
        .pipe(gulp.dest('wwwroot/js'));
});
gulp.task('styles', function () {
    return gulp.src([
            'node_modules/bootstrap/dist/css/bootstrap.min.css',
         ])
        .pipe(concat('bootstrap.css'))
        .pipe(gulp.dest('wwwroot/css'));
});
gulp.task('fonts', function () {
    return gulp.src([
        'node_modules/bootstrap/dist/fonts/*'
    ])
        .pipe(gulp.dest('wwwroot/fonts'));
});

gulp.task('clean', function () {
    gulp.src("wwwroot/js/**/*")
    .pipe(clean());
});

gulp.task('build', ['dotnet', 'libs', 'modules', 'app', 'styles', 'fonts']);