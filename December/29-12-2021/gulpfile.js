let gulp = require('gulp');
let concat = require('gulp-concat');

gulp.task('js', function () {
    return gulp.src(['./*.js'])
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/'));
});

// gulp.task('watch', function () {
//     gulp.watch('./*.js', ['js']);
// });