const deleteAll = require('./deleteAll');
const { generateAllData, CHUNK_SIZE } = require('./generateJSONData');
const runForCount = require('./neo4j');
const testQuery = require('./testQuery');

const countsArray = [
  1000, 3000, 4000, 5000, 8000, 10000, 12000, 15000, 16000, 20000, 25000, 30000,
  40000, 50000, 60000, 70000, 80000, 90000, 100000, 110000, 120000, 125000,
  140000, 150000, 160000, 175000, 180000, 200000, 225000, 300000,
];

(async () => {
  await Promise.all([
    deleteAll(),
    generateAllData(countsArray[countsArray.length - 1]),
  ]);

  console.time('All done in ');
  let lastEndCount = 0;
  for (count of countsArray) {
    for (
      let startCount = lastEndCount;
      startCount < count;
      startCount += CHUNK_SIZE
    ) {
      addRecordsAndCreateRelationshipsForCount(startCount);
    }
    const msTakenByTheQuery = testQuery();
    console.log(
      `${lastEndCount}-${count}`,
      'Query took',
      msTakenByTheQuery,
      'ms'
    );
    lastEndCount = count;
  }
  console.timeEnd('All done in ');
})();
