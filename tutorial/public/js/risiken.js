window.onload = init;
var Kategorie="Netze";
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
        /*if(currentRows!=0){
          //alle Rows löschen
          for(var e=0;e<currentRows;e++){
            document.getElementById("mainTable").deleteRow(e+1);
            e=e-1;
          }
        }*/
     


        var table = document.getElementById("mainTable");
        for(var item in obj){
           // console.log(typeof item)
            //console.log(item)
          
            var itemZ = console.log(parseInt(item));
            /*
          if(obj[item].Kategorien == "IT-Systeme"){
            var el = document.createElement('div');
            el.innerHTML = obj[item].Name;
            el.setAttribute('id', obj[item].AID );
            document.getElementById("right-defaults").appendChild(el);
          }
          */
           if (obj[item].Kategorien==Kategorie){
                      var row = table.insertRow(itemZ);
          var cell1 = row.insertCell(0);
         cell1.innerHTML = obj[item].Name;
         var cell1 = row.insertCell(1);
         cell1.innerHTML = "<div id=\"traffic-light\"><div id=\"stopLight\" class=\"bulb\"></div></div>";//https://codepen.io/nevan/pen/shtLA
         var cell1 = row.insertCell(2);
         cell1.innerHTML = "<button data-toggle=\"collapse\" data-target=\"#demo\" onclick=\"loadGefahren("+obj[item].KundenAssetID+")\">Gefährdungen_Placeholder</button>";
         
         currentRows=currentRows+1;
           }

         // console.log(item);
         // console.log(obj[item]);


          
        }
      }
    };
    xhttp.open("GET", "/allKundenAssets", true);
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
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {   
      if (xhttp.readyState == 4 && xhttp.status == 200) {     
        var obj = JSON.parse(xhttp.responseText);  
        var counter=0;  
        document.getElementById("GefahrenHeadline").innerHTML=""; 
        document.getElementById("gefahrdungenh5headline").innerText="Gefährdungen " + obj[0].Asset; 
        for(var item in obj){        
          console.log(obj[item].Name);
          var masnahmeid = "#Maßnahme"+obj[item].KundenAssetID;
          var headline = document.getElementById("GefahrenHeadline");
          headline.innerHTML+=" <div class=\"col\" class=\"ml-2\"><a data-toggle=\"collapse\" data-target= \"#Maßnahme"+counter+"\" id =\"GefahrenHeadline\" > + "+obj[item].Name+"</a></div>";
         var  mid;
         var mText;
         //getMidAndMtext(obj[item].GID, (mid, mText) => { console.log(mid + mText); });
         ////////////////////////////////////////////////////////////////////////
         var xyhttp = new XMLHttpRequest();
         xyhttp.onreadystatechange = function() {      
          console.log("1S");         
           if (xyhttp.readyState == 4 && xyhttp.status == 200) { 
            console.log("2S");                  
             var obj2 = JSON.parse(xyhttp.responseText);   
             console.log(obj2[items].MID);           
             for(var items in obj2){      
              console.log("4S");      
               console.log(obj2[items].MID);
               console.log(obj2[items].Beschreibung);
             }
           }
         };
         console.log("sdfsdf" + obj[item].AID);
         xyhttp.open("GET", "/getAllMassnahmenFurGefahrdung/ + " + obj[item].AID + "", true);
         xyhttp.send();
         ///////////////////////////////////////////////////////////////////////
          headline.innerHTML+="  <div id=\"Maßnahme"+counter+"\" class=\"collapse\" class =\"row\"> <h6>M1.02</h6> <p class=\"xyz123\" >uh</p></div>";
          counter = counter+1;
        }
      }
    };
    var link ="/allGefahrenFurAsset/"+kAID;
    console.log(link);
    xhttp.open("GET", link, true);
    xhttp.send();
    
  }


  //pie
  /*
var ctxP = document.getElementById("pieChart").getContext('2d');
var myPieChart = new Chart(ctxP, {
    type: 'pie',
    data: {
        labels: ["Red", "Green", "Yellow", "Grey", "Dark Grey"],
        datasets: [
            {
                data: [300, 50, 100, 40, 120],
                backgroundColor: ["#F7464A", "#46BFBD", "#FDB45C", "#949FB1", "#4D5360"],
                hoverBackgroundColor: ["#FF5A5E", "#5AD3D1", "#FFC870", "#A8B3C5", "#616774"]
            }
        ]
    },
    options: {
        responsive: true
    }    
});*/