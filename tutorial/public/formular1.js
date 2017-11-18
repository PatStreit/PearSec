/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function() {
  "use strict";

  var ENTER_KEY_CODE = 13;
  var queryInput, resultDiv, accessTokenInput;

  window.onload = init;

  function init() {
    queryInput = document.getElementById("q");
    resultDiv = document.getElementById("result");

    queryInput.addEventListener("keydown", queryInputKeyDown);
    window.init();

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        var obj = JSON.parse(xhttp.responseText);
        for(var item in obj){
          if(obj[item].Kategorien == "IT-Systeme"){
            var el = document.createElement('div');
            el.innerHTML = obj[item].Name;
            el.setAttribute('id', obj[item].AID );
            document.getElementById("right-defaults").appendChild(el);
          }
        }
      }
    };
    xhttp.open("GET", "/allAssets", true);
    xhttp.send();
  }


  function queryInputKeyDown(event) {
    if (event.which !== ENTER_KEY_CODE) {
      return;
    }

    var value = queryInput.value;
    queryInput.value = "";

    createQueryNode(value);
    var responseNode = createResponseNode();

    sendText(value)
      .then(function(response) {
        var result;
        try {
          result = response.result.fulfillment.speech
        } catch(error) {
          result = "";
        }
//        setResponseJSON(response);
        setResponseOnNode(result, responseNode);
      })
      .catch(function(err) {
        setResponseJSON(err);
        setResponseOnNode("Something goes wrong", responseNode);
      });
  }

  function createQueryNode(query) {
    var node = document.getElementById('eingabe');
/*    var node1 = document.createElement('div');
    node1.style.height = "40px";*/
    node.className = "green rounded accent-1 mt-3 p-3 font-weight-bold";
    node.innerHTML = query;
  }

  function createResponseNode() {
    var node = document.getElementById("antwort");
    node.className = "white rounded blue-text mt-2 p-3 font-weight-bold";
    node.innerHTML = "...";
//    resultDiv.appendChild(node);
    return node;
  }

  function setResponseOnNode(response, node) {
    node.innerHTML = response ? response : "[empty response]";
    node.setAttribute('data-actual-response', response);
  }

/*  function setResponseJSON(response) {
    var node = document.getElementById("jsonResponse");
    node.innerHTML = JSON.stringify(response, null, 2);
  }*/

  function sendRequest() {

  }


})();

"use strict";
var left = document.getElementById("left-defaults");
var assets = document.getElementById("right-defaults");
var bar = document.getElementById("bar");
var xhttp = new XMLHttpRequest();

function senden(kategorie){
  var obj = JSON.parse(xhttp.responseText);
  assets.innerHTML = "";
  var i = 1;
  for(i; i < obj.length; i++){
      if(obj[i].Kategorien == kategorie){
          var el = document.createElement('div');
          el.innerHTML = obj[i].Name;
          el.setAttribute('id', obj[i].AID );
          document.getElementById("right-defaults").appendChild(el);
      }
  }
}

function identifizierung(){
  var antwort = document.getElementById("antwort");
  var hide = document.createElement("p");
  hide.setAttribute("id", "versteckt");

  xhttp.onreadystatechange = function() {

    if (xhttp.readyState == 4 && xhttp.status == 200) {

      if(bar.style.width == "100%"){
        window.location.href = "formular2.html";
        return;
      } else {
          left.innerHTML = "";
          document.getElementById("yes").style.display = "none";
          document.getElementById("wrapper").style.display = "block";

          if(bar.style.width == "0%"){
            var kategorie = "Maschinen / Anlagen";
            senden(kategorie);
            antwort.innerHTML = "Was für Maschinen befinden sich in Ihrem Unternehmen?";
            bar.style.width = "25%";
            return;
          }

          if(bar.style.width =="25%"){
            var kategorie = "Netze";
            senden(kategorie);
            antwort.innerHTML = "Was für Netze befinden sich in Ihrem Unternehmen?";
            bar.style.width = "50%";
            return;
          }

          if(bar.style.width =="50%"){
            bar.style.width = "75%";
    //        alert(assets.childNodes[1].id);
            var kategorie = "Daten";
            senden(kategorie);
            antwort.innerHTML = "Was für Daten befinden sich in Ihrem Unternehmen?";
            bar.style.width = "75%";
            return;
          }

          if(bar.style.width == "75%"){
    //        alert(assets.childNodes[1].id);
            var kategorie = "Infrastruktur";
            senden(kategorie);
            antwort.innerHTML = "Wie gestaltet sich die Infrastruktur?";
            bar.style.width = "90%";
            return;
          }
        }
    }
  };

  xhttp.open("GET", "/allAssets", true);
  xhttp.send();

  return;
  }

function abschicken(){
  var x = document.getElementById("marker");
  var versteckt = document.getElementById("versteckt");
  var textAnfang = '{ "Paket" : [';
  var textInhalt = "";
  var textEnde = ']}';

    if (versteckt.innerHTML == "") {
        x.style.display = "block";
    } else {
      var c = document.getElementById("left-defaults").childNodes;
      var i = 1;
      for(i; i < c.length; i++){
//        alert(c[i].innerHTML);
        if(i == c.length-1){
          textInhalt += '{ "AID": "' + c[i].id + '", "Name": "' + c[i].innerHTML + '" }'
        }else {
          textInhalt += '{ "AID": "' + c[i].id + '", "Name": "' + c[i].innerHTML + '" },'
        }
      }
//      alert(textAnfang + textInhalt + textEnde);
      var obj = textAnfang + textInhalt + textEnde;

      var xhr = new XMLHttpRequest();
      xhr.open('POST', "/post", true);
      xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
      xhr.responseType ='json';
      xhr.send(obj);

      if(bar.style.width == "90%"){
//        alert(assets.childNodes[1].id);
        bar.style.width = "100%";
        document.getElementById("yes").style.display = "inline";
        document.getElementById("wrapper").style.display = "none";
        document.getElementById("erfolg").innerHTML = "Ihre Assets wurden identifziert!" +
                                                      " Bitte fahren Sie mit den Prüffragen fort.";
        document.getElementById("erfolgButton").innerHTML = "Weiter";
        antwort.innerHTML = "Juhu!";
      } else {
        document.getElementById("yes").style.display = "inline";
        document.getElementById("wrapper").style.display = "none";
      }
    }

}
