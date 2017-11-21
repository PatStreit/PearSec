"use strict";

window.onload = init;

//buttonDIV.addEventListener("click", valid(buttonDIV));

function init() {
//  window.init();

  var xhttp = new XMLHttpRequest();

  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      var obj = JSON.parse(xhttp.responseText);
      var marker = 0;
      for(var item = 1; item < obj.length; item++){
          console.log(obj[item]);
          if(obj[item].Kategorien == "IT-Systeme"){
            var assetName = document.createElement("h3");
            assetName.innerHTML = "<br>" + obj[item].Name;
            assetName.setAttribute("class", "font-weight-bold");

            var text = document.createElement("p");
            text.setAttribute("class", "ml-3 col-md-10");
            if(marker == 0){
              text.appendChild(assetName);
              marker = 1;
            }
            text.innerHTML += obj[item].Prüffrage;
            document.getElementById(obj[item].Kategorien).appendChild(text);
//            alert(obj[item].Prüffrage);

            var buttonYes = document.createElement("label");
            buttonYes.setAttribute("class", "btn btn-primary")
            buttonYes.innerHTML = "Ja"

            var buttonNo = document.createElement("label");
            buttonNo.setAttribute("class", "btn btn-primary")
            buttonNo.innerHTML = "Nein"

            var button = document.createElement("input");
            button.setAttribute("type", "radio");
            button.setAttribute("autocomplete", "off");

            buttonYes.appendChild(button);
            buttonNo.appendChild(button);

            var buttonDIV = document.createElement("div");
            buttonDIV.setAttribute("class", "btn-group ml-4 mb-3");
            buttonDIV.setAttribute("data-toggle", "buttons");
            document.getElementById(obj[item].Kategorien).appendChild(buttonDIV);

            buttonDIV.appendChild(buttonYes);
            buttonDIV.appendChild(buttonNo);

            var counter = item+1;
            if(obj[counter].Name !== obj[item].Name){
              marker = 0;
            }
          }
        }
      }
    }

  xhttp.open("GET", "/getAllKundenAssetsAndPruffragen", true);
  xhttp.send();

}

function valid(param) {
  setTimeout(function(){
    var test = param.parentNode.childNodes;
    var gültigkeit = 0;
//    alert(param.parentNode.tagName);

    var i = 1;
    for(i; i < test.length; i++){
  //    alert(test.length);
      if(test[i].tagName == "DIV"){
//        alert(test[i].tagName);
        var x = 1;
        for(x; x < test[i].childNodes.length; x++){
      //    alert(test.length);
          if(test[i].childNodes[x].tagName == "LABEL"){
//            alert(test[i].childNodes[x].childNodes[1].checked);
            if(test[i].childNodes[x].childNodes[1].checked == true){
              gültigkeit = 1;
              break;
            } else{
              gültigkeit = 0;
            }
          }
        }
      }
    }

    if(gültigkeit == 1){
  //    alert(gültigkeit);
      if(param.parentNode.id == "IT-Systeme"){
        document.getElementById("true1").style.display = "inline";
        document.getElementById("false1").style.display = "none";
        gültigkeit = 0;
      }

      if(param.parentNode.id == "Maschinen / Anlagen"){
        document.getElementById("true2").style.display = "inline";
        document.getElementById("false2").style.display = "none";
        gültigkeit = 0;
      }

      if(param.parentNode.id == "collapseExample2"){
        document.getElementById("true3").style.display = "inline";
        document.getElementById("false3").style.display = "none";
        gültigkeit = 0;
      }

      if(param.parentNode.id == "collapseExample3"){
        document.getElementById("true4").style.display = "inline";
        document.getElementById("false4").style.display = "none";
        gültigkeit = 0;
      }

      if(param.parentNode.id == "collapseExample4"){
        document.getElementById("true5").style.display = "inline";
        document.getElementById("false5").style.display = "none";
        gültigkeit = 0;
      }

    } else {
  //    alert(gültigkeit);
      if(param.parentNode.id == "collapseExample"){
        document.getElementById("true1").style.display = "none";
        document.getElementById("false1").style.display = "inline";
      }

      if(param.parentNode.id == "collapseExample1"){
        document.getElementById("true2").style.display = "none";
        document.getElementById("false2").style.display = "inline";
      }

      if(param.parentNode.id == "collapseExample2"){
        document.getElementById("true3").style.display = "none";
        document.getElementById("false3").style.display = "inline";
      }

      if(param.parentNode.id == "collapseExample3"){
        document.getElementById("true4").style.display = "none";
        document.getElementById("false4").style.display = "inline";
      }

      if(param.parentNode.id == "collapseExample4"){
        document.getElementById("true5").style.display = "none";
        document.getElementById("false5").style.display = "inline";
      }
    }

  }, 100);
}
