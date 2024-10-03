const express = require('express');
const router = express.Router();
const branchController = require('../controllers/branch');

router.get('/:id', branchController.getBranchById);
router.get('/', branchController.getAllBranches);
router.post('/', branchController.createBranch);
router.delete('/:id', branchController.deleteBranchById);
router.put('/:id', branchController.updateBranch);

module.exports = router;