var express = require('express');
var router = express.Router();
var loginRouter = require('./loginRouter');
var authenticateToken = require('../authentication');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./masterDB.db');

/* GET home page. */

router.get('/', authenticateToken, (req, res) => {

      const user = req.user;
      res.render('home', { user });
    }
);

router.get('/logout', authenticateToken, (req, res) => {

  res.cookie('authorization', '', { expires: new Date(0), httpOnly: true });
  res.redirect('/login');
});

// Mount the login router
router.use('/login', loginRouter);

module.exports = router;
