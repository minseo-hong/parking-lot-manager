const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('pages/index/home', { searchInput: null, menuActive: 'home' });
});

module.exports = router;
