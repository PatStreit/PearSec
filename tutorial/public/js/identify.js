"use strict"
var vorschläge = document.getElementById('vorschläge');
var assetListe = document.getElementById('assetListe');
var assetChildes = assetListe.childNodes;
var collapseCounter = 1;

var headerRow = document.createElement('div');
headerRow.setAttribute('class', 'row');
var headerSize = document.createElement('h4');
headerSize.setAttribute('class', 'black-text');
headerSize.innerText = 'Neue hinzufügen';
headerRow.appendChild(headerSize);

var headerRow1 = document.createElement('div');
headerRow1.setAttribute('class', 'row');
var headerSize1 = document.createElement('h4');
headerSize1.setAttribute('class', 'black-text');
headerSize1.innerText = 'Vermögenswerte im Unternehmen';
headerRow1.appendChild(headerSize1);

//assetListe.appendChild(headerRow1);

window.onload = init(document.getElementById('it'));

function init(kategorie){
  //aktuelle Farben zurücksetzen und aktuelle Kategorie färben
  document.getElementById('it').style.backgroundColor="#FFFFFF";
  document.getElementById('maschinen').style.backgroundColor="#FFFFFF";
  document.getElementById('netze').style.backgroundColor="#FFFFFF";
  document.getElementById('infrastruktur').style.backgroundColor="#FFFFFF";
  document.getElementById('daten').style.backgroundColor="#FFFFFF";

  document.getElementById(kategorie.id).style.backgroundColor="#E2E2E2";


  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(){
    if(xhr.readyState == 4 && xhr.status == 200){
      var obj = JSON.parse(xhr.responseText);

      if(kategorie.innerText == "IT-Systeme"){
        assetListe.innerHTML = "";
        assetListe.appendChild(headerRow1);
        for(var item in obj){
//          console.log(obj[item]);
          if(obj[item].Kategorien == "IT-Systeme"){
            callAsset(obj[item], kategorie.id);
          }
        }
      }

      if(kategorie.innerText == "Maschinen / Anlagen"){
        assetListe.innerHTML = "";
        assetListe.appendChild(headerRow1);
        for(var item in obj){
          if(obj[item].Kategorien == "Maschinen / Anlagen"){
            callAsset(obj[item], kategorie.id);
          }
        }
      }

      if(kategorie.innerText == "Netze"){
        assetListe.innerHTML = "";
        assetListe.appendChild(headerRow1);
        for(var item in obj){
          if(obj[item].Kategorien == "Netze"){
            callAsset(obj[item], kategorie.id);
          }
        }
      }

      if(kategorie.innerText == "Infrastruktur"){
        assetListe.innerHTML = "";
        assetListe.appendChild(headerRow1);
        for(var item in obj){
          if(obj[item].Kategorien == "Infrastruktur"){
            callAsset(obj[item], kategorie.id);
          }
        }
      }

      if(kategorie.innerText == "Daten"){
        assetListe.innerHTML = "";
        assetListe.appendChild(headerRow1);
        for(var item in obj){
          if(obj[item].Kategorien == "Daten"){
            callAsset(obj[item], kategorie.id);
          }
        }
      }

    }
  }

  xhr.open("GET", "/allKundenAssets", true);
  xhr.send();

  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if(xhttp.readyState == 4 && xhttp.status == 200){
      var obj = JSON.parse(xhttp.responseText);
//      alert(assetListe.innerText);
//      alert(assetListe.innerText.includes("LAPTOP"));

          if(kategorie.innerText == 'IT-Systeme'){
            vorschläge.innerHTML = "";
            vorschläge.appendChild(headerRow);
            for(var item in obj){
//  -            console.log(obj[item]);
              if(obj[item].Kategorien == 'IT-Systeme' && assetListe.innerText.includes(obj[item].Name.toUpperCase()) == false){
                loadAssets(obj[item], kategorie.id);
              }
            }
            return;
          }

          if(kategorie.innerText == 'Maschinen / Anlagen'){
            vorschläge.innerHTML = "";
            vorschläge.appendChild(headerRow);
            for(var item in obj){
//              console.log(obj[item]);
              if(obj[item].Kategorien == 'Maschinen / Anlagen' && assetListe.innerText.includes(obj[item].Name.toUpperCase()) == false){
                loadAssets(obj[item], kategorie.id);
              }
            }
            return;
          }

          if(kategorie.innerText == 'Netze'){
            vorschläge.innerHTML = "";
            vorschläge.appendChild(headerRow);
            for(var item in obj){
//              console.log(obj[item]);
              if(obj[item].Kategorien == 'Netze' && assetListe.innerText.includes(obj[item].Name.toUpperCase()) == false){
                loadAssets(obj[item], kategorie.id);
              }
            }
            return;
          }

          if(kategorie.innerText == 'Infrastruktur'){
            vorschläge.innerHTML = "";
            vorschläge.appendChild(headerRow);
            for(var item in obj){
//              console.log(obj[item]);
              if(obj[item].Kategorien == 'Infrastruktur' && assetListe.innerText.includes(obj[item].Name.toUpperCase()) == false){
                loadAssets(obj[item], kategorie.id);
              }
            }
            return;
          }

          if(kategorie.innerText == 'Daten'){
            vorschläge.innerHTML = "";
            vorschläge.appendChild(headerRow);
            for(var item in obj){
//              console.log(obj[item]);
              if(obj[item].Kategorien == 'Daten' && assetListe.innerText.includes(obj[item].Name.toUpperCase()) == false){
                loadAssets(obj[item], kategorie.id);
              }
            }
            return;
          }
    }
  }

  xhttp.open("GET", "/allAssets", true);
  xhttp.send();

}

function addAsset(){
//  alert('WTF SOLL DES');
  toastr.success('Vermögenswert wurde hinzugefügt!', 'Hinzugefügt!');
//      console.log(i);
  var textAnfang = "{ \"Paket\" : [";
  var textInhalt = "";
  var textEnde = ']}';
  textInhalt = "{ \"AID\": \"" + this.id + "\", \"Name\": \"" + this.innerText + "\" }";

  var obj = textAnfang + textInhalt + textEnde;
//    alert(obj);

  var xhr = new XMLHttpRequest();
  xhr.open('POST', "/post", true);
  xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
  xhr.responseType ='json';
  xhr.send(obj);

//  callAsset(JSON.parse(textInhalt));
  init(document.getElementById(this.name));

  this.parentNode.remove();
}

function callAsset(asset, kID){
  var row = document.createElement('div');
  row.setAttribute('class', 'row');

  var addButton = document.createElement('a');
  addButton.setAttribute('class', 'mt-4 mr-3');
  addButton.setAttribute('id', asset.KundenAssetID);
  addButton.setAttribute('name', kID);
  var icon = document.createElement('i');
  icon.setAttribute('class', 'fa fa-trash fa-2x');
  addButton.appendChild(icon);

  addButton.addEventListener('click', delAsset);

  var assetDIV = document.createElement('div');
  assetDIV.setAttribute('class', 'btn btn-indigo darken 2 btn-block ml-5 mt-2 mb-3 mr-4 animated fadeIn');
  assetDIV.setAttribute('id', asset.AID);
  assetDIV.style.height = '55px';
  assetDIV.style.width = '60%';
  assetDIV.innerText = asset.Name;

  row.appendChild(assetDIV);

  var bewerten = document.createElement('a');
  bewerten.setAttribute('class', 'mt-4 mr-3');
  bewerten.setAttribute('data-toggle', 'collapse');
  bewerten.setAttribute('data-target', '#collapseExample' + collapseCounter);
  bewerten.setAttribute('aria-expended', 'false');
  bewerten.setAttribute('aria-controls', 'collapseExample' + collapseCounter);
  bewerten.innerHTML = '<i class="fa fa-gears fa-2x" aria-hidden="true"></i>';

  row.appendChild(bewerten);
  row.appendChild(addButton);

  var weiterleiten = document.createElement('a');
  weiterleiten.setAttribute('class', 'mt-4 mr-2');
  weiterleiten.innerHTML = '<i class="fa fa-share fa-2x" aria-hidden="true"></i>';
  row.appendChild(weiterleiten);

  assetListe.appendChild(row);

  var collapse = document.createElement('div');
  collapse.setAttribute('class', 'collapse');
  collapse.setAttribute('id', 'collapseExample' + collapseCounter);
  collapseCounter++;

//  collapseText.innerText = 'Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident.'
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(){
    if(xhr.readyState == 4 && xhr.status == 200){
      var obj = JSON.parse(xhr.responseText);
      for(var item in obj){

        var collapseText = document.createElement('p');
        collapseText.setAttribute('class', 'black-text');

        var form = document.createElement('form');
        form.setAttribute('class', 'form-inline mb-4 black-text');
        var formGroup1 = document.createElement('div');
        formGroup1.setAttribute('class', 'form-group');

        form.appendChild(formGroup1);

        var radio1 = document.createElement('input');
        radio1.setAttribute('name', 'group20');
        radio1.setAttribute('type', 'radio');
        radio1.setAttribute('id', 'radio' + item);
        radio1.setAttribute('class', obj[item].mid);

        radio1.addEventListener('click', function(){
//          alert(obj[item].KundenAssetID);
//          alert(this.className);
          var xhttp = new XMLHttpRequest();
          xhttp.open('PUT', '/massnahmeErledigt/' + obj[item].KundenAssetID + '/' + this.className);
          xhttp.send();

        });

        var radioLabel1 = document.createElement('label');
        radioLabel1.setAttribute('for', 'radio' + item);
        radioLabel1.innerText = 'Ja';


        formGroup1.appendChild(radio1);
        formGroup1.appendChild(radioLabel1);

        var formGroup2 = document.createElement('div');
        formGroup2.setAttribute('class', 'form-group');

        form.appendChild(formGroup2);

        var radio2 = document.createElement('input');
        radio2.setAttribute('name', 'group20');
        radio2.setAttribute('type', 'radio');
        radio2.setAttribute('id', 'radio' + (item+1) );
        radio2.setAttribute('class', obj[item].mid);

        var radioLabel2 = document.createElement('label');
        radioLabel2.setAttribute('for', 'radio' + (item+1) );
        radioLabel2.innerText = 'Nein';

        radioLabel2.addEventListener('click', function(){
          var xhr = new XMLHttpRequest();

          xhr.open('PUT', '/massnahmeErledigtNegativ/' + obj[item].KundenAssetID + '/' + this.mid );
          xhr.send();
        })

        if(obj[item].Durchgeführt == "1"){
          radio1.setAttribute('checked', 'checked');
        } else{
          radio2.setAttribute('checked', 'checked');
        }

        formGroup2.appendChild(radio2);
        formGroup2.appendChild(radioLabel2);


//        console.log(obj[item]);
        if(asset.Name.toUpperCase() == obj[item].Name){
          collapseText.innerText = obj[item].Prüffragen;
          collapse.appendChild(collapseText);
          collapse.appendChild(form);
        }

      }
    }

  }
  xhr.open("GET", '/getAllKundenAssetsAndPruffragen', true);
  xhr.send();

  assetListe.appendChild(collapse);
}

function delAsset(){
//  alert(this.parentNode.innerHTML);
//  alert("/deleteAsset/" + this.id);
  toastr.error('Vermögenswert wurde entfernt', 'Entfernt!')
  var xhttp = new XMLHttpRequest();

  xhttp.open("DELETE","/deleteAsset/"+this.id, true);
  xhttp.send();

  init(document.getElementById(this.name));

  this.parentNode.remove();

}



function loadAssets(obj, kID){
  var row = document.createElement('div');
  row.setAttribute('class', 'row');

  var button = document.createElement('button');
  button.setAttribute('class', 'btn btn-indigo darken 2');
  button.setAttribute('id', obj.AID);
  button.setAttribute('name', kID);
  button.style.height = '55px';
  button.style.width = '200px';
//  alert(obj.KundenAssetID);

  button.innerHTML = '<div class="float-left"><i class="fa fa-plus mr-1" aria-hidden="true"></i></div>' + obj.Name;
  button.setAttribute('data-target','#exampleModal');
  button.setAttribute('data-toggle', 'modal');

  button.addEventListener('click', addAsset);


  row.appendChild(button);
  vorschläge.appendChild(row);
}
