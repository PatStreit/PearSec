window.onload = init;

var kategorie="IT-Systeme";
var cardbody = document.getElementById('cardbody');

var subHeader =document.createElement('div');
subHeader.setAttribute('class','row indigo darken-2 white-text pl-5 pt-3 rounded');

var vermögenswerteDiv = document.createElement('div');
vermögenswerteDiv.setAttribute('class','col-md-3');
var vermögenswerteDivPtag = document.createElement('p');
vermögenswerteDivPtag.innerText ="Vermögenswerte";
vermögenswerteDiv.appendChild(vermögenswerteDivPtag);
//vermögenswerteDiv.innerText="Vermögenswerte";

var bewertungDiv = document.createElement('div');
bewertungDiv.setAttribute('class','col-md-3');
bewertungDiv.innerText="Bewertung";

var gefährdungenDiv = document.createElement('div');
gefährdungenDiv.setAttribute('class','col-md-3');
gefährdungenDiv.innerText="Gefährdungen";

var maßnahmenDiv = document.createElement('div');
maßnahmenDiv.setAttribute('class','col-md-3');
maßnahmenDiv.innerText="Maßnahmen";

subHeader.appendChild(vermögenswerteDiv);
subHeader.appendChild(bewertungDiv);
subHeader.appendChild(gefährdungenDiv);
subHeader.appendChild(maßnahmenDiv);

var marker = 0;
var index = 0;

function init() {
  cardbody.innerHTML="";
  cardbody.appendChild(subHeader);
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      var obj = JSON.parse(xhttp.responseText);
//      alert(obj.length);
      for(var item in obj){
        if (obj[item].Kategorien == kategorie){
//          console.log(obj[item]);
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
          ratingLight.setAttribute('class', 'bulb');
          ratingBulb.appendChild(ratingLight);

          var ratingText = document.createElement('p');
          ratingText.setAttribute('class', 'success-text');/*BACKEND ANBINDUNG IMPL.*/
          ratingText.innerHTML = '&nbsp;Sicher';
          ratingRow.appendChild(ratingText);

          mainRow.appendChild(ratingCol);

          var dangerCol = document.createElement('div');
          dangerCol.setAttribute('class','col-md-3');

          var dangerButton = document.createElement('button');
          dangerButton.setAttribute('id', obj[item].KundenAssetID);
          dangerButton.setAttribute('class','btn btn-flat p-1 m-0');
          dangerButton.setAttribute('type','button');
          dangerButton.setAttribute('data-toggle','collapse');
          dangerButton.setAttribute('data-target','#collapseDangers'+item);
          dangerButton.setAttribute('alt', 'collapseDanger'+item);
          dangerCol.appendChild(dangerButton);

          var dangerIcon = document.createElement('i');
          dangerIcon.setAttribute('class','fa fa-angle-down rotate-icon');
          dangerButton.appendChild(dangerIcon);
          dangerButton.innerHTML += "&nbsp;Gefährdungen anzeigen"
          dangerButton.addEventListener('click', closeMaßnahmen);

          var dangerSpan = document.createElement('span');
          dangerSpan.setAttribute('class','badge badge-primary badge-pill ml-3');
          dangerButton.appendChild(dangerSpan);

          mainRow.appendChild(dangerCol);

          var measureCol = document.createElement('div');
          measureCol.setAttribute('class','col-md-3');

          var measureButton = document.createElement('button');
          measureButton.setAttribute('class','btn btn-flat p-1 m-0');
          measureButton.setAttribute('type','button');
          measureButton.setAttribute('data-toggle','collapse');
          measureButton.setAttribute('data-target','#collapseMeasures'+item);
          measureButton.addEventListener('click', closeGefährdungen);
          measureCol.appendChild(measureButton);

          var measureIcon = document.createElement('i');
          measureIcon.setAttribute('class','fa fa-angle-down rotate-icon');
          measureButton.appendChild(measureIcon);
          measureButton.innerHTML += "&nbsp;Maßnahmen anzeigen";

          var measureSpan = document.createElement('span');
          measureSpan.setAttribute('class','badge badge-primary badge-pill ml-3');
          measureButton.appendChild(measureSpan);

//          alert(measureCol.innerHTML);

          mainRow.appendChild(measureCol);

          cardbody.appendChild(mainRow);

          /*AB HIER GEFÄHRDUNGEN COLLAPSE*/
          var collapseDanger = document.createElement('div');
          collapseDanger.setAttribute('class', 'collapse col-md-10 ml-5');
          collapseDanger.setAttribute('id', 'collapseDangers' + item);

          cardbody.appendChild(collapseDanger);

          var accordionDanger = document.createElement('div');
          accordionDanger.setAttribute('class', 'accordion');
          accordionDanger.setAttribute('id', 'accordionEx');
          accordionDanger.setAttribute('role', 'tablist');

          collapseDanger.appendChild(accordionDanger);

          var cardDanger = document.createElement('div');
          cardDanger.setAttribute('class', 'card');
          cardDanger.appendChild(document.createElement('hr'));

          accordionDanger.appendChild(cardDanger);

          var cardDangerHeader = document.createElement('h4');
          cardDangerHeader.setAttribute('class', 'ml-4');
          cardDangerHeader.innerText = 'Gefährdungen';

          cardDanger.appendChild(cardDangerHeader);

/*          var kID = document.createElement('div');
          kID.setAttribute('id', obj[item].KundenAssetID);*/

          loadGefährdungen(obj[item].KundenAssetID, cardDanger, dangerSpan);

          //AB HIER MAßNAHMEN COLLAPSE ALDA
          var collapseMeasures = document.createElement('div');
          collapseMeasures.setAttribute('class', 'collapse mx-5 mt-4');
          collapseMeasures.setAttribute('id', 'collapseMeasures' + item);

          cardbody.appendChild(collapseMeasures);

          var tabUl = document.createElement('ul');
          tabUl.setAttribute('class', 'nav nav-tabs nav-justified');
          tabUl.setAttribute('role', 'tablist');
          tabUl.style.backgroundColor = '#e2e2e2';
          collapseMeasures.appendChild(tabUl);

          var tabGlobalLi = document.createElement('li');
          tabGlobalLi.setAttribute('class', 'nav-item');
          tabUl.appendChild(tabGlobalLi);

          var linkGlobal = document.createElement('a');
          linkGlobal.setAttribute('class', 'nav-link active black-text');
          linkGlobal.setAttribute('data-toggle', 'tab');
          linkGlobal.setAttribute('href', '#panel' + item);
          linkGlobal.setAttribute('role', 'tab');
          linkGlobal.innerText = 'Globale Massnahmen';
          tabGlobalLi.appendChild(linkGlobal);

          var tabGlobalLi1 = document.createElement('li');
          tabGlobalLi1.setAttribute('class', 'nav-item');
          tabUl.appendChild(tabGlobalLi1);

          var linkGlobal1 = document.createElement('a');
          linkGlobal1.setAttribute('class', 'nav-link black-text');
          linkGlobal1.setAttribute('data-toggle', 'tab');
          linkGlobal1.setAttribute('href', '#panel1' + item);
          linkGlobal1.setAttribute('role', 'tab');
          linkGlobal1.innerText = 'Lokale Massnahmen';
          tabGlobalLi1.appendChild(linkGlobal1);
//          alert(linkGlobal1.href);


          var tabContent = document.createElement('div');
          tabContent.setAttribute('class', 'tab-content');
          collapseMeasures.appendChild(tabContent);

          var tabPanel1 = document.createElement('div');
          tabPanel1.setAttribute('class', 'tab-pane fade in show active');
          tabPanel1.setAttribute('id', 'panel' + item);
          tabPanel1.setAttribute('role', 'tabpanel');
          tabContent.appendChild(tabPanel1);

          var tableGlobal = document.createElement('table');
          tableGlobal.setAttribute('id', 'tableGlobal');
          tableGlobal.setAttribute('class', 'table table-striped table-bordered table-responsive');
          tableGlobal.setAttribute('cellspacing', '0');
          tableGlobal.setAttribute('width', '100%');
          var globalHeader = tableGlobal.createTHead();
          var globalRow = globalHeader.insertRow(0);
          var globalCell1 = globalRow.insertCell(0);
          globalCell1.innerText = "Name";
          var globalCell2 = globalRow.insertCell(1);
          globalCell2.innerText = "Beschreibung";
          var globalCell3 = globalRow.insertCell(2);
          globalCell3.innerText = "Wirksamkeit";
          var globalCell4 = globalRow.insertCell(3);
          globalCell4.innerText = "Umsetzbarkeit";
          var globalCell5 = globalRow.insertCell(4);
          globalCell5.innerText = "Erledigt";
          var globalBody = document.createElement('tbody');
          tableGlobal.appendChild(globalBody);
          tabPanel1.appendChild(tableGlobal);


          var tabPanel2 = document.createElement('div');
          tabPanel2.setAttribute('class', 'tab-pane fade');
          tabPanel2.setAttribute('id', 'panel1' + item);
          tabPanel2.setAttribute('role', 'tabpanel');
          tabContent.appendChild(tabPanel2);

          var tableLokal = document.createElement('table');
          tableLokal.setAttribute('id', 'tableLokal');
          tableLokal.setAttribute('class', 'table table-striped table-bordered table-responsive');
          tableLokal.setAttribute('cellspacing', '0');
          tableLokal.setAttribute('width', '100%');
          var lokalHeader = tableLokal.createTHead();
          var lokalRow = lokalHeader.insertRow(0);
          var lokalCell1 = lokalRow.insertCell(0);
          lokalCell1.innerText = "Name";
          var lokalCell2 = lokalRow.insertCell(1);
          lokalCell2.innerText = "Beschreibung";
          var lokalCell3 = lokalRow.insertCell(2);
          lokalCell3.innerText = "Wirksamkeit";
          var lokalCell4 = lokalRow.insertCell(3);
          lokalCell4.innerText = "Umsetzbarkeit";
          var lokalCell5 = lokalRow.insertCell(4);
          lokalCell5.innerText = "Erledigt";
          var lokalBody = document.createElement('tbody');
          tableLokal.appendChild(lokalBody);
          tabPanel2.appendChild(tableLokal);

          loadMassnahmen(obj[item].KundenAssetID ,globalBody, lokalBody, measureSpan);
        }
      }
    }
  };
  xhttp.open("GET", "/allKundenAssets", true);
  xhttp.send();

}

function loadMassnahmen(kID, globalBody, lokalBody, measureSpan){
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(){
    if(xhr.readyState == 4 && xhr.status == 200){
      var obj = JSON.parse(xhr.responseText);
      for(var item in obj){
        console.log(obj[item]);
        var globalRow = globalBody.insertRow(item);
        var globalCell1 = globalRow.insertCell(0);
        globalCell1.innerText = obj[item].Titel;
        var globalCell2 = globalRow.insertCell(1);
        globalCell2.innerText = obj[item].Beschreibung;
        var globalCell3 = globalRow.insertCell(2);
        //WIRKSAMKEIT
        var globalCell4 = globalRow.insertCell(3);
        //UMSETZBARKEIT
        var globalCell5 = globalRow.insertCell(4);

        var checkboxDiv = document.createElement('div');
        checkboxDiv.setAttribute('class','form-group checkbox-success-filled');

        globalCell5.appendChild(checkboxDiv);
//        alert(globalCell5.innerHTML);
        var input = document.createElement('input');
        input.setAttribute('type', 'checkbox');
        input.setAttribute('class', 'filled-in');
        input.setAttribute('name', kID);
        input.setAttribute('alt', obj[item].mid);
        input.setAttribute('id','measure' + item);
        input.addEventListener('click', massnahmeErledigen);

        //IF Durchgeführt!!!!!!!!

        checkboxDiv.appendChild(input);
//        alert(checkboxDiv.innerHTML);
        var label = document.createElement('label');
        label.setAttribute('for', 'measure' + item);

        checkboxDiv.appendChild(label);
      }
    }
  }
  xhr.open('GET', '/allMassnahmenFurAsset/' + kID, true);
  xhr.send();
}

function massnahmeErledigen(){
  var xhr = new XMLHttpRequest();
  if(this.checked){
    xhr.open('GET', '/massnahmeErledigt/' + this.name + '/' + this.alt, true);
    xhr.send();
  } else{
    xhr.open('GET', '/massnahmeErledigtNegativ/' + this.name + '/' + this.alt, true);
    xhr.send();
  }
}

function closeGefährdungen(){
//    alert(this.parentNode.previousSibling.firstChild);
  $(this.parentNode.parentNode.nextSibling).collapse('hide');
}

function closeMaßnahmen(){
  $(this.parentNode.parentNode.nextSibling.nextSibling).collapse('hide');
}

function loadGefährdungen(kID, cardDanger, dangerSpan){
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(){
//            alert("hallo");
    if(xhr.readyState == 4 && xhr.status == 200){
      var obj = JSON.parse(xhr.responseText);
      dangerSpan.innerText = obj.length;
      for(var item in obj){
//        console.log(obj[item]);
        //ACCORDION ITEM ANFANG
//        alert(obj[item].Asset)
        var accordionItem = document.createElement('div');
        accordionItem.setAttribute('class', 'card-header');
        accordionItem.setAttribute('role', 'tab');
        accordionItem.setAttribute('id', 'headingOne'+kID + item);

        cardDanger.appendChild(accordionItem);

        var accordionLink = document.createElement('a');
        accordionLink.setAttribute('class', 'collapsed');
        accordionLink.setAttribute('data-toggle','collapse');
        accordionLink.setAttribute('data-parent','#accordianEx');
        accordionLink.setAttribute('href','#collapseOne'+kID + item);
//        alert(accordionLink.href);

        var gefahrHeading = document.createElement('h5');
        gefahrHeading.innerHTML = '<p class="col-md-10">' + obj[item].Name + '</p>';
        var ratingIcon = document.createElement('i');
        ratingIcon.setAttribute('id', obj[item].GID);

        ratingIcon.setAttribute('class', 'ml-3 fa fa-remove');
        ratingIcon.innerText = 'Massnahmen bitte durchführen';

        gefahrHeading.appendChild(ratingIcon);

        var gefahrIcon = document.createElement('i');
        gefahrIcon.setAttribute('class', 'fa fa-angle-down');
        gefahrIcon.innerText = 'Massnahmen anzeigen';
        gefahrHeading.appendChild(gefahrIcon);
        accordionLink.appendChild(gefahrHeading);
        accordionItem.appendChild(accordionLink);
        //ACCORDION ITEM ENDE

//        loadMeasure(kID, obj[item].GID, cardDanger);

        var collapseDiv = document.createElement('div');
        collapseDiv.setAttribute('id', 'collapseOne'+kID + item);
        collapseDiv.setAttribute('class', 'collapse');
        collapseDiv.setAttribute('role', 'tabpanel');
//        alert(collapseDiv.id);

        cardDanger.appendChild(collapseDiv);
        cardDanger.appendChild(document.createElement('hr'));

        var cardbodyDanger = document.createElement('div');
        cardbodyDanger.setAttribute('class', 'card-body');

        collapseDiv.appendChild(cardbodyDanger);

        var listDanger = document.createElement('ul');
        listDanger.setAttribute('class', 'list-group');

        cardbodyDanger.appendChild(listDanger);

        loadMeasure(kID, obj[item].GID, listDanger, ratingIcon);
//        alert(cardDanger.innerHTML);
      }
    }
  }
  xhr.open('GET', '/allGefahrenFurAsset/' + kID, true);
  xhr.send();
}

function loadMeasure(kID, gID, listDanger, ratingIcon){
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(){
    if(xhr.readyState == 4 && xhr.status == 200){
      var obj = JSON.parse(xhr.responseText);
//      alert(obj.length);
      for(var item in obj){
        //ANFANG MAßNAHMEN
//        console.log(obj[item]);
        var listDangerItem = document.createElement('li');
        listDangerItem.setAttribute('class', 'list-group-item');

        listDanger.appendChild(listDangerItem);

        var listDangerRow = document.createElement('div');
        listDangerRow.setAttribute('class', 'row');

        listDangerItem.appendChild(listDangerRow);

        var listDangerCol = document.createElement('div');
        listDangerCol.setAttribute('class', 'col-md-10');

        listDangerRow.appendChild(listDangerCol);
        //        alert(obj[item].Beschreibung);
        listDangerCol.innerText = obj[item].Beschreibung;
        //          alert(listDangerCol.innerHTML);

        var dangerCheckBoxDiv = document.createElement('div');
        dangerCheckBoxDiv.setAttribute('class','form-group checkbox-success-filled');

        var dangerInput = document.createElement('input');
        dangerInput.setAttribute('type', 'checkbox');
        dangerInput.setAttribute('class', 'filled-in');
        dangerInput.setAttribute('name', kID);
        dangerInput.setAttribute('alt', obj[item].mid);
        dangerInput.setAttribute('id','checkbox101'+ kID + index);

        if(obj[item].Durchgeführt == 1){
          dangerInput.setAttribute('checked', 'checked');
        }
//        alert(dangerInput.id);
        dangerInput.addEventListener('click', checkMeasure);

        var dangerLabel = document.createElement('label');
        dangerLabel.innerText = 'Erledigt'
        dangerLabel.setAttribute('id', gID);
        dangerLabel.setAttribute('for', 'checkbox101'+ kID + index);
//        alert(dangerLabel.id);
        dangerCheckBoxDiv.appendChild(dangerInput);
        dangerCheckBoxDiv.appendChild(dangerLabel);

        //        listDangerCol.appendChild(dangerCheckBoxDiv);

        listDangerRow.appendChild(dangerCheckBoxDiv);
        //ENDE GEFÄHRDUNGEN MAßNAHMEN
        index++;
      }
//      alert(listDanger.innerHTML);
      changeRatingIcon(listDanger, ratingIcon);
    }
  }
  xhr.open('GET', '/getAllMassnahmenFurGefahrdung/' + kID + '/' + gID, true);
  xhr.send();
}

function changeRatingIcon(listDanger){

  var iconList = document.querySelectorAll('i.fa');
  var ul = listDanger;
  var card = ul.parentNode.parentNode.parentNode;
  var ulList = card.querySelectorAll('ul');

  for(var i = 0; i < ulList.length; i++){

    var inputList = ulList[i].querySelectorAll('input.filled-in');
    var signal = true;
    for(var x = 0; x < inputList.length; x++){
      if(inputList[x].checked){
        signal = true;
      } else{
        signal = false;
        break;
      }
    }

    var input = ulList[i].firstChild.querySelector('input');
//    alert(ulList[i].firstChild.innerHTML);
    if(signal == true){
      for(var y = 0; y < iconList.length; y++){
        if(iconList[y].id == input.nextSibling.id){
          iconList[y].setAttribute('class', 'ml-3 fa fa-check');
          iconList[y].innerText = 'Massnahmen erledigt';
        }
      }
    }else{
      for(var y = 0; y < iconList.length; y++){
        if(iconList[y].id == input.nextSibling.id){
          iconList[y].setAttribute('class', 'ml-3 fa fa-remove');
          iconList[y].innerText = 'Massnahmen bitte durchführen';
        }
      }
    }

  }
}

function checkMeasure(){
//  alert('hallo');
  var ul = this.parentNode.parentNode.parentNode.parentNode;
  var inputListAll = document.querySelectorAll('input.filled-in');

  if(this.checked){
    for(var i = 0; i < inputListAll.length; i++){
      if(this.alt == inputListAll[i].alt){
        inputListAll[i].checked = true;
      }
    }
  } else{
    for(var i = 0; i < inputListAll.length; i++){
      if(this.alt == inputListAll[i].alt){
        inputListAll[i].checked = false;
      }
    }
  }

  changeRatingIcon(ul);

  var xhr = new XMLHttpRequest();
  if(this.checked){

    xhr.open('PUT', '/massnahmeErledigt/'+ this.name +'/' + this.alt, true);
    xhr.send();
  } else {
    xhr.open('PUT', '/massnahmeErledigtNegativ/'+ this.name +'/' + this.alt, true);
    xhr.send();
  }

}

function toggleKategorie(kat){
  kategorie = kat.innerText;
  init();
}
