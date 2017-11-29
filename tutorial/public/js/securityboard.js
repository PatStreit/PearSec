/*global $, document*/
$(document).ready(function () {

    'use strict';

window.onload = init;

    // ------------------------------------------------------- //
    // Anzahl der grünen, gelben und roten Assets LADEN
    // ------------------------------------------------------ //


    function init1() {

    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function() {

      if (xhttp.readyState == 4 && xhttp.status == 200) {

        var obj = JSON.parse(xhttp.responseText);

        for(var item in obj){

          console.log(obj[item]);
        }
      }
    };

    xhttp.open('GET', '/getVerhältnis', true);
    xhttp.send();

    }




    // ------------------------------------------------------- //
    // 5 Top Maßnahmen für Unternehmensrisiko lADEN
    // ------------------------------------------------------ //


    function init2() {

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {

      if (xhttp.readyState == 4 && xhttp.status == 200) {

        var obj = JSON.parse(xhttp.responseText);

        for(var item in obj){

          console.log(obj[item]);
        }
      }
    };

    xhttp.open('GET', '/get5TopMaßnahmen', true);

    }


    // ------------------------------------------------------- //
    // Charts Gradients
    // ------------------------------------------------------ //
    var ctx1 = $("canvas").get(0).getContext("2d");
    var gradient1 = ctx1.createLinearGradient(150, 0, 150, 300);
    gradient1.addColorStop(0, 'rgba(133, 180, 242, 0.91)');
    gradient1.addColorStop(1, 'rgba(255, 119, 119, 0.94)');

    var gradient2 = ctx1.createLinearGradient(146.000, 0.000, 154.000, 300.000);
    gradient2.addColorStop(0, 'rgba(104, 179, 112, 0.85)');
    gradient2.addColorStop(1, 'rgba(76, 162, 205, 0.85)');



    // ------------------------------------------------------- //
    // Pie Chart
    // ------------------------------------------------------ //
    var PIECHARTEXMPLE    = $('#pieChartGesamtrisiko');
    var pieChartExample = new Chart(PIECHARTEXMPLE, {
        type: 'pie',
        data: {
            labels: [
                "kritisch",
                "bedenklich",
                "unbedenklich"
            ],
            datasets: [
                {
                    data: [5, 50, 100],
                    borderWidth: 0,
                    backgroundColor: [
                        '#ff6347',
                        "#eeb422",
                        "#458b00"
                    ],
                    hoverBackgroundColor: [
                        '#ff6347',
                        "#eeb422",
                        "#458b00"
                    ]
                }]
            }
    });

    var pieChartExample = {
        responsive: true
    };



});
