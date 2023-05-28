const neo4j = require('neo4j-driver');
const personData = require('./json/persons.json');

const uri = 'bolt://localhost:7474/db/neo4j';
const driver = neo4j.driver(uri, neo4j.auth.basic('neo4j', 'Mou@2997'));
const session = driver.session();

const personName = 'Alice';

(async () => {
  try {
    for (let i = 0; i < 10; i++) {
      const person = personData[i];

      const query = `CREATE (a: Person { ${Object.keys(person).map(key => `${key}: $${key}`).join(',')} })`;

      const result = await session.executeWrite(async (tx) => {
        tx.run(query, person);
      });

      const singleRecord = result.records[0];
      const node = singleRecord.get(0);

      console.log(node.properties);
    }


  } finally {
    await session.close();
  }

  // on application exit:
  await driver.close();
})();
