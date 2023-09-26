// const StreamArray = require('stream-json/streamers/StreamArray');
// const { batch } = require('stream-json/utils/Batch');
const neo4j = require('neo4j-driver');

const fs = require('fs');
const { parse } = require('csv-parse/sync');

const writeDataToDB = async ({ file, label }) => {
  const uri = 'bolt://127.0.0.1:7687';
  const driver = neo4j.driver(uri, neo4j.auth.basic('neo4j', 'Mou@2997'));
  const session = driver.session();

  const array = parse(fs.readFileSync(file).toString(), {
    delimiter: ',',
    columns: true,
  });

  for (data of array) {
    const query = `CREATE (a: ${label} { ${Object.keys(data)
      .map((key) => `${key}: $${key}`)
      .join(',')} })`;

    await session.run(query, data);
  }
  await session.close();
  await driver.close();

  // console.log(query);
};

module.exports = writeDataToDB;
