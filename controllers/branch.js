const { StatusCodes } = require("http-status-codes");
const Branch = require("../models/branch");
const BaseError = require("../errors");
const mongoose = require("mongoose");
const logger = require("../middleware/logger");
// const {postTweet} = require('../twitter');

const DUPLICATE_KEY_STATUS_CODE = 11000;
const LOCATION_VALID_FIELDS = ["lat", "lon"];
const UNUPDATEABLE_FIELDS = ["city", "address", "location"]

// TODO: add bad request error handling on the catch of each route
async function getBranchById(req, res) {
  const branchId = req.params.id;
  try {
    if (!mongoose.isValidObjectId(branchId)) {
      throw new BaseError.BadRequestError(`Invalid branch ID format: ${branchId}`);
    }
    const branch = await Branch.findById({ _id: branchId });
    if (branch) {
      logger.info(`Successfully retrieved branch with id: ${branchId}`);
      return res.status(StatusCodes.OK).json(branch);
    }
    throw new BaseError.NotFoundError(`Branch with id: ${branchId} not found!`);
  } catch (error) {
    logger.error(error);
    const status = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    return res.status(status).json(error);
  }
}

async function getAllBranches(_, res) {
  try {
    const branches = await Branch.find();
    logger.info("Successfully retrieved all branches");
    return res.status(StatusCodes.OK).json(branches);
  } catch (error) {
    logger.error(error);
    const status = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    return res.status(status).json(error);
  }
}

async function createBranch(req, res) {
  const branchData = {
    name: req.body.name,
    address: req.body.address,
    city: req.body.city,
    phoneNumber: req.body.phoneNumber,
    active: req.body.active,
    location: { ...req.body.location },
  };
  try {
    if (!branchData.name || !branchData.address || !branchData.city || !branchData.phoneNumber || !branchData.location || branchData.active === undefined) {
      throw new BaseError.BadRequestError("Not all required fields were provided!");
    }
    if (!validateLocationDictionary(branchData.location)) {
      throw new BaseError.BadRequestError("Excessive keys were detected! Must be of type {lat: Number, lon: Number}");
    }
    const branch = await Branch.create(new Branch({ ...branchData }));
    logger.info(`Successfully created a branch with id: ${branch._id}`);
    return res.status(StatusCodes.CREATED).json(branch);
  } catch (error) {
    if (error.code === DUPLICATE_KEY_STATUS_CODE) {
      return res.status(StatusCodes.CONFLICT).json(`A branch with this ${Object.keys(error.keyValue)} already exists!`);
    } else {
      logger.error(error);
      const status = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
      return res.status(status).json(error);
    }
  }
}

async function updateBranch(req, res) {
  const branchId = req.params.id;
  const dataToUpdate = { ...req.body };
  try {
    if (!mongoose.isValidObjectId(branchId)) {
      throw new BaseError.BadRequestError(`Invalid branch ID format: ${branchId}`);
    }
    Object.keys(dataToUpdate).forEach((key) => {
      if(UNUPDATEABLE_FIELDS.includes(key)) {
        throw new BaseError.BadRequestError("Cannot update branch's address, city or location!");
      }
    })
    const updatedBranch = await Branch.findOneAndUpdate(
      { _id: branchId },
      dataToUpdate,
      { new: true, runValidators: true }
    );
    if (updatedBranch) {
      logger.info(`Successfully updated a branch with id: ${branchId}`);
      return res.status(StatusCodes.OK).json(updatedBranch);
    }
    throw new BaseError.NotFoundError(`Branch with id: ${branchId} not found!`);
  } catch (error) {
    if (error.code === DUPLICATE_KEY_STATUS_CODE) {
      return res.status(StatusCodes.CONFLICT).json(`A branch with this ${Object.keys(error.keyValue)} already exists!`);
    }
    logger.error(error);
    const status = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    return res.status(status).json(error);
  }
}

async function deleteBranchById(req, res) {
  const branchId = req.params.id;
  try {
    if (!mongoose.isValidObjectId(branchId)) {
      throw new BaseError.BadRequestError(`Invalid branch ID format: ${branchId}`);
    }
    const deletedBranch = await Branch.findByIdAndDelete({ _id: branchId });
    if (deletedBranch) {
      logger.info(`Successfully deleted a branch with id: ${branchId}`);
      return res
        .status(StatusCodes.OK)
        .json({ msg: `Successfully deleted branch ${branchId}!` });
    }
    throw new BaseError.NotFoundError(
      `Branch with id: ${branchId} not found!`
    );
  } catch (error) {
    logger.error(error);
    const status = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    return res.status(status).json(error);
  }
}

function validateLocationDictionary(location) {
  if (typeof location !== 'object' || location === null || Array.isArray(location) || Object.keys(location).length !== 2) {
    return false;
  }
  const locationKeys = Object.keys(location);
  locationKeys.forEach((key) => {
    if (typeof location[key] !== 'number' || !isFinite(location[key]) || !LOCATION_VALID_FIELDS.includes(key)) {
      throw new BaseError.BadRequestError("The provided location is not valid! Must be of type {lat: Number, lon: Number}")    }
  });
  return locationKeys.length === LOCATION_VALID_FIELDS.length;
}

module.exports = {
  getBranchById,
  getAllBranches,
  createBranch,
  deleteBranchById,
  updateBranch,
};
