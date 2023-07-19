const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.encryption_key);
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./masterDB.db');
const jwt = require('jsonwebtoken');
const { v4 : uuidv4 } = require('uuid');


const userLoginController = {
  register: (req, res) => {
  // Extract data from the request body
  const { first_name, last_name, username, email, password, repassword, role_id } = req.body;

  // Check if any required fields are missing
  if (!first_name || !last_name || !username || !email || !password || !repassword) {
    res.status(400).send("Missing required fields"); // Send error status 400
    return;
  } else if (password !== repassword) {
    res.status(422).send("Passwords do not match"); // Send error status 422
    return;
  } else {
    // Encrypt the password
    const encryptedString = cryptr.encrypt(password);

    // Check if role_id is provided
    let roleId = role_id;
    if (!roleId) {
      roleId = 'user'; // Assign the default role ID for regular users
    }

    // Insert user data into the 'registration' table
    db.run(
      `INSERT INTO registration (id, first_name, last_name, username, email, password, role_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [uuidv4(), first_name, last_name, username, email, encryptedString, roleId],
      function (err) {
        if (err) {
          if (err.errno === 19 && err.code === 'SQLITE_CONSTRAINT') {
            // Unique constraint violation
            if (err.message.includes('username')) {
              res.status(409).render('error', { message: "Username already exists" }); // Render error view with error message
            } else if (err.message.includes('email')) {
              res.status(409).render('error', { message: "Email already exists" }); // Render error view with error message
            } else {
              res.status(500).render('error', { message: "Error occurred" }); // Render error view with error message
            }
          } else {
            res.status(500).render('error', { message: "Error occurred" }); // Render error view with error message
          }
        } else {
          res.redirect('/login');
        }
      }
    );
  }
},

login: (req, res) => {
  try {
    const { username, password } = req.body;
    const encryptedString = cryptr.encrypt(password);

    // Find the user in the 'registration' table based on the provided username
    db.get(
      `SELECT * FROM registration WHERE username = ?`,
      [username],
      (err, row) => {
        if (err) {
          res.status(500).send("Error occurred"); // Send error status 500
        } else if (!row) {
          const error = "Invalid username or password";
          res.render('login', { error }); // Render login view with error message
        } else {
          // Decrypt the stored password and compare with the provided password
          const decryptedPassword = cryptr.decrypt(row.password);
          if (decryptedPassword == password) {
            // Generate a token with the user's information
            var token = jwt.sign({ id: row.id }, process.env.JWT_SECRET, { expiresIn: '2h' });
            res.cookie('authorization', token, { httpOnly: false });
            res.redirect('/');
          } else {
            const error = "Invalid username or password";
            res.render('login', { error }); // Render login view with error message
          }
        }
      }
    );
  } catch (error) {
    res.status(500).send("An error occurred"); // Send error status 500
  }
  },
  profile: (req, res) => {
    const id = req.user.id;
    const { first_name, last_name, username, email, password } = req.body;
    const encryptedString = cryptr.encrypt(password);
    // You can add validation checks here if needed

    // Update the user's profile in the database
    db.run(
      `UPDATE registration
      SET first_name = ?, last_name = ?, username = ?, email = ?, password = ?
      WHERE id = ?`,
      [first_name, last_name, username, email, encryptedString, id],
      function (err) {
        if (err) {
          console.error(err);
          res.status(500).send("An error occurred while updating the profile");
        } else {
          res.redirect('/'); // Redirect to the profile page after successful update
        }
      }
    );
  }
};
module.exports = userLoginController;
