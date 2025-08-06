const express = require('express');
const router = express();
const {dashboard,getMonthlyComplaintStats} = require('../controller/AdminDashboard');

router.get('/dashboard', dashboard);
router.get('/monthly-complaint-stats', getMonthlyComplaintStats);



module.exports = router;