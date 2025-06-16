const express = require('express')
const { registerController, loginController } = require('../controller/user.controller')
const router = express.Router()
const passport = require('passport');


router.post('/auth/register', registerController)
router.post('/auth/login', loginController)

router.get('/auth/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.send("This Route is protected")
})

module.exports = router