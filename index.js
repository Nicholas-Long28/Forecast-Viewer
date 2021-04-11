var key = "f8fc2f74b4dbc3527792c01085dda806";
var cities = "[]";
var cityList = "city-list";

init();


function storeCities(){
    localStorage.setItem('cities', json.stringify(cities));
    console.log(localStorage);
}

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

function init(){
    var storedCities = JSON.parse(localStorage.getItem('cities'));
    if (storedCities !== null) {
        cities = storedCities;
}

function getResponseWeather(cityName) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + key;
}

$('current-weather').empty();
$.ajax({
    url: queryURL,
    method: "GET"
}).then(function(response) {

    cityTitle = $('<h3').text(response.name + ' ')
    $('current-weather').append(cityTitle);
    var temperatureToNum = parseInt((response.main.temp)* 9/5 - 459);
    var cityTemperature = $('<p>').text('Temperature: '+ temperatureToNum + '°F');
    $('current-weather').append(cityTemperature);
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