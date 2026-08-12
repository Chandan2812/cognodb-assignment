const getAllSkillsQuery = `
  MATCH (s:Skill)
  RETURN
    s.id AS id,
    s.name AS name,
    s.category AS category
  ORDER BY s.name
`;

module.exports = {
  getAllSkillsQuery,
};
