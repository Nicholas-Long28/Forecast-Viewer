var cityList =$("#city-list");
var cities = [];
var key = "fc8bffadcdca6a94d021c093eac22797";
var clearBtn = document.querySelector("#clearBtn");

//Format for day
function FormatDay(date){
    var date = new Date();
    console.log(date);
    var month = date.getMonth()+1;
    var day = date.getDate();
    
    var dayOutput = date.getFullYear() + '/' +
        (month<10 ? '0' : '') + month + '/' +
        (day<10 ? '0' : '') + day;
    return dayOutput;
}



//Calling function init();
init();

function init(){

    var storedCities = JSON.parse(localStorage.getItem("cities"));

    // If cities were retrieved from localStorage, update the cities array to it
    if (storedCities !== null) {
        cities = storedCities;
      }
    // Render cities to the DOM
    renderCities();
    
}

function storeCities(){
   // Stringify and set "cities" key in localStorage to cities array
  localStorage.setItem('cities', JSON.stringify(cities));
  console.log(localStorage);
}

//Function renderCities()
function renderCities() {
    cityList.empty();
    
    // Render a new li for each city
    for (var i = 0; i < cities.length; i++) {
      var city = cities[i];
      
      var li = $('<li>').text(city);
      li.attr('id','listC');
      li.attr('data-city', city);
      li.attr('class', 'list-group-item');
      console.log(li);
      cityList.prepend(li);
    }
    //Get Response weather for the first city only
    if (!city){
        return
    } 
    else{
        getResponseWeather(city)
    };
}   

  $('#add-city').on('click', function(event){
      event.preventDefault();

    var city = $('#city-input').val().trim();
    
    // Return from function early if submitted city is blank
    if (city === '') {
        return;
    }
    //Adding city-input to the city array
    cities.push(city);
  storeCities();
  renderCities();
  });
  
  function getResponseWeather(cityName){
    var queryURL = 'https://api.openweathermap.org/data/2.5/weather?q=' +cityName+ '&appid=' + key; 

    //Clear content of today-weather
    $('current-weather').empty();
    $.ajax({
      url: queryURL,
      method: 'GET'
    }).then(function(response) {

        clearBtn.addEventListener("click", function (event) {
            localStorage.removeItem('cities');
            location.reload();
          });
          
        
      // Create a new table row element
      cityTitle = $('<h3>').text(response.name + ' '+ FormatDay());
      $('current-weather').append(cityTitle);
      var TempetureToNum = parseInt((response.main.temp)* 9/5 - 459);
      var cityTemperature = $('<p>').text('Tempeture: '+ TempetureToNum + ' ??F');
      $('current-weather').append(cityTemperature);
      var cityHumidity = $('<p>').text('Humidity: '+ response.main.humidity + ' %');
      $('current-weather').append(cityHumidity);
      var cityWindSpeed = $('<p>').text('Wind Speed: '+ response.wind.speed + ' MPH');
      $('current-weather').append(cityWindSpeed);
      var CoordLon = response.coord.lon;
      var CoordLat = response.coord.lat;
    
        //Api to get UV index
        var queryURL2 = 'https://api.openweathermap.org/data/2.5/uvi?appid='+ key+ '&lat=' + CoordLat +'&lon=' + CoordLon;
        $.ajax({
            url: queryURL2,
            method: 'GET'
        }).then(function(responseuv) {
            var cityUV = $('<span>').text(responseuv.value);
            var cityUVp = $('<p>').text('UV Index: ');
            cityUVp.append(cityUV);
            $('current-weather').append(cityUVp);
            console.log(typeof responseuv.value);
            if(responseuv.value > 0 && responseuv.value <=2){
                cityUV.attr('class','green')
            }
            else if (responseuv.value > 2 && responseuv.value <= 5){
                cityUV.attr('class','yellow')
            }
            else if (responseuv.value >5 && responseuv.value <= 7){
                cityUV.attr('class','orange')
            }
            else if (responseuv.value >7 && responseuv.value <= 10){
                cityUV.attr('class','red')
            }
            else{
                cityUV.attr('class','purple')
            }
        });
    
        //Api to get 5-day forecast  
        var queryURL3 = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&appid=' + key;
            $.ajax({
            url: queryURL3,
            method: 'GET'
        }).then(function(response5day) { 
            $('#boxes').empty();
            console.log(response5day);
            for(var i=0, j=0; j<=5; i=i+6){
                var read_date = response5day.list[i].dt;
                if(response5day.list[i].dt != response5day.list[i+1].dt){
                    var FivedayDiv = $('<div>');
                    FivedayDiv.attr('class','col-3 m-2 bg-primary')
                    var d = new Date(0); 
                    d.setUTCSeconds(read_date);
                    var date = d;
                    console.log(date);
                    var month = date.getMonth()+1;
                    var day = date.getDate();
                    var dayOutput = date.getFullYear() + '/' +
                    (month<10 ? '0' : '') + month + '/' +
                    (day<10 ? '0' : '') + day;
                    var Fivedayh4 = $('<h6>').text(dayOutput);
                    //Set src to the imags
                    var imgtag = $('<img>');
                    var skyconditions = response5day.list[i].weather[0].main;
                    if(skyconditions==='Clouds'){
                        imgtag.attr('src', 'https://img.icons8.com/color/48/000000/cloud.png')
                    } else if(skyconditions==='Clear'){
                        imgtag.attr('src', 'https://img.icons8.com/color/48/000000/summer.png')
                    }else if(skyconditions==='Rain'){
                        imgtag.attr('src', 'https://img.icons8.com/color/48/000000/rain.png')
                    }

                    var pTemperatureK = response5day.list[i].main.temp;
                    console.log(skyconditions);
                    var TempetureToNum = parseInt((pTemperatureK)* 9/5 - 459);
                    var pTemperature = $('<p>').text('Tempeture: '+ TempetureToNum + ' ??F');
                    var pHumidity = $('<p>').text('Humidity: '+ response5day.list[i].main.humidity + ' %');
                    FivedayDiv.append(Fivedayh4);
                    FivedayDiv.append(imgtag);
                    FivedayDiv.append(pTemperature);
                    FivedayDiv.append(pHumidity);
                    $('#boxes').append(FivedayDiv);
                    console.log(response5day);
                    j++;
                }
            
        }
      
    });
      

    });
    
  }

  //Click function to each Li 
  $(document).on('click', '#listC', function() {
    var thisCity = $(this).attr('data-city');
    getResponseWeather(thisCity);
  });