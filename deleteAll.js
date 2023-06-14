const neo4j = require('neo4j-driver');

const personData = require('./json/persons.json');
const doctorData = require('./json/doctors.json');
const patientData = require('./json/patients.json');
const complaintData = require('./json/complaints.json');
const historyData = require('./json/histories.json');
const allergyHistoryData = require('./json/allergyhistories.json');
const treatmentEpisodeData = require('./json/treatmentepisodes.json');
const visitData = require('./json/visits.json');
const getRelationshipQuery = require('./getRelationshipQuery');

const uri = 'bolt://127.0.0.1:7687';
const driver = neo4j.driver(uri, neo4j.auth.basic('neo4j', 'Mou@2997'));
const session = driver.session();

(async () => {
  try {
    for (let i = 0; i < 10000; i += 100) {
      const query = `MATCH (a:Person) WHERE a.drId <= ${i} DETACH DELETE a`;

      const result = await session.run(query);
      console.log(result);
    }
  } catch (error) {
    console.log(error);
  } finally {
    await session.close();
  }

  // on application exit:
  await driver.close();
})();
