var Imagemin = require('imagemin');

var imagemin = new Imagemin()
  .src('assets/*.{gif,jpg,jpeg,png}')
  .dest('assets')
  .use(Imagemin.gifsicle({ interlaced: true }))
  .use(Imagemin.jpegtran({ progressive: true }))
  .use(Imagemin.optipng({ optimizationLevel: 3 }))
  .use(Imagemin.pngquant());

imagemin.run(function (err, files) {
  if (err) {
    throw err;
  }
});