const { getRecommendations } = require("../services/recommendationService");

const getCandidateRecommendationsController = async (req, res) => {
  try {
    const { candidateId } = req.params;

    if (!candidateId) {
      return res.status(400).json({
        success: false,
        message: "Candidate ID is required",
      });
    }

    const recommendations = await getRecommendations(candidateId);

    return res.status(200).json({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    console.error("Recommendation controller error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch recommendations",
    });
  }
};

module.exports = {
  getCandidateRecommendationsController,
};
