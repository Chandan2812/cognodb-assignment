const getCandidateRecommendations = `
  MATCH (c:Candidate {id: $candidateId})
        -[:HAS_SKILL]->(s:Skill)
        <-[:REQUIRES]-(j:Job)

  WITH c, j, collect(DISTINCT s.name) AS matchedSkills

  MATCH (j)-[:REQUIRES]->(requiredSkill:Skill)

  WITH
    c,
    j,
    matchedSkills,
    count(DISTINCT requiredSkill) AS totalRequiredSkills

  WITH
    c,
    j,
    matchedSkills,
    totalRequiredSkills,
    size(matchedSkills) AS matchedSkillCount

  RETURN
    c.name AS candidate,
    j.id AS jobId,
    j.title AS job,
    j.description AS description,
    j.location AS location,
    j.employmentType AS employmentType,
    j.salary AS salary,
    matchedSkills,
    matchedSkillCount,
    totalRequiredSkills,
    round(
      toFloat(matchedSkillCount) /
      totalRequiredSkills * 100
    ) AS matchPercentage

  ORDER BY matchPercentage DESC
`;

module.exports = {
  getCandidateRecommendations,
};
