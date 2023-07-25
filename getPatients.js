const fs = require('fs');

const getOneRandom = require('./getOneRandom');
const randomiseWords = require('./randomiseWords');

const patientsDummyJson = require('./graph database/patient.json');

const getPatients = () => {
  const personsData = require('./json/persons.json');


  const personIdsWhoAreNotDoctor = personsData
    .filter(({ occupation }) => occupation !== 'Doctor')
    .map(({ id }) => id);

  return personIdsWhoAreNotDoctor
    .map((personId, index) => ({
      ptId: index + 1,
      Id: personId,
      alternatePtIds: randomiseWords(
        personsData.map(({ id }) => id),
        1,
        5
      )
        .split(' ')
        .map((v) => parseInt(v)),
      ecpId: getOneRandom(personsData.map(({ id }) => id)),
      ecpRelation: getOneRandom(patientsDummyJson[0].ecpRelation),
      cPAHomeId: Math.random(Math.random() * personIdsWhoAreNotDoctor.length * 2),
      cPAHomeRelation: getOneRandom(patientsDummyJson[0].ecpRelation),
    }));
};

const generatePatient = () => {
  const patients = getPatients();
  fs.writeFileSync('./json/patients.json', JSON.stringify(patients));
  console.log('Successfully created', patients.length, 'patients.');
};

module.exports = generatePatient;
