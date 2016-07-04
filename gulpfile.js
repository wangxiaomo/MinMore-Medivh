var config = require("./config.json");
var gulp = require("gulp"),
    cssmin = require("gulp-cssmin"),
    imagemin = require("gulp-imagemin"),
    sass = require("gulp-sass"),
    uglify = require("gulp-uglify"),
    changed = require("gulp-changed"),
    filter = require("./filter.js"), // Hack gulp-filter using abs path
    watch = require("gulp-watch"),
    pump = require("pump"),
    del = require("del");

gulp.task("clean", function() {
  del([config.build]);
});

gulp.task("sass", function(cb) {
  pump([
      gulp.src(config.assets_directory + "**"),
      filter("**/*.sass"),
      changed(config.build),
      sass({outputStyle:config.sass_style}),
      gulp.dest(config.build)
    ],
    cb
  );
});

gulp.task("cssmin", function() {
  gulp.src(config.assets_directory + "**")
    .pipe(filter("**/*.css"))
    .pipe(changed(config.build))
    .pipe(cssmin({showLog:config.verbose}))
    .pipe(gulp.dest(config.build));
});

gulp.task("imagemin", function() {
  gulp.src(config.assets_directory + "**")
    .pipe(filter([
      "**/*.png", "**/*.jpg"
    ]))
    .pipe(changed(config.build))
    .pipe(imagemin({verbose:config.verbose}))
    .pipe(gulp.dest(config.build));
});

gulp.task("js", function(cb) {
  pump([
      gulp.src(config.assets_directory + "**"),
      filter("**/*.js"),
      changed(config.build),
      uglify(),
      gulp.dest(config.build)
    ],
    cb
  );
});

gulp.task("watch", function() {
  watch(config.assets_directory + "**/*.sass", {verbose:config.verbose}, function(){
    gulp.start("sass");
  });
  watch(config.assets_directory + "**/*.css", {verbose:config.verbose}, function(){
    gulp.start("cssmin");
  });
  watch(config.assets_directory + "**/*.js", {verbose:config.verbose}, function(){
    gulp.start("js");
  });
  watch([
      config.assets_directory + "**/*.png",
      config.assets_directory + "**/*.jpg",
    ], {verbose:config.verbose}, function(){
      gulp.start("imagemin");
    }
  );
});
