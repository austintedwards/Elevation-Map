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
    if (geocode_array.length>1){
      console.log(geocode_array)
      google_elevations("denver")
    }
})


const ACCESS_KEY = 'AIzaSyAj8bYpM2M0T8I4xRKqvToSn9_fsRYC6dc'

let google_locations = local => {
  $.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${local}&key=${ACCESS_KEY}`)
  .done(data => {
    geocode_array.push(data.results["0"])
  })
  .fail(()=> {
    console.log( "error" );
  })
}


//installing the map
  var uluru = {
    lat: 39.7392358,
    lng: -104.990251
  };
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 13,
    center: uluru
  });
  var marker = new google.maps.Marker({
    position: uluru,
    map: map
  });
});

$(document).on('click','.remove-location', function(){
      $(this).parent().fadeOut('slow');
      $(this).parent().remove()
  });
