"use strict";

const gulp = require("gulp");
const browserify = require("browserify");
const babelify = require("babelify");
const source = require("vinyl-source-stream");

const PATHS = {
    clientStaticFiles: "client/**/*.{html,css,gif}",
    dist: "server/public"
};

gulp.task("copyStaticFiles", function () {
    return gulp
        .src(PATHS.clientStaticFiles)
        .pipe(gulp.dest(PATHS.dist));    
});

gulp.task("bundle", function () {
    return browserify({entries: "./client/main.js", debug: true})
        .transform(babelify)
        .bundle()
        .pipe(source("bundle.js"))
        .pipe(gulp.dest(PATHS.dist));    
});

gulp.task("build", ["copyStaticFiles", "bundle"], function () {
});

gulp.task("default", ["build"], function () {
});
