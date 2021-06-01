function changedRadio() { 
  $.post('/marketplace/', {
    category: $('input[name="categoryRadio"]:checked').val(), 
    sort: $('input[name="sortRadio"]:checked').val(),
    name: $('input[id="searchInput"]').val()
  }, function(result){
    $(".display-items").html(result);
  });
}

function changeQty(valueChange){
  if (Number.isInteger(valueChange)){
    if (valueChange + parseInt($("#itemQty").val()) < 1){
      $("#itemQty").val(1);
    }
    else if (valueChange + parseInt($("#itemQty").val()) > 99){
      $("#itemQty").val(99);
    }
    else {
      $("#itemQty").val(valueChange + parseInt($("#itemQty").val()));
    }
  }
}

$(function() {
  $("#noFilterRadio").prop("checked", true);
  $("#nameRadio").prop("checked", true);

  $(".categoryRadio").on("change", changedRadio);
  $(".sortRadio").on("change", changedRadio);
  $(".searchButton").on("click", changedRadio);

  $(".btnQty").on("click", function(button){
    if (button.target.id == "plus") {
      changeQty(1);
    }
    else if (button.target.id == "minus") {
      changeQty(-1);
    }
  });

  $("#itemQty").on("change", function(){
    var btn = $("#itemQty");
    if (parseInt(btn.val()) < 1){
      btn.val(1);
    }
    else if (parseInt(btn.val()) > 99){
      btn.val(99);
    }
  });
});

$(function() {
  $('#search-button').on('click', function(e) {
    if($('#search-input-container').hasClass('hdn')) {
      $('#search-button').html('<span class="material-icons" aria-hidden="true">search_off</span>');
      $('#search-input-container').removeClass('hdn');
      return false;
    }
    else {
      $('#search-button').html('<span class="material-icons" aria-hidden="true">search</span>');
      $('#search-input-container').addClass('hdn')
      return false;
    }
  });
});