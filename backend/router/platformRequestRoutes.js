const express = require('express');
const router = express.Router();

const {
  createRequest,
  getAllRequests,
  updateRequestStatus
}=require('../controller/platformRequestController.js');


// Create request
router.post("/", createRequest);

// Get all requests
router.get("/", getAllRequests);

// Update request status
router.put("/:id", updateRequestStatus);
module.exports = router;
