const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./masterDB.db');

function authenticateToken(req, res, next) {
  const token = req.cookies.authorization;

  if (!token) {
    return res.redirect('/login'); // Redirect to login page if token is missing
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.redirect('/login'); // Redirect to login page if token is invalid or expired
    }

    // Fetch user data from the database based on the decoded user id
    db.get('SELECT * FROM registration WHERE id = ?', [decoded.id], (err, user) => {
      if (err) {
        return res.status(500).send('An error occurred while fetching user data');
      }

      if (!user) {
        return res.redirect('/login'); // Redirect to login page if user not found in the database
      }

      // Attach the user data to the req.user object
      req.user = user;
      next();
    });
  });
}

module.exports = authenticateToken;
