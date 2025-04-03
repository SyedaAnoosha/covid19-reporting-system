const mysql = require('mysql2/promise');
const fs = require('fs');
const csv = require('csv-parser');

require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'root123',
  database: process.env.DB_NAME || 'covid_db'
};

async function loadData() {
  const connection = await mysql.createConnection(dbConfig);
  
  fs.createReadStream('cleaned_covid_data.csv')
    .pipe(csv())
    .on('data', async (row) => {
      const query = `
        INSERT INTO covid_cases (date, cases, deaths, recovered, travel_history, province, city, latitude, longitude, active_cases)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const values = [
        row['Date'],
        parseInt(row['Cases']),
        parseInt(row['Deaths']),
        parseInt(row['Recovered']),
        row['Travel_history'],
        row['Province'],
        row['City'],
        parseFloat(row['Latitude']),
        parseFloat(row['Longitude']),
        parseInt(row['Active Cases'])
      ];
      
      try {
        await connection.execute(query, values);
      } catch (err) {
        console.error('Error inserting row:', err);
      }
    })
    .on('end', () => {
      console.log('Data loaded successfully!');
      connection.end();
    })
    .on('error', (err) => {
      console.error('Error reading CSV:', err);
    });
}

loadData();