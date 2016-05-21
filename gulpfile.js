var gulp = require('gulp'),
    ts = require('gulp-typescript'),
    tsProj = ts.createProject('tsconfig.json'),
    tsconfig = require('./tsconfig.json'),
    outDir = tsconfig.compilerOptions.outDir || 'dist';

gulp.task('build', () => {
    return tsProj
        .src()
        .pipe(ts(tsProj))
        .pipe(gulp.dest(outDir));
});

gulp.task('watch', ['build'], () => {
    gulp.watch('src/**/*.ts', ['build']);
});
