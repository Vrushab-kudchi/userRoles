var express = require('express');
var router = express.Router();
const userLoginController = require('../Controller/userLoginController');
const authenticateToken =  require('../authentication')

router.post('/register', userLoginController.register);

router.post('/', userLoginController.login);

router.get('/', (req, res) => {
    res.render('login');
})

router.get('/registration', (req, res) => {
    res.render('registration')
})

router.get('/edit', authenticateToken, (req, res) => {
    const user = req.user;
    res.render('profile' ,{user});
})

router.post('/edit' ,authenticateToken , userLoginController.profile);
module.exports = router;
