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

    map.loadImage('https://img.icons8.com/ios/50/000000/factory-filled.png', function (error, image) {
        if (error) throw error;
        map.addImage('factory', image);
    });

    map.loadImage("https://img.icons8.com/ios/50/000000/cottage-filled.png", function (error, image) {
        if (error) throw error;
        map.addImage('house', image);
    });

    let boiler_data = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "properties": {
                    'id': 0,
                    't': Math.random() * (95 - 85) + 85,
                    'address': 'Квартал 105'
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        37.525434494018555,
                        55.57664649599778
                    ]
                }
            }
        ]
    };

    map.addSource("boiler-source", {
        "type": "geojson",
        "data": boiler_data
    });
    map.addLayer({
        id: 'boiler',
        type: 'symbol',
        source: 'boiler-source',
        "layout": {
            "icon-image": "factory",
            "icon-size": 0.5
        },
        filter: ['in', '$type', 'Point']
    });

    let dots = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "properties": {
                    'id': 0,
                    'address': 'Квартал 105, 1с3',
                    'parent': 0,
                    't': Math.random() * (75 - 65) + 65,
                    'boiler_t': Math.random() * (95 - 85) + 85,
                    'boiler_addr': 'Квартал 105'
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        37.51753807067871,
                        55.584748561551024
                    ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    'id': 1,
                    'address': 'Квартал 105, 1с77',
                    'parent': 0,
                    't': Math.random() * (75 - 65) + 65,
                    'boiler_t': Math.random() * (95 - 85) + 85,
                    'boiler_addr': 'Квартал 105'
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        37.51850366592407,
                        55.57773818911895
                    ]
                }
            },
            {
                "type": "Feature",
                "properties": {
                    'id': 2,
                    'address': 'Улица Липовый Парк, 1',
                    'parent': 0,
                    't': Math.random() * (75 - 65) + 65,
                    'boiler_t': Math.random() * (95 - 85) + 85,
                    'boiler_addr': 'Квартал 105'
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        37.495200634002686,
                        55.570762960543966
                    ]
                }
            }
        ]
    };

    map.addSource("client-source", {
        "type": "geojson",
        "data": dots
    });
    map.addLayer({
        id: 'client',
        type: 'symbol',
        layout: {
            "icon-image": "house",
            "icon-size": 0.4
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

    for (let i = 0; i < dots.features.length; i++) {
        if (i > 0) {
            data_special.features.push({
                geometry: {
                    type: "LineString",
                    coordinates: [dots.features[i].geometry.coordinates, [37.525434494018555, 55.57664649599778]]
                }
            });
        } else {
            data_special2.features.push({
                geometry: {
                    type: "LineString",
                    coordinates: [dots.features[i].geometry.coordinates, [37.525434494018555, 55.57664649599778]]
                }
            });
        }
    }
    ;


    console.log(data_special);

    map.addSource("lines-source", {
        "type": "geojson",
        "data": data_special
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
        "type": "geojson",
        "data": data_special2
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
});

function relocation() {
    localStorage.setItem("adr", document.getElementById("address_h").innerText);
    location.replace("info_page.html")
}