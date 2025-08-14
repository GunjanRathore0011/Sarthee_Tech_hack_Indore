const express = require('express');
const router = express();
const { sendOTPforSignUp,sendOTPforSignIn,signUp,signin,logout} = require('../controller/Auth');
const { isAuthenticatedUser } = require('../middleware/auth');
const {additionalDetails,complaintInformation} = require('../controller/Information');
const {getComplaintStatus,
    generateComplaintPDF,
    saveFeedback,
    getUser
    } = require('../controller/User');

const {scanText} = require('../controller/scamCheck');


router.post('/signup', signUp);
router.post('/signin', signin)

router.post('/check-scam' , scanText);
//router for sendotp to user email
router.post('/sendOTPforSignIn', sendOTPforSignIn);
router.post('/sendOTPforSignUp', sendOTPforSignUp);
router.get('/logout',isAuthenticatedUser ,logout);

router.post('/additionalDetails', isAuthenticatedUser, additionalDetails)
// router.post('/victimInformation', isAuthenticatedUser, victimInformation);
// router.post('/suspectedInformation', isAuthenticatedUser, suspectedInformation);
router.post('/complaintInformation', isAuthenticatedUser, complaintInformation);

//router check status of complaint
router.get('/complaintStatus/:id', isAuthenticatedUser, getComplaintStatus);

//pdf download
router.post('/generateComplaintPDF',generateComplaintPDF);
router.post('/giveFeedback', saveFeedback);


// get user details by user ID
router.get('/getUser/:id', getUser);

//check status of the user
module.exports = router;