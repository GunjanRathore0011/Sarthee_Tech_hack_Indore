const express = require('express');
const router = express();
const { sendOTPforSignUp,sendOTPforSignIn,signUp,signin} = require('../controller/Auth');

router.get('/user', (req, res) => {
    // Handle fetching user logic here
    res.send('User data retrieved successfully');
});


router.post('/signup', signUp);
router.post('/signin', signin)

//router for sendotp to user email
router.post('/sendOTPforSignIn', sendOTPforSignIn);
router.post('/sendOTPforSignUp', sendOTPforSignUp);


module.exports = router;