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

/*
//Alle Maßnahmen je Asset schicken
app.get('/getAllMassnahmenFurAsset/:param', getAllMaßnahmenFurAsset); 
*/
//Alle Maßnahmen je Gefährdung schicken
app.get('/getAllMassnahmenFurGefahrdung/:kaid/:gID', getAllMassnahmenFurGefahrdung); 
app.get("/getalleGefahrdungen", getalleGefährdungen);
//Alle Kundenassets schicken
app.get('/getAllKundenAssetsAndPruffragen', getAllKundenAssetsAndPruffragen); 
//get alle Assets die zur im param bestimmten Kategorie gehören
app.get('/getAssetsfurKategorien/:param', getAssetsfurKategorie);
//get alle Assets 
app.get('/allAssets', getAllAssets);
//get das Risiko für die Gefährdung, die im param angegeben ist
app.get('/risikoFurGefahrdung/:param', risikoFurGefahrdung);
//veraltete
app.get('/gesamtRisiko', getGesamtRisiko);
//berechne Risiko für ein Asset
app.get('/getRisikoFurEinAsset/:param',getRisikoFurEinAsset2);
//berechne Risiko für ein Asset
app.get('/allMassnahmenFurAsset/:param',getMaßnahmenAsset);
//Alle Maßnahmen je Gefährdung schicken
app.get('/getAllGefahrdungenfurMassnahme/:KaiD/:MiD',getGefahrdungfurMaßnahme ); 
//alle Kategorien
app.get('/allKategorien', getAlleKategorien);
//wichtigste Maßnahmen
app.get('/topmassnahmen', gettopmassnahmen);
//größte Gefahren
app.get('/topgefahrdungen', gettopgefahrdungen);
//alle KundenAssets
app.get('/allKundenAssets', getAlleKundenAssets);
//alle GefahrenF Für ein Asset
app.get('/allGefahrenFurAsset/:KundenAssetID', getGefahrenFurAsset);
//Anzahl der grünen, gelben und roten Assets
app.get('/verhaltnisAssets',getVerhältnis);

app.get('/getscore',getscore);

app.get('/getErinnerung',getErinnerung);
app.get("/gettest", gettest);
//////////////////////////
// API-POST Pfäde
/////////////////////////
app.post('/post', postDaten);
//post einer json datei mit vielen PID´s 
app.delete('/deleteAsset/:kaid', assetloschen);

//////////////////////////
// API - UPDATE Pfäde
/////////////////////////
app.put('/massnahmeErledigt/:KAID/:MID',updateMaßnahmeErledigt);
app.put('/massnahmeErledigtNegativ/:KAID/:MID',updateMaßnahmeErledigtnegativ);
////////////////////////
//Funktionen der get API
////////////////////////


//senden alle Assets die in der normalen DB hinterlegt sind als Json Response
function getAllAssets(req, res) {
  var sqlResult;
  con.query("SELECT * FROM Assets", function (err, result, fields) {
    if (err) throw err;
    sqlResult = result;
    res.send(result);
  });
  
}
function getMaßnahmenAsset(req, res) {
  getMaßnahmeAsset2(req.params.param, (xy) => { res.send((xy)); });
}
//wird von der Funktion risikoFurGefahrdung aufgerufen
function getMaßnahmeAsset2(KaiD, _callback) {
  var sqlB = "SELECT b.mid,b.Titel, b.Beschreibung, d.aid, d.Name FROM Kunde1Verbindungen a, Maßnahmen b, Kunde1Assets c, Assets d WHERE a.KundenAssetID =\"" + KaiD + " \" AND a.mid = b.mid AND a.KundenAssetID = c.KundenAssetID AND c.aid = d.aid;";
  con.query(sqlB, (err, result, fields) => {
    if (err) throw err;
    _callback(result);
  });
}

function getGefahrdungfurMaßnahme(req, res) {
  getGefahrdungfurMaßnahme2(req.params.KaiD, req.params.MiD, (xy) => { res.send((xy)); });
}
//wird von der Funktion risikoFurGefahrdung aufgerufen
function getGefahrdungfurMaßnahme2(KaiD, MiD, _callback) {
  console.log(KaiD+ "ist Kaid");
  console.log(MiD+ "ist Mid");
  var sqlB = "SELECT a.gid, a.mid, b.Name, b.Beschreibung FROM Kunde1Verbindungen a, Gefährdungen b WHERE a.mid = \"" + MiD + " \"  AND a.gid = b.gid AND a.KundenAssetID =\"" + KaiD + " \";";
  con.query(sqlB, (err, result, fields) => {
    if (err) throw err;
    _callback(result);
  });
}


function gettopmassnahmen(req, res) {
  var sqlResult;
  con.query("SELECT a.KundenAssetID, c.Beschreibung, a.mid, SUM( Schadenshöhe * a.Eintrittswahrscheinlichkeit ) AS erg FROM Kunde1Verbindungen a, Gefährdungen b, Maßnahmen c WHERE GLOBAL =1 AND c.mid = a.mid AND a.gid = b.gid AND ( Schadenshöhe * a.Eintrittswahrscheinlichkeit ) >6 GROUP BY a.mid ORDER BY erg DESC LIMIT 0 , 10;", function (err, result, fields) {
    if (err) throw err;
    sqlResult = result;
    res.send(result);
  });
}

function gettopgefahrdungen(req, res) {
  var sqlResult;
  con.query("SELECT KundenAssetID, b.Name, b.Beschreibung, a.gid, (Schadenshöhe * a.Eintrittswahrscheinlichkeit) AS erg FROM Kunde1Verbindungen a, Gefährdungen b WHERE a.gid = b.gid ORDER BY erg DESC LIMIT 0 , 5", function (err, result, fields) {
    if (err) throw err;
    sqlResult = result;
    res.send(result);
  });
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
        counter++;
        gesamtRisiko = gesamtRisiko + xy
      });
    });
    _callback((gesamtRisiko / counter));
  });
}

function getalleGefährdungen(req, res) {
  getalleGefährdungen2((xy) => {  res.send(xy)});
}
//wird von der Methode getGEsamtRisiko aufgerufen und 
function getalleGefährdungen2(_callback) {
  var sqlB = "SELECT distinct a.gid, b.name, b.Beschreibung, a.KundenAssetID, c.Name as NameA, (a.Eintrittswahrscheinlichkeit * b.Schadenshöhe) AS erg FROM Kunde1Verbindungen a, Gefährdungen b , Kunde1Assets c WHERE a.KundenAssetID = c.KundenAssetID and a.gid = b.gid ORDER BY  `a`.`gid` ASC;  ";
  con.query(sqlB, (err, result, fields) => {
    var ergebnis =[];
    for(var i in result) {
    var obj = {"gid": "", "name" : "", "beschreibung": "", "kaid": "", "NameAsset" : "", "erg": "", "farbe": ""};
    
      obj.gid = result[i].gid;
      obj.name = result[i].name;
      obj.beschreibung = result[i].Beschreibung;
      obj.kaid = result[i].KundenAssetID;
      obj.NameAsset = result[i].NameA;
      obj.erg = result[i].erg;
      if(result[i].erg > 14){
        obj.farbe = "rot";
      }else if(result[i].erg > 5){
        obj.farbe = "gelb";
      }else{
        obj.farbe = "grün";
      };  
      ergebnis[i] = obj;  
    
    }
    sqlResult = JSON.stringify(ergebnis);
        _callback(sqlResult);
  
  });
}
// ruft eine Funktion auf die das Risiko für eine Asset zurück gibt. Das Ergebnis wird direkt gesendet
function getRisikoFurEinAsset2(req, res) {
  getRisikoFurEinAsset(req.params.param, (xy) => { res.send((xy)); });
}
// berechnet das Risiko für ein Asset
function getRisikoFurEinAsset(KundenAssetID, _callback) {
  //größte Gefährdung für ein Asset suchen:
  var sqlB = "SELECT MAX(c.Eintrittswahrscheinlichkeit*a.Schadenshöhe) as erg from Gefährdungen a, Assets b, Kunde1Verbindungen c, Kunde1Assets d where a.GID = c.GID and b.AID = d.AID  and d.KundenAssetID = \"" + KundenAssetID + " \";";
  con.query(sqlB, (err, result, fields) => {
    if (err) throw err;
    
        _callback(result[0]);
      });
    }
  ;

function getAllKundenAssetsAndPruffragen(req,res){
//senden alle Assets die in der normalen DB hinterlegt sind als Json Response

  var sqlResult;
  //var sqlBef ="SELECT a.KundenAssetID, a.AiD, a.Name, b.Kategorien FROM Kunde1Assets a, Assets b where a.AID = b.AID";
  con.query("SELECT DISTINCT a.KundenAssetID, a.AiD, a.Name, b.Kategorien, d.mid, d.Beschreibung, d.Prüffragen, e.Durchgeführt FROM Kunde1Assets a, Assets b, AssetsZuGefährdungen c, Maßnahmen d, Kunde1Verbindungen e, Gefährdungen f WHERE a.AID = b.AID AND a.Aid = c.AID AND a.KundenAssetID = e.KundenAssetID  AND d.MID = e.MID AND c.GID = e.GID and f.gid = e.gid and (e.Eintrittswahrscheinlichkeit*f.Schadenshöhe)>15;", function (err, result, fields) {
    if (err) throw err;
    sqlResult = result;
    res.send(result);
  });

}
function getAssetsfurKategorie(req, res) {
  console.log("pouha");
  getAssetsfurKategorie2(req.params.param, (xy) => { res.send((xy)); });
}
function getAssetsfurKategorie2(Kategorien,_callback){
  //senden alle Assets die in der normalen DB hinterlegt sind als Json Response
  
    var sqlResult;
    //var sqlBef ="SELECT a.KundenAssetID, a.AiD, a.Name, b.Kategorien FROM Kunde1Assets a, Assets b where a.AID = b.AID";
    sqlResult =" SELECT DISTINCT a.Aid, b.Kategorien, b.Name from Kunde1Assets a, Assets b WHERE a.aid = b.aid AND b.Kategorien =  \""+Kategorien+"\";";
      con.query(sqlResult, (err, result, fields) => {
        if (err) throw err;
        _callback(result);
    });
  
  }
function getVerhältnis(req, res){
  var sqlResult;
  var red = 0;
  var yellow = 0;
  var green = 0;
  con.query("SELECT distinct KundenAssetID, a.GID, ( a.Eintrittswahrscheinlichkeit * Schadenshöhe ) AS erg FROM Kunde1Verbindungen a, Gefährdungen b WHERE a.gid = b.gid", function (err, result, fields) {
    if (err) throw err;
    for(var i in result) {
      
             var KAID = result[i].KundenAssetID;
             var erg = result[i].erg;
            if (erg >= 15) red++;
            else if(erg >=8) yellow++;
            else green++; 
        }
        var obj = {"rot" : red, "gelb" : yellow, "grün" : green, "gesamt" : red+yellow+green};
        sqlResult = JSON.stringify(obj);

    res.send(sqlResult);
  });
}

function getscore(req, res){
  var sqlResult;
  var summe = 0;
  var farbe;
  var grenzegesamt = 0;
  var grenze1 = 0;
  var grenze2 = 0;
  var test;

  getGrenzwerte((xy) => {grenzegesamt = xy.maxrot; grenze1 = xy.rotgelb; grenze2 = xy.gelbgrün; 
  console.log("teste grenze1"+grenze1);
  con.query("SELECT distinct a.KundenAssetID, a.GID, ( a.Eintrittswahrscheinlichkeit * Schadenshöhe ) AS erg, c.Wichtig FROM Kunde1Verbindungen a, Gefährdungen b, Assets c, Kunde1Assets d WHERE a.gid = b.gid and c.aid =d.aid and a.KundenAssetID = d.KundenAssetID", function (err, result, fields) {
    if (err) throw err;
    for(var i in result) {
      if(result[i].wichtig =1)
      summe = summe + (result[i].erg*0.1); 
      else    summe = summe + (result[i].erg*0.01); 
    }
        
    if (summe >= grenze1)
      farbe = "red";
      else if(summe >=grenze2)
      farbe = "yellow";
      else farbe = "green";
      summe = Math.round(summe);
      grenzegesamt = Math.round(grenzegesamt);
      grenze1 = Math.round(grenze1);
      grenze2 = Math.round(grenze2);
      var obj = {"summe" : summe, "farbe" : farbe,"obergrenze" : grenzegesamt, "grenzerotgelb" : grenze1, "grenzegelbgrün" : grenze2};
      sqlResult = JSON.stringify(obj);
    res.send(sqlResult);
  });});
}

function getGrenzwerte(_callback){
  //senden alle Assets die in der normalen DB hinterlegt sind als Json Response
    var wichtig = 0;
    var unwichtig = 0;
    var sqlResult;
    //var sqlBef ="SELECT a.KundenAssetID, a.AiD, a.Name, b.Kategorien FROM Kunde1Assets a, Assets b where a.AID = b.AID";
    console.log("test des callback");
    con.query("SELECT Wichtig, COUNT( Wichtig ) as anzahl FROM Kunde1Assets a, Assets b, Kunde1Verbindungen c WHERE a.aid = b.aid and a.KundenAssetID = c.KundenAssetID GROUP BY Wichtig order by Wichtig asc", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
      
      console.log(Object.keys(result).length);
      if (Object.keys(result).length == 0){
        unwichtig = 0;
        wichtig = 0;
      }else if(Object.keys(result).length == 1){
        if(result[0].Wichtig = 0){
          unwichtig = result[0].anzahl;
          wichtig = 0;
        }else{
          wichtig = result[0].anzahl;
          unwichtig = 0;
        }
      }else{
        unwichtig = result[0].anzahl;
        wichtig = result[1].anzahl;
      }
     
      // if (typeof result.anzahl == number){
     //   unwichtig = result;
     //   wichtig = 0;
     // }else {
     //   unwichtig = result[0].anzahl;
     //   wichtig = result[1].anzahl;}
     

      var maxrot = 36*wichtig*0.1 + 36*unwichtig*0.01;
      var grenzerotgelb = 14*wichtig*0.1 + 14*unwichtig*0.01;
      var grenzegelbgrün = 6*wichtig*0.1 + 6*unwichtig*0.01;
      var obj = {"maxrot" : maxrot, "rotgelb": grenzerotgelb, "gelbgrün": grenzegelbgrün}
      sqlResult = obj;
      _callback(sqlResult);
    });
  
  }
  /*
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
}*/
//neu
// ruft eine Funktion auf die das Risiko für eine Gefährdung zurück gibt. Das Ergebnis wird direkt gesendet
function getAllMassnahmenFurGefahrdung(req, res) {
  console.log("pouh");
  getAllMassnahmenFurGefahrdung2(req.params.kaid,req.params.gID, (xy) => { res.send((xy));});
}
//wird von der Funktion risikoFurGefahrdung aufgerufen
function getAllMassnahmenFurGefahrdung2(kaid, gID, _callback) {
 var sql = "SELECT a.gid, b.mid, Beschreibung, Durchgeführt FROM Kunde1Verbindungen a, Maßnahmen b WHERE a.KundenAssetId =\""+kaid+"\" AND a.gid = \""+gID+"\"  AND a.mid = b.mid;" ;
  con.query(sql, (err, result, fields) => {
    if (err) throw err;
    _callback(result);
  });
}

function getAlleKategorien(req, res){
  con.query("Select distinct Kategorien from Assets", function (err, result, fields) {
    if (err) console.log("Error bei den Kategorien");
    res.send(result);
  });
}
function gettest(req, res){
  
    
    res.send("test");
  
}



function getAlleKundenAssets(req, res){
  con.query("Select a.KundenAssetID, a.AiD, a.Name, b.Kategorien from Kunde1Assets a, Assets b where a.AID=b.AID;", function (err, result, fields) {
    if (err) console.log("Error bei getAlleKundenAssets");
    res.send(result);
  });
}
function getGefahrenFurAsset(req, res){
  var Kaid = req.params.KundenAssetID;
  var sql = "SELECT DISTINCT c.AID, b.GID, b.Name, c.Name AS Asset  FROM Kunde1Verbindungen a, Gefährdungen b, Kunde1Assets c  WHERE a.KundenAssetID =  \"" + Kaid + " \"AND a.GID = b.GID  AND c.KundenAssetID = a.KundenAssetID";
  con.query(sql, function (err, result, fields) {
    if (err) console.log("Error bei den Kategorien");
    res.send(result);
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
//Funktionen der get API Ramazan///
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
      // KundenAssetTabelleBefüllen(id, name);
       KundenAssetTabelleBefüllen(id, name);
  }
};
 function KundenAssetTabelleBefüllen(aiD, name, _callback){
 var sql=("INSERT INTO Kunde1Assets (KundenAssetId, AID, Name) VALUES (NULL,\"" +aiD + "\", \"" + name + "\");" );
var sql2=("INSERT INTO Kunde1Verbindungen( KundenAssetID, GID, Eintrittswahrscheinlichkeit, MID, Durchgeführt, Zeitpunkt ) SELECT a.KundenAssetID, b.Gid, c.Eintrittswahrscheinlichkeit, d.Mid, NULL, curdate() FROM Kunde1Assets a, AssetsZuGefährdungen b, Gefährdungen c, Gefährdungen_haben d WHERE a.KundenAssetID = (SELECT MAX( KundenAssetID ) FROM Kunde1Assets ) AND a.aid = b.aid AND b.gid = c.gid AND b.agid = d.agid;");
var sql4=("UPDATE Kunde1Verbindungen z, (SELECT a.mid, GLOBAL , durchgeführt FROM Kunde1Verbindungen a, Maßnahmen b WHERE a.mid = b.mid AND GLOBAL =1 AND durchgeführt =1) AS cnt SET z.durchgeführt = cnt.durchgeführt WHERE cnt.mid = z.mid;");
var sql5=("UPDATE Kunde1Verbindungen a SET Eintrittswahrscheinlichkeit =1 WHERE gid IN (SELECT b.gid FROM AssetsZuGefährdungen b, Gefährdungen_haben c, Maßnahmen d, Kunde1Assets e WHERE e.aid = b.aid AND b.agid = c.agid AND c.mid = d.mid AND d.global =1 AND a.KundenAssetID = e.KundenAssetID AND a.durchgeführt =1);");
var sql3 = sql+sql2+sql4+sql5;
counterErste++;
console.log("Erste: " + counterErste);
 con.query(sql3, (err, result, fields) => {
  if (err) console.log("Sprung2");//throw err;
 // NeueKundenAssetIDs=result;
 //  KundenAssetTabelleBefüllenHilfsMethode(sql2,(ab)=>( _callback));

  
});

}
// neu
function assetloschen(req, res) {
  console.log("pouh");
  assetloschen2(req.params.kaid, (xy) => { res.send((xy)); });
}
//wird von der Funktion risikoFurGefahrdung aufgerufen
function assetloschen2(kaid, _callback) {
  var sql = "delete from Kunde1Assets where KundenAssetID=\"" + kaid + "\"; delete from Kunde1Verbindungen where KundenAssetID=\"" + kaid + "\";" ;
  con.query(sql, (err, result, fields) => {
    if (err) throw err;
    _callback(200);
  });
}



function updateMaßnahmeErledigt(req, res) {
  /*
  * wir bekommen hier eine JSON mit vielen unter Dateien zum einfügen in eine Tabelle
  * das Einfügen ist in eienr adneren FUnktion realisiert und wir iterieren hier nur
  */
   
 istglobal(req.params.MID, (yx) => {
  
   MaßnahmeAbhaken(req.params.KAID, req.params.MID, yx, (xy) => { res.send((xy)); });
  console.log("!!")})
 
};

function MaßnahmeAbhaken(KAID, MID, ding, _callback){
  console.log("ist inder methode maßnahmeabhaken")
  console.log(ding);
  if (ding == 0){
    console.log("kein globales");
  var sql=("begin; update Kunde1Verbindungen set Durchgeführt = 1 where KundenAssetId = \"" +KAID + "\" and MID =  \"" + MID + "\";" );
 var sql2=("UPDATE Kunde1Verbindungen SET Eintrittswahrscheinlichkeit =1 WHERE KundenAssetId = \"" +KAID + "\" AND GID IN ( SELECT d.GID FROM Gefährdungen_haben a, AssetsZuGefährdungen c, Kunde1Assets b, Gefährdungen d WHERE b.KundenAssetID =\"" +KAID + "\" AND a.MID = \"" + MID + "\" AND b.AID = c.AID AND c.agid = a.agid and d.gid = c.gid); commit;");
  var sql3=sql+sql2;}
  
  else if (ding == 1){
    console.log("ist globales");
    var sql=("Begin; update Kunde1Verbindungen set Durchgeführt = 1 where MID =  \"" + MID + "\";" );
   var sql2=("UPDATE Kunde1Verbindungen SET Eintrittswahrscheinlichkeit =1 WHERE GID IN(SELECT c.gid FROM AssetsZuGefährdungen c, Gefährdungen_haben d WHERE mid = \"" +MID + "\"  AND c.agid = d.agid); commit;");
    var sql3=sql+sql2;}

 con.query(sql3, (err, result, fields) => {
   if (err) console.log("Sprung2");//throw err;
  // NeueKundenAssetIDs=result;
  //  KundenAssetTabelleBefüllenHilfsMethode(sql2,(ab)=>( _callback));
 
   
 });
 
}

function updateMaßnahmeErledigtnegativ(req, res) {
 
  
  istglobal(req.params.MID, (yx) => { 
  MaßnahmeAbhakennegativ(req.params.KAID, req.params.MID, yx,(xy) => { res.send((xy)); });
  console.log("!!")})
};

function MaßnahmeAbhakennegativ(KAID, MID, ding, _callback){
  if(ding ==0){
  var sql=("begin; update Kunde1Verbindungen set Durchgeführt = 0 where KundenAssetId = \"" +KAID + "\" and MID =  \"" + MID + "\";" );
 var sql2=("UPDATE Kunde1Verbindungen e, Gefährdungen f SET e.Eintrittswahrscheinlichkeit = f.Eintrittswahrscheinlichkeit WHERE f.gid = e.gid AND KundenAssetId =\"" +KAID + "\" AND e.GID IN (SELECT d.GID FROM Gefährdungen_haben a, AssetsZuGefährdungen c, Kunde1Assets b, Gefährdungen d WHERE b.KundenAssetID =\"" +KAID + "\" AND a.MID = \"" +MID + "\"  AND b.AID = c.AID AND c.agid = a.agid AND d.gid = c.gid); commit;");
  var sql3=sql+sql2;}
  else if(ding ==1){
    var sql=("begin; update Kunde1Verbindungen set Durchgeführt = 0 where MID =  \"" + MID + "\";" );
    var sql2=("UPDATE Kunde1Verbindungen a, Gefährdungen b SET a.Eintrittswahrscheinlichkeit = b.Eintrittswahrscheinlichkeit WHERE a.gid = b.gid AND b.gid IN ( SELECT c.gid FROM AssetsZuGefährdungen c, Gefährdungen_haben d WHERE mid = \"" +MID + "\"  AND c.agid = d.agid); commit;");
     var sql3=sql+sql2;

  };
 con.query(sql3, (err, result, fields) => {
   if (err) console.log("Sprung2");//throw err;
  // NeueKundenAssetIDs=result;
  //  KundenAssetTabelleBefüllenHilfsMethode(sql2,(ab)=>( _callback));
 
   
 });
 
}

function istglobal(MID, _callback){
  var ding;
  var sql = "select mid, global from Maßnahmen where mid =\"" +MID + "\";"
 con.query(sql, (err, result, fields) => {
   if (err) console.log("Sprung2");
   ding = result[0].global;
   console.log(typeof ding)
   _callback(ding);
 }) 
}


function getErinnerung(req, res) {
  console.log("erinnern");
  var sqlResult;
  con.query("SELECT a.Name as Bezeichnung, c.gid, c.Name, b.Zeitpunkt FROM Kunde1Assets a, Kunde1Verbindungen b, Gefährdungen c WHERE ( CURDATE( ) - b.Zeitpunkt ) >=100 AND ( c.Schadenshöhe * b.Eintrittswahrscheinlichkeit) >=15 AND a.KundenAssetID = b.KundenAssetID AND b.gid = c.gid", function (err, result, fields) {
    if (err) throw err;
    sqlResult = result;
    res.send(result);
  });
}