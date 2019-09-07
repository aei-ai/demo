//====================================================
//              Initialize charts
//====================================================

// initialize data
data = initData();

// initialize bread-crumb chart
initBreadCrumb();

// initialize the sunburst chart
sunburstChart.refreshChart();

// initialize the cartesian chart
cartesianChart.refreshChart(data);

// initialize the scatter chart
scatterChart.refreshChart();