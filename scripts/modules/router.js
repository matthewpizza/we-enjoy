require(['jquery', 'pjax'], function ($) {

  $(document).on('click', 'a:not([data-exclude])', function (event) {
    $.pjax.click(event, {
      container: 'main',
      fragment:  'main'
    })
  })

})