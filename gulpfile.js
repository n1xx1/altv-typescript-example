const gulp = require("gulp");
const nodemon = require("gulp-nodemon");
const log = require("fancy-log");
const webpack = require("webpack");
const webpackConfig = require("./webpack.config.js");

function webpackBuild() {
    return new Promise((resolve, reject) => {
        const compiler = webpack(webpackConfig());
        compiler.run((err, stats) => {
            if (err) {
                return reject(err);
            }
            if (stats.hasErrors()) {
                return reject(new Error(stats.compilation.errors.join("\n")));
            }
            resolve();
        });
    });
}
exports.webpackWatch = webpackWatch;

function webpackWatch() {
    return new Promise((resolve, reject) => {
        const compiler = webpack(webpackConfig());
        compiler.watch({}, (err, stats) => {
            if (err) {
                return reject(err);
            }
            if (stats.hasErrors()) {
                log.error(stats.compilation.errors.join("\n"));
                resolve();
                return;
            }
            for (const stat of stats.stats) {
                const entries = Array.from(stat.compilation.entrypoints.keys()).join("\", \"");
                log.info(`webpack builded ["${entries}"] in ${stat.endTime - stat.startTime}ms`);
            }
            resolve();
        });
    });
}
exports.webpackBuild = webpackBuild;

function server(cb) {
    nodemon({ 
        exec: "\"cd ../.. && altv-server.exe\"", 
        watch: ["./build"],
    }, cb);
}
exports.server = server;

exports.build = gulp.series(webpackBuild);

exports.run = gulp.series(webpackWatch, server);
