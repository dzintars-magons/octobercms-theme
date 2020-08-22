const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const autoprefix = require('gulp-autoprefixer');
const {parallel} = require('gulp');
const {series} = require('gulp');

const jsPath = './assets/js/main.js';
const scssPath = './assets/scss/main.scss';


//compile scss into css
function style(){
    
    return gulp.src(scssPath)
    .pipe(sourcemaps.init())
    .pipe(sass({
        includePaths: scssPath,
        outputStyle: 'compressed'
    })
    .on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(autoprefix('last 4 versions'))
    .pipe(gulp.dest('./assets/css')) 
    .pipe(browserSync.stream());
}

function styleDev(){
    
        return gulp.src(scssPath)
        .pipe(sourcemaps.init())
        .pipe(sass({
            includePaths: scssPath
        })
        .on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./assets/css')) 
        .pipe(browserSync.stream());
    }

function js(){
    return gulp.src(jsPath)
    .pipe(sourcemaps.init())
    .pipe(concat('all.js'))
    .pipe(terser())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./assets/js/min'));
}

function jsDev(){
    return gulp.src(jsPath)
    .pipe(sourcemaps.init())
    .pipe(concat('all.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./assets/js/min'));
}

function watch(){
    browserSync.init({
            proxy: "http://192.168.10.200/",
    });
    gulp.watch('./assets/scss/**/*.scss', styleDev);
    gulp.watch(['./**/*.html', './**/*.htm']).on('change', browserSync.reload);
    gulp.watch('./assets/js/main.js', jsDev).on('change', browserSync.reload);
    gulp.watch('./assets/img/**/*').on('change', browserSync.reload);
}

exports.style = style;

exports.build = parallel(style, js);
exports.buildDev = parallel(styleDev, jsDev);
exports.default= series(styleDev, jsDev, watch); 