const { StatusCodes } = require("http-status-codes");
const Branch = require("../models/branch");
const BaseError = require("../errors");
const mongoose = require("mongoose");
const logger = require("../middleware/logger");
const { validateLocation, validatePhoneNumber, areFieldsUpdatable } = require('../utils/validations.js');
const { postTweet } = require("../utils/twitter.js");

const DUPLICATE_KEY_STATUS_CODE = 11000;

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

async function getBranches(req, res) {
  const filterFields = { ...req.query };
  try {
    const branches = filterFields ? await Branch.find(filter=filterFields) : await Branch.find();
    logger.info("Successfully retrieved branches");
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
    location: req.body.location ? { ...req.body.location } : undefined,
  };
  try {
    if (!branchData.name || !branchData.address || !branchData.city || !branchData.phoneNumber || !branchData.location || branchData.active === undefined) {
      throw new BaseError.BadRequestError("Not all required fields were provided!");
    }
    if (!validateLocation(branchData.location)) {
      throw new BaseError.BadRequestError("The provided location is not valid! Must be of type {lat: Number, lon: Number}");
    }
    if (!validatePhoneNumber(branchData.phoneNumber)) {
      throw new BaseError.BadRequestError("The provided phone number is not valid! Must be a String that is consisted of 9-10 digits.");
    }
    const branch = await Branch.create(new Branch({ ...branchData }));
    logger.info(`Successfully created a branch with id: ${branch._id}`);
    await postTweet(`Hello! We are glad to inform you that we have opened a new branch!!! Pay a visit to ${branch.name} in ${branch.address}, ${branch.city}`);
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
    if (!areFieldsUpdatable(dataToUpdate)) {
      throw new BaseError.BadRequestError("Cannot update branch's address, city or location!");
    }
    if (dataToUpdate.phoneNumber && !validatePhoneNumber(dataToUpdate.phoneNumber)) {
      throw new BaseError.BadRequestError("The provided phone number is not valid! Must be a String that is consisted of 9-10 digits.");
    }
    const updatedBranch = await Branch.findOneAndUpdate(
      { _id: branchId },
      dataToUpdate,
      { new: true, runValidators: true }
    );
    if (updatedBranch) {
      logger.info(`Successfully updated a branch with id: ${branchId}`);
      await postTweet(`Hello! We have made some changes to our branch ${updatedBranch.name} in ${updatedBranch.address}, ${updatedBranch.city}. Check out our website for more info.`);
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
      await postTweet(`We are sorry to inform you that branch ${deletedBranch.name} in ${deletedBranch.address}, ${deletedBranch.city} has been closed... Hope to meet you in another one!.`);
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

module.exports = {
  getBranchById,
  getBranches,
  createBranch,
  deleteBranchById,
  updateBranch,
};
