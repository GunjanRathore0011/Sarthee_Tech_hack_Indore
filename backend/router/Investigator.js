const express = require('express');
const router = express.Router();

const {getInvestigatorDetails,
     getAllInvestigators, 
     createInvestigator,
     updateInvestigatorStatus,
     allAssignedCases
    } = require('../controller/InvestigatorController');

// Route to create a new investigator
router.post('/investigator', createInvestigator);

// Route to get details of a specific investigator by ID
router.get('/investigator/:id', getInvestigatorDetails);

// Route to get all investigators
router.get('/investigators', getAllInvestigators);

// Route to update investigator status
router.post('/investigatorStatus/:id', updateInvestigatorStatus);

router.get('/allAssignedCases/:id',allAssignedCases)


// Export the router
module.exports = router;