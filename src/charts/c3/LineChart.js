/**
 *
 * @name LineChart
 * @constructor
 * @classdesc This class constructs a c3 line chart.
 * @memberOf dex.charts.c3
 * @implements {dex/component}
 *
 * @example {@lang javascript}
 * var areachart = new dex.charts.c3.AreaChart({
 *   'parent' : "#AreaChart",
 *   'id'     : "AreaChart"
 *   'csv'    : { header : [ "X", "Y", "Z" ],
 *                data   : [[ 1, 2, 3 ], [4, 5, 6], [7, 8, 9]]}
 * });
 *
 * @param {object} userConfig - A user supplied configuration object which will override the defaults.
 * @param {string} userConfig.parent - The parent node to which this Axis will be attached.  Ex: #MyParent
 * will attach to a node with an id = "MyParent".
 * @param {string} [userConfig.id=Axis] - The id of this axis.
 * @param {string} [userConfig.class=Axis] - The class of this axis.
 * @param {csv} userConfig.csv - The user's CSV data.
 *
 * @inherit module:dex/component
 *
 */

var linechart = function (userConfig) {
  var chart;

  var defaults = {
    // The parent container of this chart.
    'parent': '#LineChart',
    // Set these when you need to CSS style components independently.
    'id': 'LineChart',
    'class': 'LineChart',
    'resizable': true,
    'csv': {
      'header': [],
      'data': []
    },
    'linktype': 'line',
    'width': "100%",
    'height': "100%"
  };

  var chart = new dex.component(userConfig, defaults);
  var internalChart;
  var selectedColumns = [];

  chart.resize = function resize() {
    dex.console.log("PARENT: '" + chart.config.parent + "'");
    if (chart.config.resizable) {
      var width = $("" + chart.config.parent).width();
      var height = $("" + chart.config.parent).height();
      dex.console.log("RESIZE: " + width + "x" + height);
      chart.attr("width", width)
        .attr("height", height)
        .update();
    }
    else {
      chart.update();
    }
  };

  chart.render = function render() {

    //var chart = this;
    var config = chart.config;
    var csv = config.csv;
    window.onresize = this.resize;

    d3.select(config.parent).selectAll("*").remove();
    var gtypes = dex.csv.guessTypes(csv);
    selectedColumns = dex.csv.getNumericIndices(csv);
    if (gtypes[0] == "string") {
      selectedColumns.unshift(0);
    }
    else if (gtypes[0] == "date") {
      selectedColumns.unshift(0);
    }

    var ncsv = dex.csv.columnSlice(csv, selectedColumns);

    var columns = dex.csv.transpose(ncsv);

    for (var ci = 0; ci < columns.header.length; ci++) {
      columns.data[ci].unshift(columns.header[ci]);
    }

    var types = {};
    dex.range(1, ncsv.header.length)
      .map(function (hi) {
        types[ncsv.header[hi - 1]] = config.linktype;
      });

    var c3config = {
      'bindto': config.parent,
      'data': {
        'x': columns.header[0],
        'columns': columns.data,
        'types': types
      },
      subchart: {
        show: true
      },
      zoom: {
        enabled: true
      },
      legend: {
        position: 'right'
      },
      groups: config.groups
    };

    //dex.console.log("TYPES:", gtypes);

    if (gtypes[0] == "string") {
      c3config["axis"] = {
        "x": {
          "type": "category",
          "categories": [].concat.apply([],
            dex.matrix.uniques(dex.matrix.slice(csv.data, [0]))).sort()
        }
      }
    }
    else if (gtypes[0] == "date") {
      //dex.console.log("DEALING WITH A DATE...");
      c3config["axis"] = {
        "x": {
          "type": "timeseries",
          "tick": {
            format: '%Y-%m-%d'
          }
        }
      }
    }

    //dex.console.log("RENDER C3CONFIG", c3config);

    //dex.console.log("CATEGORIES", c3config);
    internalChart = c3.generate(c3config);
  };

  chart.update = function () {
    var chart = this;
    var config = chart.config;
    var csv = config.csv;

    var gtypes = dex.csv.guessTypes(csv);

    var ncsv = dex.csv.columnSlice(csv, selectedColumns);
    var columns = dex.csv.transpose(ncsv);

    for (var ci = 0; ci < columns.header.length; ci++) {
      columns.data[ci].unshift(columns.header[ci]);
    }

    var types = {};
    dex.range(1, ncsv.header.length)
      .map(function (hi) {
        types[ncsv.header[hi - 1]] = config.linktype;
      });

    var c3config = {
      'columns': columns.data
    };

    //dex.console.log("C3CONFIG", c3config);

    //internalChart.groups(config.groups);
    internalChart.load(c3config);
  };

  $(document).ready(function () {
    // Make the entire chart draggable.
    //$(chart.config.parent).draggable();
  });

  return chart;
};

module.exports = linechart;