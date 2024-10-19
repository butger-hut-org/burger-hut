window.onload = function () {
    //Top Users Purchased Online
    $.ajax({
        type: "GET",
        url: "api/orders/sortUsers",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            userOrderChart(response);
        },
        failure: function (response) {
            alert(response.responseText);
            alert("Failure");
        },
        error: function (response) {
            alert("Error api/orders/sortUsers");
            alert(response);
        },
    });

    //Top Products Purchased Online
    $.ajax({
        type: "GET",
        url: "api/orders/sortProducts",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            productOrderChart(response);
        },
        failure: function (response) {
            alert(response.responseText);
            alert("Failure");
        },
        error: function (response) {
            alert("Error application/json");
            alert(response);
        },
    });


    $("#loader").hide();
};

function userOrderChart(res) {
    data = [];
    for (element of res["items"]) {
        data.push({
            label: element[0],
            y: element[1]
        });
    }

    var chart = new CanvasJS.Chart("usersChartContainer", {
        animationEnabled: true,
        theme: "light2", // "light1", "light2", "dark1", "dark2"
        title: {
            text: "Top Users Purchased Online"
        },
        subtitles: [{
            text: "In USD",
            fontSize: 16
        }],
        axisY: {
            prefix: "$",
            scaleBreaks: {
                customBreaks: [{
                    startValue: 10000,
                    endValue: 35000
                }]
            }
        },
        data: [{
            type: "column",
            yValueFormatString: "$#,##0.00",
            dataPoints: data
        }]
    });
    chart.render();

}

function productOrderChart(res) {
    data = [];
    for (element of res["items"]) {
        data.push({
            label: element[0],
            y: element[1]
        });
    }

    var chart = new CanvasJS.Chart("productsChartContainer", {
        animationEnabled: true,
        theme: "light1", // "light1", "light2", "dark1", "dark2"
        title: {
            text: "Top Products Purchased Online"
        },
        subtitles: [{
            text: "In USD",
            fontSize: 16
        }],
        axisY: {
            prefix: "$",
            scaleBreaks: {
                customBreaks: [{
                    startValue: 10000,
                    endValue: 35000
                }]
            }
        },
        data: [{
            type: "column",
            yValueFormatString: "$#,##0.00",
            dataPoints: data
        }]
    });
    chart.render();

}
