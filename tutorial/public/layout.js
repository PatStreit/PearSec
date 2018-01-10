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
  var queryInput, resultDiv;

  window.onload = los();

  function los() {
    queryInput = document.getElementById("q");
    resultDiv = document.getElementById("result");

    queryInput.addEventListener("keydown", queryInputKeyDown);
  }


  function queryInputKeyDown(event) {
    if (event.which !== ENTER_KEY_CODE) {
      return;
    }
//    alert('hallo');
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
        setResponseOnNode(result, responseNode);
      })
      .catch(function(err) {
        setResponseOnNode("Something goes wrong", responseNode);
      });

      document.getElementById('result').scrollTo(0,document.getElementById('result').scrollHeight);
  }

  function createQueryNode(query) {
    var node = document.createElement('li');
    node.setAttribute('class', 'd-flex justify-content-between mb-4');
    resultDiv.appendChild(node);
    var img = document.createElement('img');
    img.setAttribute('src', 'https://mdbootstrap.com/img/Photos/Avatars/avatar-6');
    img.setAttribute('alt', 'avatar');
    img.setAttribute('class', 'avatar rounded-circle mr-2 ml-lg-3 ml-0 z-depth-1');
    node.appendChild(img);
    var chatbody = document.createElement('div');
    chatbody.setAttribute('class', 'chat-body white p-3 mx-2 z-depth-1');
    chatbody.style.width = '400px';
    node.appendChild(chatbody);
    var header = document.createElement('div');
    header.setAttribute('class', 'header');
    chatbody.appendChild(header);
    var headerTitle = document.createElement('strong');
    headerTitle.setAttribute('class', 'primary-font')
    headerTitle.innerText = "Brad Pitt";
    header.appendChild(headerTitle);
    var strich = document.createElement('hr');
    strich.setAttribute('class', 'w-100');
    chatbody.appendChild(strich);
    var eingabeText = document.createElement('p');
    eingabeText.setAttribute('class', 'mb-0');
    eingabeText.innerText = query;
    chatbody.appendChild(eingabeText);
//    alert(node.innerHTML);
/*    var node1 = document.createElement('div');
    node1.style.height = "40px";*/
  }

  function createResponseNode() {
    var node = document.createElement('li');
    node.setAttribute('class', 'd-flex justify-content-between mb-4');
    resultDiv.appendChild(node);
    var chatbody = document.createElement('div');
    chatbody.setAttribute('class', 'chat-body white p-3 mx-2 z-depth-1');
    node.appendChild(chatbody);
    var header = document.createElement('div');
    header.setAttribute('class', 'header');
    chatbody.style.width = '400px';
    chatbody.appendChild(header);
    var headerTitle = document.createElement('strong');
    headerTitle.setAttribute('class', 'primary-font')
    headerTitle.innerText = "Lunar";
    header.appendChild(headerTitle);
    var strich = document.createElement('hr');
    strich.setAttribute('class', 'w-100');
    chatbody.appendChild(strich);
    var eingabeText = document.createElement('p');
    eingabeText.setAttribute('class', 'mb-0');
    chatbody.appendChild(eingabeText);
    var img = document.createElement('img');
    img.setAttribute('src', 'https://mdbootstrap.com/img/Photos/Avatars/avatar-5');
    img.setAttribute('alt', 'avatar');
    img.setAttribute('class', 'avatar rounded-circle mr-2 ml-lg-3 ml-0 z-depth-1');
    node.appendChild(img);
//    resultDiv.appendChild(node);
    return eingabeText;
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
