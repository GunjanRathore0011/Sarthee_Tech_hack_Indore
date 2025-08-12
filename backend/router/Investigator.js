const express = require('express');
const router = express.Router();

const {getInvestigatorDetails,
     getAllInvestigators, 
     createInvestigator,
     updateInvestigatorStatus,
     allAssignedCases,
     updateComplaintStatus,
     getCaseNotes,
     AddCaseNoteSchema,

    } = require('../controller/InvestigatorController');

//Add and get notes for a case
router.post('/addCaseNote', AddCaseNoteSchema);
router.get('/getCaseNotes', getCaseNotes);

// Route to create a new investigator
router.post('/investigator', createInvestigator);

// Route to get details of a specific investigator by ID
router.get('/investigator/:id', getInvestigatorDetails);


// Route to get all investigators
router.get('/investigators', getAllInvestigators);

// Route to update investigator status
router.post('/investigatorStatus/:id', updateInvestigatorStatus);

router.get('/allAssignedCases/:id',allAssignedCases)

//update status 
router.post('/updateComplaintStatus',updateComplaintStatus)


// Export the router
module.exports = router;