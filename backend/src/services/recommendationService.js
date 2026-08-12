const driver = require("../config/db");

const {
  getCandidateRecommendations,
} = require("../queries/recommendationQueries");

const { toNumber } = require("../utils/neo4j");

const getRecommendations = async (candidateId) => {
  const session = driver.session();

  try {
    const result = await session.run(getCandidateRecommendations, {
      candidateId,
    });

    return result.records.map((record) => ({
      candidate: record.get("candidate"),

      jobId: record.get("jobId"),

      job: record.get("job"),

      description: record.get("description"),

      location: record.get("location"),

      employmentType: record.get("employmentType"),

      salary: toNumber(record.get("salary")),

      matchedSkills: record.get("matchedSkills"),

      matchedSkillCount: toNumber(record.get("matchedSkillCount")),

      totalRequiredSkills: toNumber(record.get("totalRequiredSkills")),

      matchPercentage: toNumber(record.get("matchPercentage")),
    }));
  } finally {
    await session.close();
  }
};

module.exports = {
  getRecommendations,
};
