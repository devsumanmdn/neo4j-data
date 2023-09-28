// const StreamArray = require('stream-json/streamers/StreamArray');
// const { batch } = require('stream-json/utils/Batch');
const neo4j = require('neo4j-driver');

const fs = require('fs');
const { parse } = require('csv-parse/sync');

const writeDataToDB = async ({ file, label }) => {
  const uri = 'bolt://127.0.0.1:7687';
  const driver = neo4j.driver(uri, neo4j.auth.basic(process.env.DB_USER, process.env.DB_PASS));
  const session = driver.session();

  const array = parse(fs.readFileSync(file).toString(), {
    delimiter: ',',
    columns: true,
  });

  let query = '';
  let queryData = {};
  let count = 0;
  for (data of array) {
    query += `CREATE (a${count}: ${label} { ${Object.keys(data)
      .map((key) => {
        const queryKey = `${key}${count}`;
        queryData[queryKey] = data[key];
        return `${key}: $${queryKey}`;
      })
      .join(',')} })`;

      count++;

      if (count === 100) {
        await session.run(query, queryData);
        query = '';
        count = 0;
        queryData = {};
      }
  }

  if (count !== 0) {
    await session.run(query, queryData);
  }
  await session.close();
  await driver.close();

  // console.log(query);
};

module.exports = writeDataToDB;
