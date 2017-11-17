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
<<<<<<< HEAD
    password: "1610337",
    database: "pearsec"
  });
 // End of SQL-Connection
//Launch Server
=======
  password: "1610337",
  database: "pearsec"
});
//Launch Server on port 3000
>>>>>>> d1a312947a54d7bacf44d75e02ff1333c7d23ddb
var server = app.listen(3000, listening);
function listening() {
  console.log("Server was launched");
}
//Provide static files
app.use(express.static('public'));

////////////////////////////
//API-GET Pfäde & Methoden:
////////////////////////////

app.get('/allAssets', getAllAssets);
//get RisikoJeGefährdung
app.get('/risikoFurGefahrdung/:param', risikoFurGefahrdung);
//get RisikoJeGefährdung
app.get('/gesamtRisiko', getGesamtRisiko);
<<<<<<< HEAD

function getAllAssets (req, res){
    // SQL Part
    var sqlResult;

      con.query("SELECT * FROM Assets", function (err, result, fields) {
          if (err) throw err;
          console.log(result);
           sqlResult = result;
           res.send(result);

      });


      // END OF SQL PART
      console.log(sqlResult);

//res.send(sqlResult);
}

=======
//berechne Risiko für ein Asset
app.get('/getRisikoFurEinAsset/:param',getRisikoFurEinAsset2);
//////////////////////////
// API-POST Pfäde
/////////////////////////
>>>>>>> d1a312947a54d7bacf44d75e02ff1333c7d23ddb
app.post('/post', postDaten);

////////////////////////
//Funktionen der get API
////////////////////////

<<<<<<< HEAD
function risikoFurGefahrdung (req, res){
    // working

     getRisikoFurEineGefahrung(req.params.param, (xy)=>{res.send((xy));});

}

function getGesamtRisiko (req, res){
     getGesamtRisiko2((xy)=>{console.log(xy);});


=======
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
>>>>>>> d1a312947a54d7bacf44d75e02ff1333c7d23ddb
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
<<<<<<< HEAD
 Object.keys(result).forEach(function(key) {
 // console.log( result[key].KundenAssetID);
     //hier durch die json iterieren und jeweils patricks sql befehl aufrufen und dnn alles zusammen addieren
   //console.log(e.);

    getRisikoFurEinAsset(result[key].KundenAssetID, (xy)=>{console.log("done : " + xy);
    counter++;
    gesamtRisiko= gesamtRisiko+xy});
   //ende des sql parts

});
console.log(gesamtRisiko);
  _callback((gesamtRisiko/counter));
});
=======
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
>>>>>>> d1a312947a54d7bacf44d75e02ff1333c7d23ddb
}
// ruft eine Funktion auf die das Risiko für eine Asset zurück gibt. Das Ergebnis wird direkt gesendet
function getRisikoFurEinAsset2(req, res) {
  console.log("getRisiko2");
  getRisikoFurEinAsset(req.params.param, (xy) => { res.send((xy)); });
}
// berechnet das Risiko für ein Asset
function getRisikoFurEinAsset(KundenAssetID, _callback) {
  console.log("getRisiko3");
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

////////////////////////
//Funktionen der get API
////////////////////////

function postDaten(req, res) {
  // SQL Part
  /* var sql = "INSERT INTO test1 (t1ID, text) VALUES ('57', 'patrick')";
 con.query(sql, function (err, result) {
   if (err) throw err;*/
  console.log("1 record inserted");
  console.log(req.body);
  var sql = ("INSERT INTO test1 (t1ID, text) VALUES (' " + req.body.zahl + "','" + req.body.text + "');");
  con.query(sql, function (err, result) {
    if (err) throw err;
  });
<<<<<<< HEAD
}
=======
};



>>>>>>> d1a312947a54d7bacf44d75e02ff1333c7d23ddb
