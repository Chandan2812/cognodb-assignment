const driver = require("../config/db");

const { getAllJobsQuery, getJobByIdQuery } = require("../queries/jobQueries");
const { toNumber } = require("../utils/neo4j");

const getAllJobs = async () => {
  const session = driver.session();

  try {
    const result = await session.run(getAllJobsQuery);

    return result.records.map((record) => ({
      id: record.get("id"),
      title: record.get("title"),
      description: record.get("description"),
      experienceRequired: toNumber(record.get("experienceRequired")),
      location: record.get("location"),
      employmentType: record.get("employmentType"),
      salary: toNumber(record.get("salary")),
      company: record.get("companyId")
        ? {
            id: record.get("companyId"),
            name: record.get("companyName"),
          }
        : null,
      skills: record.get("skills").filter(Boolean),
    }));
  } finally {
    await session.close();
  }
};

const getJobById = async (jobId) => {
  const session = driver.session();

  try {
    const result = await session.run(getJobByIdQuery, {
      jobId,
    });

    if (result.records.length === 0) {
      return null;
    }

    const record = result.records[0];

    return {
      id: record.get("id"),
      title: record.get("title"),
      description: record.get("description"),
      experienceRequired: toNumber(record.get("experienceRequired")),
      location: record.get("location"),
      employmentType: record.get("employmentType"),
      salary: toNumber(record.get("salary")),
      company: record.get("company"),
      skills: record.get("skills").filter(Boolean),
    };
  } finally {
    await session.close();
  }
};

module.exports = {
  getAllJobs,
  getJobById,
};
