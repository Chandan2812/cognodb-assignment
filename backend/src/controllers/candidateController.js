const {
  getAllCandidates,
  getCandidateById,
} = require("../services/candidateService");

const getAllCandidatesController = async (req, res) => {
  try {
    const candidates = await getAllCandidates();

    return res.status(200).json({
      success: true,
      data: candidates,
    });
  } catch (error) {
    console.error("Get candidates error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch candidates",
    });
  }
};

const getCandidateByIdController = async (req, res) => {
  try {
    const { candidateId } = req.params;

    if (!candidateId) {
      return res.status(400).json({
        success: false,
        message: "Candidate ID is required",
      });
    }

    const candidate = await getCandidateById(candidateId);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: candidate,
    });
  } catch (error) {
    console.error("Get candidate error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch candidate",
    });
  }
};

module.exports = {
  getAllCandidatesController,
  getCandidateByIdController,
};
