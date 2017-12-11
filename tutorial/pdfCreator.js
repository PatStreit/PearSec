var pdf = require('pdfkit');
var fs = require('fs');
var lowestX = 30;
var minimalx = 50;
var lowestY = 20;
var myDoc = new pdf;

// SQL Connections
var mysql = require('mysql');
var con = mysql.createConnection({
  host: "141.19.141.151",
  user: "t_schaefer",
  password: "1610337",
  database: "pearsec",
  multipleStatements: true
});


myDoc.pipe(fs.createWriteStream('node.pdf'));

myDoc.image('public/img/PEARSEC_LOGO.png', lowestX, lowestY, {
  scale: 0.055
});
lowestX = lowestX + 200;
myDoc.font('Helvetica-Bold')
  .fontSize(26)
  .text('Risikobericht', lowestX, lowestY);


lowestX = minimalx;
lowestY = lowestY + 150;

myDoc.font('Helvetica-Bold')
  .fontSize(14)
  .text('Risikoscore :', lowestX, lowestY);

lowestY = lowestY + 20;

////////////////////////


var summe = 0;
var farbe;
var grenzegesamt = 0;
var grenze1 = 0;
var grenze2 = 0;

getGrenzwerte((xy) => {
  grenzegesamt = xy.maxrot; grenze1 = xy.rotgelb; grenze2 = xy.gelbgrün;
  con.query("SELECT distinct a.KundenAssetID, a.GID, ( a.Eintrittswahrscheinlichkeit * Schadenshöhe ) AS erg, c.Wichtig FROM Kunde1Verbindungen a, Gefährdungen b, Assets c, Kunde1Assets d WHERE a.gid = b.gid and c.aid =d.aid and a.KundenAssetID = d.KundenAssetID", function (err, result, fields) {
    if (err) throw err;
    for (var i in result) {
      if (result[i].wichtig = 1)
        summe = summe + (result[i].erg * 0.1);
      else summe = summe + (result[i].erg * 0.01);
    }

    if (summe >= grenze1)
      farbe = "red";
    else if (summe >= grenze2)
      farbe = "yellow";
    else farbe = "green";
    summe = Math.round(summe);
    grenzegesamt = Math.round(grenzegesamt);
    grenze1 = Math.round(grenze1);
    grenze2 = Math.round(grenze2);

    console.log(grenze1);
    console.log(grenze2);
    console.log(summe);

    keepGoing();
  });
});

/////////////////////  
function keepGoing() {
  console.log("blablabla");
  myDoc.font('Times-Roman')
    .fontSize(12)
    .text(' ' + summe + '/' + grenzegesamt + ' ', lowestX, lowestY);

  lowestY = lowestY + 50;

  printAllAssetsAndThreats(lowestX, lowestY);
}

function printAllAssetsAndThreats(startX, startY) {
  try {

    con.query("SELECT * FROM Kunde1Assets;", function (err, result, fields) {
      for (var i in result) {
        console.log("gotcha");
        myDoc.font('Helvetica-Bold')
        .fontSize(20)
        .text('str', startX, startY);

        var xxx = result[i].KundenAssetID;

        startY = startY + 50;
        //jetzt jeweils alle gefährdungen:
        var sql = "SELECT DISTINCT c.AID, b.GID, b.Name, c.Name AS Asset  FROM Kunde1Verbindungen a, Gefährdungen b, Kunde1Assets c  WHERE a.KundenAssetID =  \"" + xxx + " \"AND a.GID = b.GID  AND c.KundenAssetID = a.KundenAssetID";
        con.query(sql, function (err, result2, fields) {
          for (var i2 in result2) {

          }
        });
        ///////////////////



      }
    });
  } catch (e) {
  } finally {
    console.log("hurensohn");
    end();
  }
}
function end() {
  myDoc.end();
}

function writeStrToCoordinates(str, x, y, callback) {

  myDoc.font('Helvetica-Bold')
    .fontSize(20)
    .text(str, y, y);

  callback();
}

/*
myDoc.font('Helvetica-Bold')
    .fontSize(20)
    .text('Risikobericht', lowestX, lowesty);

myDoc.circle(70, 120, 5)
    .lineWidth(3)
    .fillOpacity(1)
    .fillAndStroke("red", "#900");

myDoc.font('Helvetica-Bold')
    .fontSize(14)
    .text('Es gibt folgende Gefährdungen in Ihrem Unternehmen :', 80, 120);

myDoc.font('Helvetica-Bold')
    .fontSize(12)
    .text('Lorem ', 80, 140);
    */



function getGrenzwerte(_callback) {
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
    if (Object.keys(result).length == 0) {
      unwichtig = 0;
      wichtig = 0;
    } else if (Object.keys(result).length == 1) {
      if (result[0].Wichtig = 0) {
        unwichtig = result[0].anzahl;
        wichtig = 0;
      } else {
        wichtig = result[0].anzahl;
        unwichtig = 0;
      }
    } else {
      unwichtig = result[0].anzahl;
      wichtig = result[1].anzahl;
    }

    // if (typeof result.anzahl == number){
    //   unwichtig = result;
    //   wichtig = 0;
    // }else {
    //   unwichtig = result[0].anzahl;
    //   wichtig = result[1].anzahl;}


    var maxrot = 36 * wichtig * 0.1 + 36 * unwichtig * 0.01;
    var grenzerotgelb = 14 * wichtig * 0.1 + 14 * unwichtig * 0.01;
    var grenzegelbgrün = 6 * wichtig * 0.1 + 6 * unwichtig * 0.01;
    var obj = { "maxrot": maxrot, "rotgelb": grenzerotgelb, "gelbgrün": grenzegelbgrün }
    sqlResult = obj;
    _callback(sqlResult);
  });

}