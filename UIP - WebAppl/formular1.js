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

function interact(){
  var antwort = document.getElementById("antwort");
  var assets = document.getElementById("right-defaults");
  var left = document.getElementById("left-defaults");

  if(antwort.className == "white rounded blue-text mt-2 p-3 font-weight-bold"){
    antwort.innerHTML = "Was für Maschinen haben Sie im Unternehmen?";
    assets.innerHTML =  "<div>Maschine</div>" +
                        "<div>Maschine</div>" +
                        "<div>Maschine</div>" +
                        "<div>Maschine</div>" +
                        "<div>Maschine</div>" +
                        "<div>Maschine</div>";

    left.innerHTML = "";
    return;
  }

    return;
  }

function abschicken(){
  var bar = document.getElementById("bar");
  var left = document.getElementById("left-defaults");

  if(left.innerHTML.indexOf("hypothalamus") != -1){
    left.innerHTML = "<div>Bitte ziehen Sie Ihre Vermögenswerte in das Feld</div>";
    return;
  } else {

    return;
  }
}
