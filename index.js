// 'use strict';
require('dotenv').config();
// Imports dependencies and set up http server
const
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express(); // creates express http server
morgan = require('morgan');
// Import Connect/Express middleware that can be used to enable CORS with various options.
var cors = require('cors')

// Enable AllCORS Request
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const authMdw = require('./middlewares/auth.mdw');

const PORT = process.env.PORT || 5000;

app.get('/', function (req, res) {
  res.json({
    message: 'Hello from WNC 2021 NNN Udemy API, this shit is my test for API chatbot!'
  });
})

require('./handlers/listeners/event-listener')

app.use('/api/webhook', require('./routes/webhook.route'))

// API
app.use('/api/auth', require('./routes/auth.route'));
// Category route
app.use('/api/categories', require('./routes/category.route'));
// Course route
app.use('/api/courses', require('./routes/course.route'));
// Topic route
app.use('/api/topics', require('./routes/topic.route'));
// Log route
app.use('/api/logs', require('./routes/log.route'));

app.use('/api/course-reviews', require('./routes/course-reviews.route'));

app.use('/api/users', require('./routes/user.route'));

app.use('/api/watch-list', authMdw, require('./routes/watch-list.route'));

app.use('/api/purchases', authMdw, require('./routes/purchase.route'));

app.use('/api/lessons', authMdw, require('./routes/lesson.route'));

app.use('/api/chapters', authMdw, require('./routes/chapter.route'));

app.use('/api/dev', require('./middlewares/auth.v2.mdw')(0), require('./routes/dev.route'));
// Sets server port and logs message on success
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));

