var express = require('express');
var router = express.Router();
var rolesController = require('../Controller/rolesController')

/* GET users listing. */
router.get('/roles', rolesController.users);

router.post('/delete/:id', rolesController.deleteUser);

router.get('/edit/:id', rolesController.edituser)

router.post('/edit/:id', rolesController.editeduser)

module.exports = router;
