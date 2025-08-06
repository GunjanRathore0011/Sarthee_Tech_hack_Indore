const express = require('express');
const router = express();
const {dashboard} = require('../controller/AdminDashboard');

router.get('/dashboard', dashboard);



module.exports = router;