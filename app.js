$(()=> {
let location_array = []
let geocode_array=[]
let elevation_sortable = [];
//installing the map
  const center = {
    lat: 0,
    lng: 0
  };
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 2,
    center: center
  });


  // Initialize collapse button
  $(".button-collapse").sideNav({});

  $(".add-location").click(() => {
    let new_local = $(".location").val()
    if (new_local.match(/[a-z]/i)){
    $(".location-list").append(`<div class = '${new_local}'><li class ='col s10'>${new_local}</li><button class ='col s2 btn-flat remove-location'>X</button></div>`)
    location_array.push(new_local)
    google_locations(new_local)
  }else{
    alert("Please only include text in the input.")
  }
    $(".location").val('')
  })

  $(".location-list").on("click",".remove-location",(event)=>{
    let text = $(event)["0"].target.parentNode.className
    let index = location_array.indexOf(text);
    if (index > -1) geocode_array.splice(index, 1)
    if (index > -1) location_array.splice(index, 1)
    if (index > -1) elevation_sortable.splice(index, 1)
  })

  $(".sort-elevations").click(() => {
    $(".elevation-list").empty()
    if (geocode_array.length>=1){
      console.log(elevation_sortable)
      sort(elevation_sortable, elevation_sortable.length )
      $(".elevation-list").append(`<h6>Elevations Decending:</h6>`)

     elevation_sortable.forEach(local =>{
       let marker = new google.maps.Marker({
         position: local[2],
         map: map
       });
       console.log(local)
       let place = local[0]
       let location = local[2]

       let height = local[1].toFixed(2)
       $(".elevation-list").append(`<li class ='${place}'>${place}: ${height} meters</li>`)
     }
     )
     map.setCenter(elevation_sortable[0][2])
     map.setZoom(10);

    }else{
      alert("Please add location")
    }

})

$(".elevation-list").on("click","li",(event)=>{
  let local_text = event.currentTarget.className
  for(let i =0; i<elevation_sortable.length; i++){
    if(elevation_sortable[i][0]===local_text){
      let local_spot = elevation_sortable[i][2]
      map.setCenter(local_spot)
      map.setZoom(10);
    }
  }

})


const ACCESS_KEY = 'AIzaSyAj8bYpM2M0T8I4xRKqvToSn9_fsRYC6dc'

let google_locations = local => {
  $.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${local}&key=${ACCESS_KEY}`)
  .done(data => {
    geocode_array.push(data.results["0"])
    google_elevations(geocode_array[geocode_array.length-1])

  })
  .fail(()=> {
    console.log( "error" );
  })
}



  let google_elevations = local =>{
    let elevator = new google.maps.ElevationService;
    elevator.getElevationForLocations({'locations':[local.geometry.location]}, results=>{
      elevation_sortable.push([local.formatted_address, results["0"].elevation, local.geometry.location])
})
}

let sort = (array,n) => {
  if (n===1) return ;

  for(let i=0; i<n-1;i++){
    if (array[i][1] < array[i+1][1]){
      let a = array[i]
      array[i] = array[i+1]
      array[i+1] = a
    }
  }
  sort(array, n-1)

}


});

$(document).on('click','.remove-location', function(){
      $(this).parent().fadeOut('slow');
      $(this).parent().remove()
  });
