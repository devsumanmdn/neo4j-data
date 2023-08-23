const runForCount = require("./neo4j");

(async () => {
  const countsArray = [
    // 1000, 3000, 4000, 5000, 8000, 10000,
    12000, 15000, 16000, 20000, 25000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000, 110000, 120000, 125000, 140000, 150000, 160000, 175000, 180000, 200000, 225000, 300000];

  console.time("All done in ");
  for (let i = 0; i < countsArray.length; i++) {
    const count = countsArray[i];
    console.log('Starting for count: ', count);
    console.time(`Done for Count ${count} in `);
    await runForCount(count);
    console.timeEnd(`Done for Count ${count} in `);
  }
  console.timeEnd("All done in ");

  await runForCount(3000);
})();
