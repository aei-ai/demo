//====================================================
//              Initialize charts
//====================================================

// initialize bread-crumb chart
initBreadCrumb();

// initialize the sunburst chart
sunburstChart.refreshChart();

// initialize the cartesian chart
data = initData(); // initial data
cartesianChart.refreshChart(data);

// initialize the scatter chart
scatterChart.refreshChart();