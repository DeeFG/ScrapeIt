// Imports
const express = require('express');
// Initial Config
const app = express();
const port = process.env.PORT || 4000;
// Server
app.listen(port, () => console.log(`Listening on port ${port}`));

const models = require('./models');