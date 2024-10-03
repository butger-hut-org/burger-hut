const { StatusCodes, CONFLICT } = require("http-status-codes");
const Branch = require("../models/branch");
const BaseError = require("../errors");
// const {postTweet} = require('../twitter');

async function getAllBranches(_, res) {
  try {
    const branches = await Branch.find();
    res.status(StatusCodes.OK).json(branches);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
}

async function createBranch(req, res) {
  try {
    const branchData = {
      name: req.body.name,
      address: req.body.address,
      city: req.body.city,
      phoneNumber: req.body.phoneNumber,
      active: req.body.active
    };

    if (!branchData.name || !branchData.address || !branchData.city || !branchData.phoneNumber || !branchData.active) {
        return res.status(StatusCodes.BAD_REQUEST).json("Not all required fields were provided!");
    }
    // TODO: change duplicate entry validations
    if (await Branch.findOne({name: branchData.name})) {
        return res.status(StatusCodes.CONFLICT).json("A branch with this name already exists!");
    }
    if (await Branch.findOne({name: branchData.phoneNumber})) {
        return res.status(StatusCodes.CONFLICT).json("A branch with this phone number already exists!");
    }
    if (await Branch.findOne({name: branchData.address})) {
        return res.status(StatusCodes.CONFLICT).json("A branch with this address already exists!");
    }
    
    const branch = new Branch({ ...branchData });
    Branch.create(branch);
    res.status(StatusCodes.OK).json({});
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
}

module.exports = {
  getAllBranches,
  createBranch,
};
