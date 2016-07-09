var config = require("./config.json");
var gulp = require("gulp"),
    gulpif = require("gulp-if"),
    cleancss = require("gulp-clean-css"),
    cssmin = require("gulp-cssmin"),
    imagemin = require("gulp-imagemin"),
    sass = require("gulp-sass"),
    uglify = require("gulp-uglify"),
    changed = require("gulp-changed"),
    filter = require("./filter.js"), // Hack gulp-filter using abs path
    watch = require("gulp-watch"),
    pump = require("pump"),
    del = require("del");

config.sass_style = config.compress?"compressed":config.default_sass_style;
config.clean_css = config.compress?{}:{"keepBreaks": true};

gulp.task("clean", function() {
  del([config.build]);
});

gulp.task("sass", function(cb) {
  pump([
      gulp.src(config.assets_directory + "**"),
      filter("**/*.sass"),
      changed(config.build),
      sass({outputStyle:config.sass_style}),
      cleancss(config.clean_css),
      gulp.dest(config.build)
    ],
    cb
  );
});

gulp.task("css", function() {
  gulp.src(config.assets_directory + "**")
    .pipe(filter("**/*.css"))
    .pipe(changed(config.build))
    .pipe(cleancss(config.clean_css))
    .pipe(gulpif(config.compress, cssmin({showLog:config.verbose})))
    .pipe(gulp.dest(config.build));
});

gulp.task("image", function() {
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
      gulpif(config.compress, uglify()),
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
    gulp.start("css");
  });
  watch(config.assets_directory + "**/*.js", {verbose:config.verbose}, function(){
    gulp.start("js");
  });
  watch([
      config.assets_directory + "**/*.png",
      config.assets_directory + "**/*.jpg",
    ], {verbose:config.verbose}, function(){
      gulp.start("image");
    }
  );
});
