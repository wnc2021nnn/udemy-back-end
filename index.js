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

require('./handlers/listeners/event-listener')

app.use('/api/webhook', require('./routes/webhook.route'))

// API
// Category route
app.use('/api/categories', require('./routes/category.route'));
// Course route
app.use('/api/courses', require('./routes/course.route'));
// Topic route
app.use('/api/topics', require('./routes/topic.route'));
// Log route
app.use('/api/logs', require('./routes/log.route'));

// Sets server port and logs message on success
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));

