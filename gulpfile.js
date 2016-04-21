"use strict";

const gulp = require("gulp");
const babel = require("gulp-babel");
const browserify = require("gulp-browserify");

const PATHS = {
    clientStaticFiles: "client/**/*.{html,css,gif}",
    clientJavaScriptFiles: "client/**/*.js",
    clientLibs: [
        "node_modules/rx/dist/rx.all.js",
        "node_modules/@cycle/core/dist/cycle.js",
        "node_modules/@cycle/dom/dist/cycle-dom.js"
    ],
    dist: "server/public"
};

gulp.task("copyStaticFiles", function () {
    return gulp
        .src(PATHS.clientStaticFiles)
        .pipe(gulp.dest(PATHS.dist));    
});

gulp.task("copyLibs", function () {
    return gulp
        .src(PATHS.clientLibs)
        .pipe(gulp.dest(PATHS.dist));    
});

gulp.task("transpile", function () {
    return gulp
        .src(PATHS.clientJavaScriptFiles)
        .pipe(babel({
            presets: ["es2015"]
        }))
        .pipe(gulp.dest(PATHS.dist))
});

gulp.task("build", ["copyStaticFiles", "copyLibs", "transpile"], function () {
});

gulp.task("default", ["build"], function () {
});
