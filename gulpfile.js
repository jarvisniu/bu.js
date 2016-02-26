/**
 * Gulp config file for Bu.js - https://github.com/jarvisniu/Bu.js
 */

var fs = require('fs');

var gulp = require('gulp');
var del = require('del');
var open = require('open');

// Gulp plugins: coffee, concat, header, uglify, sourcemaps, jade, stylus, liveServer
var plugins = require('gulp-load-plugins')();

// config
var port = 8080;
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
        'examples/lib/**/*.js',
        'examples/lib/**/*.js.map',
        'examples/*.html',
        'examples/vue/*.css'
    ]
};

// atom tasks

gulp.task('clean', function () {
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

gulp.task('serve_examples', ['src_scripts', 'ext_scripts', 'examples', 'stylus'], function () {
    plugins.liveServer.static('./', port).start();
});

gulp.task('open_examples', ['serve_examples'], function () {
    open('http://localhost:' + port + '/examples/');
});

// compound tasks

gulp.task('build', ['clean', 'src_scripts', 'ext_scripts', 'stylus', 'examples']);

gulp.task('watch', function () {
    gulp.watch(paths.src_scripts, ['src_scripts']);
    gulp.watch(paths.ext_scripts, ['ext_scripts']);
    gulp.watch(paths.stylus, ['stylus']);
    gulp.watch(paths.examples, ['examples']);
});

gulp.task('run', ['build', 'serve_examples', 'open_examples']);

// default tasks

gulp.task('default', ['watch', 'build', 'run']);
