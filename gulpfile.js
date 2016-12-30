var gulp = require('gulp'),
    del = require('del'),
    sass = require('gulp-sass'),
    // image = require('gulp-image'),
    imagemin = require('gulp-imagemin'),
    imageminMozjpeg = require('imagemin-mozjpeg'),
    spritesmith = require('gulp.spritesmith'),
    merge = require('merge-stream'),
    buffer = require('vinyl-buffer');

//Clean up production files
gulp.task('clean', function(){
  del('./prod/*');
})

//Make sprite image
gulp.task('sprite', function () {
  var spriteData = gulp.src('dev/img/sprite/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    cssName: '_sprites.scss',
    padding: 8
  }));

  var imgStream = spriteData.img,
      cssStream = spriteData.css;

  imgStream
    // .pipe(buffer())
    // .pipe(image())
    .pipe(gulp.dest('dev/img/'));
  cssStream.pipe(gulp.dest('dev/sass/modules/'));

  return merge(imgStream, cssStream);
});


//Minify Images
// gulp.task('img', function(){
//   gulp.src(['./dev/img/*.jpg','./dev/img/*.png'])
//   .pipe(image({
//     jpegRecompress: true,
//     jpegoptim: false,
//     mozjpeg: false
//   }))
//   .pipe(gulp.dest('./prod/img/'))
// });

//Minify Images 2
gulp.task('image', function(){
  gulp.src(['./dev/img/*.jpg','./dev/img/*.png'])
  .pipe(imagemin([
    imageminMozjpeg({
      quality: 92
    })
  ]))
  .pipe(gulp.dest('./prod/img/'))
});

// Transpile SCSS
gulp.task('sass', function() {
  gulp.src('./dev/sass/*.scss')
  .pipe(sass({
    outputStyle: 'compressed'
  }).on('error', sass.logError))
  .pipe(gulp.dest('./prod/'));
});

gulp.task('watch', function() {
  gulp.watch('dev/sass/**/*.scss', ['sass']);
  gulp.watch(['dev/img/*'], ['image']);
  gulp.watch(['dev/img/sprite/*'], ['sprite']);
});

gulp.task('default', ['sprite','image','sass']);