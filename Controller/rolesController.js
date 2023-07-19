const Cryptr = require('cryptr');
const cryptr = new Cryptr(process.env.encryption_key);
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./masterDB.db');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const roleController = {
    users: (req, res) => {
        db.all(`SELECT * FROM REGISTRATION`, (err, data) => {
            if (err) {
                return res.status(500).send("An error occurred while fetching user data");
            } else {
                user = req.user;
                res.render('./Admin/roles', { data, user });
            }
        });
    },

        deleteUser: (req, res) => {
        const id = req.params.id; // Get the user ID from request parameters
        // Your code to delete the user from the database goes here...
        // For example:
        db.run('DELETE FROM registration WHERE id = ?', [id], (err) => {
            if (err) {
                // Handle error if the deletion fails
                return res.status(500).send("An error occurred while deleting the user");
            }
            // Successful deletion, redirect to the roles page or any other page you prefer
            res.redirect('/admin/roles');
        });
    },
    edituser: (req, res) => {
        let id = req.params.id;
        let user = req.user;
        db.get(`SELECT * from registration where id = ?`, [id], (err, data) => {
            if (err)
            {
                res.send("Error");
            }
            else
            {
               res.render('./Admin/editrole' , {data ,user})
            }
        })
    },
editeduser: (req, res) => {
  const id = req.params.id;
  const { first_name, last_name, username, email, role_id } = req.body;

  db.run(
    `UPDATE registration
    SET first_name = ?, last_name = ?, username = ?, email = ?, role_id = ?
    WHERE id = ?`,
    [first_name, last_name, username, email, role_id, id],
    function (err) {
      if (err) {
        console.error("Error updating user role:", err);
        return res.status(500).send("An error occurred while updating the user role");
      }
      res.redirect('/admin/roles'); // Redirect to the roles page or any other page you prefer
    }
  );
}

}

module.exports = roleController;
