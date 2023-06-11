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

    const query = `
      MATCH (n)
      RETURN n
    `;

    // const name = "Bhaswati";

    // const str = `Name: ${name}`; // => "Name: Bhaswati"

    //for personData

    for (let i = 0; i < personData.length; i++) {
      const person = personData[i];

      const query = `CREATE (a: Person { ${Object.keys(person).map(key => `${key}: $${key}`).join(',')} })`;

      const result = await session.run(query, person);

      console.log(result);
    }


  //for doctorData

  for (let i = 0; i < doctorData.length; i++) {
    const doctor = doctorData[i];

    const query = `CREATE (b: Doctor { ${Object.keys(doctor).map(key => `${key}: $${key}`).join(',')} })`;

    const personRelQuery = getRelationshipQuery('Doctor', 'Person', 'personId', 'id', 'DOCTOR_PERSON_REL');


    const result = await session.run(query, doctor);
    const PersonRelResult = await session.run(personRelQuery);

    console.log(result, PersonRelResult);
  }


    //for patientData

    for (let i = 0; i < patientData.length; i++) {
      const patient = patientData[i];

      const query = `CREATE (c: Patient { ${Object.keys(patient).map(key => `${key}: $${key}`).join(',')} })`;

      const result = await session.run(query, patient);

      console.log(result);
    }


    //for complaintData

    for (let i = 0; i < complaintData.length; i++) {
      const complaint = complaintData[i];

      const query = `CREATE (d: Complaint { ${Object.keys(complaint).map(key => `${key}: $${key}`).join(',')} })`;

      const result = await session.run(query, complaint);

      console.log(result);
    }

    //for historyData

    for (let i = 0; i < historyData.length; i++) {
      const history = historyData[i];

      const query = `CREATE (e: History { ${Object.keys(history).map(key => `${key}: $${key}`).join(',')} })`;

      const result = await session.run(query, history);

      console.log(result);
    }

    //for allergyHistoryData

    for (let i = 0; i < allergyHistoryData.length; i++) {
      const allergyHistory = allergyHistoryData[i];

      const query = `CREATE (f: AllergyHistory { ${Object.keys(allergyHistory).map(key => `${key}: $${key}`).join(',')} })`;

      const result = await session.run(query, allergyHistory);

      console.log(result);
    }

    //for treatmentEpisodeData

    for (let i = 0; i < treatmentEpisodeData.length; i++) {
      const treatmentEpisode = treatmentEpisodeData[i];

      const query = `CREATE (g: TreatmentEpisode { ${Object.keys(treatmentEpisode).map(key => `${key}: $${key}`).join(',')} })`;

      const result = await session.run(query, treatmentEpisode);

      console.log(result);
    }

    //for visitData

    for (let i = 0; i < visitData.length; i++) {
      const visit = visitData[i];

      const query = `CREATE (h: Visit { ${Object.keys(visit).map(key => `${key}: $${key}`).join(',')} })`;

      const result = await session.run(query, visit);

      console.log(result);
    }




  } finally {
    await session.close();
  }

  // on application exit:
  await driver.close();
})();
