"use strict"
window.onload = init;
var mTB = document.getElementById('maßnahmenTabelle');
var gTB = document.getElementById('gefährdungenTabelle');



function toggleTabellen(){

    if (mTB.style.display == "none"){
        mTB.style.display = "table";
        gTB.style.display = "none";
        document.getElementById('gHeader').style.display = "none";
        document.getElementById('mHeader').style.display = "inline";
      
    }else{
        mTB.style.display = "none";
        gTB.style.display = "table";
        document.getElementById('mHeader').style.display = "none";
        document.getElementById('gHeader').style.display = "inline";
    }
}

function init() {
    
  
  init1();
  }
  function init1(){
  
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
     
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        
        var obj = JSON.parse(xhttp.responseText);
       var green = obj.grün;
       var yellow = obj.gelb;
       var red = obj.rot;
  
            //pie
  var ctxP = document.getElementById("pieChart").getContext('2d');
  var myPieChart = new Chart(ctxP, {
      type: 'pie',
      data: {
          labels: ["Sichere Vermögenswerte", "Bedenkliche Vermögenswerte","Kritische Vermögenswerte" ],
          datasets: [
              {
                  data: [green, yellow, red],
                  backgroundColor: ["#31B404", "#FFFF00", "#DF0101"]
                  //hoverBackgroundColor: ["#FF5A5E", "#5AD3D1", "#FFC870"]
              }
          ]
      },
      options: {
          responsive: true
      }    
  });
  // end of pie
      }
    };
    xhttp.open("GET", "/verhaltnisAssets", true);
    xhttp.send();
  
  init2();
    }
    function init2(){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {        
          if (xhttp.readyState == 4 && xhttp.status == 200) {         
            var obj = JSON.parse(xhttp.responseText);    
            var maxMaßnahmen = 5;  
            var counter =0;

           var zähler=0;
            for(var item in obj){ 
                var itemZ = parseInt(item) + 1;           
                if (counter == maxMaßnahmen) break; 
                
             mTB.rows[itemZ++].cells[1].firstChild.firstChild.innerText = obj[item].Beschreibung;
             document.getElementById('checkbox10' + zähler).name = obj[item].mid;
             document.getElementById('checkbox10' + zähler).className = obj[item].KundenAssetID;

//                alert(mTB.rows[2].innerHTML);
             console.log(obj[item]);
            
             zähler++;
             
             counter++;
            }
          }
        };
        xhttp.open("GET", "/topmassnahmen", true);
        xhttp.send();
        init3();
    }
    function init3(){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {        
          if (xhttp.readyState == 4 && xhttp.status == 200) {         
            var obj = JSON.parse(xhttp.responseText);    
            var zähler=1;
            for(var item in obj){ 
                var itemZ = parseInt(item) + 1;      
                gTB.rows[itemZ++].cells[1].firstChild.firstChild.innerText = obj[item].Name;
            }
          }
        };
        xhttp.open("GET", "/topgefahrdungen", true);
        xhttp.send();

    }
    
    function maßnahmeErledigt (obj){
        var mid = obj.name;
        var kaid = obj.className;
        //alert (mid + kid);
       // alert(obj.checked);
        //document.getElementById(id).innerText("Ich wurde bereits erledigt !");
        //console.log(id);
///massnahmeErledigtNegativ/:KAID/:MID
        if(obj.checked == false){
        //    alert("hure2");
            $.ajax({
                type: 'PUT',
                url: "/massnahmeErledigtNegativ/" + kaid + "/" + mid,
            
            });
            updatePie();
        }else {
            //alert("hure");
            $.ajax({
                type: 'PUT',
                url: "/massnahmeErledigt/" + kaid + "/" + mid,
            
            });
            updatePie();
        }


    }
    function updatePie()   {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
         
          if (xhttp.readyState == 4 && xhttp.status == 200) {
            
            var obj = JSON.parse(xhttp.responseText);
           var green = obj.grün;
           var yellow = obj.gelb;
           var red = obj.rot;
      
                //pie
      var ctxP = document.getElementById("pieChart").getContext('2d');
      var myPieChart = new Chart(ctxP, {
          type: 'pie',
          data: {
              labels: ["Sichere Vermögenswerte", "Bedenkliche Vermögenswerte","Kritische Vermögenswerte" ],
              datasets: [
                  {
                      data: [green, yellow, red],
                      backgroundColor: ["#31B404", "#FFFF00", "#DF0101"]
                      //hoverBackgroundColor: ["#FF5A5E", "#5AD3D1", "#FFC870"]
                  }
              ]
          },
          options: {
              responsive: true
          }    
      });
      // end of pie
          }
        };
        xhttp.open("GET", "/verhaltnisAssets", true);
        xhttp.send();
    }