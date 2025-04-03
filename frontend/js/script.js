let trendsChart, provinceChart, map;

if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
  document.addEventListener('DOMContentLoaded', async () => {
    await fetchProvinces();
    fetchData();
    initializeMap();
  });
} else if (window.location.pathname.includes('full-data.html')) {
  document.addEventListener('DOMContentLoaded', async () => {
    await fetchProvinces();
    fetchFullData();
  });
}

async function fetchProvinces() {
  try {
    const response = await fetch('http://localhost:3000/api/summary/province');
    const data = await response.json();
    const provinceSelect = document.getElementById('province');
    data.forEach(item => {
      const option = document.createElement('option');
      option.value = item.province;
      option.textContent = item.province;
      provinceSelect.appendChild(option);
    });
  } catch (err) {
    console.error('Error fetching provinces:', err);
  }
}

// Helper function to format dates
function formatDate(isoDate) {
  const date = new Date(isoDate);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`; // e.g., 02/25/2020
}

// Homepage: Fetch data for summary and visualizations
async function fetchData() {
  const province = document.getElementById('province').value;
  const startDate = document.getElementById('start-date').value;
  const endDate = document.getElementById('end-date').value;

  let url = 'http://localhost:3000/api/cases';
  if (province) {
    url = `http://localhost:3000/api/cases/province/${province}`;
  } else if (startDate && endDate) {
    url = `http://localhost:3000/api/cases/date?start=${startDate}&end=${endDate}`;
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    updateSummaryTable(await fetchSummaryData(province, startDate, endDate));
    updateTrendsChart(data);
    updateProvinceChart();
    updateMap(data);
  } catch (err) {
    console.error('Error fetching data:', err);
  }
}

// Full Data Page: Fetch detailed data
async function fetchFullData() {
  const province = document.getElementById('province').value;
  const startDate = document.getElementById('start-date').value;
  const endDate = document.getElementById('end-date').value;

  let url = 'http://localhost:3000/api/cases';
  if (province) {
    url = `http://localhost:3000/api/cases/province/${province}`;
  } else if (startDate && endDate) {
    url = `http://localhost:3000/api/cases/date?start=${startDate}&end=${endDate}`;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Fetched data for full table:', data); 
    if (data.length === 0) {
      console.warn('No data returned from API');
    }
    updateFullTable(data);
  } catch (err) {
    console.error('Error fetching full data:', err);
  }
}

async function fetchSummaryData(province, startDate, endDate) {
  let url = 'http://localhost:3000/api/summary/province';
  if (province) {
    url = `http://localhost:3000/api/cases/province/${province}`;
  } else if (startDate && endDate) {
    url = `http://localhost:3000/api/cases/date?start=${startDate}&end=${endDate}`;
  }
  
  const response = await fetch(url);
  const data = await response.json();

  if (province || (startDate && endDate)) {
    const summary = {};
    data.forEach(row => {
      if (!summary[row.province]) {
        summary[row.province] = { cases: 0, deaths: 0, recovered: 0, active: 0 };
      }
      summary[row.province].cases += row.cases;
      summary[row.province].deaths += row.deaths;
      summary[row.province].recovered += row.recovered;
      summary[row.province].active += row.active_cases;
    });
    return Object.entries(summary).map(([prov, stats]) => ({
      province: prov,
      total_cases: stats.cases,
      total_deaths: stats.deaths,
      total_recovered: stats.recovered,
      total_active: stats.active
    }));
  }
  return data;
}

function updateSummaryTable(data) {
  const tbody = document.getElementById('summary-table-body');
  tbody.innerHTML = '';

  data.forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${row.province}</td>
      <td>${row.total_cases}</td>
      <td>${row.total_deaths}</td>
      <td>${row.total_recovered}</td>
      <td>${row.total_active}</td>
    `;
    tbody.appendChild(tr);
  });
}

function updateFullTable(data) {
  const tbody = document.getElementById('full-table-body');
  tbody.innerHTML = '';

  if (!data || data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8">No data available</td></tr>';
    return;
  }

  data.forEach(row => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${formatDate(row.date)}</td>
      <td>${row.province}</td>
      <td>${row.city}</td>
      <td>${row.cases}</td>
      <td>${row.deaths}</td>
      <td>${row.recovered}</td>
      <td>${row.active_cases}</td>
      <td>${row.travel_history}</td>
    `;
    tbody.appendChild(tr);
  });
}

function updateTrendsChart(data) {
  const ctx = document.getElementById('trends-chart').getContext('2d');
  if (trendsChart) trendsChart.destroy();

  const dates = [...new Set(data.map(item => formatDate(item.date)))].sort();
  const casesData = dates.map(date => 
    data.filter(item => formatDate(item.date) === date).reduce((sum, item) => sum + item.cases, 0)
  );
  const deathsData = dates.map(date => 
    data.filter(item => formatDate(item.date) === date).reduce((sum, item) => sum + item.deaths, 0)
  );
  const recoveredData = dates.map(date => 
    data.filter(item => formatDate(item.date) === date).reduce((sum, item) => sum + item.recovered, 0)
  );

  trendsChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: dates,
      datasets: [
        { label: 'Cases', data: casesData, borderColor: '#007BFF', fill: false },
        { label: 'Deaths', data: deathsData, borderColor: '#FF5733', fill: false },
        { label: 'Recovered', data: recoveredData, borderColor: '#28A745', fill: false }
      ]
    },
    options: {
      responsive: true,
      scales: {
        x: { title: { display: true, text: 'Date' } },
        y: { title: { display: true, text: 'Count' } }
      }
    }
  });
}

async function updateProvinceChart() {
  const response = await fetch('http://localhost:3000/api/summary/province');
  const data = await response.json();
  
  const ctx = document.getElementById('province-chart').getContext('2d');
  if (provinceChart) provinceChart.destroy();

  const provinces = data.map(item => item.province);
  const cases = data.map(item => item.total_cases);

  provinceChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: provinces,
      datasets: [{
        label: 'Total Cases',
        data: cases,
        backgroundColor: '#007BFF'
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: { title: { display: true, text: 'Province' } },
        y: { title: { display: true, text: 'Total Cases' } }
      }
    }
  });
}

function initializeMap() {
  map = L.map('map').setView([30.3753, 69.3451], 5);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
}

function updateMap(data) {
  map.eachLayer(layer => {
    if (layer instanceof L.Marker) map.removeLayer(layer);
  });

  const cityData = {};
  data.forEach(row => {
    const key = `${row.city}-${row.latitude}-${row.longitude}`;
    if (!cityData[key]) {
      cityData[key] = { cases: 0, lat: row.latitude, lon: row.longitude, city: row.city };
    }
    cityData[key].cases += row.cases;
  });

  Object.values(cityData).forEach(item => {
    if (item.lat !== 0 && item.lon !== 0) {
      L.marker([item.lat, item.lon])
        .addTo(map)
        .bindPopup(`${item.city}: ${item.cases} cases`);
    }
  });
}