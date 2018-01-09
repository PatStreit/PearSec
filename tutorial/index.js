/*
*node.js webserver providing static and dynamic html files, a front-end api, database connection
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



//get alle Maßnahmen für die Gefährdung eines KundenAssets 
app.get('/getAllMassnahmenFurGefahrdung/:kaid/:gID', getAllMassnahmenFurGefahrdung); 
//get alle Gefährdungen 
app.get("/getalleGefahrdungen", getalleGefährdungen);
//get alle Kundenassets und deren Attribute
app.get('/getAllKundenAssetsAndPruffragen', getAllKundenAssetsAndPruffragen); 
//get alle Assets die zur im param bestimmten Kategorie gehören
app.get('/getAssetsfurKategorien/:param', getAssetsfurKategorie);
//get alle Assets 
app.get('/allAssets', getAllAssets);
//get das Risiko für die Gefährdung, die im param angegeben ist
app.get('/risikoFurGefahrdung/:param', risikoFurGefahrdung);
//berechne Risiko für ein Asset
app.get('/getRisikoFurEinAsset/:param',getRisikoFurEinAsset2);
//get alle Maßnahmen, die Gefährdungen für ein Kundenasset beheben
app.get('/allMassnahmenFurAsset/:param',getMaßnahmenAsset);
//get lokale Maßnahmen für ein KundenAsset
app.get('/lokalemassnahmen/:Kaid',getlokalmaßnahmen);
//get globale Maßnahmen eines Kundenasset
app.get('/globalemassnahmen/:Kaid',getglobalmaßnahmen);
//get alle Gefährdungen eines Kundenassets, die von der Maßnahme behoben werden 
app.get('/getAllGefahrdungenfurMassnahme/:KaiD/:MiD',getGefahrdungfurMaßnahme ); 
//get alle Kategorien der Assets
app.get('/allKategorien', getAlleKategorien);
//get die einflussreichsten globalen Maßnahmen
app.get('/topmassnahmen', gettopmassnahmen);
//get alle Kundenasset
app.get('/allKundenAssets', getAlleKundenAssets);
//get Gefährdungen mit höchstem Risiko
app.get('/topgefahrdungen', gettopgefahrdungen);
//get alle KundenAssets
app.get('/allKundenAssets', getAlleKundenAssets);
//get alle GefahrenF Für ein Asset
app.get('/allGefahrenFurAsset/:KundenAssetID', getGefahrenFurAsset);
//get Anzahl der grünen, gelben und roten Assets
app.get('/verhaltnisAssets',getVerhältnis);
//get Scorewert für die Sicherheit des Unternehmens
app.get('/getscore',getscore);
//get alle Gefährdungen von Kundenassets, die seit 30 Tagen in der Datenbank sind und ein Risiko größer 15 besitzen
app.get('/getErinnerung',getErinnerung);

//////////////////////////
// API-POST Pfäde
/////////////////////////
//trägt die Daten des mitgegebenen Assets in die Tabellen Kunde1Assets und Kunde1Verbindungen ein
app.post('/post', postDaten);


//////////////////////////
// API-DELETE Pfäde
/////////////////////////
//löscht das angegebene Kundenasset aus der Datenbank
app.delete('/deleteAsset/:kaid', assetloschen);

//////////////////////////
// API - UPDATE Pfäde
/////////////////////////
//setzt die angegebene Maßnahme des angegebenen Kundenassets auf durchgeführt und reduziert 
//die Eintrittswahrscheinlichkeiten der jeweiligen Gefährdungen auf 1
app.put('/massnahmeErledigt/:KAID/:MID',updateMaßnahmeErledigt);
//kehrt die Wirkung von massnahmeErledigt für die angegebene Maßnahme und Kundenasset um 
app.put('/massnahmeErledigtNegativ/:KAID/:MID',updateMaßnahmeErledigtnegativ);
//löscht den Inhalt der Tabelle Kunde1test und kopiert die Daten der Tabelle Kunde1Verbindungen in sie hinein
app.put('/resettest',resettest);
//setzt die angegebene Maßnahme des angegebenen Kundenassets in der Tabelle Kunde1test auf durchgeführt und reduziert 
//die Eintrittswahrscheinlichkeiten der jeweiligen Gefährdungen auf 1
app.put('/testabhaken/:KAID/:MID',updatetestErledigt);
//kehrt die Wirkung von testabhaken für die angegebenen Maßnahmen und Kundenasset um
app.put('/testabhakennegativ/:KAID/:MID', updatetestErledigtnegativ);
////////////////////////
//Funktionen der API
////////////////////////


//get alle Assets
function getAllAssets(req, res) {
  var sqlResult;
  con.query("SELECT * FROM Assets", function (err, result, fields) {
    if (err) throw err;
    sqlResult = result;
    res.send(result);
  });
//get alle Maßnahmen des angegebenen Kundenassets 
}
function getMaßnahmenAsset(req, res) {
  getMaßnahmeAsset2(req.params.param, (xy) => { res.send((xy)); });
}
function getMaßnahmeAsset2(KaiD, _callback) {
  var sqlB = "SELECT b.mid,b.Titel, b.Beschreibung, d.aid, d.Name FROM Kunde1Verbindungen a, Maßnahmen b, Kunde1Assets c, Assets d WHERE a.KundenAssetID =\"" + KaiD + " \" AND a.mid = b.mid AND a.KundenAssetID = c.KundenAssetID AND c.aid = d.aid;";
  con.query(sqlB, (err, result, fields) => {
    if (err) throw err;
    _callback(result);
  });
}
//get Gefährdungen des angegebenen Kundenassets, das von der angegebenen Maßnahme betroffen wird
function getGefahrdungfurMaßnahme(req, res) {
  getGefahrdungfurMaßnahme2(req.params.KaiD, req.params.MiD, (xy) => { res.send((xy)); });
}
function getGefahrdungfurMaßnahme2(KaiD, MiD, _callback) {

  var sqlB = "SELECT a.gid, a.mid, b.Name, b.Beschreibung FROM Kunde1Verbindungen a, Gefährdungen b WHERE a.mid = \"" + MiD + " \"  AND a.gid = b.gid AND a.KundenAssetID =\"" + KaiD + " \";";
  con.query(sqlB, (err, result, fields) => {
    if (err) throw err;
    _callback(result);
  });
}

//get die globalen Maßnahmen mit der höchsten Wirkung auf das Risiko
function gettopmassnahmen(req, res) {
  var sqlResult;
  con.query("SELECT a.KundenAssetID, c.Beschreibung, a.mid, SUM( Schadenshöhe * a.Eintrittswahrscheinlichkeit ) AS erg FROM Kunde1Verbindungen a, Gefährdungen b, Maßnahmen c WHERE GLOBAL =1 AND c.mid = a.mid AND a.gid = b.gid AND ( Schadenshöhe * a.Eintrittswahrscheinlichkeit ) >6 GROUP BY a.mid ORDER BY erg DESC LIMIT 0 , 10;", function (err, result, fields) {
    if (err) throw err;
    sqlResult = result;
    res.send(result);
  });
}
//get die Gefährdungen mit dem höchsten Risiko
function gettopgefahrdungen(req, res) {
  var sqlResult;
  con.query("SELECT KundenAssetID, b.Name, b.Beschreibung, a.gid, (Schadenshöhe * a.Eintrittswahrscheinlichkeit) AS erg FROM Kunde1Verbindungen a, Gefährdungen b WHERE a.gid = b.gid ORDER BY erg DESC LIMIT 0 , 5", function (err, result, fields) {
    if (err) throw err;
    sqlResult = result;
    res.send(result);
  });
}

//get das Risiko der angegebenen Gefährdung
function risikoFurGefahrdung(req, res) {
  getRisikoFurEineGefahrung(req.params.param, (xy) => { res.send((xy)); });
}
function getRisikoFurEineGefahrung(giD, _callback) {
  var sqlB = "SELECT (Eintrittswahrscheinlichkeit * Schadenshohe) as erg FROM Gefährdungen where GID= \"" + giD + " \";";
  con.query(sqlB, (err, result, fields) => {
    if (err) throw err;
    _callback(result[0]);
  });
}

//get alle Gefährdungen für ein Kundenasset mit Einschätzung des Risikos
function getalleGefährdungen(req, res) {
  getalleGefährdungen2((xy) => {  res.send(xy)});
} 
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
        
      }
        ergebnis[i] = obj;  
    
    }
    sqlResult = JSON.stringify(ergebnis);
  
        _callback(sqlResult);
  
  });
}
//berechnet das Risiko für ein Kundenasset
function getRisikoFurEinAsset2(req, res) {
  getRisikoFurEinAsset(req.params.param, (xy) => { res.send((xy)); });
}
function getRisikoFurEinAsset(KundenAssetID, _callback) {
  var sqlB = "SELECT MAX( a.eintrittswahrscheinlichkeit * schadenshöhe ) AS erg FROM Kunde1Verbindungen a, Gefährdungen b WHERE a.gid = b.gid AND kundenassetid = \"" + KundenAssetID + " \";";
  con.query(sqlB, (err, result, fields) => {
    if (err) throw err;
    
        _callback(result[0]);
      });
    }
  ;
//get alle Kundenassets und deren Prüffragen
function getAllKundenAssetsAndPruffragen(req,res){

  var sqlResult;
  con.query("SELECT DISTINCT a.KundenAssetID, a.AiD, a.Name, b.Kategorien, d.mid, d.Beschreibung, d.Prüffragen, e.Durchgeführt FROM Kunde1Assets a, Assets b, AssetsZuGefährdungen c, Maßnahmen d, Kunde1Verbindungen e, Gefährdungen f WHERE a.AID = b.AID AND a.Aid = c.AID AND a.KundenAssetID = e.KundenAssetID  AND d.MID = e.MID AND c.GID = e.GID and f.gid = e.gid;", function (err, result, fields) {
    if (err) throw err;
    sqlResult = result;
    res.send(result);
  });

}
//get alle Assets der angegebenen Kategorie
function getAssetsfurKategorie(req, res) {
  getAssetsfurKategorie2(req.params.param, (xy) => { res.send((xy)); });
}
function getAssetsfurKategorie2(Kategorien,_callback){
  
    var sqlResult;
    sqlResult =" SELECT DISTINCT a.Aid, b.Kategorien, b.Name from Kunde1Assets a, Assets b WHERE a.aid = b.aid AND b.Kategorien =  \""+Kategorien+"\";";
      con.query(sqlResult, (err, result, fields) => {
        if (err) throw err;
        _callback(result);
    });
  
  }
//liefert das Verhältnis der Gefährdungen der Kundenassets bezüglich des Risikos
function getVerhältnis(req, res){
  var sqlResult;
  var red = 0;
  var yellow = 0;
  var green = 0;
  con.query("SELECT distinct KundenAssetID, a.GID, ( a.Eintrittswahrscheinlichkeit * Schadenshöhe ) AS erg FROM Kunde1test a, Gefährdungen b WHERE a.gid = b.gid", function (err, result, fields) {
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
//berechnet den Risikoscore des gesamten Unternehmens
function getscore(req, res){
  var sqlResult;
  var summe = 0;
  var farbe;
  var grenzegesamt = 0;
  var grenze1 = 0;
  var grenze2 = 0;
  var test;

  getGrenzwerte((xy) => {grenzegesamt = xy.maxrot; grenze1 = xy.rotgelb; grenze2 = xy.gelbgrün; 
  con.query("SELECT distinct a.KundenAssetID, a.GID, ( a.Eintrittswahrscheinlichkeit * Schadenshöhe ) AS erg, c.Wichtig FROM Kunde1test a, Gefährdungen b, Assets c, Kunde1Assets d WHERE a.gid = b.gid and c.aid =d.aid and a.KundenAssetID = d.KundenAssetID", function (err, result, fields) {
    if (err) throw err;
    for(var i in result) {
      if(result[i].Wichtig ==1)
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
      summe = Math.round(summe/grenzegesamt*100);
      summe= 100- summe;
      grenze1 = Math.round(grenze1);
      grenze1 = Math.round(grenze1/grenzegesamt*100);
      grenze1= 100 - grenze1;
      grenze2 = Math.round(grenze2);
      grenze2 = Math.round(grenze2/grenzegesamt*100);
      grenze2= 100 - grenze2;
      grenzegesamt = 100;
      var obj = {"summe" : summe, "farbe" : farbe,"obergrenze" : grenzegesamt, "grenzerotgelb" : grenze1, "grenzegelbgrün" : grenze2};
      sqlResult = JSON.stringify(obj);
    res.send(sqlResult);
  });});
}

function getGrenzwerte(_callback){
    var wichtig = 0;
    var unwichtig = 0;
    var sqlResult;
    con.query("SELECT Wichtig, COUNT( Wichtig ) as anzahl FROM Kunde1Assets a, Assets b, Kunde1test c WHERE a.aid = b.aid and a.KundenAssetID = c.KundenAssetID GROUP BY Wichtig order by Wichtig asc", function (err, result, fields) {
      if (err) throw err;
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
      var maxrot = 36*wichtig*0.1 + 36*unwichtig*0.01;
      var grenzerotgelb = 14*wichtig*0.1 + 14*unwichtig*0.01;
      var grenzegelbgrün = 6*wichtig*0.1 + 6*unwichtig*0.01;
      var obj = {"maxrot" : maxrot, "rotgelb": grenzerotgelb, "gelbgrün": grenzegelbgrün}
      sqlResult = obj;
      _callback(sqlResult);
    });
  
  }

//get alle Maßnahmen für die angegebene Gefährdung des angegebenen Kundenassets
function getAllMassnahmenFurGefahrdung(req, res) {
  getAllMassnahmenFurGefahrdung2(req.params.kaid,req.params.gID, (xy) => { res.send((xy));});
}
function getAllMassnahmenFurGefahrdung2(kaid, gID, _callback) {
 var sql = "SELECT a.gid, b.mid, Beschreibung,  Titel, Durchgeführt FROM Kunde1Verbindungen a, Maßnahmen b WHERE a.KundenAssetId =\""+kaid+"\" AND a.gid = \""+gID+"\"  AND a.mid = b.mid;" ;
  con.query(sql, (err, result, fields) => {
    if (err) throw err;
    _callback(result);
  });
}
//get alle Assetkategorien
function getAlleKategorien(req, res){
  con.query("Select distinct Kategorien from Assets", function (err, result, fields) {
    if (err) console.log("Error bei den Kategorien");
    res.send(result);
  });
}
function gettest(req, res){
  
    
    res.send("test");
  
}
//get alle lokalen Maßnahmen des angegebenen Kundenassets
function getlokalmaßnahmen(req, res){
  var Kaid = req.params.Kaid;
  con.query("SELECT DISTINCT a.mid, a.kundenassetid, b.titel, b.beschreibung, b.umsetzbarkeit, sum(c.Schadenshöhe * a.Eintrittswahrscheinlichkeit) AS erg, a.durchgeführt FROM Kunde1Verbindungen a, Maßnahmen b, Gefährdungen c WHERE b.global =0 AND a.gid = c.gid AND a.mid = b.mid AND kundenassetid =\"" + Kaid + " \" group by MID;", function (err, result, fields) {
    if (err) console.log("Error bei den Maßnahmen lokal");
    res.send(result);
  });
}
//get alle globalen Maßnahmen des angegebenen Kundenassets
function getglobalmaßnahmen(req, res){
  var Kaid = req.params.Kaid;
  con.query("SELECT DISTINCT a.mid, a.kundenassetid, b.titel, b.beschreibung, b.umsetzbarkeit, sum(c.Schadenshöhe * a.Eintrittswahrscheinlichkeit) AS erg, a.durchgeführt FROM Kunde1Verbindungen a, Maßnahmen b, Gefährdungen c WHERE b.global =1 AND a.gid = c.gid AND a.mid = b.mid AND kundenassetid =\"" + Kaid + " \" group by MID;", function (err, result, fields) {
    if (err) console.log("Error bei den Maßnahmen global");
    res.send(result);
  });
}
//get alle Kundenasset mit ihren Kategorien
function getAlleKundenAssets(req, res){
  con.query("Select a.KundenAssetID, a.AiD, a.Name, b.Kategorien from Kunde1Assets a, Assets b where a.AID=b.AID;", function (err, result, fields) {
    if (err) console.log("Error bei getAlleKundenAssets");
    res.send(result);
  });
}
//get alle Gefährdungen eines Kundenasset
function getGefahrenFurAsset(req, res){
  var Kaid = req.params.KundenAssetID;
  var sql = "SELECT DISTINCT c.AID, b.GID, b.Name, b.Beschreibung, c.Name AS Asset, ( a.Eintrittswahrscheinlichkeit * Schadenshöhe) FROM Kunde1Verbindungen a, Gefährdungen b, Kunde1Assets c WHERE a.KundenAssetID =\""+Kaid+"\" AND a.GID = b.GID AND c.KundenAssetID = a.KundenAssetID ORDER BY ( a.Eintrittswahrscheinlichkeit * Schadenshöhe) DESC;" ;
  con.query(sql, function (err, result, fields) {
    if (err) console.log("Error bei den Gefahren Assets");
    res.send(result);
  });
}
//pflegt die in der empfangenen JSON-Datei erhaltenen Kundenassets in die Datenbank ein
function postDaten(req, res) {

  var data = (req.body).Paket;
  
      var id = data[0].AID;
      var name = data[0].Name;
      KundenAssetTabelleBefüllen(id, name, (xy)=> {res.send("200")});
  
};
 function KundenAssetTabelleBefüllen(aiD, name, _callback){
 var sql=("INSERT INTO Kunde1Assets (KundenAssetId, AID, Name) VALUES (NULL,\"" +aiD + "\", \"" + name + "\");" );
var sql2=("INSERT INTO Kunde1Verbindungen( KundenAssetID, GID, Eintrittswahrscheinlichkeit, MID, Durchgeführt, Zeitpunkt ) SELECT a.KundenAssetID, b.Gid, c.Eintrittswahrscheinlichkeit, d.Mid, NULL, curdate() FROM Kunde1Assets a, AssetsZuGefährdungen b, Gefährdungen c, Gefährdungen_haben d WHERE a.KundenAssetID = (SELECT MAX( KundenAssetID ) FROM Kunde1Assets ) AND a.aid = b.aid AND b.gid = c.gid AND b.agid = d.agid;");
var sql4=("UPDATE Kunde1Verbindungen z, (SELECT a.mid, GLOBAL , durchgeführt FROM Kunde1Verbindungen a, Maßnahmen b WHERE a.mid = b.mid AND GLOBAL =1 AND durchgeführt =1) AS cnt SET z.durchgeführt = cnt.durchgeführt WHERE cnt.mid = z.mid;");
var sql5=("UPDATE Kunde1Verbindungen AS t INNER JOIN ( SELECT KundenAssetID, Gid, Durchgeführt FROM Kunde1Verbindungen )t1 ON t.KundenAssetID = t1.KundenAssetID AND t.Gid = t1.Gid AND t1.durchgeführt =1 SET Eintrittswahrscheinlichkeit =1;");
var sql3 = sql+sql2+sql4+sql5;
counterErste++;
 con.query(sql3, (err, result, fields) => {
  if (err) console.log("Sprung2");//throw err;
_callback("200");
  
});

}
// löscht das angegebene Kundenasset aus der Datenbank
function assetloschen(req, res) {
  assetloschen2(req.params.kaid, (xy) => { res.send((xy)); });
}
function assetloschen2(kaid, _callback) {
  var sql = "delete from Kunde1Assets where KundenAssetID=\"" + kaid + "\"; delete from Kunde1Verbindungen where KundenAssetID=\"" + kaid + "\";" ;
  con.query(sql, (err, result, fields) => {
    if (err) throw err;
    _callback(200);
  });
}


//kennzeichnet die angegebene Maßnahme des angegebenen Kundenasset in der Tabelle Kunde1Verbindungen als
//durchgeführt und senkt die Eintrittswahrscheinlichkeiten der betroffenen Gefährdungen auf 1
function updateMaßnahmeErledigt(req, res) {
 
 istglobal(req.params.MID, (yx) => {
  
   MaßnahmeAbhaken(req.params.KAID, req.params.MID, yx, (xy) => { res.send(("gesendet")); });
  console.log("!!")})
 
};
function MaßnahmeAbhaken(KAID, MID, ding, _callback){
  if (ding == 0){
  var sql=("begin; update Kunde1Verbindungen set Durchgeführt = 1 where KundenAssetId = \"" +KAID + "\" and MID =  \"" + MID + "\";" );
 var sql2=("UPDATE Kunde1Verbindungen SET Eintrittswahrscheinlichkeit =1 WHERE KundenAssetId = \"" +KAID + "\" AND GID IN ( SELECT d.GID FROM Gefährdungen_haben a, AssetsZuGefährdungen c, Kunde1Assets b, Gefährdungen d WHERE b.KundenAssetID =\"" +KAID + "\" AND a.MID = \"" + MID + "\" AND b.AID = c.AID AND c.agid = a.agid and d.gid = c.gid); commit;");
  var sql3=sql+sql2;}
  
  else if (ding == 1){
    var sql=("Begin; update Kunde1Verbindungen set Durchgeführt = 1 where MID =  \"" + MID + "\";" );
   var sql2=("UPDATE Kunde1Verbindungen AS t INNER JOIN ( SELECT KundenAssetID, Gid, Durchgeführt FROM Kunde1Verbindungen )t1 ON t.KundenAssetID = t1.KundenAssetID AND t.Gid = t1.Gid AND t1.durchgeführt =1 SET Eintrittswahrscheinlichkeit =1; commit;");
    var sql3=sql+sql2;}

 con.query(sql3, (err, result, fields) => {
   if (err) console.log("Sprung2");//throw err;
 });
 _callback("abhaken");
}
//kehrt die Wirkung von updateMaßnahmeErledigt für die angegebene Maßnahme des angegebenen Kundenassets um
function updateMaßnahmeErledigtnegativ(req, res) {
 
  
  istglobal(req.params.MID, (yx) => { 
  MaßnahmeAbhakennegativ(req.params.KAID, req.params.MID, yx,(xy) => { res.send(("gesendet")); });
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
  
 });
 _callback("abhaken");
}

function istglobal(MID, _callback){
  var ding;
  var sql = "select mid, global from Maßnahmen where mid =\"" +MID + "\";"
 con.query(sql, (err, result, fields) => {
   if (err) console.log("Sprung2");
   ding = result[0].global;
   _callback(ding);
 }) 
}
//setzt die Tabelle Kunde1test auf den Stand der Tabelle Kunde1Verbindungen zurück
function resettest(req, res){
  var sql = "DELETE FROM Kunde1test; INSERT INTO Kunde1test SELECT *  FROM Kunde1Verbindungen;" ;
  con.query(sql, function (err, result, fields) {
    if (err) console.log("Error bei den Gefahren Assets");
    res.send(result);
  });
}
//kennzeichnet die angegebene Maßnahme des angegebenen Kundenasset in der Tabelle Kunde1test als
//durchgeführt und senkt die Eintrittswahrscheinlichkeiten der betroffenen Gefährdungen auf 1
function updatetestErledigt(req, res) { 
 istglobal(req.params.MID, (yx) => {
  
   testAbhaken(req.params.KAID, req.params.MID, yx, (xy) => { res.send(("gesendet")); });
  console.log("!!")})
 
};

function testAbhaken(KAID, MID, ding, _callback){
  if (ding == 0){
  var sql=("begin; update Kunde1test set Durchgeführt = 1 where KundenAssetId = \"" +KAID + "\" and MID =  \"" + MID + "\";" );
 var sql2=("UPDATE Kunde1test SET Eintrittswahrscheinlichkeit =1 WHERE KundenAssetId = \"" +KAID + "\" AND GID IN ( SELECT d.GID FROM Gefährdungen_haben a, AssetsZuGefährdungen c, Kunde1Assets b, Gefährdungen d WHERE b.KundenAssetID =\"" +KAID + "\" AND a.MID = \"" + MID + "\" AND b.AID = c.AID AND c.agid = a.agid and d.gid = c.gid); commit;");
  var sql3=sql+sql2;}
  
  else if (ding == 1){
    var sql=("Begin; update Kunde1test set Durchgeführt = 1 where MID =  \"" + MID + "\";" );
   var sql2=("UPDATE Kunde1test AS t INNER JOIN ( SELECT KundenAssetID, Gid, Durchgeführt FROM Kunde1test )t1 ON t.KundenAssetID = t1.KundenAssetID AND t.Gid = t1.Gid AND t1.durchgeführt =1 SET Eintrittswahrscheinlichkeit =1; commit;");
    var sql3=sql+sql2;}

 con.query(sql3, (err, result, fields) => {
   if (err) console.log("Sprung2");//throw err;
 
 });
 _callback("abhaken");
}
//kehrt die Wirkung von updatetestErledigt für das angebene Kundenasset und Maßnahme um
function updatetestErledigtnegativ(req, res) {
  
   
   istglobal(req.params.MID, (yx) => { 
   testAbhakennegativ(req.params.KAID, req.params.MID, yx,(xy) => { res.send(("gesendet")); });
   console.log("!!")})
 };
 
 
 function testAbhakennegativ(KAID, MID, ding, _callback){
   if(ding ==0){
   var sql=("begin; update Kunde1test set Durchgeführt = 0 where KundenAssetId = \"" +KAID + "\" and MID =  \"" + MID + "\";" );
  var sql2=("UPDATE Kunde1test e, Gefährdungen f SET e.Eintrittswahrscheinlichkeit = f.Eintrittswahrscheinlichkeit WHERE f.gid = e.gid AND KundenAssetId =\"" +KAID + "\" AND e.GID IN (SELECT d.GID FROM Gefährdungen_haben a, AssetsZuGefährdungen c, Kunde1Assets b, Gefährdungen d WHERE b.KundenAssetID =\"" +KAID + "\" AND a.MID = \"" +MID + "\"  AND b.AID = c.AID AND c.agid = a.agid AND d.gid = c.gid); commit;");
   var sql3=sql+sql2;}
   else if(ding ==1){
     var sql=("begin; update Kunde1test set Durchgeführt = 0 where MID =  \"" + MID + "\";" );
     var sql2=("UPDATE Kunde1test a, Gefährdungen b SET a.Eintrittswahrscheinlichkeit = b.Eintrittswahrscheinlichkeit WHERE a.gid = b.gid AND b.gid IN ( SELECT c.gid FROM AssetsZuGefährdungen c, Gefährdungen_haben d WHERE mid = \"" +MID + "\"  AND c.agid = d.agid); commit;");
      var sql3=sql+sql2;
 
   };
  con.query(sql3, (err, result, fields) => {
    if (err) console.log("Sprung2");
  });
  _callback("abhaken");
 }
 


//sendet Assetname, Gid, Gefährdungsbezeichnung und Zeitpunkt von Kundenassets, die seit mehr als 30 Tagen in der 
//Datenbank sind für Gefährdungen, deren Risiken größer 15 sind.
function getErinnerung(req, res) {
  var sqlResult;
  con.query("SELECT a.Name as Bezeichnung, c.gid, c.Name, b.Zeitpunkt FROM Kunde1Assets a, Kunde1Verbindungen b, Gefährdungen c WHERE ( CURDATE( ) - b.Zeitpunkt ) >=100 AND ( c.Schadenshöhe * b.Eintrittswahrscheinlichkeit) >=15 AND a.KundenAssetID = b.KundenAssetID AND b.gid = c.gid", function (err, result, fields) {
    if (err) throw err;
    sqlResult = result;
    res.send(result);
  });
}