window.onload = init;

var kategorie="IT-Systeme";
var cardbody = document.getElementById('cardbody');

function init() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      var obj = JSON.parse(xhttp.responseText);
      for(var item in obj){
        if (obj[item].Kategorien == kategorie){
          console.log(obj[item]);
          cardbody.appendChild(document.createElement('hr'));
          var mainRow = document.createElement('div');
          mainRow.setAttribute('class', 'row ml-4');

          var assetCol = document.createElement('div');
          assetCol.setAttribute('class', 'col-md-3');
          assetCol.innerText = obj[item].Name;

          mainRow.appendChild(assetCol);

          var ratingCol = document.createElement('div');
          ratingCol.setAttribute('class', 'col-md-3');

          var ratingRow = document.createElement('div');
          ratingRow.setAttribute('class', 'row ml-2');
          ratingCol.appendChild(ratingRow);

          var ratingBulb = document.createElement('div');
          ratingBulb.setAttribute('id', 'trafficLight' + item);
          ratingRow.appendChild(ratingBulb);

          var ratingLight = document.createElement('div');
          ratingLight.setAttribute('id', 'stopLight' + item);

          cardbody.appendChild(mainRow);

        }

      }
    }
  };
  xhttp.open("GET", "/allKundenAssets", true);
  xhttp.send();

}
function toggleKategorie(kat){
  kategorie = kat.innerText;
  init();
}
