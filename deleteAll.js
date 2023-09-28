const neo4j = require('neo4j-driver');


const deleteAll = async () => {
  const uri = 'bolt://127.0.0.1:7687';
  const driver = neo4j.driver(uri, neo4j.auth.basic(process.env.DB_USER, process.env.DB_PASS));
  const session = driver.session();
  try {
    const query = `MATCH (n)
    CALL {
        WITH n
        DETACH DELETE n
    } IN TRANSACTIONS OF 10000 ROWS`;

    await session.run(query);
    console.log('Deleted all records');
  } catch (error) {
    console.log(error);
  } finally {
    await session.close();
  }

  // on application exit:
  await driver.close();
};

module.exports = deleteAll;
