const express = require('express');
const cors = require('cors');
const config = require('./src/config/config.js');


const app = express();
const PORT = config.app.port;

app.use(cors({ origin: config.cors.origin }));


app.use(express.json());


app.get('/', (req, res) => {
  res.json({ message: `Welcome to the FarmGrid API! Running in ${config.app.env} mode.` });
});

// TODO: Import and use API routes here


app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});