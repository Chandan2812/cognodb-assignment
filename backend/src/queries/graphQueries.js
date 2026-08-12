const getCandidateGraphQuery = `
  MATCH (c:Candidate {id: $candidateId})

  OPTIONAL MATCH (c)-[r1:HAS_SKILL]->(s:Skill)
  OPTIONAL MATCH (c)-[r2:APPLIED_FOR]->(j:Job)
  OPTIONAL MATCH (c)-[r3:WORKED_AT]->(company:Company)

  OPTIONAL MATCH (j)-[r4:REQUIRES]->(jobSkill:Skill)
  OPTIONAL MATCH (j)-[r5:POSTED_BY]->(jobCompany:Company)

  WITH
    c,
    collect(DISTINCT s) +
    collect(DISTINCT j) +
    collect(DISTINCT company) +
    collect(DISTINCT jobSkill) +
    collect(DISTINCT jobCompany) AS relatedNodes,

    collect(DISTINCT r1) +
    collect(DISTINCT r2) +
    collect(DISTINCT r3) +
    collect(DISTINCT r4) +
    collect(DISTINCT r5) AS relationships

  RETURN
    c,
    [node IN relatedNodes
      WHERE node IS NOT NULL] AS relatedNodes,
    [rel IN relationships
      WHERE rel IS NOT NULL] AS relationships
`;

module.exports = {
  getCandidateGraphQuery,
};
