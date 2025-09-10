// Include PapaParse for CSV file parsing (loaded via CDN)
const Papa = window.Papa;

// Set up the CSV data URLs (replace with actual URLs when deploying)
const files = [
  "../data/2015.csv",
  "../data/2016.csv",
  "../data/2017.csv",
  "../data/2018.csv",
  "../data/2019.csv"
];

// Placeholder data to use when CSV is loaded
let data = [];

// Fetch and parse CSV files using PapaParse (from the CDN)
files.forEach(file => {
  Papa.parse(file, {
    download: true,  // Download the CSV file
    header: true,    // Treat the first row as headers
    dynamicTyping: true,  // Automatically convert numbers
    complete: function(results) {
      data.push(results.data);
      // Once all files are parsed, call the function to render the dashboard
      if (data.length === files.length) {
        renderDashboard();
      }
    }
  });
});

// Function to render the charts after data is loaded
function renderDashboard() {
  // Data for global happiness trend over the years (using the 2015 dataset as an example)
  const years = data[0].map(row => row.Year);
  const happinessScores = data[0].map(row => row['Happiness Score']);

  // Line chart: Global happiness trend
  const lineChartData = {
    x: years,
    y: happinessScores,
    type: 'scatter',
    mode: 'lines+markers',
    line: {color: 'blue'}
  };
  Plotly.newPlot('lineChart', [lineChartData], {
    title: 'Global Happiness Over Time',
    xaxis: { title: 'Year' },
    yaxis: { title: 'Happiness Score' }
  });

  // Scatter plot: GDP per Capita vs Happiness (using 2019 data)
  const gdp2019 = data[4].map(row => row['GDP per capita']);
  const happiness2019 = data[4].map(row => row['Happiness Score']);
  const scatterPlotData = {
    x: gdp2019,
    y: happiness2019,
    mode: 'markers',
    type: 'scatter'
  };
  Plotly.newPlot('scatterPlot', [scatterPlotData], {
    title: 'GDP per Capita vs Happiness Score (2019)',
    xaxis: { title: 'GDP per Capita' },
    yaxis: { title: 'Happiness Score' }
  });

  // Bar chart: Top 5 happiest countries (2019 data)
  const topCountries = data[4]
    .sort((a, b) => b['Happiness Score'] - a['Happiness Score'])
    .slice(0, 5); // Top 5 happiest countries

  const barChartData = {
    x: topCountries.map(row => row.Country),
    y: topCountries.map(row => row['Happiness Score']),
    type: 'bar'
  };
  Plotly.newPlot('barChart', [barChartData], {
    title: 'Top 5 Happiest Countries (2019)',
    xaxis: { title: 'Country' },
    yaxis: { title: 'Happiness Score' }
  });
}
