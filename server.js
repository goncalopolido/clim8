const express = require('express');
const cors = require('cors');
const path = require('path');
const fetch = require('node-fetch');

const api = require("./routes/api");

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('public'));

app.use("/api", api);

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});