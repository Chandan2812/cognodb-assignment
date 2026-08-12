const express = require("express");

const {
  getCandidateRecommendationsController,
} = require("../controllers/recommendationController");

const router = express.Router();

router.get(
  "/candidates/:candidateId/recommendations",
  getCandidateRecommendationsController,
);

module.exports = router;
