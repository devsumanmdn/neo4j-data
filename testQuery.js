const neo4j = require('neo4j-driver');

const testQuery = async () => {
  const uri = 'bolt://127.0.0.1:7687';
  const driver = neo4j.driver(uri, neo4j.auth.basic(process.env.DB_USER, process.env.DB_PASS));
  const session = driver.session();

  const trial = 5;
  let totalTime = 0;
  for (let i = 1; i <= trial; i++) {
    const time1 = Date.now();
    await session.run(
      `Match (p:Person{name:"Terry Medhurst"}) <-[r1:PATIENT_PERSON_REL]- (d:Patient) <-[r2:COMPLAINT_PATIENT_REL]- (c:Complaint) return c;`
    );
    const timeTaken = Date.now() - time1;

    totalTime += timeTaken;
  }

  return totalTime / trial;
};

module.exports = testQuery;
