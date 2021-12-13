const chartEventHandler = function () {
  this.init = function () {
    _this.MONTHS = [
      "",
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
    ];
    _this.displayBarChart();
    _this.chartFilterEvents();
    _this.displayPieChart();
  };

  //display bar chart
  this.displayBarChart = function (chartBy = "hourly") {
    let chart = {
      type: "line",
    };
    let title = {
      text: chartBy + " posts report",
    };
    let subtitle = {
      text: "Source: Social Media",
    };
    let yAxis = {
      min: 0,
      title: {
        text: "Number Of Posts",
      },
    };
    let plotOptions = {
      series: {
        animation: {
          duration: 1000,
        },
      },
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
      },
    };

    let dragDrop = {
      draggableX: true,
      draggableY: true,
    };

    let xAxis;

    $.ajax({
      url: "/chart/" + chartBy,
      method: "GET",
      success: function (response) {
        let data = response.data;
        let xAxisData = response.xAxis;
        if (chartBy == "monthly") {
          xAxis = {
            categories: xAxisData.map(function (value) {
              return (
                _this.MONTHS[Number(value.split("-")[0])] +
                "-" +
                value.split("-")[1]
              );
            }),
            crosshair: true,
          };
        } else if (chartBy == "yearly") {
          xAxis = {
            categories: xAxisData,
            crosshair: true,
          };
        } else if (chartBy == "daily") {
          xAxis = {
            categories: xAxisData.map(function (value) {
              return (
                value.split("-")[0] +
                "-" +
                _this.MONTHS[Number(value.split("-")[1])]
              );
            }),
            crosshair: true,
          };
        } else if (chartBy == "hourly") {
          console.log(xAxisData);
          xAxis = {
            categories: xAxisData.map(function (hourValue) {
              if (hourValue == 12) {
                return hourValue + " pm";
              } else if (hourValue > 12) {
                hourValue = hourValue - 12;
                return hourValue + " pm";
              } else {
                return hourValue + " am";
              }
            }),
            crosshair: true,
          };
        }

        let series = [
          {
            name: "DateTime",
            data: data,
          },
        ];
        let json = {};
        json.chart = chart;
        json.title = title;
        json.subtitle = subtitle;
        json.plotOptions = plotOptions;
        json.series = series;
        json.xAxis = xAxis;
        json.dragDrop = dragDrop;
        json.yAxis = yAxis;

        $("#barChart").highcharts(json);
      },
    });
  };

  //bar chart filter events
  this.chartFilterEvents = function () {
    $("#chartBy").on("change", function () {
      _this.displayBarChart($(this).val());
    });
  };

  //pie chart display
  this.displayPieChart = function () {
    let chart = {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
    };
    let title = {
      text: "Userwise posts stats",
    };
    let tooltip = {
      pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
    };
    let exporting = {
      buttons: {
        contextButton: {
          symbol: null,
          menuItems: null,
          text: "Download",
          onclick: function () {
            this.exportChart({
              type: "image/png",
            });
          },
        },
      },
    };

    let plotOptions = {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",

        dataLabels: {
          enabled: false,
        },

        showInLegend: true,
      },
    };
    let series;

    $.ajax({
      url: "/pieChart",
      method: "GET",
      success: function (response) {
        let postStatistics = response.postStatistics;
        series = [
          {
            type: "pie",
            name: "Userwise Post",
            data: postStatistics.map(function (value) {
              return {
                name: value.user.name,
                y: value.totalPosts,
                sliced: true,
                selected: true,
              };
            }),
          },
        ];
        let json = {};
        json.chart = chart;
        json.title = title;
        json.tooltip = tooltip;
        json.series = series;
        json.plotOptions = plotOptions;
        json.exporting = exporting;
        $("#pieChart").highcharts(json);
      },
    });
  };

  let _this = this;
  this.init();
};
