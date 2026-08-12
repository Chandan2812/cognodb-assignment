const express = require("express");

const {
  getCandidateGraphController,
} = require("../controllers/graphController");

const router = express.Router();

router.get("/candidate/:candidateId", getCandidateGraphController);

module.exports = router;
