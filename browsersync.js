const browserSync = require('browser-sync').create();

browserSync.init({
  server: {
    baseDir: './www'
  },
  files: ['./www/**/*']
});
