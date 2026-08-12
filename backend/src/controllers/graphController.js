const { getCandidateGraph } = require("../services/graphService");

const getCandidateGraphController = async (req, res) => {
  try {
    const { candidateId } = req.params;

    if (!candidateId) {
      return res.status(400).json({
        success: false,
        message: "Candidate ID is required",
      });
    }

    const graph = await getCandidateGraph(candidateId);

    if (!graph) {
      return res.status(404).json({
        success: false,
        message: "Candidate graph not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: graph,
    });
  } catch (error) {
    console.error("Get candidate graph error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load candidate graph",
    });
  }
};

module.exports = {
  getCandidateGraphController,
};
