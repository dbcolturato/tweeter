//responsible for the character counter
$(document).ready(function() {
  $('#tweet-text').on('keyup', function() {
    let chars = $(this).val().length;
    $('#counter').val(140 - chars);
    if ($('#counter').val() < 0) {
      $('#counter').css('color', 'red');
    } else {
      $('#counter').css('color', 'black');
    }

  });
});