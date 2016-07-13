var $ = require('jquery')
require('pjax')

$(document).on('click', 'a:not([data-exclude])', function (event) {
  $.pjax.click(event, {
    container: 'main',
    fragment : 'main'
  })
})
