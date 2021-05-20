// 'use strict';

// Imports dependencies and set up http server
const
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express(); // creates express http server
  morgan = require('morgan');

app.use(express.json());
app.use(morgan('dev'));

const PORT = process.env.PORT || 5000;

app.get('/', function (req, res) {
  res.json({
    message: 'Hello from WNC 2021 NNN Udemy API, this shit is my test for API chatbot!'
  });
})

app.use('/api/webhook', require('./routes/webhook.route'))

// API
// Category route
app.use('/api/category', require('./routes/category.route'));
// Course rout
app.use('/api/course', require('./routes/coures.route'));


// Sets server port and logs message on success
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));

