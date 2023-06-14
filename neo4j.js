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



  //for personData

    for (let i = 0; i < personData.length; i++) {
      const person = personData[i];

      const query = `CREATE (a: Person { ${Object.keys(person).map(key => `${key}: $${key}`).join(',')} })`;

      const result = await session.run(query, person);

      // console.log(result);
    }


  //for doctorData

    for (let i = 0; i < doctorData.length; i++) {
    const doctor = doctorData[i];

    const query = `CREATE (b: Doctor { ${Object.keys(doctor).map(key => `${key}: $${key}`).join(',')} })`;

    const result = await session.run(query, doctor);
  }
  const doctorPersonRelQuery = getRelationshipQuery('Doctor', 'Person', 'personId', 'id', 'DOCTOR_PERSON_REL');
  await session.run(doctorPersonRelQuery);


  //for patientData

    for (let i = 0; i < patientData.length; i++) {
      const patient = patientData[i];

      const query = `CREATE (c: Patient { ${Object.keys(patient).map(key => `${key}: $${key}`).join(',')} })`;

      const result = await session.run(query, patient);
    }
    const patientPersonRelQuery = getRelationshipQuery('Patient', 'Person', 'Id', 'id', 'PATIENT_PERSON_REL');
    await session.run(patientPersonRelQuery);


    //for historyData

    for (let i = 0; i < historyData.length; i++) {
      const history = historyData[i];

      const query = `CREATE (e: History { ${Object.keys(history).map(key => `${key}: $${key}`).join(',')} })`;

      const result = await session.run(query, history);
    }
    const historyPatientRelQuery = getRelationshipQuery('History','Patient', 'ptId', 'ptId', 'HISTORY_PATIENT_REL');
    await session.run(historyPatientRelQuery);


    //for allergyHistoryData

    for (let i = 0; i < allergyHistoryData.length; i++) {
      const allergyHistory = allergyHistoryData[i];

      const query = `CREATE (f: AllergyHistory { ${Object.keys(allergyHistory).map(key => `${key}: $${key}`).join(',')} })`;

      const result = await session.run(query, allergyHistory);
    }
    const allergyHistoryPatientRelQuery = getRelationshipQuery('AllergyHistory','Patient', 'ptId', 'ptId', 'ALLERGY_HISTORY_PATIENT_REL');
    await session.run(allergyHistoryPatientRelQuery);


    //for complaintData

    for (let i = 0; i < complaintData.length; i++) {
      const complaint = complaintData[i];

      const query = `CREATE (d: Complaint { ${Object.keys(complaint).map(key => `${key}: $${key}`).join(',')} })`;

      const result = await session.run(query, complaint);
    }
    const complaintPatientRelQuery = getRelationshipQuery('Complaint','Patient', 'ptId', 'ptId', 'COMPLAINT_PATIENT_REL');
    await session.run(complaintPatientRelQuery);


    //for treatmentEpisodeData

    for (let i = 0; i < treatmentEpisodeData.length; i++) {
      const treatmentEpisode = treatmentEpisodeData[i];

      const query = `CREATE (g: TreatmentEpisode { ${Object.keys(treatmentEpisode).map(key => `${key}: $${key}`).join(',')} })`;

      const result = await session.run(query, treatmentEpisode);
    }
    const treatmentEpisodePatientRelQuery = getRelationshipQuery('TreatmentEpisode', 'Patient', 'ptId', 'ptId', 'TREATMENT_EPISODE_PATIENT_REL');
    await session.run(treatmentEpisodePatientRelQuery);

    const treatmentEpisodeComplaintRelQuery = getRelationshipQuery('TreatmentEpisode', 'Complaint', 'complaintId', 'complaintId', 'TREATMENT_EPISODE_COMPLAINT_REL');
    await session.run(treatmentEpisodeComplaintRelQuery);


    //for visitData

    for (let i = 0; i < visitData.length; i++) {
      const visit = visitData[i];

      const query = `CREATE (h: Visit { ${Object.keys(visit).map(key => `${key}: $${key}`).join(',')} })`;

      const result = await session.run(query, visit);
    }
    const visitPatientRelQuery = getRelationshipQuery('Visit','Patient', 'ptId', 'ptId', 'VISIT_PATIENT_REL');
    await session.run(visitPatientRelQuery);

    const visitComplaintRelQuery = getRelationshipQuery('Visit','Complaint', 'complaintId', 'complaintId', 'VISIT_COMPLAINT_REL');
    await session.run(visitComplaintRelQuery);

    const visitTreatmentEpisodeRelQuery = getRelationshipQuery('Visit','TreatmentEpisode', 'trtEpId', 'treatEpId', 'VISIT_TREATMENT_EPISODE_REL');
    await session.run(visitTreatmentEpisodeRelQuery);


  } finally {
    await session.close();
  }

  // on application exit:
  await driver.close();
})();
