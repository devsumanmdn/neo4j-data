const neo4j = require('neo4j-driver');
const fs = require('fs');

const getRelationshipQuery = require('./getRelationshipQuery');
const { getKeyAndFolder, CHUNK_SIZE } = require('./generateJSONData');
const writeDataToDB = require('./streamJson');

const addRecordsAndCreateRelationshipsForCount = async (skip) => {
  const uri = 'bolt://127.0.0.1:7687';
  const driver = neo4j.driver(uri, neo4j.auth.basic('neo4j', 'Mou@2997'));
  const session = driver.session();
  try {
    const stats = JSON.parse(fs.readFileSync('./stats.json'));

    const { key, folder } = getKeyAndFolder(skip);

    const { key: PrevKey } = skip ? getKeyAndFolder(skip - CHUNK_SIZE) : {key: '' };
    let prevStat = stats[PrevKey];
    let stat = stats[key];

    await writeDataToDB({
      file: `${folder}persons.csv`,
      label: 'Person',
    });

    await writeDataToDB({
      file: `${folder}doctors.csv`,
      label: 'Doctor',
    });

    const doctorPersonRelQuery = getRelationshipQuery(
      'Doctor',
      'Person',
      'personId',
      'id',
      'DOCTOR_PERSON_REL',
      prevStat?.doctors.count || 0,
      "drId"
    );
    await session.run(doctorPersonRelQuery);
    // console.log('Done running rel query for table Doctor');

    await writeDataToDB({
      file: `${folder}patients.csv`,
      label: 'Patient',
    });
    const patientPersonRelQuery = getRelationshipQuery(
      'Patient',
      'Person',
      'Id',
      'id',
      'PATIENT_PERSON_REL',
      prevStat?.patients.count || 0,
      'ptId'
    );
    await session.run(patientPersonRelQuery);
    // console.log('Done running rel query for table Patient');

    await writeDataToDB({
      file: `${folder}histories.csv`,
      label: 'History',
    });
    const historyPatientRelQuery = getRelationshipQuery(
      'History',
      'Patient',
      'ptId',
      'ptId',
      'HISTORY_PATIENT_REL',
      prevStat?.histories.count || 0,
      "historyId"
    );
    await session.run(historyPatientRelQuery);
    // console.log('Done running rel query for table History');

    await writeDataToDB({
      file: `${folder}allergyhistories.csv`,
      label: 'AllergyHistory',
    });
    const allergyHistoryPatientRelQuery = getRelationshipQuery(
      'AllergyHistory',
      'Patient',
      'ptId',
      'ptId',
      'ALLERGY_HISTORY_PATIENT_REL',
      prevStat?.allergyhistories.count || 0,
      "allergyHId"
    );
    await session.run(allergyHistoryPatientRelQuery);
    // console.log('Done running rel query for table AllergyHistory');

    await writeDataToDB({
      file: `${folder}complaints.csv`,
      label: 'Complaint',
    });
    const complaintPatientRelQuery = getRelationshipQuery(
      'Complaint',
      'Patient',
      'ptId',
      'ptId',
      'COMPLAINT_PATIENT_REL',
      prevStat?.complaints.count || 0,
      "complaintId"
    );
    await session.run(complaintPatientRelQuery);
    // console.log('Done running rel query for table Complaint');

    await writeDataToDB({
      file: `${folder}treatmentEpisodes.csv`,
      label: 'TreatmentEpisode',
    });
    const treatmentEpisodePatientRelQuery = getRelationshipQuery(
      'TreatmentEpisode',
      'Patient',
      'ptId',
      'ptId',
      'TREATMENT_EPISODE_PATIENT_REL',
      prevStat?.treatmentEpisodes.count || 0,
      "treatEpId"
    );
    await session.run(treatmentEpisodePatientRelQuery);
    // console.log('Done running rel query for table TreatmentEpisode');

    const treatmentEpisodeComplaintRelQuery = getRelationshipQuery(
      'TreatmentEpisode',
      'Complaint',
      'complaintId',
      'complaintId',
      'TREATMENT_EPISODE_COMPLAINT_REL',
      prevStat?.treatmentEpisodes.count || 0,
      "treatEpId"
    );
    await session.run(treatmentEpisodeComplaintRelQuery);
    // console.log('Done running rel query for table TreatmentEpisode');

    await writeDataToDB({
      file: `${folder}visits.csv`,
      label: 'Visit',
    });
    const visitPatientRelQuery = getRelationshipQuery(
      'Visit',
      'Patient',
      'ptId',
      'ptId',
      'VISIT_PATIENT_REL',
      prevStat?.visits.count || 0,
      "vId"
    );
    await session.run(visitPatientRelQuery);
    // console.log('Done running rel query for table Visit');

    const visitComplaintRelQuery = getRelationshipQuery(
      'Visit',
      'Complaint',
      'complaintId',
      'complaintId',
      'VISIT_COMPLAINT_REL',
      prevStat?.visits.count || 0,
      "vId"
    );
    await session.run(visitComplaintRelQuery);
    // console.log('Done running rel query for table Visit');

    const visitTreatmentEpisodeRelQuery = getRelationshipQuery(
      'Visit',
      'TreatmentEpisode',
      'trtEpId',
      'treatEpId',
      'VISIT_TREATMENT_EPISODE_REL',
      prevStat?.visits.count || 0,
      "vId"
    );
    await session.run(visitTreatmentEpisodeRelQuery);

    // const timeInMS = await testQuery();
    // console.log('Done running rel query for table Visit');
  } finally {
    await session.close();
  }

  // on application exit:
  await driver.close();
};

module.exports = addRecordsAndCreateRelationshipsForCount;
