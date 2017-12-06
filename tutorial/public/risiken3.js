window.onload = init;
var Kategorie="IT-Systeme";
var currentRows=0;
function init() {
  
// 1.) Kategorien laden

var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
 
  if (xhttp.readyState == 4 && xhttp.status == 200) {
    
    var obj = JSON.parse(xhttp.responseText);
   
    for(var item in obj){
     
      console.log(obj[item]);
    }
  }
};
xhttp.open("GET", "/allKategorien", true);
xhttp.send();

init1();
}
function init1(){

// 2.) Tabelle Laden
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        var obj = JSON.parse(xhttp.responseText);

        var table = document.getElementById("mainTable");
        for(var item in obj){
//unter jede Spale muss eine pseudospalte mit den gefährdungen kommen
          
            var itemZ = console.log(parseInt(item));
           if (obj[item].Kategorien==Kategorie){
                      var row = table.insertRow(itemZ);
                      var pseudoCounter =itemZ;
                      pseudoCounter++;
                      var pseudoRow = table.insertRow();
                      pseudoRow.innerHTML='style= display : \"none \"';

          var cell1 = row.insertCell(0);
         cell1.innerHTML = obj[item].Name;
         var cell1 = row.insertCell(1);
         cell1.innerHTML = "<div id=\"traffic-light\"><div id=\"stopLight"+obj[item].KundenAssetID+"\" class=\"bulb\"></div></div>";//https://codepen.io/nevan/pen/shtLA
         var kaidParam = obj[item].KundenAssetID;
         bulbID = "stopLight"+obj[item].KundenAssetID;
         calcRisikoFurAssetAndChangeLight(bulbID, kaidParam,(buttonID, erg) => { 
          
              console.log("Just got invoked !" + erg);
              if (erg>15){
              illuminateRed(buttonID,()=>{});
              
              }
              else if (erg>5)  {
                illuminateYellow(buttonID,()=>{});
              }else{
                illuminateGreen(buttonID,()=>{});
              }
         });

         var cell1 = row.insertCell(2);
         cell1.innerHTML = "<button data-toggle=\"collapse\" class=\"btn btn-primary\" data-target=\"#accordion"+obj[item].KundenAssetID+"\" onclick=\"loadGefahren("+obj[item].KundenAssetID+")\">Gefährdungen</button>";

         var cell2 = pseudoRow.insertCell(0);
         var cell3 = pseudoRow.insertCell(1);
            
         cell2.colSpan="3";
         cell2.innerHTML="<div id=\"accordion"+obj[item].KundenAssetID+"\" class=\"collapse\"></div>";
         
         
           }
          
        }
      }
    };
    xhttp.open("GET", "/allKundenAssets", true);
    xhttp.send();
  }
  function calcRisikoFurAssetAndChangeLight (bulbID,kaidParam,callback){
    //invoke light changeing funktion and call back here
  
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
     
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        
        var obj = JSON.parse(xhttp.responseText);
       
        for(var item in obj){
         
          //console.log(obj[item]);
          var erg = obj[item];
        }
        callback(bulbID, erg);
      }
    };
    xhttp.open("GET", "/getRisikoFurEinAsset/"+kaidParam, true);
    xhttp.send();

  }
  function loadTable(neueKat){
    this.Kategorie=neueKat;
    document.getElementById("buttonKat").innerText=neueKat;
    document.getElementById("GefahrenHeadline").innerHTML="";
    var Table = document.getElementById("tbody");
    Table.innerHTML = "<tr></tr>";

    init1();
  }
  function loadGefahren( kAID){
    console.log(kAID);
    var jsonobj;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {   
      if (xhttp.readyState == 4 && xhttp.status == 200) { 
        var obj = JSON.parse(xhttp.responseText);  
        jsonobj=obj;
        var counter=0;  
        document.getElementById("GefahrenHeadline").innerHTML=""; 
     try{//  document.getElementById("gefahrdungenh5headline").innerText="Gefährdungen " + obj[0].Asset; 
     console.log("-->"+obj[0].KundenAssetID);
      var stg = document.getElementById( ("accordion"+kAID) );
      stg.innerHTML="";
        for(var item in obj){        
          //console.log(obj[item].Name);
         var name = item;
        
      

         stg.innerHTML+= "<div class=\"col\" class=\"ml-2\"><a  data-toggle=\"collapse\" data-target=\"#button"+name+kAID+"\" > + "+obj[item].Name+" </a></div>";
         stg.innerHTML+= "<div id=\"button"+name+kAID+"\" class=\"collapse\"  class=\"col\" class=\"ml-2\"  >  </div>";
         
         var ggid = obj[item].GID;
         var aaid = obj[item].AID;
         var buttonID = "button"+name+kAID;
         console.log(buttonID+ "iöp");
       maßnahmenNachladen(ggid,aaid,kAID,buttonID, (array, buttonID) => { 
         var temp = document.getElementById((buttonID));
        //hier jetzt jeweils die maßnahme nachladen
        console.log("-----------------------------------------------------------------------------------------------------------");
        for ( var i = 0 ; i<array.length; i++){
          
          var i2 = i;
          i2++;
          var i3=i2;
          i3++;
            var paramId = 'coll'+array[i]+array[i2]+'';
            var buttonColourID = "coll"+array[i]+array[i2];
            if (array[i3]==1){
              temp.innerHTML+= "<div class=\"xyz123Nice\" id =\"coll"+array[i]+array[i2]+"\" >"+array[i]+"</br>"+array[i2]+ "</br> <button type=\"button\"  class=\"btn btn-primary\" onclick=\"checkDieMasnahme('"+array[i]+"','"+kAID+"','coll"+array[i]+array[i2]+"')\"> Erledigt </button>  </div></div>";
            }else{
              temp.innerHTML+= "<div class=\"xyz123\" id =\"coll"+array[i]+array[i2]+"\" >"+array[i]+"</br>"+array[i2]+ "</br> <button type=\"button\"  class=\"btn btn-primary\" onclick=\"checkDieMasnahme('"+array[i]+"','"+kAID+"','coll"+array[i]+array[i2]+"')\"> Erledigt </button>  </div></div>";
            }
          
           console.log(array[i]+array[i2]);
           i = i3;
          // i++;
           
        }
        console.log("-----------------------------------------------------------------------------------------------------------");

        });
        console.log("outside");
          counter = counter+1;
        }
      } //end of try 
      catch (e) {
        console.log(e.message);
        var stg = document.getElementById( ("accordion"+kAID) );
        stg.innerText="Oh! Zu diesem Asset gibt es leider noch keine definierten Gefährdungen. Schreibe doch bitte ein Ticket oder rufe den Kundensupport unter 999 an."
        
      }
      }
    };
    var link ="/allGefahrenFurAsset/"+kAID;
    console.log(link);
    xhttp.open("GET", link, true);
    xhttp.send();

  }
  function maßnahmenNachladen(gid,aid,kAID,buttonID,counter){
    console.log("inside");
    console.log("2gid-" + gid + "2aaid-" + kAID);
    
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {     
      if (xhttp.readyState == 4 && xhttp.status == 200) {

        var obj = JSON.parse(xhttp.responseText);

        
        var array = new Array();
        var counterx = 0;
        for(var item in obj){
          array[counterx]=obj[item].mid;
          counterx++;
          array[counterx]=obj[item].Beschreibung;
          counterx++;
          array[counterx]=obj[item].Durchgeführt;
          counterx++;
           
          // textInhalt += "{ \"Beschreibung\": \"" + obj[item].Beschreibung + "\", \"MID\": \"" + obj[item].MID + "\" }"
          
         }
        // var objP = textAnfang + textInhalt + textEnde;

        counter(array,buttonID);
      }
    };
      console.log("GID ist "+gid);
       var path = "/getAllMassnahmenFurGefahrdung/"+kAID+"/"+gid;
    xhttp.open("GET", path, true);
    xhttp.send();
  
    
//counter("p");
    }
   function checkDieMasnahme(mid, kaid, id){
     alert("checke die maßnahme : "+ mid + "kaid-->" + kaid);
     //document.getElementById(id).innerText("Ich wurde bereits erledigt !");
console.log(id);


     $.ajax({
      type: 'PUT',
      url: "/massnahmeErledigt/" + kaid + "/" + mid,

  });
//nochmal die farbe checken
//var colorChange = document.getElementById(id);
//colorChange.setAttribute("class", "xyz123Nice");

   }