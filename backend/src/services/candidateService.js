const driver = require("../config/db");
const { toNumber } = require("../utils/neo4j");

const {
  getAllCandidatesQuery,
  getCandidateByIdQuery,
} = require("../queries/candidateQueries");

const getAllCandidates = async () => {
  const session = driver.session();

  try {
    const result = await session.run(getAllCandidatesQuery);

    return result.records.map((record) => ({
      id: record.get("id"),
      name: record.get("name"),
      email: record.get("email"),
      experience: toNumber(record.get("experience")),
      location: record.get("location"),
    }));
  } finally {
    await session.close();
  }
};

const getCandidateById = async (candidateId) => {
  const session = driver.session();

  try {
    const result = await session.run(getCandidateByIdQuery, {
      candidateId,
    });

    if (result.records.length === 0) {
      return null;
    }

    const record = result.records[0];

    const skills = record
      .get("skills")
      .filter(Boolean)
      .map((skill) => ({
        id: skill.id,
        name: skill.name,
        category: skill.category,
        proficiency: skill.proficiency,
        years: toNumber(skill.years),
      }));

    return {
      id: record.get("id"),
      name: record.get("name"),
      email: record.get("email"),
      experience: toNumber(record.get("experience")),
      location: record.get("location"),
      skills,
    };
  } finally {
    await session.close();
  }
};

module.exports = {
  getAllCandidates,
  getCandidateById,
};
