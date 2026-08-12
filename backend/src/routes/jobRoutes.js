const express = require("express");

const {
  getAllJobsController,
  getJobByIdController,
} = require("../controllers/jobController");

const router = express.Router();

router.get("/", getAllJobsController);

router.get("/:jobId", getJobByIdController);

module.exports = router;
