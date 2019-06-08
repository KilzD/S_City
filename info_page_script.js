function clicked(args){
    $(".active").removeClass("active");
    $(args).addClass("active");

    var obj = document.getElementById("graph_holder");

    switch (args.innerText) {
        case ("День"):
            document.getElementById("legend").style.visibility = "hidden";
            obj.innerHTML = '<div id="chartContainer" style="width: 70%; height: 100%; position: static"></div>';

            dataPoints1 = [];
            dataPoints2=[];

            chart = new CanvasJS.Chart("chartContainer", {
                width: 900,
                height: 183,
                zoomEnabled: true,
                axisY:{
                    includeZero: true
                },
                toolTip: {
                    shared: true
                },
                legend: {
                    cursor:"pointer",
                    verticalAlign: "top",
                    fontSize: 22,
                    fontColor: "dimGrey",
                    itemclick : toggleDataSeries
                },
                data: [{
                    type: "line",
                    xValueType: "dateTime",
                    yValueFormatString: "####.00",
                    xValueFormatString: "hh:mm:ss TT",
                    showInLegend: true,
                    name: "Температура за бортом",
                    dataPoints: dataPoints1
                },
                    {
                        type: "line",
                        xValueType: "dateTime",
                        yValueFormatString: "####.00",
                        showInLegend: true,
                        name: "Температура входящей воды",
                        dataPoints: dataPoints2
                    }]
            });

            updateChart(20);
            setInterval(function(){updateChart()}, updateInterval);
            break;
        case("Неделя"):
            obj.innerHTML = '<img src="images/week.png" style="width: 70%; height: 100%">';
            document.getElementById("legend").style.visibility = "visible";
            break;
        case("Месяц"):
            obj.innerHTML = '<img src="images/month.png" style="width: 70%; height: 100%">'
            document.getElementById("legend").style.visibility = "visible";
            break;
    }
}

var chart;

function toggleDataSeries(e) {
    if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
        e.dataSeries.visible = false;
    }
    else {
        e.dataSeries.visible = true;
    }
    chart.render();
}

var dataPoints1 = [];
var dataPoints2 = [];

var updateInterval = 500;
// initial value
var yValue1 = 10;
var yValue2 = 70;
// generates first set of dataPoints

var time = new Date;
// starting at 9.30 am
time.setHours(9);
time.setMinutes(30);
time.setSeconds(30);
time.setMilliseconds(30);

function updateChart(count) {
    count = count || 1;
    for (var i = 0; i < count; i++) {
        time.setTime(time.getTime() + updateInterval);
        dataPoints1.push({
            x: time.getTime(),
            y: Math.random() * (70-60) + 60
        });
        dataPoints2.push({
            x: time.getTime(),
            y: Math.random() * (18-8) + 8
        });
    }
    chart.render();
}
