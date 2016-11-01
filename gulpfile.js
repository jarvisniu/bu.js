/**
 * Gulp config file for Bu.js - https://github.com/jarvisniu/Bu.js
 */

var fs = require('fs');
var path = require('path');

var gulp = require('gulp');
var del = require('del');
var open = require('open');

// Gulp plugins: coffee, concat, header, uglify, sourcemaps, jade, stylus, liveServer
var plugins = require('gulp-load-plugins')();

// config
var port = 3000;
var header = '// Bu.js - https://github.com/jarvisniu/Bu.js\n';
var paths = {
    src_scripts: [
        'src/Bu.coffee',
        'src/math/*.coffee',
        'src/core/*.coffee',
        'src/shapes/*.coffee',
        'src/drawable/*.coffee',
        'src/anim/*.coffee',
        'src/extra/*.coffee'
    ],
    ext_scripts: [
        'examples/lib/**/*.coffee'
    ],
    stylus: [
        'examples/vue/*.styl'
    ],
    examples: [
        'examples/*.jade'
    ],
    clean: [
        'build/*',
        'src/**/*.js',
        'src/**/*.js.map',
        'examples/lib/*/*.js',
        'examples/lib/*/*.js.map',
        'examples/*.html',
        'examples/vue/*.css'
    ],
    dist: [
        'logo.png',
        'build/*.js',
        'examples/assets/**',
        'examples/*.html',
        'examples/*.htm',
        'examples/js/*.js',
        'examples/lib/a-star/*.js*',
        'examples/lib/morph/*.js*',
        'examples/lib/reactor/*.js*',
        'examples/vue/*.vue',
        'examples/vue/*.css',
        'examples/vue/icons/*',
    ],
    distTo: 'dist/'
};

// tasks

gulp.task('clean_src', function () {
    return del(paths.clean);
});

gulp.task('src_scripts', function () {
    return gulp.src(paths.src_scripts)
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.coffee())
        .pipe(plugins.concat('bu.js'))
        .pipe(plugins.header(header))
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest('build/'));
});

gulp.task('min', function () {
    return gulp.src(paths.src_scripts)
        .pipe(plugins.concat('bu.min.js'))
        .pipe(plugins.coffee())
        .pipe(plugins.uglify())
        .pipe(plugins.header(header))
        .pipe(gulp.dest('build/'));
});

gulp.task('ext_scripts', function () {
    return gulp.src(paths['ext_scripts'])
        // TODO add sourcemaps
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.coffee())
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest('examples/lib/'));
});

gulp.task('examples', function () {
    return gulp.src(paths.examples)
        .pipe(plugins.jade({
            pretty: true
        }))
        .pipe(gulp.dest('examples/'));
});

gulp.task('stylus', function () {
    return gulp.src(paths.stylus)
        .pipe(plugins.stylus())
        .pipe(gulp.dest('examples/vue/'));
});

gulp.task('serve_examples', ['build'], function () {
    plugins.liveServer.static('./', port).start();
});

gulp.task('open_examples', ['serve_examples'], function () {
    open('http://localhost:' + port + '/examples/');
});

gulp.task('clean', ['clean_src', 'clean_dist']);

gulp.task('build', ['clean_src', 'src_scripts', 'ext_scripts', 'stylus', 'examples']);

gulp.task('watch', function () {
    gulp.watch(paths.src_scripts, ['src_scripts']);
    gulp.watch(paths.ext_scripts, ['ext_scripts']);
    gulp.watch(paths.stylus, ['stylus']);
    gulp.watch(paths.examples, ['examples']);
});

gulp.task('run', ['build', 'serve_examples', 'open_examples']);

// distribution

gulp.task('clean_dist', function () {
    return del(paths.distTo + '**');
});

gulp.task('build_dist', ['clean_dist', 'build'], function () {
    for (var i in paths.dist)
        gulp.src(paths.dist[i])
            .pipe(gulp.dest(paths.distTo + path.dirname(paths.dist[i])));
});

gulp.task('serve_dist', ['build_dist'], function () {
    plugins.liveServer.static('./', port).start();
});

gulp.task('open_dist', ['serve_dist'], function () {
    open('http://localhost:' + port + '/' + paths.distTo + 'examples/');
});

gulp.task('dist', ['open_dist']);

// default

gulp.task('default', ['watch', 'build', 'run']);
