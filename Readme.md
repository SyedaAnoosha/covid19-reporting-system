# COVID-19 Data Reporting System

## Overview

The COVID-19 Data Reporting System is a web-based platform designed to analyze and visualize COVID-19 data specific to Pakistan. It provides users with an interactive interface to explore case statistics, geographic distribution, and trends over time. The system consists of a Node.js back-end with a MySQL database, a front-end built with HTML, CSS, and JavaScript, and a data analysis component for preprocessing raw data.

This project was developed to deliver:
- A fully functional web-based reporting platform.
- A well-documented codebase with structured modules.

---

## Features
- **Dashboard (index.html)**: Displays a summary table by province, a line chart of cases/deaths/recoveries over time, a bar chart of total cases by province, and a geographic map of case distribution.
- **Full Data Page (full-data.html)**: Shows a detailed table of all records with filtering options.
- **Filters**: Filter data by province or date range on both pages.
- **Visualizations**: Built with Chart.js (charts) and Leaflet.js (map).
- **Back-End APIs**: RESTful endpoints to fetch all cases, filter by province/date, and summarize data.

---

## Project Structure

The codebase is split into three main directories:

### `data-analysis/`
- **`preprocessing.ipynb`**: Python script for preprocessing raw COVID-19 data (merges datasets, cleans inconsistencies, calculates active cases).
- **`Dataset/`**:
  - `PK COVID-19.csv`: Raw COVID-19 case data (date, cases, deaths, recovered, travel history, province, city).
  - `covid_cases_city_coordinates.csv`: City coordinates data (city, latitude, longitude).
  - `cleaned_covid_data.csv`: Output file with preprocessed, merged data.



### `covid-backend/`
- **Purpose**: Handles data storage, processing, and API services.
- **Files**:
  - `server.js`: Main server file that initializes Express.js and mounts API routes.
  - `routes/api.js`: Defines RESTful API endpoints for data retrieval.
  - `db/database.js`: Configures the MySQL database connection.
  - `load_data.js`: Script to import preprocessed CSV data into MySQL.
  - `cleaned_covid_data.csv`: Preprocessed dataset.
  - `.env`: Environment variables for database credentials.

### `covid-frontend/`
- **Purpose**: Provides the user interface and visualizations.
- **Files**:
  - `index.html`: Dashboard page with summary table and visualizations.
  - `full-data.html`: Full Data page with detailed table.
  - `css/styles.css`: Stylesheet for a modern, responsive design.
  - `js/script.js`: JavaScript logic for fetching data and rendering UI elements.

## Prerequisites

To run this system locally, you’ll need:
- **Node.js** (v14.x or later): For the back-end server.
- **MySQL** (v8.x or later): For the database.
- **Python** (v3.x): For data preprocessing (Step 1).
- A web browser (e.g., Chrome, Firefox).
