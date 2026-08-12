const getAllCandidatesQuery = `
  MATCH (c:Candidate)
  RETURN
    c.id AS id,
    c.name AS name,
    c.email AS email,
    c.experience AS experience,
    c.location AS location
  ORDER BY c.name
`;

const getCandidateByIdQuery = `
  MATCH (c:Candidate {id: $candidateId})

  OPTIONAL MATCH (c)-[r:HAS_SKILL]->(s:Skill)

  RETURN
    c.id AS id,
    c.name AS name,
    c.email AS email,
    c.experience AS experience,
    c.location AS location,
    collect(
      CASE
        WHEN s IS NOT NULL THEN {
          id: s.id,
          name: s.name,
          category: s.category,
          proficiency: r.proficiency,
          years: r.years
        }
      END
    ) AS skills
`;

module.exports = {
  getAllCandidatesQuery,
  getCandidateByIdQuery,
};
