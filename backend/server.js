const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the COVID-19 Data API');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});