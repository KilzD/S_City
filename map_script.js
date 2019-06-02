//Переменные и карта
mapboxgl.accessToken = 'pk.eyJ1Ijoia2lsemQiLCJhIjoiY2p3Y3BrcGdlMHY4ZjQ5b2p4YWp1b3oyYiJ9.7e4nFGsZKigW54wKypPXFA';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v10',
    center: [37.525434494018555, 55.57664649599778],
    zoom: 15
});

var linking = "http://10.20.3.26:8000/";

function find(){
    map.setCenter({
        lat: 55.577611459040156,
        lng: 37.518823709011656
    });
}

map.on('click', function () {

    document.getElementById("info_hot_bowl").style.visibility = "hidden";
    document.getElementById("info_house").style.visibility = "hidden";
    document.getElementById("hot_bowl_temp").innerText = "Текущая температура: ";
    document.getElementById("address_b").innerText = "Адрес котельной";
    document.getElementById("house_temp").innerText = "Текущая температура: ";
    document.getElementById("address_h").innerText = "Адрес дома";
});

map.on('click', 'client', function (e) {
    document.getElementById("info_hot_bowl").style.visibility = "visible";
    document.getElementById("info_house").style.visibility = "visible";
    document.getElementById("hot_bowl_temp").innerText = "Текущая температура: " + parseInt(e.features[0].properties.boiler_t);
    document.getElementById("address_b").innerText = e.features[0].properties.boiler_addr;
    document.getElementById("house_temp").innerText = "Текущая температура: " + parseInt(e.features[0].properties.t);
    document.getElementById("address_h").innerText = e.features[0].properties.address;

});

map.on('click','boiler', function (e) {
    document.getElementById("info_hot_bowl").style.visibility = "visible";
    document.getElementById("hot_bowl_temp").innerText = "Текущая температура: " + parseInt(e.features[0].properties.t);
    document.getElementById("address_b").innerText = e.features[0].properties.address;

});

map.on('mouseenter', 'client', function () {
    map.getCanvas().style.cursor = 'pointer';
});

map.on('mouseenter', 'boiler', function () {
    map.getCanvas().style.cursor = 'pointer';
});

map.on('mouseleave', 'client', function () {
    map.getCanvas().style.cursor = '';
});

map.on('mouseleave', 'boiler', function () {
    map.getCanvas().style.cursor = '';
});

map.on('load', function () {

    var boiler_pos;

        map.loadImage('https://img.icons8.com/ios/50/000000/factory-filled.png', function(error, image) {
            if (error) throw error;
            map.addImage('factory', image);
        });

        map.loadImage("https://img.icons8.com/ios/50/000000/cottage-filled.png", function (error, image) {
            if (error) throw error;
            map.addImage('house', image);
        });

    $.ajax({
        url: linking + "boiler",
        type: 'get',
        success(data){
            boiler_pos = data.features[0].geometry.coordinates;
            console.log(boiler_pos);
            map.addSource("boiler-source", {
                "type" : "geojson",
                "data" : data
            });
            map.addLayer({
                id: 'boiler',
                type: 'symbol',
                source: 'boiler-source',
                "layout":{
                    "icon-image": "factory",
                    "icon-size" : 1
                },
                filter: ['in', '$type', 'Point']
            })
        }
    });

    console.log(boiler_pos);

    $.ajax({
        url: linking + "client",
        type: 'get',
        success(data){
            map.addSource("client-source", {
                "type" : "geojson",
                "data" : data
            });
            map.addLayer({
                id: 'client',
                type: 'symbol',
                layout:{
                    "icon-image":"house",
                    "icon-size":0.5
                },
                source: 'client-source',
                filter: ['in', '$type', 'Point']
            });

            var data_special = {
                type: "FeatureCollection",
                features: []
            };

            var data_special2 = {
                type: "FeatureCollection",
                features: []
            };

            for (let i=0;i<data.features.length;i++){
                if (i>0) {
                    data_special.features.push({
                        geometry: {
                            type: "LineString",
                            coordinates: [data.features[i].geometry.coordinates, [37.525434494018555, 55.57664649599778]]
                        }
                    });
                }
                else{
                    data_special2.features.push({
                        geometry: {
                            type: "LineString",
                            coordinates: [data.features[i].geometry.coordinates, [37.525434494018555, 55.57664649599778]]
                        }
                    });
                }
            };



            console.log(data_special);

            map.addSource("lines-source", {
                "type" : "geojson",
                "data" : data_special
            });
            map.addLayer({
                id: 'lines',
                type: 'line',
                source: 'lines-source',
                layout: {
                    'line-cap': 'round',
                    'line-join': 'round'
                },
                paint: {
                    'line-color': '#00ff00',
                    'line-width': 4.0
                },
                filter: ['in', '$type', 'LineString']
            });

            map.addSource("lines-source2", {
                "type" : "geojson",
                "data" : data_special2
            });
            map.addLayer({
                id: 'lines2',
                type: 'line',
                source: 'lines-source2',
                layout: {
                    'line-cap': 'round',
                    'line-join': 'round'
                },
                paint: {
                    'line-color': '#ff0000',
                    'line-width': 4.0
                },
                filter: ['in', '$type', 'LineString']
            })

        }
    });

});

function relocation() {
    localStorage.setItem("adr", document.getElementById("address_h").innerText);
    location.replace("info_page.html")
}