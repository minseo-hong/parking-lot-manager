const fs = require('fs');
const path = require('path');

const express = require('express');

const BinarySearchTree = require('../lib/binarySearchTree');
let carData = require('../data/cars.json');
const parkingData = require('../data/parkings.json');

const carTree = new BinarySearchTree();

carData.forEach((car) => {
  carTree.insert(car.carNum, car);
});

const router = express.Router();

const carDataFilePath = path.join(__dirname, '..', 'data', 'cars.json');
const parkingDataFilePath = path.join(__dirname, '..', 'data', 'parkings.json');

router.get('/overview', (req, res) => {
  fs.promises.readFile(carDataFilePath)
  .then((result) => {
    const cars = JSON.parse(result);
    res.render('pages/cars/overview', { cars, searchInput: null, menuActive: 'all-cars' });
  })
  .catch((err) => {
    console.log(err);
    res.status(500).send('Error reading car data file');
  });
});

router.get('/detail/:carNum', (req, res) => {
  const { carNum } = req.params;
  const car = carTree.search(carNum);

  res.render('pages/cars/detail', { car, searchInput: null, menuActive: 'all-cars' });
});

router.get('/search-result', (req, res) => {
  const { carNum } = req.query;
  const car = carTree.search(carNum);

  res.render('pages/cars/search-result', { car, searchInput: carNum, menuActive: 'all-cars' });
});

router.get('/add-car', (req, res) => {
  res.render('pages/cars/add-form', { searchInput: null, menuActive: 'all-cars' }); 
});

router.post('/add-car', (req, res) => {
  const { owner, model, carNum } = req.body;
  const newCar = { carNum, owner, model };
  const sortedCarData = [];

  carTree.insert(carNum, newCar);
  carTree.inOrderTraversal(carTree.root, (carNum, car) => {
    sortedCarData.push({ carNum, owner: car.owner, model: car.model });
  });
  carData = sortedCarData;

  fs.promises.writeFile(carDataFilePath, JSON.stringify(carData, null, 2))
  .then(() => {
    res.redirect('/cars/overview');
  })
  .catch((err) => {
    console.log(err);
    res.status(500).send('Error updating car data file');
  });
});

router.post('/delete-car', (req, res) => {
  const { carNum } = req.body;
  const sortedCarData = [];
  
  carTree.remove(carNum);
  carTree.inOrderTraversal(carTree.root, (carNum, car) => {
    sortedCarData.push({ carNum, owner: car.owner, model: car.model });
  });
  carData = sortedCarData;
  
  fs.promises.writeFile(carDataFilePath, JSON.stringify(carData, null, 2))
  .then(() => {
    for (let i = 0; i < parkingData.length; i++) {
      if (parkingData[i].car === carNum) {
        parkingData[i].car = null;
      }
    }

    return fs.writeFileSync(parkingDataFilePath, JSON.stringify(parkingData, null, 2));
  })
  .then(() => {
    res.redirect('/cars/overview');
  })
  .catch((err) => {
    console.log(err);
    return res.status(500).send('Error updating car or parking data file');
  });
});

module.exports = router;