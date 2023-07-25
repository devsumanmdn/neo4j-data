const fs = require('fs');

const getOneRandom = require('./getOneRandom');

const doctorsDummyJson = require('./graph database/doctor.json');
const getRandomNumberWithinRange = require('./getRandomNumberWithinRange');

const getDoctors = () => {
  const personsData = require('./json/persons.json');

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

const generateDoctor = () => {
  const doctors = getDoctors();
  fs.writeFileSync('./json/doctors.json', JSON.stringify(doctors));
  console.log('Successfully created', doctors.length, 'doctors.');
};

module.exports = generateDoctor;
