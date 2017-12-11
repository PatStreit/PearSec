"use strict"
window.onload = init;
var mTB = document.getElementById('maßnahmenTabelle');
var gTB = document.getElementById('gefährdungenTabelle');


//var canvas = document.getElementById("pieChart");
///document.getElementById("canvasAround").addEventListener('click', function() {alert("hurensohn") }, false);





function init() {
    init1();
}
function init1() {


    createProgessBar(() => { });
    createTipList(() => { });
    updatePie(() => { });
    init2();
}

function createTipList(callback) {

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        document.createElement
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            var tble = document.createElement('table');
            tble.setAttribute('class', 'table');
            var tHead = tble.createTHead();
            tHead.setAttribute('class', 'blue-grey lighten-4');
            var row = tHead.insertRow(0);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            cell1.setAttribute('class', 'font-weight-bold');
            cell2.setAttribute('class', 'font-weight-bold');
            cell3.setAttribute('class', 'font-weight-bold');
            cell1.innerHTML = "Asset";
            cell2.innerHTML = "Top Gefährdung"
            cell3.innerHTML = "Im Unternehmen seit"

            var tBody = tble.createTBody();
            /*
            var row = tBody.insertRow(0);
            var cell1 = row.insertCell(0);
            cell1 = "obj[item].Bezeichnung";
            */
            var obj = JSON.parse(xhttp.responseText);
            for (var item in obj) {
                var row = tBody.insertRow(parseInt(item));
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2);
                console.log(obj);
                cell1.innerHTML = obj[item].Bezeichnung;
                cell2.innerHTML = obj[item].Name;
                cell3.innerHTML = obj[item].Zeitpunkt;
            }
            document.getElementById("tiplist").innerHTML = "";
            document.getElementById("tiplist").appendChild(tble);
        }
    };
    xhttp.open("GET", "/getErinnerung", true);
    xhttp.send();
    callback();
}

function createProgessBar(callback) {

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

        if (xhttp.readyState == 4 && xhttp.status == 200) {

            var obj = JSON.parse(xhttp.responseText);
            var summe = obj.summe;
            var oben = obj.obergrenze;
            document.getElementById("h1score").innerText = summe + "/" + oben;


            var progressDiv = document.getElementById("progessDiv");
            progressDiv.innerHTML = "";
            var progessBar = document.createElement('div');
            progessBar.setAttribute('id', 'progess');
            progessBar.setAttribute('class', 'progress-bar bg-danger');
            progessBar.setAttribute('role', 'progressbar');
            progessBar.setAttribute('style', 'width: ' + summe + '%');
            progessBar.setAttribute('aria-valuenow', summe);
            progessBar.setAttribute('aria-valuemin', '0');
            progessBar.setAttribute('aria-valuemax', oben);

            progressDiv.appendChild(progessBar);

            document.getElementById("scoreExplanation").innerText = "0-" + obj.grenzegelbgrün + ": keine kritische Einstufung, " + obj.grenzegelbgrün + "-" + obj.grenzerotgelb + ": akzeptable Einstufung, " + obj.grenzerotgelb + "-" + obj.summe + ": sehr kritische Einstufung";
        }
    };
    xhttp.open("GET", "/getscore", true);
    xhttp.send();

    callback();
}
function init2() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            var obj = JSON.parse(xhttp.responseText);
            var maxMaßnahmen = 5;
            var counter = 0;

            var zähler = 0;
            for (var item in obj) {
                var itemZ = parseInt(item) + 1;
                if (counter == maxMaßnahmen) break;
                //  var mTB = document.getElementById('maßnahmenTabelle');

                mTB.rows[itemZ++].cells[1].firstChild.firstChild.innerText = obj[item].Beschreibung;
                document.getElementById('checkbox10' + zähler).name = obj[item].mid;
                document.getElementById('checkbox10' + zähler).className = obj[item].KundenAssetID;

                console.log(obj[item]);

                zähler++;

                counter++;
            }
        }
    };
    xhttp.open("GET", "/topmassnahmen", true);
    xhttp.send();
    init3();
}
function init3() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            var obj = JSON.parse(xhttp.responseText);
            var zähler = 1;
            for (var item in obj) {
                var itemZ = parseInt(item) + 1;
                gTB.rows[itemZ++].cells[1].firstChild.firstChild.innerHTML = " <a href=\"javascript://\" title=\"" + obj[item].Name + "\" data-toggle=\"popover\" data-placement=\"top\" data-trigger=\"focus\" data-content=\"" + obj[item].Beschreibung + "\"> " + obj[item].Name; + "</a>";
                $('[data-toggle="popover"]').popover();

            }
        }
    };
    xhttp.open("GET", "/topgefahrdungen", true);
    xhttp.send();

}

function maßnahmeErledigt(obj) {

    var mid = obj.name;
    var kaid = obj.className;

    if (obj.checked == false) {

        toastr.error('Diese Aktion dient nur zu Illustrationszwecken', 'Achtung : ') ;
            updatePie(() => { });

    } else {
        //toastr.success('Maßnahme erledigt', 'Achtung : ');
        toastr.error('Diese Aktion dient nur zu Illustrationszwecken', 'Achtung : ') ;
        try {
            $.ajax({
                type: 'PUT',
                url: "/massnahmeErledigt/" + kaid + "/" + mid,
            });
        } catch (e) {
            updatePie(() => { });
        }
        setTimeout(function () {
            updatePie(() => { });
            $.ajax({
                type: 'PUT',
                url: "/massnahmeErledigtNegativ/" + kaid + "/" + mid,
            });
        }, 1000);


    }


}
function updatePie(callback) {

    document.getElementById("pieChart").remove();

    var canvas = document.createElement('canvas');
    canvas.setAttribute('id', 'pieChart');
    document.getElementById("canvasBody").appendChild(canvas);


    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {

        if (xhttp.readyState == 4 && xhttp.status == 200) {

            var obj = JSON.parse(xhttp.responseText);
            var green = obj.grün;
            var yellow = obj.gelb;
            var red = obj.rot;
            // http://jsfiddle.net/tk31rehf/
            Chart.pluginService.register({
                beforeRender: function (chart) {
                    if (chart.config.options.showAllTooltips) {
                        // create an array of tooltips
                        // we can't use the chart tooltip because there is only one tooltip per chart
                        chart.pluginTooltips = [];
                        chart.config.data.datasets.forEach(function (dataset, i) {
                            chart.getDatasetMeta(i).data.forEach(function (sector, j) {
                                chart.pluginTooltips.push(new Chart.Tooltip({
                                    _chart: chart.chart,
                                    _chartInstance: chart,
                                    _data: chart.data,
                                    _options: chart.options.tooltips,
                                    _active: [sector]
                                }, chart));
                            });
                        });

                        // turn off normal tooltips
                        chart.options.tooltips.enabled = false;
                    }
                },
                afterDraw: function (chart, easing) {
                    if (chart.config.options.showAllTooltips) {
                        // we don't want the permanent tooltips to animate, so don't do anything till the animation runs atleast once
                        if (!chart.allTooltipsOnce) {
                            if (easing !== 1)
                                return;
                            chart.allTooltipsOnce = true;
                        }

                        // turn on tooltips
                        chart.options.tooltips.enabled = true;
                        Chart.helpers.each(chart.pluginTooltips, function (tooltip) {
                            tooltip.initialize();
                            tooltip.update();
                            // we don't actually need this since we are not animating tooltips
                            tooltip.pivot();
                            tooltip.transition(easing).draw();
                        });
                        chart.options.tooltips.enabled = false;
                    }
                }
            })
            //pie
            var ctxP = document.getElementById("pieChart").getContext('2d');
            var myPieChart = new Chart(ctxP, {
                type: 'pie',
                data: {
                    labels: ["Behoben", "Zu beheben", "Dringend zu beheben"],
                    datasets: [
                        {
                            data: [green, yellow, red],
                            backgroundColor: ["#31B404", "#FFFF00", "#DF0101"]
                            //hoverBackgroundColor: ["#FF5A5E", "#5AD3D1", "#FFC870"]
                        }
                    ]
                },
                options: {
                    responsive: true,
                    showAllTooltips: true
                }
            });
            // end of pie
        }
    };
    xhttp.open("GET", "/verhaltnisAssets", true);
    xhttp.send();

    callback();
}
function updateModalTable(param) {


    document.getElementById('redButton').style.background='#ffffff';
    document.getElementById('gelbButton').style.background='#ffffff';
    document.getElementById('grünButton').style.background='#ffffff';

    if (param.name == "rot"){
         document.getElementById('redButton').style.background='#E2E2E2';
    }
    if (param.name == "gelb"){
        document.getElementById('gelbButton').style.background='#E2E2E2';
    }
    if (param.name == "grün"){
        document.getElementById('grünButton').style.background='#E2E2E2';
    }

    var div = document.getElementById('modalContent');
    ///////BEGIN OF TABLE
    var tble = document.createElement('table');
    tble.setAttribute('class', 'table');
    var tHead = tble.createTHead();
    tHead.setAttribute('class', 'blue-grey lighten-4');
    var row = tHead.insertRow(0);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    cell1.setAttribute('class', 'font-weight-bold');
    cell2.setAttribute('class', 'font-weight-bold');
    cell3.setAttribute('class', 'font-weight-bold');
    cell1.innerHTML = "Gefährdetes Asset";
    cell2.innerHTML = "Gefährdung"
    cell3.innerHTML = "Einstufung"
    var tBody = tble.createTBody();
    tBody.setAttribute('table-layout','fixed');
    /////////

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            var obj = JSON.parse(xhttp.responseText);
            var rowCounter = 0;
            for (var item in obj) {
                try {
                    var gelb = "gelb";
                    var gelb2 = obj[item].farbe
                    if (param.name == gelb2) {
                        console.log(param.name);
                        console.log(obj[item].farbe);
                        //var pseudo = obj[item].erg;
                        var row = tBody.insertRow(rowCounter);
                        var cell1 = row.insertCell(0);
                        var cell2 = row.insertCell(1);
                        var cell3 = row.insertCell(2);
                       // console.log(obj);
                        cell1.innerHTML = obj[item].NameAsset;
                        cell2.innerHTML = obj[item].name;
                        cell3.innerHTML = obj[item].erg;
                        rowCounter = rowCounter++;

                        //NameAsset
                    }

                } catch (e) {

                }

            }
            div.innerHTML = "";
            var hr = document.createElement('hr');
            div.appendChild(hr);
            div.appendChild(tble);
        }
    };
    xhttp.open("GET", "/getalleGefahrdungen", true);
    xhttp.send();


    console.log(param);
}
/*

    //
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        document.createElement
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            var tble = document.createElement('table');
            tble.setAttribute('class', 'table');
            var tHead = tble.createTHead();
            tHead.setAttribute('class', 'blue-grey lighten-4');
            var row = tHead.insertRow(0);
            var cell1 = row.insertCell(0);

            cell1.setAttribute('class', 'font-weight-bold');
            cell1.innerHTML = "Gefährdung";
            var tBody = tble.createTBody();

            var obj = JSON.parse(xhttp.responseText);
            for (var item in obj) {
                var row = tBody.insertRow(parseInt(item));
                var cell1 = row.insertCell(0);
                console.log(obj);
                cell1.innerHTML = obj[item].Name;
            }
            div.innerHTML = "";
            div.appendChild(tble);
        }
    };
    xhttp.open("GET", "/topgefahrdungen", true);
    xhttp.send();

}*/
/*
$(document).ready(
    function () {
        var canvas = document.getElementById("pieChart");
        var ctx = canvas.getContext("2d");
        var myNewChart = new Chart(ctx, {
            type: 'pie',
            data: data
        });

        canvas.onclick = function (evt) {
            var activePoints = myNewChart.getElementsAtEvent(evt);
            if (activePoints[0]) {
                var chartData = activePoints[0]['_chart'].config.data;
                var idx = activePoints[0]['_index'];

                var label = chartData.labels[idx];
                var value = chartData.datasets[0].data[idx];

                var url = "http://example.com/?label=" + label + "&value=" + value;
                console.log(url);
                alert(url);
            }
        };


    }
);

$(document).ready(function () {
    $('[data-toggle="popover"]').popover();
});


*/
