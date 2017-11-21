/*bla1
*node.js webserver providing static and dynamic html files, a front-end api, database connection
* TODO : Catch all possible error relating to mysql
*/
console.log('server is running');
var express = require('express');
var app = express();
var bodyparser = require('body-parser');
app.use(bodyparser.json());
// SQL Connections
var mysql = require('mysql');
var con = mysql.createConnection({
  host: "141.19.141.151",
  user: "t_schaefer",
  password: "1610337",
  database: "pearsec"
});
//Launch Server on port 3000
var server = app.listen(3000, listening);
function listening() {
  console.log("Server was launched");
}
//Provide static files
app.use(express.static('public'));

////////////////////////////
//API-GET Pfäde & Methoden:
////////////////////////////

/*
*TODO : alle Parameter und Ergebnisse als Kommentar angeben
*/

//alle Prüffragen zu einem KundenAsset schicken
app.get('/allePruffragen/:param', getAllePruffragen); // not working yet

//Alle Kundenassets schicken
app.get('/allKundenAssets', getAllKundenAssets);
//get alle Assets die im Unternehmen vorkommen können
app.get('/allAssets', getAllAssets);
//get RisikoJeGefährdung
app.get('/risikoFurGefahrdung/:param', risikoFurGefahrdung);
//get RisikoJeGefährdung
app.get('/gesamtRisiko', getGesamtRisiko);
//berechne Risiko für ein Asset
app.get('/getRisikoFurEinAsset/:param',getRisikoFurEinAsset2);
//////////////////////////
// API-POST Pfäde
/////////////////////////
app.post('/post', postDaten);
//post PID

////////////////////////
//Funktionen der get API
////////////////////////

//senden alle Assets die in der normalen DB hinterlegt sind als Json Response
function getAllAssets(req, res) {
  var sqlResult;
  con.query("SELECT * FROM Assets", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    sqlResult = result;
    res.send(result);
  });
  console.log(sqlResult);
}
// ruft eine Funktion auf die das Risiko für eine Gefährdung zurück gibt. Das Ergebnis wird direkt gesendet
function risikoFurGefahrdung(req, res) {
  getRisikoFurEineGefahrung(req.params.param, (xy) => { res.send((xy)); });
}
//wird von der Funktion risikoFurGefahrdung aufgerufen
function getRisikoFurEineGefahrung(giD, _callback) {
  var sqlB = "SELECT (Eintrittswahrscheinlichkeit * Schadenshohe) as erg FROM Gefährdungen where GID= \"" + giD + " \";";
  con.query(sqlB, (err, result, fields) => {
    if (err) throw err;
    _callback(result[0]);
  });
}
// ruft eine Methode auf die das GesamtRisiko des Unternehmens berechnet und ausgibt
function getGesamtRisiko(req, res) {
  getGesamtRisiko2((xy) => { console.log(xy); });
}
//wird von der Methode getGEsamtRisiko aufgerufen und
function getGesamtRisiko2(_callback) {
  var sqlB = "SELECT KundenAssetID from Kunde1Assets; ";
  con.query(sqlB, (err, result, fields) => {
    if (err) throw err;
    var counter;
    var gesamtRisiko;
    Object.keys(result).forEach(function (key) {
      //hier durch die json iterieren und jeweils patricks sql befehl aufrufen und dnn alles zusammen addieren
      getRisikoFurEinAsset(result[key].KundenAssetID, (xy) => {
        console.log("done : " + xy);
        counter++;
        gesamtRisiko = gesamtRisiko + xy
      });
    });
    console.log(gesamtRisiko);
    _callback((gesamtRisiko / counter));
  });
}
// ruft eine Funktion auf die das Risiko für eine Asset zurück gibt. Das Ergebnis wird direkt gesendet
function getRisikoFurEinAsset2(req, res) {
  getRisikoFurEinAsset(req.params.param, (xy) => { res.send((xy)); });
}
// berechnet das Risiko für ein Asset
function getRisikoFurEinAsset(KundenAssetID, _callback) {
  //größte Gefährdung für ein Asset suchen:
  var sqlB = "SELECT MAX (a.Eintrittswahrscheinlichkeit*a.Schadenshohe) as erg from Gefährdungen a, Assets b, Kunde1Verbindungen c, Kunde1Assets d where a.GID = c.GID and b.AID = c.AID and b.AID = d.AID and d.KundenAssetID = \"" + KundenAssetID + " \";";
  con.query(sqlB, (err, result, fields) => {
    if (err) throw err;
    //ist die Gefährdung größer gleich 15 wird der _callback aufgerufen, ansonsten wird der avg wert berechnet
    // console.log(result[0].erg);
    if (result[0] >= 15) {
      //console.log(result[0].erg);
      _callback(15);
    } else {
      // avg wert berechnen
      var sqlB = "SELECT AVG (a.Eintrittswahrscheinlichkeit*a.Schadenshohe) as erg from Gefährdungen a, Assets b, Kunde1Verbindungen c, Kunde1Assets d where a.GID = c.GID and b.AID = c.AID and b.AID = d.AID and d.KundenAssetID = \"" + KundenAssetID + " \";";
      con.query(sqlB, (err, result, fields) => {
        if (err) throw err;
        //console.log(result[0].erg);
        _callback(result[0]);
      });
    }
  });
}
function getAllKundenAssets(req,res){
//senden alle Assets die in der normalen DB hinterlegt sind als Json Response

  var sqlResult;
  //var sqlBef ="SELECT a.KundenAssetID, a.AiD, a.Name, b.Kategorien FROM Kunde1Assets a, Assets b where a.AID = b.AID";
  con.query("SELECT a.KundenAssetID, a.AiD, a.Name, b.Kategorien, d.PID, d.Prüffrage FROM Kunde1Assets a, Assets b, AssetsZuGefährdungen c, Prüffragen d where a.AID = b.AID and a.Aid=c.AID and c.PID = d.PID", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    sqlResult = result;
    res.send(result);
  });
  console.log(sqlResult);

}
// ruft eine Funktion auf die das Risiko für eine Gefährdung zurück gibt. Das Ergebnis wird direkt gesendet
function getAllePruffragen(req, res) {
  getAllePruffragen2(req.params.param, (xy) => { res.send((xy)); });
}
//wird von der Funktion risikoFurGefahrdung aufgerufen
function getAllePruffragen2(aiD, _callback) {
  var sqlB = "SELECT a.AID,c.Kategorien, c.Name ,b.PID ,b.Prüffrage  FROM AssetsZuGefährdungen a, Prüffragen b, Assets c where a.AID= \"" + aiD + " \" and a.PID=b.PID and a.aid=c.aid;";
  con.query(sqlB, (err, result, fields) => {
    if (err) throw err;
    _callback(result);
  });
}
///////////////////////////
//Funktionen der get API///
///////////////////////////
function postDaten(req, res) {
  // SQL Part
  /* var sql = "INSERT INTO test1 (t1ID, text) VALUES ('57', 'patrick')";
 con.query(sql, function (err, result) {
   if (err) throw err;*/
  //console.log("1 record inserted");
  //console.log(req.body);
  /*
  * wir bekommen hier eine JSON mit vielen unter Dateien zum einfügen in eine Tabelle
  * das Einfügen ist in eienr adneren FUnktion realisiert und wir iterieren hier nur
  */
  var data = (req.body).Paket;

  for(var i in data) {
       var id = data[i].AID;
       var name = data[i].Name;
       console.log(id);
       console.log(name);
      // KundenAssetTabelleBefüllen(id, name);
       KundenAssetTabelleBefüllen(id, name, (antw)=>{console.log("done")});
  }
  //Object.keys(req.body[0]).forEach(function (key) {
    //hier durch die json iterieren und jeweils patricks sql befehl aufrufen und dnn alles zusammen addieren
   // console.log("Iteration :")
   // console.log("DONE: " + req.body[0][key].AID);
   // console.log("DONE: " + req.body[0][key].Name);
  //});


 // var sql = ("INSERT INTO test1 (t1ID, text) VALUES (' " + req.body.zahl + "','" + req.body.text + "');");
 // con.query(sql, function (err, result) {
 //   if (err) throw err;
 // });
};

function KundenAssetTabelleBefüllen(aiD, name, _callback){
 var sql=("INSERT INTO Kunde1Assets (KundenAssetId, AID, Name) VALUES (NULL,\"" +aiD + "\", \"" + name + "\");" );
var sql2=("INSERT INTO Kunde1Verbindungen SELECT a.KundenAssetID, a.AID, b.GID, c.MID from Kunde1Assets a, "+
"AssetsZuGefährdungen b, Gefährdungen_haben c where a.KundenAssetID = (SELECT MAX(KundenAssetID) from Kunde1Assets)"+
"and a.AID = b.AID and b.GID = c.GID");

con.query(sql, (err, result, fields) => {
  if (err) console.log("There was an error");//throw err;

  KundenAssetTabelleBefüllenHilfsMethode(sql2, _callback);

});

}
function KundenAssetTabelleBefüllenHilfsMethode(sql, _callback){
  con.query(sql, (err, result, fields) => {
    if (err) throw err;
    _callback("done");
  });
}
