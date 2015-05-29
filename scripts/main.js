requirejs.config({
  paths: {
    app:    '/scripts/modules',
    jquery: '/scripts/vendor/jquery.min',
    pjax:   '/scripts/vendor/jquery.pjax'
  },
  shim: {
    pjax: {
      deps: ['jquery']
    }
  }
})

requirejs([
  'app/router'
])