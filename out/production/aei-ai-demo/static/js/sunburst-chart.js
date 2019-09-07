
//====================================================
//                Utility functions
//====================================================
/**
 * Initializes the data to generate the charts.
 */
function initData() {
    return {
        _scores: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        _description: null,
        children: null,
        value: 0,
        key: "",
        depth: 1
    };
}

/**
 * Updates affect data with new user affect data.
 * @param newAffectData New user affect data.
 */
function updateData(newAffectData) {

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

    function pushNewBigFiveScore(newBigFiveScore) {
        if (affectData['Affect']['Personality']['Big Five']['Openness'].length > 14) {
            affectData['Affect']['Personality']['Big Five']['Openness'].shift();
            affectData['Affect']['Personality']['Big Five']['Conscientiousness'].shift();
            affectData['Affect']['Personality']['Big Five']['Extroversion'].shift();
            affectData['Affect']['Personality']['Big Five']['Agreeableness'].shift();
            affectData['Affect']['Personality']['Big Five']['Neuroticism'].shift();
        }
        affectData['Affect']['Personality']['Big Five']['Openness'].push(newBigFiveScore['Openness']);
        affectData['Affect']['Personality']['Big Five']['Conscientiousness'].push(newBigFiveScore['Conscientiousness']);
        affectData['Affect']['Personality']['Big Five']['Extroversion'].push(newBigFiveScore['Extroversion']);
        affectData['Affect']['Personality']['Big Five']['Agreeableness'].push(newBigFiveScore['Agreeableness']);
        affectData['Affect']['Personality']['Big Five']['Neuroticism'].push(newBigFiveScore['Neuroticism']);
    }

    function pushNewSatisfaction(newSatisfaction) {
        if (affectData['Affect']['Satisfaction'].length > 14) {
            affectData['Affect']['Satisfaction'].shift();
        }
        affectData['Affect']['Satisfaction'].push(newSatisfaction);
    }

    // push new PAD data to affect data
    pushNewPadScore(newAffectData['Affect']['Emotion'], 'Emotion');
    pushNewPadScore(newAffectData['Affect']['Mood'], 'Mood');
    pushNewPadScore(newAffectData['Affect']['Personality']['PAD'], 'Personality');

    // push new emotion and mood names
    pushNewDescription(newAffectData['Affect']['Emotion']['Description'], 'Emotion');
    pushNewDescription(newAffectData['Affect']['Mood']['Description'], 'Mood');

    // push new big five data to affect data
    pushNewBigFiveScore(newAffectData['Affect']['Personality']['Big Five']);

    // push new satisfaction data to affect data
    pushNewSatisfaction(newAffectData['Affect']['Satisfaction']);
}

/**
 * Converts user data to a dictionary including the affect data.
 * @param user User data.
 * @return A dictionary including the affect data to be visualized.
 */
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

/**
 * Gets the path from center to the node on which mouse is hovered.
 * @param data Data of the node on which mouse is hovered.
 * @returns {Array} Path from center to the node on which mouse is hovered.
 */
function getPath(data) {
    for (var path = [], node = data; node.parent;) {
        path.unshift(node);
        node = node.parent;
    }
    return path
}

//====================================================
//                 Sunburst chart
//====================================================
var colorAlternative = 0;

var sunburstChart = function(d3) {
    /**
     * Gets an RGB color based on the node'd value and depth.
     * @param node Target node.
     * @returns {*} RGB color based on the node'd value and depth.
     */
    function getRgbColor(node) {
        var c = ["#93648D", "#FFC65D", "#7BC8A4", "#4CC3D9", "#404040"];
        var d = [-.1, -.05, 0];

        if (node.depth === 1) {
            var e = c[colorAlternative % 5];
            colorAlternative++;
            return e;
        }

        if (node.depth > 1) {
            var f = d[Math.round(100.0 * Math.abs(node.value) % 3)];
            return d3.rgb(node.parent._color).brighter(.2 * node.depth + f * node.depth);
        }
    }

    // create sunburst chart
    var sunburstChart = {};
    var width = 800;
    var height = 600;
    var rad = 1.3 * Math.min(width, height) / Math.PI;
    var rgbColor = getRgbColor;

    // scores of the sunburst chart
    var scoreData = d3
        .layout
        .partition()
        .sort(null)
        .size([2 * Math.PI, rad])
        .children((a) => {
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
        .value((a) => { return Math.abs(a.value) });

    // the arc to be used for each data node
    var arc = d3
        .svg
        .arc()
        .startAngle((a) => { return a.x })
        .endAngle((a) => { return a.x + a.dx - 0.01 / (a.depth + 0.5) })
        .innerRadius((a) => { return rad / Math.PI * a.depth})
        .outerRadius((a) => { return rad / Math.PI * (a.depth + 1)});

    // the sunburst chart
    var sunburst = d3
        .select(".affect-sunburst-chart")
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

    /**
     * Displays the created sunburst chart.
     */
    function drawChart() {
        var path = sunburst
            .data(d3.entries(affectData))
            .selectAll("g")
            .data(scoreData)
            .enter()
            .append("svg:g")
            .attr("display", (a) => { return a.depth ? null : "none" });

        // create an arc for each data node
        path.append("svg:path")
            .attr("d", arc)
            .attr("stroke", "#fff")
            .attr("fill", (a) => {
                a._color = rgbColor(a);
                return a._color
            })
            .attr("fill-rule", "evenodd").attr("display", (a) => { return a.children ? null : "none" })
            .on("mouseover", mouseover);

        // write text in sunburst chart nodes
        path.append("svg:text")
            .attr("transform", (a) => {
                var r = 180 * ((a.x + a.dx / 2 - Math.PI / 2) / Math.PI);
                return "rotate(" + r + ")"
            })
            .attr("x", (a) => { return rad / Math.PI * a.depth})
            .attr("dx", "6").attr("dy", ".1em").text((a) => { return a.key })
            .attr("display", (a) => { return a.children ? null : "none" })
            .on("mouseover", mouseover);

        // setup mouse-leave event for sunburst chart
        d3.select(".affect-sunburst-chart")
            .on("mouseleave", mouseleave);
    }

    /**
     * Refreshes (re-draws) the chart.
     */
    function refreshChart() {
        drawChart()
    }

    /**
     * Returns the sunburst chart.
     */
    function getChart() {
        return sunburst;
    }

    // refresh the sunburst chart and return it
    sunburstChart.refreshChart = refreshChart;
    sunburstChart.getChart = getChart;
    return sunburstChart;
}(d3);

//====================================================
//            Mouse action functions
//====================================================

/**
 * Defines action at mouse-over event.
 * @param data Data of affect node on which mouse is hovered.
 */
function mouseover(data) {
    // refresh the Cartesian chart
    cartesianChart.refreshChart(data);
    // get the path to draw for bread-crumb chart
    var path = getPath(data);
    // Value of the last node in path
    var score = data._scores.length > 0 ? (data._scores[data._scores.length - 1]).toPrecision(2) : null;
    // draw the bread-crumb chart
    drawBreadCrumbChart(path);
    // reduce the opacity of the whole sunburst chart
    d3.selectAll(".affect-sunburst-chart path").style("opacity", 0.3);
    // increase opacity of the nodes in the path to 1
    sunburstChart.getChart().selectAll("path").filter(function (a) { return path.indexOf(a) >= 0 }).style("opacity", 1);
    // show the descriptions in the middle of sunburst chart
    var description =  data._description;
    if (data.key === "Emotion" || data.key === "Mood") {
        let desc = affectData["Affect"][data.key]["Description"];
        let len = desc.length;
        description = desc[len - 1].toLowerCase();
        description = description.charAt(0).toUpperCase() + description.slice(1);
    }
    d3.select(".description").style("visibility", "").text(description);
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