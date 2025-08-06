const express = require('express');
const router = express();
const {dashboard,
    getMonthlyComplaintStats,
    suggestInvestigator,
    subCategoryStats
    } = require('../controller/AdminDashboard');

router.get('/dashboard', dashboard);
router.get('/monthly-complaint-stats', getMonthlyComplaintStats);
router.get('/suggestInvestigator', suggestInvestigator);
router.get('/subCategoryStats',subCategoryStats);


module.exports = router;