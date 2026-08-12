const driver = require("../config/db");

const { getAllSkillsQuery } = require("../queries/skillQueries");

const getAllSkills = async () => {
  const session = driver.session();

  try {
    const result = await session.run(getAllSkillsQuery);

    return result.records.map((record) => ({
      id: record.get("id"),
      name: record.get("name"),
      category: record.get("category"),
    }));
  } finally {
    await session.close();
  }
};

module.exports = {
  getAllSkills,
};
