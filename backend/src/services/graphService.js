const driver = require("../config/db");

const { getCandidateGraphQuery } = require("../queries/graphQueries");

const getCandidateGraph = async (candidateId) => {
  const session = driver.session();

  try {
    const result = await session.run(getCandidateGraphQuery, {
      candidateId,
    });

    if (result.records.length === 0) {
      return null;
    }

    const record = result.records[0];

    const candidate = record.get("c");

    const relatedNodes = record.get("relatedNodes");

    const relationships = record.get("relationships");

    const allNodes = [candidate, ...relatedNodes].filter(Boolean);

    const nodes = Array.from(
      new Map(
        allNodes.map((node) => [
          node.properties.id,
          {
            id: node.properties.id,
            label:
              node.properties.name ||
              node.properties.title ||
              node.properties.id,
            type: node.labels?.[0] || "Unknown",
          },
        ]),
      ).values(),
    );

    const links = relationships.map((relationship) => ({
      source: relationship.startNodeElementId,
      target: relationship.endNodeElementId,
      relationship: relationship.type,
    }));

    // Convert element IDs in relationships
    // to our application IDs.
    const nodeByElementId = new Map(
      allNodes.map((node) => [node.elementId, node.properties.id]),
    );

    const normalizedLinks = relationships.map((relationship) => ({
      source: nodeByElementId.get(relationship.startNodeElementId),
      target: nodeByElementId.get(relationship.endNodeElementId),
      relationship: relationship.type,
    }));

    return {
      nodes,
      links: normalizedLinks,
    };
  } finally {
    await session.close();
  }
};

module.exports = {
  getCandidateGraph,
};
