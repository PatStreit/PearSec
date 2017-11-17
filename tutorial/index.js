/*
*node.js webserver providing static and dynamic html files, a front-end api, database connection
* TODO : Catch all possible error relating to mysql
//Hallo
*/
//console.log ('server is running');
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
  // HALLLLLLOOOOOO
 // End of SQL-Connection
//Launch Server 
var server = app.listen(3000, listening);
function listening(){
    console.log("listeninnnng");
}
//Provide static files
app.use(express.static('public'));
//API-GET Pfäde & Methoden:

app.get('/allAssets', getAllAssets);
//get RisikoJeGefährdung
app.get('/risikoFurGefahrdung/:param', risikoFurGefahrdung);
//get RisikoJeGefährdung
app.get('/gesamtRisiko', getGesamtRisiko);

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

app.post('/post', postDaten);

function postDaten (req, res){
    // SQL Part
   /* var sql = "INSERT INTO test1 (t1ID, text) VALUES ('57', 'patrick')";
  con.query(sql, function (err, result) {
    if (err) throw err;*/

    console.log("1 record inserted");
    console.log(req.body);

    var sql = ("INSERT INTO test1 (t1ID, text) VALUES (' " + req.body.zahl +"','" + req.body.text +"');");
    con.query(sql, function (err, result) {
      if (err) throw err;
    });

//});
};


function risikoFurGefahrdung (req, res){
    // working
  
     getRisikoFurEineGefahrung(req.params.param, (xy)=>{res.send((xy));});
   
}

function getGesamtRisiko (req, res){
     getGesamtRisiko2((xy)=>{console.log(xy);});   
   
          
}

function getRisikoFurEineGefahrung(giD, _callback){
  var sqlB = "SELECT (Eintrittswahrscheinlichkeit * Schadenshohe) as erg FROM Gefährdungen where GID= \"" + giD + " \";";
//copied
con.query(sqlB, (err, result, fields) => {
  if (err) throw err;
  _callback(result[0]);
});
}

function getGesamtRisiko2( _callback){
  var sqlB = "SELECT KundenAssetID from Kunde1Assets; ";
 // var sqlB = "SELECT * from AssetsZuGefährdungen ;";
//copied
con.query(sqlB, (err, result, fields) => {
  if (err) throw err;
 // console.log(result[0].GiD);
 var counter;
    var gesamtRisiko;
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
}
function getRisikoFurEinAsset(KundenAssetID, _callback){

  //größte Gefährdung für ein Asset suchen:
  var sqlB = "SELECT MAX (a.Eintrittswahrscheinlichkeit*a.Schadenshohe) as erg from Gefährdungen a, Assets b, Kunde1Verbindungen c, Kunde1Assets d where a.GID = c.GID and b.AID = c.AID and b.AID = d.AID and d.KundenAssetID = \"" + KundenAssetID + " \";";
  con.query(sqlB, (err, result, fields) => {
    if (err) throw err;
    //ist die Gefährdung größer gleich 15 wird der _callback aufgerufen, ansonsten wird der avg wert berechnet
   // console.log(result[0].erg);
    if (result[0].erg>=15){
      //console.log(result[0].erg);
      _callback(15);
    }else{
      // avg wert berechnen
      var sqlB = "SELECT AVG (a.Eintrittswahrscheinlichkeit*a.Schadenshohe) as erg from Gefährdungen a, Assets b, Kunde1Verbindungen c, Kunde1Assets d where a.GID = c.GID and b.AID = c.AID and b.AID = d.AID and d.KundenAssetID = \"" + KundenAssetID + " \";";
      con.query(sqlB, (err, result, fields) => {
        if (err) throw err;
        //console.log(result[0].erg);
        _callback(result[0].erg);
      });
      //ende der avg wert berechnung
    }

  });
}