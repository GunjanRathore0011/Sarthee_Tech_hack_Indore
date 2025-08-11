const express = require('express');
const router = express.Router();

const { SuspectController, PatternAlertController } = require('../controller/PatternAlert');

// Route to handle suspect creation and pattern detection
router.post('/suspects', SuspectController); 
// Route to fetch pattern alerts
router.get('/pattern-alerts', PatternAlertController);

// Export the router
module.exports = router;