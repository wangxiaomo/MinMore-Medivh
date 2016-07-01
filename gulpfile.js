var config = require("./config.json");
var gulp = require("gulp"),
    cssmin = require("gulp-cssmin"),
    imagemin = require("gulp-imagemin"),
    filter = require("./filter.js"), // Hack gulp-filter using abs path
    del = require("del");

gulp.task("clean", function() {
  del([config.build]);
});

gulp.task("cssmin", function() {
  gulp.src(config.assets_directory + "**")
    .pipe(filter("**/*.css"))
    .pipe(cssmin({showLog:config.verbose}))
    .pipe(gulp.dest(config.build));
});

gulp.task("imagemin", function() {
  gulp.src(config.assets_directory + "**")
    .pipe(filter([
      "**/*.png", "**/*.jpg"
    ]))
    .pipe(imagemin({verbose:config.verbose}))
    .pipe(gulp.dest(config.build));
});
