"use strict"

var anliegenHeader = document.getElementById('anliegen');
var kategorieHeader = document.getElementById('kategorie');

function toggleAnliegen(anliegen){

  anliegenHeader.innerText = anliegen.innerText;

  if(anliegenHeader.innerText == "Sie möchten einen Vermögenswert hinzufügen?".toUpperCase()){
    document.getElementById('addAsset').removeAttribute('style');
    document.getElementById('footer').removeAttribute('style');
    document.getElementById('sonstiges').style.display = "none";
    document.getElementById('submitFehler').style.display = "none";
    document.getElementById('vorschlag').style.display = "none";
  }

  if(anliegenHeader.innerText == "Ein Fehler muss behoben werden".toUpperCase()){
    document.getElementById('addAsset').style.display = "none";
    document.getElementById('vorschlag').style.display = "none";
    document.getElementById('sonstiges').style.display = "none";
    document.getElementById('submitFehler').removeAttribute('style');
    document.getElementById('footer').removeAttribute('style');

  }

  if(anliegenHeader.innerText == "Verbesserungvorschläge".toUpperCase()){
    document.getElementById('addAsset').style.display = "none";
    document.getElementById('submitFehler').style.display = "none";
    document.getElementById('sonstiges').style.display = "none";
    document.getElementById('vorschlag').removeAttribute('style');
    document.getElementById('footer').removeAttribute('style');

  }

  if(anliegenHeader.innerText == "Sonstiges".toUpperCase()){
    document.getElementById('addAsset').style.display = "none";
    document.getElementById('submitFehler').style.display = "none";
    document.getElementById('vorschlag').style.display = "none";
    document.getElementById('sonstiges').removeAttribute('style');
    document.getElementById('footer').removeAttribute('style');

  }
}

function toggleKategorie(kategorie){

  kategorieHeader.innerText = kategorie.innerText;
  var newKategorie = document.getElementById('addKategorie');
  newKategorie.style.display = "none";
}

function toggleVerbesserung(kategorie){
  var verbesserung = document.getElementById('verbesserung');

  verbesserung.innerText = kategorie.innerText;

}

function addKategorie(){
  var kategorieHeader = document.getElementById('kategorie');

  kategorieHeader.innerText = "Neue Kategorie";
  var newKategorie = document.getElementById('addKategorie');
  newKategorie.removeAttribute('style');
}

function sendAsset(){
  var input1 = document.getElementById('form1');
  var input2 = document.getElementById('form2');
//  alert(input1.value);
  if(kategorieHeader.innerText == "NEUE KATEGORIE" && input1.value == ""){
    toastr.error('Bitte alle Felder ausfüllen!', 'Fehlgeschlagen');
    return;
  }

  if(input2.value == ""){
    toastr.error('Bitte alle Felder ausfüllen!', 'Fehlgeschlagen');
  } else{
    toastr.success('Ticket wurde versendet!', 'Erfolgreich');
  }

}

function sendFehler(){
  var textarea = document.getElementById('exampleFormControlTextarea6');
  var input = document.getElementById('form3');

  if(textarea.value == "" || input.value == ""){
    toastr.error('Bitte alle Felder ausfüllen!', 'Fehlgeschlagen');
  } else{
    toastr.success('Ticket wurde versendet!', 'Erfolgreich');
  }

}

function sendVorschlag(){
  var textarea = document.getElementById('exampleFormControlTextarea7');
  var input = document.getElementById('form4');

  if(textarea.value == "" || input.value == ""){
    toastr.error('Bitte alle Felder ausfüllen!', 'Fehlgeschlagen');
  } else{
    toastr.success('Ticket wurde versendet!', 'Erfolgreich');
  }
}

function sendSonstiges(){
  var textarea = document.getElementById('exampleFormControlTextarea8');
  var input = document.getElementById('form5');

  if(textarea.value == "" || input.value == ""){
    toastr.error('Bitte alle Felder ausfüllen!', 'Fehlgeschlagen');
  } else{
    toastr.success('Ticket wurde versendet!', 'Erfolgreich');
  }

}
