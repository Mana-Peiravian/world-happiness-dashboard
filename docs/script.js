// Load CSV files and initialize dashboard
const csvFiles = [
    'data/2015.csv',
    'data/2016.csv',
    'data/2017.csv',
    'data/2018.csv',
    'data/2019.csv'
];
let allData = [];
let selectedYear = 2019;
let selectedCountry = null;
let selectedCountries = []; // For multi-line chart dropdown

// Load and parse CSVs
async function loadData() {
    for (const file of csvFiles) {
        const response = await fetch(file);
        const text = await response.text();
        const parsed = Papa.parse(text, { header: true, skipEmptyLines: true }).data;
        // Add year from filename (assumes format 201X.csv)
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
    // Populate country dropdown
    const uniqueCountries = [...new Set(allData.map(d => d['Country or region']))];
    const countrySelect = document.getElementById('countrySelect');
    uniqueCountries.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        countrySelect.appendChild(option);
    });

    updatePlots(selectedYear, selectedCountry, selectedCountries);

    // Year slider
    const yearSlider = document.getElementById('yearSlider');
    const yearValue = document.getElementById('yearValue');
    yearSlider.addEventListener('input', () => {
        selectedYear = parseInt(yearSlider.value);
        yearValue.textContent = selectedYear;
        updatePlots(selectedYear, selectedCountry, selectedCountries);
    });

    // Country search
    const countrySearch = document.getElementById('countrySearch');
    countrySearch.addEventListener('input', () => {
        selectedCountry = countrySearch.value.trim();
        updatePlots(selectedYear, selectedCountry, selectedCountries);
    });

    // Country dropdown for line chart
    countrySelect.addEventListener('change', () => {
        const selectedOptions = Array.from(countrySelect.selectedOptions).map(opt => opt.value);
        selectedCountries = selectedOptions.slice(0, 5); // Limit to 5 countries
        updatePlots(selectedYear, selectedCountry, selectedCountries);
    });

    // Dark mode toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    darkModeToggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode');
    });
}

// Update all plots based on year, search country, and selected countries
function updatePlots(year, country, countries) {
    const filteredData = allData.filter(d => d.Year === year);
    const displayData = country ? filteredData.filter(d => d['Country or region'].toLowerCase().includes(country.toLowerCase())) : filteredData;

    plotChoropleth(filteredData);
    plotStackedBarChart(filteredData);
    plotBubbleChart(displayData);
    plotMultiLineChart(countries);
}

// Choropleth Map 
function plotChoropleth(data) {
    const trace = {
        type: 'choropleth',
        locations: data.map(d => d['Country or region']),
        locationmode: 'country names',
        z: data.map(d => parseFloat(d['Happiness Score'])),
        text: data.map(d => `${d['Country or region']}<br>Score: ${d['Happiness Score']}`),
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

// Stacked Bar Chart (Top 10 with factor contributions)
function plotStackedBarChart(data) {
    const sorted = data.sort((a, b) => parseFloat(b['Happiness Score']) - parseFloat(a['Happiness Score'])).slice(0, 10);
    const factors = ['Economy (GDP per Capita)', 'Health (Life Expectancy)', 'Freedom', 'Generosity'];
    const traces = factors.map((factor, i) => ({
        x: sorted.map(d => d['Country or region']),
        y: sorted.map(d => parseFloat(d[factor])),
        name: factor,
        type: 'bar',
        marker: { color: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728'][i] },
        text: sorted.map(d => parseFloat(d[factor]).toFixed(2)),
        textposition: 'none',
        hoverinfo: 'text',
        hovertext: sorted.map(d => `${d['Country or region']}<br>${factor}: ${parseFloat(d[factor]).toFixed(2)}`)
    }));
    const layout = {
        title: { text: `Top 10 Countries: Factor Contributions in ${selectedYear}`, x: 0.5 },
        yaxis: { title: 'Contribution to Happiness' },
        barmode: 'stack',
        height: 400,
        legend: { x: 1, xanchor: 'right', y: 1 },
        hovermode: 'closest'
    };
    Plotly.newPlot('barChart', traces, layout);
}

// Bubble Chart with Regression Line
function plotBubbleChart(data) {
    // Calculate regression line
    const x = data.map(d => parseFloat(d['Economy (GDP per Capita)']));
    const y = data.map(d => parseFloat(d['Happiness Score']));
    const n = x.length;
    const meanX = x.reduce((a, b) => a + b, 0) / n;
    const meanY = y.reduce((a, b) => a + b, 0) / n;
    let num = 0, denom = 0;
    for (let i = 0; i < n; i++) {
        num += (x[i] - meanX) * (y[i] - meanY);
        denom += (x[i] - meanX) ** 2;
    }
    const slope = num / denom;
    const intercept = meanY - slope * meanX;
    const xMin = Math.min(...x), xMax = Math.max(...x);
    const regressionY = [slope * xMin + intercept, slope * xMax + intercept];

    const traceBubble = {
        x: x,
        y: y,
        mode: 'markers',
        type: 'scatter',
        text: data.map(d => `${d['Country or region']}<br>Score: ${d['Happiness Score']}<br>GDP: ${d['Economy (GDP per Capita)']}<br>Health: ${d['Health (Life Expectancy)']}<br>Freedom: ${d['Freedom']}`),
        marker: {
            size: data.map(d => parseFloat(d['Health (Life Expectancy)']) * 30),
            color: data.map(d => parseFloat(d['Freedom'])),
            colorscale: 'Portland',
            showscale: true,
            colorbar: { title: 'Freedom' },
            opacity: 0.7
        }
    };
    const traceRegression = {
        x: [xMin, xMax],
        y: regressionY,
        mode: 'lines',
        name: 'Trend Line',
        line: { color: '#d62728', dash: 'dash' }
    };
    const layout = {
        title: { text: `Happiness vs. GDP in ${selectedYear}`, x: 0.5 },
        xaxis: { title: 'GDP per Capita' },
        yaxis: { title: 'Happiness Score' },
        legend: {
            orientation: "h",
            y: -0.2   // 👈 pushes legend below chart
        },
        height: 400,
        hovermode: 'closest'
    };
    Plotly.newPlot('scatterPlot', [traceBubble, traceRegression], layout);
}

// Multi-Line Chart with Annotations
function plotMultiLineChart(countries) {
    const years = [2015, 2016, 2017, 2018, 2019];
    const traces = [];
    const colors = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd'];

    if (countries.length > 0) {
        countries.forEach((country, i) => {
            const countryData = allData.filter(d => d['Country or region'] === country);
            traces.push({
                x: years,
                y: years.map(y => {
                    const row = countryData.find(d => d.Year === y);
                    return row ? parseFloat(row['Happiness Score']) : null;
                }),
                mode: 'lines+markers',
                name: country,
                line: { color: colors[i % colors.length] },
                marker: { size: 8 }
            });
        });
    } else {
        // Global average as fallback
        traces.push({
            x: years,
            y: years.map(y => {
                const yearData = allData.filter(d => d.Year === y);
                const avg = yearData.reduce((sum, d) => sum + parseFloat(d['Happiness Score']), 0) / yearData.length;
                return avg;
            }),
            mode: 'lines+markers',
            name: 'Global Average',
            line: { color: '#ff7f0e' },
            marker: { size: 8 }
        });
    }

    // Add annotation for a notable event (e.g., 2018 dip)
    const annotations = [
        {
            x: 2018,
            y: traces[0]?.y?.[3] || 5.5, // Adjust based on data or fallback
            xref: 'x',
            yref: 'y',
            text: 'Global economic shifts',
            showarrow: true,
            arrowhead: 2,
            ax: 20,
            ay: -30
        }
    ];

    const layout = {
        title: { text: countries.length > 0 ? 'Happiness Trends for Selected Countries' : 'Global Happiness Trend', x: 0.5 },
        xaxis: { title: 'Year', tickmode: 'array', tickvals: years },
        yaxis: { title: 'Happiness Score' },
        height: 400,
        legend: { x: 1, xanchor: 'right', y: 1 },
        annotations: annotations,
        hovermode: 'closest'
    };
    Plotly.newPlot('lineChart', traces, layout);
}

// Start loading data
loadData();