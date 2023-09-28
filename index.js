const deleteAll = require('./deleteAll');
const { generateAllData, CHUNK_SIZE } = require('./generateJSONData');
const addRecordsAndCreateRelationshipsForCount = require('./neo4j');
const fs = require('fs');
const testQuery = require('./testQuery');

const countsArray = [
  1000, 3000, 4000, 5000
];

(async () => {
  await Promise.all([
    deleteAll(),
    generateAllData(countsArray[countsArray.length - 1]),
  ]);

  console.time('All done in ');
  let lastEndCount = 0;
  fs.writeFileSync('queryStats.txt', '')

  for (count of countsArray) {
    for (
      let startCount = lastEndCount;
      startCount < count;
      startCount += CHUNK_SIZE
    ) {
      await addRecordsAndCreateRelationshipsForCount(startCount);
    }
    const msTakenByTheQuery = await testQuery();
    console.log(
      `${count}`,
      'Query took',
      msTakenByTheQuery,
      'ms'
    );
    fs.appendFileSync('queryStats.txt', `${count}\t${msTakenByTheQuery}\n`)
    lastEndCount = count;
  }
  console.timeEnd('All done in ');
  process.exit(0)
})();
