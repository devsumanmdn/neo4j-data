const getRelationshipQuery = (
  label1,
  label2,
  attribute1,
  attribute2,
  relationshipName,
  maxLimit,
  minLimit
) => {
  return `
    match (a: ${label1}), (b:${label2})
    where a.${attribute1} = b.${attribute2} and a.${attribute1} <= ${maxLimit} and a.${attribute1} > ${minLimit}
    create (a)-[r:${relationshipName}]->(b)`;
};

module.exports = getRelationshipQuery;
