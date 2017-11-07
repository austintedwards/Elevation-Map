$(()=> {
let location_array = []
let geocode_array=[]
let elevation_obj = {}
var elevation_sortable = [];

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
      sort(elevation_sortable, elevation_sortable.length )

    }

})


const ACCESS_KEY = 'AIzaSyAj8bYpM2M0T8I4xRKqvToSn9_fsRYC6dc'

let google_locations = local => {
  $.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${local}&key=${ACCESS_KEY}`)
  .done(data => {
    geocode_array.push(data.results["0"])
    var marker = new google.maps.Marker({
      position: data.results["0"].geometry.location,
      map: map
    });
    google_elevations(geocode_array[geocode_array.length-1])

  })
  .fail(()=> {
    console.log( "error" );
  })
}

//installing the map
  var center = {
    lat: 0,
    lng: 0
  };
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 2,
    center: center
  });


  let google_elevations = local =>{
    var elevator = new google.maps.ElevationService;
    elevator.getElevationForLocations({'locations':[local.geometry.location]}, results=>{
      elevation_sortable.push([local.formatted_address, results["0"].elevation])
})
}

let sort = (array,n) => {
  if (n===1) return;

  for(var i=0; i<n-1;i++){
    if (array[i][1] < array[i+1][1]){
      var a = array[i]
      array[i] = array[i+1]
      array[i+1] = a
    }
  }
  console.log(array)
  sort(array, n-1)

}


});

$(document).on('click','.remove-location', function(){
      $(this).parent().fadeOut('slow');
      $(this).parent().remove()
  });
