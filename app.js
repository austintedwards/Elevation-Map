$(() => {
  // Initialize collapse button
  $(".button-collapse").sideNav({});
  //staging arrays for input list, geolocations, and elevations sorted
  let location_array = []
  let geocode_array = []
  let elevation_sortable = [];
  //installing the map and earth center
  const center = {
    lat: 0,
    lng: 0
  };
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 2,
    center: center
  });
  //adding location to the list
  $(".add-location").click(() => {
    //set input value
    let new_local = $(".location").val()
    //confirm value is a letter
    if (new_local.match(/[a-z]/i)) {
      //adds to the list
      $(".location-list").append(`<div class = '${new_local}'><li class ='col s10'>${new_local}</li><button class ='col s2 btn-flat remove-location'>X</button></div>`)
      //builds into array
      location_array.push(new_local)
      //finds locations in new function
      google_locations(new_local)
    } else {
      alert("Please only include text in the input.")
    }
    //clears input
    $(".location").val('')
  })
  //when an item is removed from the list, it will also be removed from every array
  $(".location-list").on("click", ".remove-location", (event) => {
    let text = $(event)["0"].target.parentNode.className
    let index = location_array.indexOf(text);
    if (index > -1)
      geocode_array.splice(index, 1)
    if (index > -1)
      location_array.splice(index, 1)
    if (index > -1)
      elevation_sortable.splice(index, 1)
  })
  //my google api access key
  const ACCESS_KEY = 'AIzaSyAj8bYpM2M0T8I4xRKqvToSn9_fsRYC6dc'
  //this will take each local and find the location.  this will then input that location infomation
  //into the geolocation array
  let google_locations = local => {
    $.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${local}&key=${ACCESS_KEY}`).done(data => {
      geocode_array.push(data.results["0"])
      //each of the items in the array will not also have the elevation
      google_elevations(geocode_array[geocode_array.length - 1])

    }).fail(() => {
      console.log("error");
    })
  }

  //this is an elevation service included in the map.  this was used
  //due to a google error that was being obtain from an ajax call.  this fuction also works better
  //and smoother with the map and mupliple call
  let google_elevations = local => {
    let elevator = new google.maps.ElevationService;
    elevator.getElevationForLocations({
      'locations': [local.geometry.location]
    }, results => {
      elevation_sortable.push([local.formatted_address, results["0"].elevation, local.geometry.location])
    })
  }
  //when an item is the in the location list or array or will be able to obtain the elevations
  //and have them sorted
  $(".sort-elevations").click(() => {
    $(".elevation-list").empty()
    if (geocode_array.length >= 1) {
      //this calls the recursive sort function
      sort(elevation_sortable, elevation_sortable.length)
      $(".elevation-list").append(`<h6>Elevations Decending:</h6>`)

      elevation_sortable.forEach(local => {
        let marker = new google.maps.Marker({position: local[2], map: map});
        console.log(local)
        let place = local[0]
        let location = local[2]

        let height = local[1].toFixed(2)
        $(".elevation-list").append(`<li class ='${place}'>${place}: ${height} meters</li>`)
      })
      map.setCenter(elevation_sortable[0][2])
      map.setZoom(10);

    } else {
      alert("Please add location")
    }

  })
  //this is a recursive sort function that will arrange the array from highest
  // to lowest elevation
  let sort = (array, n) => {
    if (n === 1)
      return;

    for (let i = 0; i < n - 1; i++) {
      if (array[i][1] < array[i + 1][1]) {
        let a = array[i]
        array[i] = array[i + 1]
        array[i + 1] = a
      }
    }
    sort(array, n - 1)

  }
  //this will activate the click function of the elevation list inorder to view
  //each location on the map
  $(".elevation-list").on("click", "li", (event) => {
    let local_text = event.currentTarget.className
    for (let i = 0; i < elevation_sortable.length; i++) {
      if (elevation_sortable[i][0] === local_text) {
        let local_spot = elevation_sortable[i][2]
        map.setCenter(local_spot)
        map.setZoom(10);
      }
    }

  })

});
//removes the items properly on the visual list
$(document).on('click', '.remove-location', function() {
  $(this).parent().fadeOut('slow');
  $(this).parent().remove()
});
