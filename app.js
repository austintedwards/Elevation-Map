$(()=> {
let location_array = []
let geocode_array=[]
  // Initialize collapse button
  $(".button-collapse").sideNav({});

  $(".add-location").click(() => {
    let new_local = $(".location").val()
    $(".location-list").append(`<div class = '${new_local}'><li class ='col s10'>${new_local}</li><button class ='col s2 btn-flat remove-location'>X</button></div>`)
    location_array.push(new_local)
    google_locations(new_local)
    $(".location").val('')
  })

  $(".location-list").click((event)=>{
    let text = $(event)["0"].target.parentNode.className
    var index = location_array.indexOf(text);
    if (index > -1) location_array.splice(index, 1)
  })

  $(".sort-elevations").click(() => {
    if (location_array.length>1){
      locations
    }
})


const ACCESS_KEY = 'AIzaSyAj8bYpM2M0T8I4xRKqvToSn9_fsRYC6dc'

let google_locations = (local)=>{
  $.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${local}&key=${ACCESS_KEY}`, data =>{
  })
  .done((data)=>{
    console.log(data)
  })
  .fail(()=> {
    console.log( "error" );
  })
}


});

$(document).on('click','.remove-location', function(){
      $(this).parent().fadeOut('slow');
      $(this).parent().remove()
  });
