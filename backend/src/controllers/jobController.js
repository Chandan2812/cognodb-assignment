const { getAllJobs, getJobById } = require("../services/jobService");

const getAllJobsController = async (req, res) => {
  try {
    const jobs = await getAllJobs();

    return res.status(200).json({
      success: true,
      data: jobs,
    });
  } catch (error) {
    console.error("Get jobs error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch jobs",
    });
  }
};

const getJobByIdController = async (req, res) => {
  try {
    const { jobId } = req.params;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required",
      });
    }

    const job = await getJobById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    console.error("Get job error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch job",
    });
  }
};

module.exports = {
  getAllJobsController,
  getJobByIdController,
};
