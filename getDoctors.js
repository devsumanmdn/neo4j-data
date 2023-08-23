const fs = require('fs');

const getOneRandom = require('./getOneRandom');

const doctorsDummyJson = require('./graph database/doctor.json');
const getRandomNumberWithinRange = require('./getRandomNumberWithinRange');
const writeJsonFile = require('./writeJsonFile');

const getDoctors = () => {
  const personsData = JSON.parse(fs.readFileSync('./json/persons.json').toString());

  const personIdsWhoAreDoctor = personsData
    .filter(({ occupation }) => occupation === 'Doctor')
    .map(({ id }) => id);

  return personIdsWhoAreDoctor.map((personId, index) => ({
    drId: index + 1,
    personId: personId,
    organizationId: getRandomNumberWithinRange(1, 50),
    specialization: getOneRandom(doctorsDummyJson[0].specialization),
  }));
};

const generateDoctor = async () => {
  const doctors = getDoctors();
  await writeJsonFile({ file: './json/doctors.json', data: doctors });
  console.log('Successfully created', doctors.length, 'doctors.');
  return doctors.length;
};

module.exports = generateDoctor;
