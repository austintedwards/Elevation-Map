$(()=> {
let location_array = []
  // Initialize collapse button
  $(".button-collapse").sideNav({});

  $(".add-location").click(() => {
    let new_local = $(".location").val()
    $(".location-list").append(`<div class = '${new_local}'><li class ='col s10'>${new_local}</li><button class ='col s2 btn-flat remove-location'>X</button></div>`)
    location_array.push(new_local)
    $(".location").val('')
    console.log(location_array)
  })

  $(".location-list").click((event)=>{
    let text = $(event)["0"].target.parentNode.className
    var index = location_array.indexOf(text);
    if (index > -1) location_array.splice(index, 1)
    console.log(location_array)
  })

});

$(document).on('click','.remove-location', function(){
      $(this).parent().fadeOut('slow');
      $(this).parent().remove()
  });
