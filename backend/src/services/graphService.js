const driver = require("../config/db");

const { getCandidateGraphQuery } = require("../queries/graphQueries");

const { toNumber } = require("../utils/neo4j");

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

    // ------------------------------------------
    // Combine candidate + related nodes
    // ------------------------------------------

    const allNodes = [candidate, ...relatedNodes].filter(Boolean);

    // ------------------------------------------
    // Convert Neo4j nodes into API-friendly data
    // ------------------------------------------

    const nodes = Array.from(
      new Map(
        allNodes.map((node) => {
          const properties = {
            ...node.properties,
          };

          // ------------------------------------
          // Normalize Neo4j integer properties
          // ------------------------------------

          if (
            node.labels?.includes("Candidate") &&
            node.properties.experience !== undefined
          ) {
            properties.experience = toNumber(node.properties.experience);
          }

          if (
            node.labels?.includes("Job") &&
            node.properties.experienceRequired !== undefined
          ) {
            properties.experienceRequired = toNumber(
              node.properties.experienceRequired,
            );
          }

          if (
            node.labels?.includes("Job") &&
            node.properties.salary !== undefined
          ) {
            properties.salary = toNumber(node.properties.salary);
          }

          return [
            node.properties.id,
            {
              id: node.properties.id,

              label:
                node.properties.name ||
                node.properties.title ||
                node.properties.id,

              type: node.labels?.[0] || "Unknown",

              properties,
            },
          ];
        }),
      ).values(),
    );

    // ------------------------------------------
    // Map Neo4j elementId → application ID
    // ------------------------------------------

    const nodeByElementId = new Map(
      allNodes.map((node) => [node.elementId, node.properties.id]),
    );

    // ------------------------------------------
    // Normalize relationships
    // ------------------------------------------

    const normalizedLinks = relationships.map((relationship) => ({
      source: nodeByElementId.get(relationship.startNodeElementId),

      target: nodeByElementId.get(relationship.endNodeElementId),

      relationship: relationship.type,
    }));

    // ------------------------------------------
    // Return graph
    // ------------------------------------------

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
