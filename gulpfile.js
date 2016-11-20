/**
 * Gulp config file for Bu.js - https://github.com/jarvisniu/Bu.js
 */

// ------------------------------------------------------------
// Requires
// ------------------------------------------------------------

var fs = require('fs');
var path = require('path');

var gulp = require('gulp');
var del = require('del');
var open = require('open');

// Gulp plugins: coffee, concat, header, uglify, sourcemaps, liveServer
var plugins = require('gulp-load-plugins')();

// Get version number from `package.json`
var BU_VER = require('./package.json').version;

// ------------------------------------------------------------
// Configs
// ------------------------------------------------------------

var port = 3000;
var header = '// Bu.js v' + BU_VER + ' - https://github.com/jarvisniu/Bu.js\n';
var paths = {
    src: [
        'src/Bu.coffee',
        'src/math/*.coffee',
        'src/base/*.coffee',
        'src/core/*.coffee',
        'src/shapes/*.coffee',
        'src/drawable/*.coffee',
        'src/anim/*.coffee',
        'src/input/*.coffee',
        'src/extra/*.coffee',
    ],
    ext: [
        'examples/lib/**/*.coffee',
    ],
    clean: [
        'build/*',
        'src/**/*.js',
        'src/**/*.js.map',
        'examples/lib/*/*.js',
        'examples/lib/*/*.js.map',
    ],
    dist: [
        'logo.png',
        'build/bu.min.js',
        'examples/assets/**',
        'examples/css/*.css',
        'examples/js/*.js',
        'examples/lib/a-star/*.js*',
        'examples/lib/morph/*.js*',
        'examples/lib/reactor/*.js*',
    ],
    dist_html: 'examples/*.html',
    distTo: 'dist/',
};

// ------------------------------------------------------------
// Basal tasks
// ------------------------------------------------------------

gulp.task('clean', function () {
    del(paths.clean);
    del(paths.distTo + '**');
});

gulp.task('max', function () {
    return gulp.src(paths.src)
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.coffee())
        .pipe(plugins.concat('bu.js'))
        .pipe(plugins.header(header))
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest('build/'));
});

gulp.task('min', function () {
    return gulp.src(paths.src)
        .pipe(plugins.concat('bu.min.js'))
        .pipe(plugins.coffee())
        .pipe(plugins.uglify())
        .pipe(plugins.header(header))
        .pipe(gulp.dest('build/'));
});

gulp.task('ext', function () {
    return gulp.src(paths['ext'])
        // TODO add sourcemaps
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.coffee())
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest('examples/lib/'));
});

gulp.task('serve_examples', ['build'], function () {
    plugins.liveServer.static('./', port).start();
});

gulp.task('open_examples', ['serve_examples'], function () {
    open('http://localhost:' + port + '/examples/');
});

gulp.task('build', ['clean', 'max', 'min', 'ext']);

gulp.task('watch', function () {
    gulp.watch(paths.src, ['max']);
    gulp.watch(paths.ext, ['ext']);
});

gulp.task('run', ['build', 'serve_examples', 'open_examples']);

// ------------------------------------------------------------
// Final tasks
// ------------------------------------------------------------

// Distribution the lib and examples
gulp.task('dist', ['build'], function () {
    for (var i in paths.dist)
        gulp.src(paths.dist[i])
            .pipe(gulp.dest(paths.distTo + path.dirname(paths.dist[i])));
    gulp.src(paths.dist_html)
        .pipe(plugins.replace('../build/bu.js', '../build/bu.min.js'))
        .pipe(gulp.dest(paths.distTo + path.dirname(paths.dist_html)));

    plugins.liveServer.static('./', port).start();
    open('http://localhost:' + port + '/' + paths.distTo + 'examples/');
});

// Build two versions (dev and min) of the library
gulp.task('release', ['min', 'max']);

// Default task: start to develop
gulp.task('default', ['watch', 'build', 'run']);
