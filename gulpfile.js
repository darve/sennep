
/**
 * Behold, a super useful set of GULP tasks.
 */

var gulp            = require('gulp'),
    del             = require('del'),
    sass            = require('gulp-sass'),
    processhtml     = require('gulp-processhtml'),
    autoprefixer    = require('gulp-autoprefixer'),
    mincss          = require('gulp-minify-css'),
    concat          = require('gulp-concat'),
    uglify          = require('gulp-uglify'),
    size            = require('gulp-filesize'),
    jshint          = require('gulp-jshint');

/**
 * This task compiles, nay transforms my sass into a hard
 * shiny peg of truth (CSS). Compiles scss files for dev.
 */
gulp.task('sass', function() {
    gulp.src('./scss/*.scss')
    .pipe(sass())
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
    .pipe(mincss())
    .pipe(gulp.dest('./app/assets/css'));
});

/**
 * This task is used to verify that I am not taking crazy pills
 * and that my javascript is in fact perfectly formed.
 */
gulp.task('jshint', function() {
    gulp.src('./app/assets/scripts/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
});

/**
 * This task monitors file changes and compiles the scss and lints
 * the javascript.
 */
gulp.task('watch', function() {
    gulp.watch('scss/**', ['sass']);
    gulp.watch('app/assets/js/**/*.js', ['jshint']);
});

/**
 * This task is used to lint and minify everything and stick
 * it in a folder called 'prod'.
 */
gulp.task('build', function() {

    // If the prod directory exists, delete it.
    del(['prod'], function() {

        // Copy over any html files
        gulp.src(['app/*.html'])
            .pipe(processhtml())
            .pipe(gulp.dest('prod'));

        // Copy over any images
        gulp.src(['app/assets/img/**/*'])
            .pipe(gulp.dest('prod/assets/img'));

        // Copy over any vendor files
        gulp.src(['app/assets/vendor/**/*'])
            .pipe(gulp.dest('prod/assets/vendor'));

        // JS
        gulp.src('./app/assets/scripts/**/*.js')
            .pipe(concat('app.js'))
            .pipe(jshint())
            .pipe(jshint.reporter('default'))
            .pipe(gulp.dest('./prod/assets/scripts'))
            .pipe(size())
            .pipe(concat('app.min.js'))
            .pipe(uglify())
            .pipe(gulp.dest('./prod/assets/scripts'))
            .pipe(size());

        // SCSS
        gulp.src('./scss/*.scss')
            .pipe(sass())
            .pipe(autoprefixer({
                browsers: ['last 2 versions'],
                cascade: false
            }))
            .pipe(concat('app.css'))
            .pipe(gulp.dest('./prod/assets/css'))
            .pipe(size())
            .pipe(concat('app.min.css'))
            .pipe(mincss())
            .pipe(gulp.dest('./prod/assets/css'))
            .pipe(size());

    });
});

/**
 * Deletes the prod folder
 */
gulp.task('clean', function() {
    del(['prod']);
});
