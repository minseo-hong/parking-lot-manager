const fs = require('fs');
const path = require('path');

const express = require('express');

const carData = require('../data/cars.json');
const parkingData = require('../data/parkings.json');

const router = express.Router();

const parkingDataFilePath = path.join(__dirname, '..', 'data', 'parkings.json');

router.get('/overview', (req, res) => {
  fs.promises.readFile(parkingDataFilePath)
  .then((result) => {
    const parkings = JSON.parse(result);
    res.render('pages/parking/overview', { parkings, searchInput: null, menuActive: 'parking-overview' });
  })
  .catch((err) => {
    console.log(err);
  });
});

router.get('/:parkingName/add-car', (req, res) => {
  const parkingName = req.params.parkingName;

  res.render('pages/parking/add-car-form', { cars: carData, parkingName, menuActive: 'parking-overview' });
});

router.post('/add-car', (req, res) => {
  const { parkingName, carNum } = req.body;
  const foundIndex = parkingData.findIndex(parking => parking.name === parkingName);

  if (carNum === "select-your-car") {
    return res.redirect(`/parking/${parkingName}/add-car`);
  }

  parkingData[foundIndex].car = carNum;

  fs.promises.writeFile(parkingDataFilePath, JSON.stringify(parkingData, null, 2))
  .then(() => {
    res.redirect('/parking/overview');
  })
  .catch((err) => {
    console.log(err);
    return res.status(500).send('Error updating parking data file');
  });
});

router.post('/remove-car', (req, res) => {
  const { parkingName } = req.body;
  const foundIndex = parkingData.findIndex(parking => parking.name === parkingName);

  parkingData[foundIndex].car = null;

  fs.promises.writeFile(parkingDataFilePath, JSON.stringify(parkingData, null, 2))
  .then(() => {
    res.redirect('/parking/overview');
  })
  .catch(() => {
    console.log(err);
    return res.status(500).send('Error updating parking data file');
  });
});

module.exports = router;
