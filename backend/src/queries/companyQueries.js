const getAllCompaniesQuery = `
  MATCH (c:Company)
  RETURN
    c.id AS id,
    c.name AS name,
    c.location AS location,
    c.industry AS industry
  ORDER BY c.name
`;

const getCompanyByIdQuery = `
  MATCH (c:Company {id: $companyId})

  OPTIONAL MATCH (j:Job)-[:POSTED_BY]->(c)

  OPTIONAL MATCH (candidate:Candidate)-[:WORKED_AT]->(c)

  RETURN
    c.id AS id,
    c.name AS name,
    c.location AS location,
    c.industry AS industry,

    collect(
      DISTINCT CASE
        WHEN j IS NOT NULL THEN {
          id: j.id,
          title: j.title,
          location: j.location,
          employmentType: j.employmentType,
          salary: j.salary
        }
      END
    ) AS jobs,

    collect(
      DISTINCT CASE
        WHEN candidate IS NOT NULL THEN {
          id: candidate.id,
          name: candidate.name,
          role: "Previous Employee"
        }
      END
    ) AS employees
`;

module.exports = {
  getAllCompaniesQuery,
  getCompanyByIdQuery,
};
