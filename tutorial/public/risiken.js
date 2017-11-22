//polar
var ctxPA = document.getElementById("polarChart").getContext('2d');
var myPolarChart = new Chart(ctxPA, {
    type: 'polarArea',
    data: {
        labels: ["Kritisch", "unbedenklich", "bedenklich"],
        datasets: [
            {
                data: [150, 200, 50],
                backgroundColor: ["red", "green", "yellow"],
                hoverBackgroundColor: ["red", "green", "yellow"]
            }
        ]
    },
    options: {
        responsive: true
    }
});
