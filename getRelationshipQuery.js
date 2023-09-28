const getRelationshipQuery = (
  label1,
  label2,
  attribute1,
  attribute2,
  relationshipName,
  minLimit,
  label1PrimaryAttribute
) => {
  return `
    match (a: ${label1}), (b:${label2})
    where a.${attribute1} = b.${attribute2} and toInteger(a.${label1PrimaryAttribute}) > ${minLimit}
    create (a)-[r:${relationshipName}]->(b)`;
};

module.exports = getRelationshipQuery;
