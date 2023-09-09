const fs = require('fs');
const { parse } = require("csv-parse/sync");

const getOneRandom = require('./getOneRandom');

const doctorsDummyJson = require('./graph database/doctor.json');
const getRandomNumberWithinRange = require('./getRandomNumberWithinRange');
const writeJsonToCSVFile = require('./writeJsonToCSVFile');

const getDoctors = (personsSize) => {
  const personsData = parse(fs.readFileSync('./json/persons.csv').toString(), { delimiter: ',', columns: true });

  let personIdsWhoAreDoctor = personsData
    .filter(({ occupation }) => occupation === 'Doctor')
    .map(({ id }) => id);

  return personIdsWhoAreDoctor.map((personId, index) => ({
    drId: personsSize + index + 1,
    personId: personId,
    organizationId: getRandomNumberWithinRange(1, 50),
    specialization: getOneRandom(doctorsDummyJson[0].specialization),
  }));
};

const generateDoctor = async (folder, lastCount) => {
  const doctors = getDoctors(lastCount);
  await writeJsonToCSVFile({ file: `${folder}doctors.csv`, data: doctors });
  console.log('Successfully created', doctors.length, 'doctors.');
  return doctors.length;
};

module.exports = generateDoctor;
