const express = require('express');
const bodyParser = require('body-parser');

const indexRouter = require('./routes/index');
const carsRouter = require('./routes/cars');
const parkingRouter = require('./routes/parking');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

const PORT = process.env.PORT || 8080;

app.use('/', indexRouter);
app.use('/cars', carsRouter);
app.use('/parking', parkingRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Please go to http://127.0.0.1:${PORT}`);
});
