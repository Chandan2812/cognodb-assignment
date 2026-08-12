const driver = require("../config/db");

const {
  getAllCompaniesQuery,
  getCompanyByIdQuery,
} = require("../queries/companyQueries");

const getAllCompanies = async () => {
  const session = driver.session();

  try {
    const result = await session.run(getAllCompaniesQuery);

    return result.records.map((record) => ({
      id: record.get("id"),
      name: record.get("name"),
      location: record.get("location"),
      industry: record.get("industry"),
    }));
  } finally {
    await session.close();
  }
};

const getCompanyById = async (companyId) => {
  const session = driver.session();

  try {
    const result = await session.run(getCompanyByIdQuery, {
      companyId,
    });

    if (result.records.length === 0) {
      return null;
    }

    const record = result.records[0];

    return {
      id: record.get("id"),
      name: record.get("name"),
      location: record.get("location"),
      industry: record.get("industry"),
      jobs: record.get("jobs").filter(Boolean),
      employees: record.get("employees").filter(Boolean),
    };
  } finally {
    await session.close();
  }
};

module.exports = {
  getAllCompanies,
  getCompanyById,
};
