const neo4j = require('neo4j-driver');
const fs = require('fs');

const getRelationshipQuery = require('./getRelationshipQuery');
const deleteAll = require('./deleteAll');
const testQuery = require('./testQuery');
const { generateAllData, getKeyAndFolder } = require('./generateJSONData');
const writeToDB = require('./stream2');

const runForCount = async (skip) => {
  const [_, __] = await Promise.all([deleteAll(), generateAllData(count)]);

  const uri = 'bolt://127.0.0.1:7687';
  const driver = neo4j.driver(uri, neo4j.auth.basic('neo4j', 'Mou@2997'));
  const session = driver.session();
  try {
    const stats = JSON.parse(fs.readFileSync('./stats.json'));

    const { key, folder } = getKeyAndFolder(skip);

    await writeToDB({
      file: `${folder}persons.csv`,
      label: 'Person',
    });

    await writeToDB({
      file: `${folder}doctors.csv`,
      label: 'Doctor',
    });

    const doctorPersonRelQuery = getRelationshipQuery(
      'Doctor',
      'Person',
      'personId',
      'id',
      'DOCTOR_PERSON_REL'
    );
    await session.run(doctorPersonRelQuery);

    await writeToDB({
      file: `${folder}patients.csv`,
      label: 'Patient',
    });
    const patientPersonRelQuery = getRelationshipQuery(
      'Patient',
      'Person',
      'Id',
      'id',
      'PATIENT_PERSON_REL'
    );
    await session.run(patientPersonRelQuery);

    await writeToDB({
      file: `${folder}histories.csv`,
      label: 'History',
    });
    const historyPatientRelQuery = getRelationshipQuery(
      'History',
      'Patient',
      'ptId',
      'ptId',
      'HISTORY_PATIENT_REL'
    );
    await session.run(historyPatientRelQuery);

    await writeToDB({
      file: `${folder}allergyhistories.csv`,
      label: 'AllergyHistory',
    });
    const allergyHistoryPatientRelQuery = getRelationshipQuery(
      'AllergyHistory',
      'Patient',
      'ptId',
      'ptId',
      'ALLERGY_HISTORY_PATIENT_REL'
    );
    await session.run(allergyHistoryPatientRelQuery);

    await writeToDB({
      file: `${folder}complaints.csv`,
      label: 'Complaint',
    });
    const complaintPatientRelQuery = getRelationshipQuery(
      'Complaint',
      'Patient',
      'ptId',
      'ptId',
      'COMPLAINT_PATIENT_REL'
    );
    await session.run(complaintPatientRelQuery);

    await writeToDB({
      file: `${folder}treatmentepisodes.csv`,
      label: 'TreatmentEpisode',
    });
    const treatmentEpisodePatientRelQuery = getRelationshipQuery(
      'TreatmentEpisode',
      'Patient',
      'ptId',
      'ptId',
      'TREATMENT_EPISODE_PATIENT_REL'
    );
    await session.run(treatmentEpisodePatientRelQuery);

    const treatmentEpisodeComplaintRelQuery = getRelationshipQuery(
      'TreatmentEpisode',
      'Complaint',
      'complaintId',
      'complaintId',
      'TREATMENT_EPISODE_COMPLAINT_REL'
    );
    await session.run(treatmentEpisodeComplaintRelQuery);

    await writeToDB({
      file: `${folder}visits.csv`,
      label: 'Visit',
    });
    const visitPatientRelQuery = getRelationshipQuery(
      'Visit',
      'Patient',
      'ptId',
      'ptId',
      'VISIT_PATIENT_REL'
    );
    await session.run(visitPatientRelQuery);

    const visitComplaintRelQuery = getRelationshipQuery(
      'Visit',
      'Complaint',
      'complaintId',
      'complaintId',
      'VISIT_COMPLAINT_REL'
    );
    await session.run(visitComplaintRelQuery);

    const visitTreatmentEpisodeRelQuery = getRelationshipQuery(
      'Visit',
      'TreatmentEpisode',
      'trtEpId',
      'treatEpId',
      'VISIT_TREATMENT_EPISODE_REL'
    );
    await session.run(visitTreatmentEpisodeRelQuery);

    // const timeInMS = await testQuery();

    // stats += `\t${timeInMS}ms\n`;
    // console.log(stats);

    // fs.appendFileSync('./stats.txt', stats);
    console.log('Successfully ran for');
  } finally {
    await session.close();
  }

  // on application exit:
  await driver.close();
};

module.exports = runForCount;
