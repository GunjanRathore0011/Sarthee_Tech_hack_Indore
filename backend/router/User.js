const express = require('express');
const router = express();
const { sendOTPforSignUp,sendOTPforSignIn,signUp,signin,logout} = require('../controller/Auth');
const { isAuthenticatedUser } = require('../middleware/auth');
const {victimInformation,suspectedInformation,additionalDetails,complaintInformation} = require('../controller/Information');


router.post('/signup', signUp);
router.post('/signin', signin)

//router for sendotp to user email
router.post('/sendOTPforSignIn', sendOTPforSignIn);
router.post('/sendOTPforSignUp', sendOTPforSignUp);
router.get('/logout',isAuthenticatedUser ,logout);

router.post('/additionalDetails', isAuthenticatedUser, additionalDetails)
router.post('/victimInformation', isAuthenticatedUser, victimInformation);
router.post('/suspectedInformation', isAuthenticatedUser, suspectedInformation);
router.post('/complaintInformation', isAuthenticatedUser, complaintInformation);
module.exports = router;