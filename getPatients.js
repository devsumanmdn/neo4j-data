const fs = require('fs');
const { parse } = require('csv-parse/sync');

const getOneRandom = require('./getOneRandom');
const randomiseWords = require('./randomiseWords');

const patientsDummyJson = require('./graph database/patient.json');
const writeJsonToCSVFile = require('./writeJsonToCSVFile');

const getPatients = (folder, lastCount) => {
  const personsData = parse(fs.readFileSync(`${folder}persons.csv`).toString(), {
    delimiter: ',',
    columns: true,
  });

  const personIdsWhoAreNotDoctor = personsData
    .filter(({ occupation }) => occupation !== 'Doctor')
    .map(({ id }) => id);

  return personIdsWhoAreNotDoctor.map((personId, index) => ({
    ptId: lastCount + index + 1,
    Id: personId,
    alternatePtIds: randomiseWords(
      personsData.map(({ id }) => id),
      1,
      5
    )
      .split(' ')
      .map((v) => parseInt(v)).join('|'),
    ecpId: getOneRandom(personsData.map(({ id }) => id)),
    ecpRelation: getOneRandom(patientsDummyJson[0].ecpRelation),
    cPAHomeId: Math.random(Math.random() * personIdsWhoAreNotDoctor.length * 2),
    cPAHomeRelation: getOneRandom(patientsDummyJson[0].ecpRelation),
  }));
};

const generatePatient = async (folder, lastCount) => {
  const patients = getPatients(folder, lastCount);
  await writeJsonToCSVFile({ file: `${folder}patients.csv`, data: patients });
  //console.log('Successfully created', patients.length, 'patients.');
  return patients.length;
};

module.exports = generatePatient;
