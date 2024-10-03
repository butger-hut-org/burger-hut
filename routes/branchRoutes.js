const express = require('express');
const router = express.Router();
const branchController = require('../controllers/branch');

// Route for creating a new branch
router.get('/', branchController.getAllBranches)
router.post('/', branchController.createBranch);

module.exports = router;