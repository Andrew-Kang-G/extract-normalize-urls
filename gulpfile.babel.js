import gulp from 'gulp';
import mocha from 'gulp-mocha';
import ts from 'gulp-typescript';
import webpack from 'webpack';
import webpackStream from 'webpack-stream';
import webpackConfig from './webpack.config.babel';

const tsProject = ts.createProject('tsconfig.json');

const routes = {
    typescript: {
        src: 'src/**/*.ts',
        dest: 'dist',
    },
    test: 'test/**/*.ts',
};

// Compile TypeScript files
const typescript = () =>
    tsProject
        .src()
        .pipe(tsProject())
        .js.pipe(gulp.dest(routes.typescript.dest));

// Run tests
const test = () =>
    gulp.src(routes.test, { read: false })
        .pipe(mocha({
            reporter: 'list',
            require: ['ts-node/register'],
            exit: true,
        }))
        .on('error', console.error);

// Webpack bundling
const webpackTask = (callback) => {
    webpackStream(webpackConfig, webpack)
        .pipe(gulp.dest(routes.typescript.dest))
        .on('end', callback)
        .on('error', (err) => {
            console.error(err);
            callback(err);
        });
};

// Watch files for changes
const watch = () => {
    gulp.watch(routes.typescript.src, gulp.series(typescript, webpackTask));
    gulp.watch(routes.test, test);
};

// Define Gulp tasks
export const dev = gulp.series(typescript, webpackTask, test, watch);
export const build = gulp.series(typescript, webpackTask);
export const runTest = test;
export default dev;

// Export individual tasks for CLI usage
exports.test = test;
exports.typescript = typescript;
exports.webpack = webpackTask;
