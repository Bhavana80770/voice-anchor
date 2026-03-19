const express = require('express');
const cors = require('cors');
require('dotenv').config();

const generateRoute = require('./routes/generate');
const speakRoute = require('./routes/speak');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/generate', generateRoute);
app.use('/api/speak', speakRoute);

app.listen(5000, () => {
  console.log('Server running on port 5000');
});