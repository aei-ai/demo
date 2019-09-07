//====================================================
//                 Cartesian chart
//====================================================
/**
 * Create Cartesian chart.
 */
var cartesianChart = function (d3) {
    var cartesianChart = {};
    // container padding
    var rect = {top: 20, right: 20, bottom: 30, left: 20};
    // x-axis
    var xAxisLength = 500 - rect.left - rect.right;
    var xAxisTickValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
    var xAxisScale = d3.scale.linear().range([0, xAxisLength]);
    // ticks on x axis
    var bottomTick = d3
        .svg
        .axis()
        .scale(xAxisScale)
        .tickValues(xAxisTickValues.slice(1))
        .tickFormat(d3.format(".0f"))
        .tickPadding(10)
        .tickSize(0)
        .orient("bottom");
    // y-axis
    var yAxisLength = 400 - rect.top - rect.bottom;
    var yAxisTickValues = [-1, -0.5, 0, 0.5, 1];
    var yAxisScale = d3.scale.linear().range([yAxisLength, 0]);
    // ticks on y axis
    var leftTick = d3
        .svg
        .axis()
        .scale(yAxisScale)
        .tickSize(0)
        .tickPadding(10)
        .tickValues(yAxisTickValues)
        .orient("left");
    // chart interpolated line
    var chartInterpolatedLine = d3
        .svg
        .line()
        .interpolate("monotone")
        .x((a) => { return xAxisScale(a.y) })
        .y((a) => { return yAxisScale(a.x) });
    // cartesian chart's path
    var cpath = d3
        .select(".affect-cartesian-chart")
        .append("svg")
        .attr("width", xAxisLength + rect.left + rect.right)
        .attr("height", yAxisLength + rect.top + rect.bottom)
        .append("g")
        .attr("transform", "translate(" + rect.left + "," + rect.top + ")");

    /**
     * Processes the input JSON data.
     * @param data Input JSON data.
     */
    function processData(data) {
        var points = [], count = 0;
        data._scores.forEach((item) => {
            // create x-y coordinates of data points
            if (count <= xAxisTickValues.length) {
                points.push({x: item, y: count});
                count++;
            }
        });

        return points;
    }

    /**
     * Draws the line chart with interpolating between given points with given line color.
     * @param points Given points to interpolate.
     * @param lineColor Line color.
     */
    function drawChart(points, lineColor) {
        xAxisScale.domain(d3.extent(points, (a) => { return a.y }));
        yAxisScale.domain([-1.0, 1.0]);
        cpath
            .append("g")
            .attr("class", "x-axis axis")
            .attr("transform", "translate(0," + (yAxisLength / 2) + ")")
            .call(bottomTick)
            .append("text")
            .attr("x", 450)
            .attr("y", -8)
            .style("text-anchor", "end")
            .text("Turn");
        cpath
            .append("g")
            .attr("class", "y-axis axis")
            .call(leftTick)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".91em")
            .style("text-anchor", "end")
            .text("Value");
        cpath
            .append("path")
            .datum(points)
            .attr("class", "line")
            .attr("id", "affect-cartesian-chart-line")
            .attr("d", chartInterpolatedLine)
            .attr("stroke", () => { return lineColor });
    }

    /**
     * Refreshes the cartesian chart with new data.
     * @param data New data.
     */
    function refreshChart(data) {
        var points = processData(data);
        var chartLine = d3.select("#affect-cartesian-chart-line");
        null === chartLine[0][0]
            ? drawChart(points, data._color)
            : chartLine
                .datum(points)
                .attr("d", chartInterpolatedLine)
                .attr("stroke", () => { return data._color })
    }

    // refresh the cartesian chart and return it
    cartesianChart.refreshChart = refreshChart;
    return cartesianChart;
}(d3);