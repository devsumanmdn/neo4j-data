const getRelationshipQuery = (label1, label2, attribute1, attribute2, relationshipName) =>{
  return `match
    (a: ${label1}), (b:${label2})
    (
      with a,b
      where a.${attribute1} = b.${attribute2}
    create (a)-[r:${relationshipName}]->(b)
    )
    IN TRANSACTIONS OF 10000 ROWS
    `;
}

module.exports = getRelationshipQuery;
