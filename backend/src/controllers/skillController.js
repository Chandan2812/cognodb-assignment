const { getAllSkills } = require("../services/skillService");

const getAllSkillsController = async (req, res) => {
  try {
    const skills = await getAllSkills();

    return res.status(200).json({
      success: true,
      data: skills,
    });
  } catch (error) {
    console.error("Get skills error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch skills",
    });
  }
};

module.exports = {
  getAllSkillsController,
};
