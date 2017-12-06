window.onload = init;

var kategorie="Netze";
var currentRows=0;

function init() {

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() { 
    if (xhttp.readyState == 4 && xhttp.status == 200) {   
      var obj = JSON.parse(xhttp.responseText);   
      for(var item in obj){
        if (obj[item].Kategorien == kategorie){
          console.log(obj[item]);
        }
        
      }
    }
  };
  xhttp.open("GET", "/allKundenAssets", true);
  xhttp.send();

}