// Load CSV files and initialize dashboard
const csvFiles = [
    'data/data2015.csv',
    'data/data2016.csv',
    'data/data2017.csv',
    'data/data2018.csv',
    'data/data2019.csv'
];
let allData = [];
let selectedYear = 2019;
let selectedCountry = null;

// Load and parse CSVs
async function loadData() {
    for (const file of csvFiles) {
        const response = await fetch(file);
        const text = await response.text();
        const parsed = Papa.parse(text, { header: true, skipEmptyLines: true }).data;
        // Add year from filename (assumes format dataYYYY.csv)
        const year = file.match(/\d{4}/)[0];
        parsed.forEach(row => {
            row.Year = parseInt(year);
            allData.push(row);
        });
    }
    initDashboard();
}

// Initialize plots and event listeners
function initDashboard() {
    updatePlots(selectedYear, selectedCountry);

    // Year slider
    const yearSlider = document.getElementById('yearSlider');
    const yearValue = document.getElementById('yearValue');
    yearSlider.addEventListener('input', () => {
        selectedYear = parseInt(yearSlider.value);
        yearValue.textContent = selectedYear;
        updatePlots(selectedYear, selectedCountry);
    });

    // Country search
    const countrySearch = document.getElementById('countrySearch');
    countrySearch.addEventListener('input', () => {
        selectedCountry = countrySearch.value.trim();
        updatePlots(selectedYear, selectedCountry);
    });

    // Dark mode toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    darkModeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode');
    });
}

// Update all plots based on year and country
function updatePlots(year, country) {
    const filteredData = allData.filter(d => d.Year === year);
    const displayData = country ? filteredData.filter(d => d['Country or region'].toLowerCase().includes(country.toLowerCase())) : filteredData;

    plotChoropleth(filteredData);
    plotBarChart(filteredData);
    plotScatter(displayData);
    plotLineChart(country);
}

// Choropleth Map
function plotChoropleth(data) {
    const trace = {
        type: 'choropleth',
        locations: data.map(d => d.Country),
        locationmode: 'country names',
        z: data.map(d => parseFloat(d['Happiness Score'])),
        text: data.map(d => `${d.Country}<br>Score: ${d['Happiness Score']}`),
        colorscale: 'Viridis',
        autocolorscale: false,
        reversescale: false,
        colorbar: { title: 'Happiness Score' }
    };
    const layout = {
        title: { text: `Happiness Scores in ${selectedYear}`, x: 0.5 },
        geo: { projection: { type: 'mercator' } },
        height: 400
    };
    Plotly.newPlot('choroplethMap', [trace], layout);
}

// Bar Chart (Top 10)
function plotBarChart(data) {
    const sorted = data.sort((a, b) => parseFloat(b['Happiness Score']) - parseFloat(a['Happiness Score'])).slice(0, 10);
    const trace = {
        x: sorted.map(d => d['Country or region']),
        y: sorted.map(d => parseFloat(d['Happiness Score'])),
        type: 'bar',
        text: sorted.map(d => d['Happiness Score']),
        textposition: 'auto',
        marker: { color: '#1f77b4' }
    };
    const layout = {
        title: { text: `Top 10 Happiest Countries in ${selectedYear}`, x: 0.5 },
        yaxis: { title: 'Happiness Score' },
        height: 400
    };
    Plotly.newPlot('barChart', [trace], layout);
}

// Scatter Plot
function plotScatter(data) {
    const trace = {
        x: data.map(d => parseFloat(d['Economy (GDP per Capita)'])),
        y: data.map(d => parseFloat(d['Happiness Score'])),
        mode: 'markers',
        type: 'scatter',
        text: data.map(d => d['Country or region']),
        marker: {
            size: data.map(d => parseFloat(d['Health (Life Expectancy)']) * 20),
            color: '#ff7f0e',
            opacity: 0.6
        }
    };
    const layout = {
        title: { text: `Happiness vs. GDP in ${selectedYear}`, x: 0.5 },
        xaxis: { title: 'GDP per Capita' },
        yaxis: { title: 'Happiness Score' },
        height: 400
    };
    Plotly.newPlot('scatterPlot', [trace], layout);
}

// Line Chart (Trends for selected country)
function plotLineChart(country) {
    const years = [2015, 2016, 2017, 2018, 2019];
    const traces = [];
    if (country) {
        const countryData = allData.filter(d => d['Country or region'].toLowerCase().includes(country.toLowerCase()));
        traces.push({
            x: years,
            y: years.map(y => {
                const row = countryData.find(d => d.Year === y);
                return row ? parseFloat(row['Happiness Score']) : null;
            }),
            mode: 'lines+markers',
            name: country,
            line: { color: '#1f77b4' }
        });
    } else {
        // Global average
        traces.push({
            x: years,
            y: years.map(y => {
                const yearData = allData.filter(d => d.Year === y);
                const avg = yearData.reduce((sum, d) => sum + parseFloat(d['Happiness Score']), 0) / yearData.length;
                return avg;
            }),
            mode: 'lines+markers',
            name: 'Global Average',
            line: { color: '#ff7f0e' }
        });
    }
    const layout = {
        title: { text: country ? `${country} Happiness Trend` : 'Global Happiness Trend', x: 0.5 },
        xaxis: { title: 'Year' },
        yaxis: { title: 'Happiness Score' },
        height: 400
    };
    Plotly.newPlot('lineChart', traces, layout);
}

// Start loading data
loadData();