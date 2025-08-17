const express = require('express');
const { handleRedirect, getCaseTrackingLogs, generateTrackingLink ,checkIP ,getInvestigatorTrackingLogs} = require('../controller/trackingController');
const { isAuthenticatedUser } = require('../middleware/auth');

const router = express.Router();

// Investigator creates a tracking link
router.post('/create',isAuthenticatedUser,generateTrackingLink);

// Suspect clicks on tracking link
router.get('/t/:shortCode', handleRedirect);

// Investigator fetches case logs
router.get('/logs/:caseId', getCaseTrackingLogs);

router.get('/allinvestigator', isAuthenticatedUser,getInvestigatorTrackingLogs);

router.get('/checkIP', checkIP);
module.exports = router;
