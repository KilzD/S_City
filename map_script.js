//Переменные и карта
mapboxgl.accessToken = 'pk.eyJ1Ijoia2lsemQiLCJhIjoiY2p3Y3BrcGdlMHY4ZjQ5b2p4YWp1b3oyYiJ9.7e4nFGsZKigW54wKypPXFA';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v10',
    center: [37.623889714544504, 55.741055286358545],
    zoom: 15
});

map.on('load', function () {

});