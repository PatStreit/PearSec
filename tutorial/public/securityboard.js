window.onload = init;
var Kategorie="IT-Systeme";
var currentRows=0;
function init() {
  

init1();
}
function init1(){

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
   
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      
      var obj = JSON.parse(xhttp.responseText);
     var green = obj.grün;
     var yellow = obj.gelb;
     var red = obj.rot;

          //pie
var ctxP = document.getElementById("pieChart").getContext('2d');
var myPieChart = new Chart(ctxP, {
    type: 'pie',
    data: {
        labels: ["Green", "Yellow","Red" ],
        datasets: [
            {
                data: [green, yellow, red],
                backgroundColor: ["#31B404", "#FFFF00", "#DF0101"]
                //hoverBackgroundColor: ["#FF5A5E", "#5AD3D1", "#FFC870"]
            }
        ]
    },
    options: {
        responsive: true
    }    
});
// end of pie
    }
  };
  xhttp.open("GET", "/verhaltnisAssets", true);
  xhttp.send();





  }
  

  

