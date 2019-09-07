//====================================================
//                Breadcrumb chart
//====================================================
var polygonShape = {w: 116, h: 30, s: 3, t: 7};

/**
 * Initializes the bread-crumb chart.
 */
function initBreadCrumb() {
    d3.select("#affect-breadcrumb-chart")
        .append("svg:svg")
        .attr("width", 500)
        .attr("height", 50)
        .attr("class", "trail")
}

/**
 * Draws the bread-crumb chart for the given path data.
 * @param data Data of the path from the most grand parent node to the leaf node on which mouse is hovered.
 */
function drawBreadCrumbChart(data) {
    /**
     * Calculates a brightness score for an RGB color, which helps us decide about text color on top of that RGB color.
     * @param color Given color for which brighness score is calculated.
     * @returns {number} An brightness score.
     */
    function getColor(color) {
        return 0.299 * color.r + 0.587 * color.g + 0.114 * color.b
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

    var c = d3.select("#affect-breadcrumb-chart .trail")
        .selectAll("g")
        .data(data, (a) => { return a.key + a.depth });

    // create the bread-crumb polygon for given node data
    var d = c.enter().append("svg:g");
    d.append("svg:polygon")
        .attr("points", getPolygonPoints)
        .style("fill", (a) => { return a._color });

    // write text in polygon
    d.append("svg:text")
        .attr("x", polygonShape.w / 2 + 2)
        .attr("y", polygonShape.h / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .attr("class", "breadcumb-text")
        .style("fill", (a) => { return getColor(d3.rgb(a._color)) < 150 ? "#fff" : "#000" })
        .text((a) => { return a.key });

    // position the polygon to the right place
    c.attr("transform", (a, b) => { return "translate(" + b * (polygonShape.w + polygonShape.s) + ", 0)" });
    c.exit().remove();

    // show the polygon
    d3.select(".trail").style("visibility", "");
}