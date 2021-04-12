var key = "f8fc2f74b4dbc3527792c01085dda806";
var cities = "[]";
var cityList = "city-list";

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

init();


function init(){
    var storedCities = JSON.parse(localStorage.getItem('cities'));

    if (storedCities !== null) {
        cities = storedCities;
    }
renderCities();
}

function storeCities(){
    localStorage.setItem('cities', json.stringify(cities));
    console.log(localStorage);
}

function renderCities(){
    
    cityList.empty();

    for (var i = 0; i < cities.length; i++) {
        var city = cities[i];

        var li = $('<li>').text(city);
        li.attr('id','listC');
        li.attr('data-city', city);
        li.attr('class', 'list-group-item');
        console.log(li);
        cityList.prepend(li);
    }
    if(!city){
        return
    }
    else{
        getResponseWeather(city)
    };

    $('#add-city').on('click',function(event){
    event.preventDefault();
    
    var city = $('#city-input').val().trim();
    
    if (city === "") {
        return;
    }
    cities.push(city);

    storeCities();
    renderCities();
    });


    function getResponseWeather(cityName) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + key;


    $('current-weather').empty();
    $.ajax({
    url: queryURL,
    method: "GET"
    }).then(function(response) {

    cityTitle = $('<h3').text(response.name + ' ' + FormatDay());
    $('current-weather').append(cityTitle);
    var temperatureToNum = parseInt((response.main.temp)* 9/5 - 459);
    var cityTemperature = $('<p>').text('Temperature: '+ temperatureToNum + '°F');
    $('current-weather').append(cityTemperature);
    var cityHumidity = $("<p>").text("Humidity: "+ response.main.humidity + " %");
    $("#today-weather").append(cityHumidity);
    var cityWindSpeed = $('<p>').text('Wind Speed: ' + response.wind.speed + ' MPH');
    $('current-weather').append(cityWindSpeed);
    var cordLon = response.cord.lon;
    var cordLat = response.cord.lat;

    var queryURL2 = "https://api.openweathermap.org/data/2.5/uvi?appid="+ key+ "&lat=" + CoordLat +"&lon=" + CoordLon;
    $.ajax({
        url: queryURL2,
        method: "GET"
    }).then(function(responseuv) {
        var cityUV = $('<span>').text(responseuv.value);
        var cityUVp = $('<p>').text('UV Index');
        cityUVp.append(cityUV);
        $('current-weather').appened(cityUVp);
        console.log(typeof responseuv.value);
        if(responseuv.value > 0 && responseuv.value <=2){
            cityUV.attr('class', 'green')
        }
        else if(responseuv.value > 2 && responseuv.value <= 5){
            cityUV.attr('class', 'yellow')
        }
        else if(responseuv.value > 5 && responseuv.value <= 7){
            cityUV.attr('class', 'orange')
        } 
        else if(responseuv.value > 7 && responseuv.value <= 10){
            cityUV.attr('class', 'red')
        }
        else {
            cityUV.attr('class', 'purple')
        }
    });

        var queryURL3 = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + key;
        $.ajax({
        url: queryURL3,
        method: "GET"
        }).then(function(response5day) { 
        $("#boxes").empty();
        console.log(response5day);
        for(var i=0, j=0; j<=5; i=i+6){
        var read_date = response5day.list[i].dt;
        if(response5day.list[i].dt != response5day.list[i+1].dt){
            var FivedayDiv = $("<div>");
            FivedayDiv.attr("class","col-3 m-2 bg-primary")
            var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
            d.setUTCSeconds(read_date);
            var date = d;
            console.log(date);
            var month = date.getMonth()+1;
            var day = date.getDate();
            var dayOutput = date.getFullYear() + '/' +
            (month<10 ? '0' : '') + month + '/' +
            (day<10 ? '0' : '') + day;
            var Fivedayh4 = $("<h6>").text(dayOutput);
            //Set src to the imags
            var imgtag = $("<img>");
            var skyconditions = response5day.list[i].weather[0].main;
            if(skyconditions==="Clouds"){
                imgtag.attr("src", "https://img.icons8.com/color/48/000000/cloud.png")
            } else if(skyconditions==="Clear"){
                imgtag.attr("src", "https://img.icons8.com/color/48/000000/summer.png")
            }else if(skyconditions==="Rain"){
                imgtag.attr("src", "https://img.icons8.com/color/48/000000/rain.png")
            }

                var pTemperatureK = response5day.list[i].main.temp;
                console.log(skyconditions);
                var TempetureToNum = parseInt((pTemperatureK)* 9/5 - 459);
                var pTemperature = $("<p>").text("Tempeture: "+ TempetureToNum + " °F");
                var pHumidity = $("<p>").text("Humidity: "+ response5day.list[i].main.humidity + " %");
                FivedayDiv.append(Fivedayh4);
                FivedayDiv.append(imgtag);
                FivedayDiv.append(pTemperature);
                FivedayDiv.append(pHumidity);
             $("#boxes").append(FivedayDiv);
                console.log(response5day);
             j++;
            }
        
    }

    });


    });
