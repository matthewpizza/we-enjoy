require(['jquery', 'pjax'], function ($) {

  $(document).pjax('a:not([data-exclude])', 'main')

})