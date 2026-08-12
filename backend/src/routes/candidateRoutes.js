const express = require("express");

const {
  getAllCandidatesController,
  getCandidateByIdController,
} = require("../controllers/candidateController");

const router = express.Router();

router.get("/", getAllCandidatesController);

router.get("/:candidateId", getCandidateByIdController);

module.exports = router;
