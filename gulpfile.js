var config = require("./config.json");
var gulp = require("gulp"),
    cssmin = require("gulp-cssmin"),
    imagemin = require("gulp-imagemin"),
    sass = require("gulp-sass"),
    uglify = require("gulp-uglify"),
    filter = require("./filter.js"), // Hack gulp-filter using abs path
    pump = require("pump"),
    del = require("del");

gulp.task("clean", function() {
  del([config.build]);
});

gulp.task("sass", function(cb) {
  pump([
      gulp.src(config.assets_directory + "**"),
      filter("**/*.sass"),
      sass({outputStyle:config.sass_style}),
      gulp.dest(config.build)
    ],
    cb
  );
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

gulp.task("js", function(cb) {
  pump([
      gulp.src(config.assets_directory + "**"),
      filter("**/*.js"),
      uglify(),
      gulp.dest(config.build)
    ],
    cb
  );
});
