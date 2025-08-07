const express = require('express');
const router = express();
const {dashboard,
    getMonthlyComplaintStats,
    suggestInvestigator,
    subCategoryStats,
    mapVisualize,
    assignInvestigator,    
    } = require('../controller/AdminDashboard');

router.get('/dashboard', dashboard);
router.get('/monthly-complaint-stats', getMonthlyComplaintStats);
router.get('/suggestInvestigator', suggestInvestigator);
router.get('/subCategoryStats',subCategoryStats);
router.get('/mapVisualize', mapVisualize);
router.post('/assignInvestigator', assignInvestigator);

module.exports = router;