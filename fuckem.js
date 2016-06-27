$(function() {

  var weatherIcon,
    bodyImageUrl,
    cloudImage = "https://dl.dropboxusercontent.com/u/21809793/clouds-above.jpg",
    cloudImageNight = "https://dl.dropboxusercontent.com/u/21809793/night-clouds-comp.png",
    rainImage = "https://dl.dropboxusercontent.com/u/21809793/rain-window.jpg",
    freezingImage = "https://dl.dropboxusercontent.com/u/21809793/freezing-weather.jpg",
    snowImage = "https://dl.dropboxusercontent.com/u/21809793/day-snow-weather.jpg",
    snowImageNight = "https://dl.dropboxusercontent.com/u/21809793/snow-freezing.jpg",
    clearImageNight = "https://dl.dropboxusercontent.com/u/21809793/sky_moon_night_sky_with_moon.jpg",
    clearImage = "https://dl.dropboxusercontent.com/u/21809793/clear-day.jpg",
    hazeImage = "https://dl.dropboxusercontent.com/u/21809793/hazy-weather.jpg",
    loadingDiv = '<div class="loader"><div class="spinner"><div class="double-bounce1"></div><div class="double-bounce2"></div></div></div>';

  //determine weather icon and background image
  function getWeatherFontIcon(possibleCondition, isNight) {

    var cloud = new RegExp("Cloud", "g"),
      snow = new RegExp("Snow", "g"),
      thunderstorm = new RegExp("Thunderstorm", "g"),
      fog = new RegExp("Fog", "g"),
      freezing = new RegExp("Freezing", "g"),
      hail = new RegExp("Hail", "g"),
      haze = new RegExp("Haze", "g"),
      rain = new RegExp("Rain", "g");

    if (thunderstorm.test(possibleCondition)) {
      if (isNight) {
        weatherIcon = '<i class="wi wi-night-alt-thunderstorm"></i>';
        bodyImageUrl = rainImage;
      } else {
        weatherIcon = '<i class="wi wi-day-thunderstorm"></i>';
        bodyImageUrl = rainImage;
      }
      return;
    }

    if (freezing.test(possibleCondition)) {
      if (isNight) {
        weatherIcon = '<i class="wi wi-night-alt-rain-mix"></i>';
        bodyImageUrl = freezingImage;
      } else {
        weatherIcon = '<i class="wi wi-day-rain-mix"></i>';
        bodyImageUrl = freezingImage;
      }
      return;
    }

    if (cloud.test(possibleCondition) || possibleCondition == "Overcast") {
      if (isNight) {
        weatherIcon = '<i class="wi wi-night-cloudy"></i>';
        bodyImageUrl = cloudImageNight;
      } else {
        weatherIcon = '<i class="wi wi-day-cloudy"></i>';
        bodyImageUrl = cloudImage;
      }
      return;
    }

    if (rain.test(possibleCondition) || possibleCondition == "Drizzle") {
      if (isNight) {
        weatherIcon = '<i class="wi wi-night-rain"></i>';
        bodyImageUrl = rainImage;
      } else {
        weatherIcon = '<i class="wi wi-night-alt-rain"></i>';
        bodyImageUrl = rainImage;
      }
      return;
    }

    if (snow.test(possibleCondition)) {
      if (isNight) {
        weatherIcon = '<i class="wi wi-night-alt-snow"></i>';
        bodyImageUrl = snowImageNight;
      } else {
        weatherIcon = '<i class="wi wi-day-snow"></i>';
        bodyImageUrl = snowImage;
      }
      return;
    }

    if (hail.test(possibleCondition)) {
      if (isNight) {
        weatherIcon = '<i class="wi wi-night-alt-hail"></i>';
        bodyImageUrl = rainImage;
      } else {
        weatherIcon = '<i class="wi wi-day-hail"></i>';
        bodyImageUrl = rainImage;
      }
      return;
    }

    if (fog.test(possibleCondition)) {
      if (isNight) {
        weatherIcon = '<i class="wi wi-night-fog"></i>';
        bodyImageUrl = cloudImageNight;
      } else {
        weatherIcon = '<i class="wi wi-day-fog"></i>';
        bodyImageUrl = cloudImage;
      }
      return;
    }

    if (possibleCondition == "Clear") {
      if (isNight) {
        weatherIcon = '<i class="wi wi-night-clear"></i>';
        bodyImageUrl = clearImageNight;
      } else {
        weatherIcon = '<i class="wi wi-day-sunny"></i>';
        bodyImageUrl = clearImage;
      }
      return;
    }

    if (haze.test(possibleCondition)) {
      if (isNight) {
        weatherIcon = '<i class="wi wi-night-fog"></i>';
        bodyImageUrl = hazeImage;
      } else {
        weatherIcon = '<i class="wi wi-day-haze"></i>';
        bodyImageUrl = hazeImage;
      }
      return;
    }

  }

  //get google map
  function getMap(lat, long) {
    var mapOptions = {
      center: {
        lat: lat,
        lng: long
      },
      zoom: 10
    };
    var map = new google.maps.Map(document.getElementById("map"),
      mapOptions);

    var marker = new google.maps.Marker({
      position: mapOptions.center,
      map: map,
      title: 'You Are Here!'
    });
   
  }

  //get conditions from weather underground
  function getConditions(lat, long) {
    $.ajax({
      url: "https://api.wunderground.com/api/acd28d73045d22e0/conditions/q/" + lat + ',' + long + ".json",
      dataType: "jsonp"
    }).done(function(condition) {
      

      var loc = condition.current_observation.display_location;
      var observe = condition.current_observation;
      var possibleWeather = observe.weather;
      var tempF = observe.temp_f + " &deg;F";
      var tempC = observe.temp_c + " &deg;C";

      //get end of icon url to determine day or night
      var icon = observe.icon_url.split("/").pop();
      var iconRegEx = new RegExp("nt_", "g");
      var nightTime = iconRegEx.test(icon);

      //call to determine icon and background
      getWeatherFontIcon(possibleWeather, nightTime);

      //format update time
      var asOf = observe.observation_time;
      var asOfLength = asOf.length;
      asOf = asOf.slice(16, asOfLength - 4);

      //check for bodyImageUrl
      if (bodyImageUrl !== "" && bodyImageUrl !== undefined) {
        $('body').css({
          'background': 'url(' + bodyImageUrl + ') no-repeat #000',
          'background-size': '100%'
        });
      }

      //build html
      var locationDiv = '<p class="location">' + loc.city + ', ' + loc.state + '</p><p class="small asof"> as of ' + asOf + '</p>';

      var weatherDiv = '<p>' + observe.weather + '</p><p class="temperature">' + tempF + '</p>';

      $('.weather').append(locationDiv + weatherDiv);
       $('.loader').remove();

      if (weatherIcon !== undefined) {
        $('.animate-icon').append(weatherIcon);

        $('.wi').addClass("animated bounceInUp");

        //toggle f and c
        var count = 0;
        $('.scale-change').on('click', function(ev) {
          count++;
          if (count % 2 !== 0) {
            $('.temperature').html(tempC);
          } else {
            $('.temperature').html(tempF);
          }
        });
      }
    })
  }

  //check for location
  function checkGeoLocation() {
    $('body').append(loadingDiv);
    if (!navigator.geolocation) {
      alert("Isn't it time for a better browser?");
      return;
    }

    function success(position) {
      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;
      getConditions(latitude, longitude);
      getMap(latitude, longitude);
    }

    function error(err) {
      console.log(err.code);
    }

    navigator.geolocation.getCurrentPosition(success, error);

  }

  //initial call
  checkGeoLocation();

});