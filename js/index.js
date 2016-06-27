function getWeather(latitude, longitude){
    // console.log("http://api.wunderground.com/api/89a189c86e73c7bf/conditions/q/"+latitude+","+longitude+".json")
    $.ajax({
        url: "http://api.wunderground.com/api/89a189c86e73c7bf/conditions/q/"+latitude+","+longitude+".json",
        dataType: "jsonp",
        success: function(result){
          // console.log(result.current_observation);
          var fullData = result.current_observation;
          var weather = fullData.weather;
          var tempf = fullData.temp_f;
          var tempc = fullData.temp_c;
          var iconUrl = fullData.icon_url;
          var time = fullData.observation_time;
          var location = {city: fullData.display_location.city,
                          state: fullData.display_location.state};
          // console.log(fullData)

          var html = "";
          html += '<h3 class="col-xs-12 text-center" id="temp">'+tempf+' Fahrenheit*'+'</h3>';
          html += '<div class="col-xs-12"><img src="'+iconUrl+'" class="text-center iconSize"></div>';
          html += '<h3 class="col-xs-12 text-center">'+weather+'</h3>';
          html += '<h4 class="col-xs-12 text-center">'+location.city+", "+location.state+'</h4>';
          html += '<h5 class="col-xs-12 text-center">'+time+'</h5>';
          html += '<p class="col-xs-12 text-center">'+"* click on temp to change to/from Celsius"+'</p>';

          
          $("#main").html(html);
          var count = 0;
          $("#temp").on("click", function(){
            count++
            if (count%2 == 0) {
              $("#temp").html(tempc+" Celsius")
            } else{
              $("#temp").html(tempf+" Fahrenheit")
            };
          });

          }
        }
    )};

function checkGeoLocation(){
  function success(position){
    var longitude;
    var latitude;
    longitude = position.coords.longitude;
    latitude = position.coords.latitude; 
    // console.log(longitude, latitude);
    getWeather(latitude, longitude);

  }

    navigator.geolocation.getCurrentPosition(success);
  }

//initial call
checkGeoLocation();