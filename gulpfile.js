const {src, dest, watch, parallel} = require('gulp')
const concat = require('gulp-concat')
const sass = require('gulp-sass')(require('sass'));
const csso = require('gulp-csso');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const uglyfly = require('gulp-uglyfly');

function styles() {
    return src('src/css/**/*.scss')
        .pipe(autoprefixer())
        .pipe(sass())
        .pipe(csso())
        .pipe(concat('style.min.css'))
        .pipe(dest('src/css'))
        .pipe(browserSync.stream())
}

function scripts() {
    return src(['src/js/**/*.js','!src/js/**/*.min.js'])
        
        .pipe(concat('script.min.js'))
        .pipe(uglyfly())
        .pipe(dest('src/js'))
        .pipe(browserSync.stream())
}

function reload() {
    browserSync.init({
        server: {
            baseDir: "src/"
        }
    });
}

function watching() {
    watch(['src/css/**/*.scss'], styles)
    watch(['src/*.html']).on('change', browserSync.reload)
    watch(['src/js**/*.js','!src/js**/*.min.js'], scripts)
}

function build() {
    return src(['src/js/**/*.min.js', 'src/css/**/*.min.css', 'src/**/*.html'], {base: 'src'})
        .pipe(dest('dist/'))
}

exports.styles = styles
exports.build = build
exports.default = parallel(styles, scripts, reload, watching)

