// 'use strict';

// Imports dependencies and set up http server
const
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express(); // creates express http server

app.use(express.json());

const PORT = process.env.PORT || 1337;

app.use('/api/webhook', require('./routes/webhook.route'))

// Sets server port and logs message on success
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));

