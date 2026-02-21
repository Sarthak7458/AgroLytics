const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const routes = require('./api/routes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api', routes);

// Health Check
app.get('/', (req, res) => {
    res.send({ status: 'ok', message: 'Farmer Crop Advisor Backend is Running' });
});

module.exports = app;
