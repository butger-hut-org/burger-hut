const { StatusCodes } = require("http-status-codes");
const Branch = require("../models/branch");
const BaseError = require("../errors");
const mongoose = require("mongoose");
// const {postTweet} = require('../twitter');

const DUPLICATE_KEY_STATUS_CODE = 11000;

//TODO: add logs to functions
async function getBranchById(req, res) {
  try {
    const branchId = req.params.id;
    if (!mongoose.isValidObjectId(branchId)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Invalid branch ID format" });
    }
    const branch = await Branch.findById({ _id: branchId });
    if (branch) {
      return res.status(StatusCodes.OK).json(branch);
    }
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: `Branch with id: ${branchId} not found!` });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
}

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
      active: req.body.active,
    };

    if (
      !branchData.name ||
      !branchData.address ||
      !branchData.city ||
      !branchData.phoneNumber ||
      !branchData.active
    ) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Not all required fields were provided!" });
    }

    const branch = new Branch({ ...branchData });
    await Branch.create(branch);
    res.status(StatusCodes.OK).json({});
  } catch (error) {
    if (error.code === DUPLICATE_KEY_STATUS_CODE) {
      return res.status(StatusCodes.CONFLICT).json({
        error: `A branch with this ${Object.keys(
          error.keyValue
        )} already exists!`,
      });
    }
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
}

async function updateBranch(req, res) {
  try {
    const branchId = req.params.id;
    const dataToUpdate = { ...req.body };
    if (!mongoose.isValidObjectId(branchId)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Invalid branch ID format" });
    }
    const newBranch = await Branch.findOneAndUpdate(
      { _id: branchId },
      dataToUpdate,
      { new: true, runValidators: true }
    );
    if (newBranch) {
      return res.status(StatusCodes.OK).json(newBranch);
    }
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: `Branch with id: ${branchId} not found!` });
  } catch (error) {
    if (error.code === DUPLICATE_KEY_STATUS_CODE) {
      return res.status(StatusCodes.CONFLICT).json({
        error: `A branch with this ${Object.keys(
          error.keyValue
        )} already exists!`,
      });
    }
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
}

async function deleteBranchById(req, res) {
  try {
    const branchId = req.params.id;
    if (!mongoose.isValidObjectId(branchId)) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Invalid branch ID format" });
    }
    const deletedBranch = await Branch.findByIdAndDelete({ _id: branchId });
    if (deletedBranch) {
      return res
        .status(StatusCodes.OK)
        .json({ msg: `Successfully deleted branch ${branchId}!` });
    }
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: `Branch with id: ${branchId} not found!` });
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
}

module.exports = {
  getBranchById,
  getAllBranches,
  createBranch,
  deleteBranchById,
  updateBranch,
};
