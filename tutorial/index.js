/*bla1
*node.js webserver providing static and dynamic html files, a front-end api, database connection
* TODO : Catch all possible error relating to mysql
*/
console.log('server is running');
var express = require('express');
var app = express();
var bodyparser = require('body-parser');
app.use(bodyparser.json());
var NeueKundenAssetIDs;
var counterErste=0;
var counterZweite=0;
// SQL Connections
var mysql = require('mysql');
var con = mysql.createConnection({
  host: "141.19.141.151",
  user: "t_schaefer",
  password: "1610337",
  database: "pearsec",
  multipleStatements : true
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

/*wird tendenzuell nicht mehr gebraucht
//alle Prüffragen zu einem KundenAsset schicken
app.get('/allePruffragen/:param', getAllePruffragen);
*/
//Alle Maßnahmen je Asset schicken
app.get('/getAllMassnahmenFurAsset/:param', getAllMaßnahmenFurAsset); 


//Alle Kundenassets schicken
app.get('/getAllKundenAssetsAndPruffragen', getAllKundenAssetsAndPruffragen); 
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
//post einer json datei mit vielen PID´s 
app.post('/postPIDToRemove', postPidToRemove);

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
  var sqlB = "SELECT MAX (a.Eintrittswahrscheinlichkeit*a.Schadenshöhe) as erg from Gefährdungen a, Assets b, Kunde1Verbindungen c, Kunde1Assets d where a.GID = c.GID and b.AID = c.AID and b.AID = d.AID and d.KundenAssetID = \"" + KundenAssetID + " \";";
  con.query(sqlB, (err, result, fields) => {
    if (err) throw err;
    //ist die Gefährdung größer gleich 15 wird der _callback aufgerufen, ansonsten wird der avg wert berechnet
    // console.log(result[0].erg);
    if (result[0] >= 15) {
      //console.log(result[0].erg);
      _callback(15);
    } else {
      // avg wert berechnen
      var sqlB = "SELECT AVG (a.Eintrittswahrscheinlichkeit*a.Schadenshöhe) as erg from Gefährdungen a, Assets b, Kunde1Verbindungen c, Kunde1Assets d where a.GID = c.GID and b.AID = c.AID and b.AID = d.AID and d.KundenAssetID = \"" + KundenAssetID + " \";";
      con.query(sqlB, (err, result, fields) => {
        if (err) throw err;
        //console.log(result[0].erg);
        _callback(result[0]);
      });
    }
  });
}
function getAllKundenAssetsAndPruffragen(req,res){
//senden alle Assets die in der normalen DB hinterlegt sind als Json Response

  var sqlResult;
  //var sqlBef ="SELECT a.KundenAssetID, a.AiD, a.Name, b.Kategorien FROM Kunde1Assets a, Assets b where a.AID = b.AID";
  con.query("SELECT DISTINCT a.KundenAssetID, a.AiD, a.Name, b.Kategorien, d.PID, d.Prüffrage FROM Kunde1Assets a, Assets b, AssetsZuGefährdungen c, Prüffragen d, Kunde1Verbindungen e WHERE a.AID = b.AID AND a.Aid = c.AID AND a.KundenAssetID = e.KundenAssetID  AND c.PID = d.PID AND c.GID = e.GID ORDER BY  `d`.`PID`;", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
    sqlResult = result;
    res.send(result);
  });
  console.log(sqlResult);

}
//neu
// ruft eine Funktion auf die das Risiko für eine Gefährdung zurück gibt. Das Ergebnis wird direkt gesendet
function getAllMaßnahmenFurAsset(req, res) {
  console.log("pouh");
  getAllMaßnahmenFurAsset2(req.params.param, (xy) => { res.send((xy)); });
}
//wird von der Funktion risikoFurGefahrdung aufgerufen
function getAllMaßnahmenFurAsset2(aiD, _callback) {
  var sqlB = "Select b.KundenAssetID, c.Kategorien, a.MID, a.Beschreibung from Maßnahmen a, Kunde1Verbindungen b, Assets c where b.KundenAssetID = \"" + aiD + " \" and a.MID = b.MID and c.AID=b.AID;";
  con.query(sqlB, (err, result, fields) => {
    if (err) throw err;
    _callback(result);
  });
}
/* Wird tendenziell nicht mehr gebraucht
// ruft eine Funktion auf die das Risiko für eine Gefährdung zurück gibt. Das Ergebnis wird direkt gesendet
function getAllePruffragen(req, res) {
  getAllePruffragen2(req.params.param, (xy) => { res.send((xy)); });
}
//wird von der Funktion risikoFurGefahrdung aufgerufen
function getAllePruffragen2(aiD, _callback) {
  var sqlB = "SELECT a.AID, a.GID, c.Kategorien, c.Name ,b.PID ,b.Prüffrage  FROM AssetsZuGefährdungen a, Prüffragen b, Assets c where a.AID= \"" + aiD + " \" and a.PID=b.PID and a.aid=c.aid;";
  con.query(sqlB, (err, result, fields) => {
    if (err) throw err;
    _callback(result);
  });
}
*/

///////////////////////////
//Funktionen der get API///
///////////////////////////
function postDaten(req, res) {
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
       KundenAssetTabelleBefüllen(id, name);
  }
};
 function KundenAssetTabelleBefüllen(aiD, name, _callback){
 var sql=("INSERT INTO Kunde1Assets (KundenAssetId, AID, Name) VALUES (NULL,\"" +aiD + "\", \"" + name + "\");" );
var sql2=("INSERT ignore INTO Kunde1Verbindungen SELECT a.KundenAssetID, a.AID, b.GID, c.MID from Kunde1Assets a, "+
"AssetsZuGefährdungen b, Gefährdungen_haben c where a.KundenAssetID = (SELECT MAX(KundenAssetID) from Kunde1Assets)"+
"and a.AID = b.AID and b.GID = c.GID");
var sql3 = sql+sql2;
counterErste++;
console.log("Erste: " + counterErste);
 con.query(sql3, (err, result, fields) => {
  if (err) console.log("Sprung2");//throw err;
 // NeueKundenAssetIDs=result;
 //  KundenAssetTabelleBefüllenHilfsMethode(sql2,(ab)=>( _callback));

  
});

}
// neu
function postPidToRemove(req, res) {
  /*
  * wir bekommen hier eine JSON mit vielen unter Dateien zum einfügen in eine Tabelle
  * das Einfügen ist in eienr adneren FUnktion realisiert und wir iterieren hier nur
  */
  var data = (req.body).Paket;
  for(var i in data) {

       var aiD = data[i].AID;
       var giD = data[i].GID;
       var piD = data[i].Name;
       console.log(id);
       console.log(name);
       console.log(GID);
      /*Delete from Table
      */
      con.query("delete from Kunde1Verbindungen where KundenAssetID=\"" + AID + "\" and GID=\" " + GID+ "\";" , (err, result, fields) => {
        if (err) console.log("...");
        _callback("done");
      });
  }
};



