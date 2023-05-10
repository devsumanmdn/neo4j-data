const fs = require('fs')

const getOneRandom = require('./getOneRandom');
const randomiseWords = require('./randomiseWords');

const doctorsDummyJson = require('./graph database/doctor.json');
const personsData = require('./json/persons.json');

const getDoctors = (count) =>
  Array(count)
    .fill(1)
    .map((_, index) => ({
      drId: index,
      personId: getOneRandom(personsData.map(({ id }) => id)),
      organizationId: getOneRandom(personsData.map(({ id }) => id)),
      specialization: getOneRandom(doctorsDummyJson[0].specialization),
    }));

const doctors = getDoctors(10000);
fs.writeFileSync('./json/doctors.json', JSON.stringify(doctors));
console.log('Successfully created', doctors.length, 'doctors.');
