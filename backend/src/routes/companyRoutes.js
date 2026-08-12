const express = require("express");

const {
  getAllCompaniesController,
  getCompanyByIdController,
} = require("../controllers/companyController");

const router = express.Router();

router.get("/", getAllCompaniesController);

router.get("/:companyId", getCompanyByIdController);

module.exports = router;
