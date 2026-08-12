const getAllJobsQuery = `
  MATCH (j:Job)
  OPTIONAL MATCH (j)-[:POSTED_BY]->(c:Company)
  OPTIONAL MATCH (j)-[:REQUIRES]->(s:Skill)

  RETURN
    j.id AS id,
    j.title AS title,
    j.description AS description,
    j.experienceRequired AS experienceRequired,
    j.location AS location,
    j.employmentType AS employmentType,
    j.salary AS salary,
    c.id AS companyId,
    c.name AS companyName,
    collect(
      DISTINCT CASE
        WHEN s IS NOT NULL THEN {
          id: s.id,
          name: s.name,
          category: s.category
        }
      END
    ) AS skills

  ORDER BY j.title
`;

const getJobByIdQuery = `
  MATCH (j:Job {id: $jobId})

  OPTIONAL MATCH (j)-[:POSTED_BY]->(c:Company)

  OPTIONAL MATCH (j)-[:REQUIRES]->(s:Skill)

  RETURN
    j.id AS id,
    j.title AS title,
    j.description AS description,
    j.experienceRequired AS experienceRequired,
    j.location AS location,
    j.employmentType AS employmentType,
    j.salary AS salary,

    CASE
      WHEN c IS NOT NULL THEN {
        id: c.id,
        name: c.name,
        location: c.location,
        industry: c.industry
      }
      ELSE null
    END AS company,

    collect(
      DISTINCT CASE
        WHEN s IS NOT NULL THEN {
          id: s.id,
          name: s.name,
          category: s.category
        }
      END
    ) AS skills
`;

module.exports = {
  getAllJobsQuery,
  getJobByIdQuery,
};
