/**
 * Initializes the chart with all-zero data.
 */
function initChart() {
    var data = {
        _scores: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        _description: null,
        children: null,
        value: 0,
        key: "",
        depth: 1
    };
    chart.refreshChart(data)
}

/**
 * Defines action at mouse-over event.
 * @param data Data of affect node on which mouse is hovered.
 */
function mouseover(data) {
    // refresh the Cartesian chart
    chart.refreshChart(data);
    // get the path to draw for bread-crumb chart
    var path = getCrumbPath(data);
    // Value of the last node in path
    var score = data._scores.length > 0 ? (data._scores[data._scores.length - 1]).toPrecision(2) : null;
    // draw the bread-crumb chart
    drawBreadCrumbChart(path);
    // reduce the opacity of the whole sunburst chart
    d3.selectAll(".affect-sunburst path").style("opacity", .3);
    // increase opacity of the nodes in the path to 1
    sunburst.selectAll("path").filter(function (a) { return path.indexOf(a) >= 0 }).style("opacity", 1);
    // show the descriptions in the middle of sunburst chart
    d3.select(".description").style("visibility", "").text(data._description);
    // show the score in the middle of sunburst chart
    d3.select(".score").style("visibility", "").text(score);
}

/**
 * Defines action at mouse-leave event from sunburst chart.
 */
function mouseleave() {
    // empty the path
    d3.selectAll("path").on("mouseover", null);
    // after one second, increase opacity of the whole sunburst chart to 1
    d3.selectAll("path")
        .transition()
        .duration(1e3)
        .style("opacity", 1)
        .each("end", function () {
            d3.select(this).on("mouseover", mouseover)
        });
    // hide the descriptions in the middle of sunburst chart
    d3.select(".description")
        .transition()
        .duration(1000)
        .style("visibility", "hidden");
    // hide the score in the middle of sunburst chart
    d3.select(".score")
        .transition()
        .duration(1000)
        .style("visibility", "hidden");
}

/**
 * Gets the path from center to the node on which mouse is hovered.
 * @param data Data of the node on which mouse is hovered.
 * @returns {Array} Path from center to the node on which mouse is hovered.
 */
function getCrumbPath(data) {
    for (var path = [], node = data; node.parent; ) {
        path.unshift(node);
        node = node.parent;
    }
    return path
}

/**
 * Initializes the bread-crumb chart.
 */
function initBreadCrumb() {
    d3.select("#affect-chart-breadcrumb")
        .append("svg:svg")
            .attr("width", 500)
            .attr("height", 50)
            .attr("class", "trail")
}

/**
 * Calculates polygon points for the bread-crumb chart.
 *
 * @param data Node data.
 * @param d3 D3.js object.
 * @returns {string} Space separated polygon points.
 */
function getPolygonPoints(data, d3) {
    var c = [];
    c.push("0,0");
    c.push(polygonShape.w + ",0");
    c.push(polygonShape.w + polygonShape.t + "," + polygonShape.h / 2);
    c.push(polygonShape.w + "," + polygonShape.h);
    c.push("0," + polygonShape.h);
    d3 > 0 && c.push(polygonShape.t + "," + polygonShape.h / 2);
    return c.join(" ");
}

/**
 * Draws the bread-crumb chart for the given path data.
 * @param data Data of the path from the most grand parent node to the leaf node on which mouse is hovered.
 */
function drawBreadCrumbChart(data) {
    var c = d3.select("#affect-chart-breadcrumb .trail")
        .selectAll("g")
        .data(data, function (a) { return a.key + a.depth });
    // create the bread-crumb polygon for given node data
    var d = c.enter().append("svg:g");
    d.append("svg:polygon")
        .attr("points", getPolygonPoints)
        .style("fill", function (a) { return a._color });
    // write text in polygon
    d.append("svg:text")
        .attr("x", polygonShape.w / 2 + 2)
        .attr("y", polygonShape.h / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .attr("class", "breadcumb-text")
        .style("fill", function (a) { return getColor(d3.rgb(a._color)) < 150 ? "#fff" : "#000" })
        .text(function (a) { return a.key });
    // position the polygon to the right place
    c.attr("transform", function (a, b) { return "translate(" + b * (polygonShape.w + polygonShape.s) + ", 0)" });
    c.exit().remove();
    // show the polygon
    d3.select(".trail").style("visibility", "");
}

/**
 * Calculates a brightness score for an RGB color, which helps us decide about text color on top of that RGB color.
 * @param color Given color for which brighness score is calculated.
 * @returns {number} An brightness score.
 */
function getColor(color) {
    return 0.299 * color.r + 0.587 * color.g + 0.114 * color.b
}

/**
 * Gets an RGB color based on the node'd value and depth.
 * @param node Target node.
 * @returns {*} RGB color based on the node'd value and depth.
 */
function getRgbColor(node) {
    var c = ["#4CC3D9", "#FFC65D", "#7BC8A4", "#93648D", "#404040"];
    var d = [-.1, -.05, 0];

    if (node.depth === 1) {
        var e = c[colorAlternative % 5];
        colorAlternative++;
        return e;
    }

    if (node.depth > 1) {
        var f = d[Math.round(100.0 * Math.abs(node.value) % 3)];
        return d3.rgb(node.parent._color).brighter(.2 * node.depth + f * node.depth)
    }
}

/**
 * Cartesian chart.
 */
var chart = function (d3) {
    var chart = {};
    var rect = {top: 20, right: 20, bottom: 30, left: 20};
    var xAxisLength = 500 - rect.left - rect.right;
    var xAxisTickValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];
    var xAxixScale = d3.scale.linear().range([0, xAxisLength]);
    var yAxisLength = 400 - rect.top - rect.bottom;
    var yAxisTickValues = [-1, -0.5, 0, 0.5, 1];
    var yAxisScale = d3.scale.linear().range([yAxisLength, 0]);
    // ticks on x axis
    var bottomTick = d3
        .svg
        .axis()
        .scale(xAxixScale)
        .tickValues(xAxisTickValues.slice(1))
        .tickFormat(d3.format(".0f"))
        .tickPadding(10)
        .tickSize(0)
        .orient("bottom");
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
    var chartInterpolatedLine = d3.svg.line().interpolate("monotone")
        .x(function (a) { return xAxixScale(a.y) })
        .y(function (a) { return yAxisScale(a.x) });
    var cpath = d3
        .select(".affect-chart")
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
        data._scores.forEach(function (item) {
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
        xAxixScale.domain(d3.extent(points, function (a) { return a.y }));
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
                .attr("id", "affect-chart-line")
                .attr("d", chartInterpolatedLine)
                .attr("stroke", function () { return lineColor });
    }

    /**
     * Refreshes the chart with new data.
     * @param data New data.
     */
    function refreshChart(data) {
        var points = processData(data);
        var chartLine = d3.select("#affect-chart-line");
        null === chartLine[0][0]
            ? drawChart(points, data._color)
            : chartLine
                .datum(points)
                .attr("d", chartInterpolatedLine)
                .attr("stroke", function () { return data._color })
    }

    // refresh the chart and return it
    chart.refreshChart = refreshChart;
    return chart;
}(d3);

// default values
var polygonShape = {w: 116, h: 30, s: 3, t: 7};
var colorAlternative = 0;
// create sunburst chart
var width = 800;
var height = 600;
var rad = 1.1 * Math.min(width, height) / Math.PI;
var rgbColor = getRgbColor;
var sunburst = d3
    .select(".affect-sunburst")
    .append("svg:svg")
        .attr("width", width)
        .attr("height", height)
    .append("svg:g")
        .attr("transform", "translate(" + (width / 2) + "," + (height / 2 - 25) + ")");

// create center circle
sunburst
    .append("svg:circle")
        .attr("r", rad)
        .style("opacity", 0);
// add description text in the center
sunburst
    .append("svg:text")
        .attr("text-anchor", "middle")
        .attr("class", "description")
        .style("fill", "#666")
        .style("font-size", "1.5em");
// add score text in the center, below the description
sunburst
    .append("svg:text")
        .attr("text-anchor", "middle")
        .attr("class", "score")
        .attr("transform", "translate(0," + 30 + ")")
        .style("fill", "#666")
        .style("font-size", "2.5em");

// scores of the sunburst chart
var scoreData = d3
    .layout
    .partition()
    .sort(null)
    .size([2 * Math.PI, rad])
    .children(function (a) {
        if (a.key === "Description") {
            a._descriptions = a.value;
            // use last array value (i.e., emotion name, mood name) as description
            a.parent._description = a.value[a.value.length - 1];
            return null;
        }

        // use key as description for nodes other than 'description'
        a._description = a.key;
        if (a.value instanceof Array) {
            a._scores = a.value;
            return d3.entries([a.value[a.value.length - 1]]);
        } else {
            a._scores = [];
            return isNaN(a.value) ? d3.entries(a.value) : null;
        }
    })
    .value(function (a) { return Math.abs(a.value) });

// the arc to be used for each data node
var arc = d3.svg
        .arc()
        .startAngle(function (a) { return a.x })
        .endAngle(function (a) { return a.x + a.dx - 0.01 / (a.depth + 0.5) })
        .innerRadius(function (a) { return rad / Math.PI * a.depth })
        .outerRadius(function (a) { return rad / Math.PI * (a.depth + 2) - 1 });

// initialize bread-crumb chart
initBreadCrumb();

// display the sunburst chart
var path = sunburst
    .data(d3.entries(affectData))
    .selectAll("g")
    .data(scoreData)
    .enter()
    .append("svg:g")
    .attr("display", function (a) { return a.depth ? null : "none" });
// create an arc for each data node
path.append("svg:path")
    .attr("d", arc)
    .attr("stroke", "#fff")
    .attr("fill", function (a) {
        a._color = rgbColor(a);
        return a._color
    })
    .attr("fill-rule", "evenodd").attr("display", function (a) { return a.children ? null : "none" })
    .on("mouseover", mouseover);
// write text in sunburst chart nodes
path.append("svg:text")
    .attr("transform", function (a) {
        var r = 180 * ((a.x + a.dx / 2 - Math.PI / 2) / Math.PI);
        return "rotate(" + r + ")"
    })
    .attr("x", function (a) { return rad / Math.PI * a.depth})
    .attr("dx", "6").attr("dy", ".1em").text(function (a) { return a.key })
    .attr("display", function (a) { return a.children ? null : "none" })
    .on("mouseover", mouseover);
// setup mouse-leave event for sunburst chart
d3.select(".affect-sunburst")
    .on("mouseleave", mouseleave);

// center circle
sunburst.append("circle")
    .attr("r", rad / Math.PI)
    .attr("opacity", 0);
// initialize the chart values
initChart();

function updateData(newAffectData) {
    // push new PAD data to affect data
    pushNewPadScore(newAffectData['Affect']['Emotion'], 'Emotion');
    pushNewPadScore(newAffectData['Affect']['Mood'], 'Mood');
    pushNewPadScore(newAffectData['Affect']['Personality']['PAD'], 'Personality');

    // push new emotion and mood names
    pushNewDescription(affectData['Affect']['Emotion']['Description'], 'Emotion');
    pushNewDescription(affectData['Affect']['Mood']['Description'], 'Mood');

    // push new big five data to affect data
    if (affectData['Affect']['Personality']['Big Five']['Openness'].length > 14) {
        affectData['Affect']['Personality']['Big Five']['Openness'].shift();
        affectData['Affect']['Personality']['Big Five']['Conscientiousness'].shift();
        affectData['Affect']['Personality']['Big Five']['Extroversion'].shift();
        affectData['Affect']['Personality']['Big Five']['Agreeableness'].shift();
        affectData['Affect']['Personality']['Big Five']['Neuroticism'].shift();
    }
    affectData['Affect']['Personality']['Big Five']['Openness'].push(newAffectData['Affect']['Personality']['Big Five']['Openness']);
    affectData['Affect']['Personality']['Big Five']['Conscientiousness'].push(newAffectData['Affect']['Personality']['Big Five']['Conscientiousness']);
    affectData['Affect']['Personality']['Big Five']['Extroversion'].push(newAffectData['Affect']['Personality']['Big Five']['Extroversion']);
    affectData['Affect']['Personality']['Big Five']['Agreeableness'].push(newAffectData['Affect']['Personality']['Big Five']['Agreeableness']);
    affectData['Affect']['Personality']['Big Five']['Neuroticism'].push(newAffectData['Affect']['Personality']['Big Five']['Neuroticism']);

    // push new satisfaction data to affect data
    if (affectData['Affect']['Satisfaction'].length > 14) {
        affectData['Affect']['Satisfaction'].shift();
    }
    affectData['Affect']['Satisfaction'].push(newAffectData['Affect']['Satisfaction']);
}

function pushNewPadScore(newPadScore, padFeature) {
    if (padFeature === 'Personality') {
        if (affectData['Affect'][padFeature]['PAD']['Pleasure'].length > 14) {
            affectData['Affect'][padFeature]['PAD']['Pleasure'].shift();
            affectData['Affect'][padFeature]['PAD']['Arousal'].shift();
            affectData['Affect'][padFeature]['PAD']['Dominance'].shift();
        }

        affectData['Affect'][padFeature]['PAD']['Pleasure'].push(newPadScore['Pleasure']);
        affectData['Affect'][padFeature]['PAD']['Arousal'].push(newPadScore['Arousal']);
        affectData['Affect'][padFeature]['PAD']['Dominance'].push(newPadScore['Dominance']);
    } else {
        if (affectData['Affect'][padFeature]['Pleasure'].length > 14) {
            affectData['Affect'][padFeature]['Pleasure'].shift();
            affectData['Affect'][padFeature]['Arousal'].shift();
            affectData['Affect'][padFeature]['Dominance'].shift();
        }

        affectData['Affect'][padFeature]['Pleasure'].push(newPadScore['Pleasure']);
        affectData['Affect'][padFeature]['Arousal'].push(newPadScore['Arousal']);
        affectData['Affect'][padFeature]['Dominance'].push(newPadScore['Dominance']);
    }
}

function pushNewDescription(newDescription, feature) {
    if (affectData['Affect'][feature]['Description'].length > 14) {
        affectData['Affect'][feature]['Description'].shift();
    }
    affectData['Affect'][feature]['Description'].push(newDescription);
}

function user2Data(user) {
    let emotion = user.affect.emotion;
    let mood = user.affect.mood;
    let personality = user.affect.personality;
    let satisfaction = user.affect.satisfaction;
    return {
        "Affect": {
            "Emotion": {
                "Description": emotion.emotionName,
                "Pleasure": emotion.pad.pleasure,
                "Arousal": emotion.pad.arousal,
                "Dominance": emotion.pad.dominance
            },
            "Mood": {
                "Description": mood.moodName,
                "Pleasure": mood.pad.pleasure,
                "Arousal": mood.pad.arousal,
                "Dominance": mood.pad.dominance
            },
            "Personality": {
                "PAD": {
                    "Pleasure": personality.pad.pleasure,
                    "Arousal": personality.pad.arousal,
                    "Dominance": personality.pad.dominance
                },
                "Big Five": {
                    "Openness": personality.bigFive.openness,
                    "Conscientiousness": personality.bigFive.conscientiousness,
                    "Extroversion": personality.bigFive.extroversion,
                    "Agreeableness": personality.bigFive.agreeableness,
                    "Neuroticism": personality.bigFive.neuroticism
                }
            },
            "Satisfaction": satisfaction.score
        }
    };
}