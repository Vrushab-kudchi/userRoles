function checkAdmin(req, res, next) {
  // Assuming req.user.role contains the user's role (e.g., 'admin' or 'user')
  const role = req.user.role_id;
  if (role !== "admin") {
    // If the user is not an admin, redirect them to the login page or show an error page
    return res.redirect('/login'); // or res.status(403).send('Forbidden');
  }

  // If the user is an admin, proceed to the next middleware or route handler
  next();
}

module.exports = checkAdmin;
