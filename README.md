World Happiness Dashboard 🌍😊
Welcome to the World Happiness Dashboard! This interactive web app lets you explore global happiness trends from 2015 to 2019, based on the World Happiness Report. Visualize data with vibrant charts, filter by year or country, and uncover what makes the world smile! 😄
Hosted on GitHub Pages, this project is built with HTML, CSS, JavaScript, Bootstrap, and Plotly.js, making it lightweight and perfect for static hosting. 🚀
Features ✨

🌎 Global Happiness Map: A colorful choropleth map showing Happiness Scores by country, with hover details and year-based animations.
📊 Stacked Bar Chart: See how Economy, Health, Freedom, and Generosity contribute to the top 10 happiest countries’ scores. Toggle factors with the legend!
🟡 Bubble Chart: Explore Happiness vs. GDP, with bubble sizes for Life Expectancy and colors for Freedom, plus a trend line for insights.
📈 Multi-Line Chart: Compare Happiness Score trends for up to 5 countries, with annotations highlighting key events.
🎮 Interactive Controls: Use a year slider, country search, and multi-select dropdown to customize your view.
🌙 Dark Mode: Toggle for a sleek, eye-friendly dark theme.
📱 Responsive Design: Looks great on desktops, tablets, and phones!
---
Data 📅
The dashboard uses data from the World Happiness Report for 2015–2019, stored in CSV files (data/2015.csv to data/2019.csv). Each file includes:

Columns: Country or region, Happiness Score, Economy (GDP per Capita), Health (Life Expectancy), Freedom, Generosity
Source: Publicly available datasets, capturing factors that drive happiness worldwide.
---
Getting Started 🛠️
Prerequisites

A modern web browser (Chrome, Firefox, Safari, etc.)
Git installed to clone the repo
A local server (e.g., Python’s http.server) for testing
---
Installation

Clone the Repository:
git clone https://github.com/Mana-Peiravian/world-happiness-dashboard.git
cd world-happiness-dashboard


Directory Structure:
world-happiness-dashboard/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
├── data/
│   ├── 2015.csv
│   ├── 2016.csv
│   ├── 2017.csv
│   ├── 2018.csv
│   └── 2019.csv


Test Locally:Start a local server to avoid CORS issues with CSV loading:
python -m http.server 8000

Open http://localhost:8000 in your browser to view the dashboard.

---
Deployment on GitHub Pages 🚀

Ensure all files are in the repo’s root or a docs/ folder.
Go to your repo’s Settings > Pages on GitHub.
Set Source to “Deploy from a branch” and select main (or docs if used).
Save and visit https://mana-peiravian.github.io/world-happiness-dashboard/ after a few minutes.
---
Usage 🎉

Year Slider: Slide to switch between 2015–2019 data.
Country Search: Type a country name to filter the bubble and line charts.
Country Dropdown: Select up to 5 countries for trend comparisons in the line chart.
Dark Mode Toggle: Switch to dark mode for a cooler vibe. 😎
Hover & Click: Hover over charts for details; click legends to toggle data.
---
Technologies Used 💻

HTML/CSS/JavaScript: Core web technologies for structure and interactivity.
Bootstrap 5: Responsive and modern UI framework.
Plotly.js: Dynamic and interactive charts.
PapaParse: CSV parsing for data loading.
GitHub Pages: Free static hosting.
---
Contributing 🤝
Want to make this dashboard even happier? Fork the repo, make changes, and submit a pull request! Suggestions for new charts or features are welcome. 😊
License 📜
This project is licensed under the MIT License. Feel free to use and share!
---
Acknowledgments 🙏

World Happiness Report for the awesome data.
Plotly.js for stunning visualizations.
Bootstrap for a sleek UI.

Happy exploring! 🌟
