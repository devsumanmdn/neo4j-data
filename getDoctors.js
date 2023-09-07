const fs = require('fs');
const { parse } = require('csv-parse');
const { Parser } = require('@json2csv/plainjs');

const getOneRandom = require('./getOneRandom');

const doctorsDummyJson = require('./graph database/doctor.json');
const getRandomNumberWithinRange = require('./getRandomNumberWithinRange');
const writeCSVFile = require('./writeCSVFile');
const { Readable } = require('stream');

const parserWithHeader = new Parser({});
const parserWithoutHeader = new Parser({ header: false });

async function * getDoctors() {
  const readStream = fs.createReadStream('./json/persons.csv');
  const parser = readStream.pipe(parse({ columns: true }));
  let index = 0;
  let personCount = 0;

  for await (const record of parser) {
    personCount++;
    console.log(record.occupation);
    if (record.occupation === 'Doctor') {
      const doctor = {
        drId: index + 1,
        personId: record.id,
        organizationId: getRandomNumberWithinRange(1, 50),
        specialization: getOneRandom(doctorsDummyJson[0].specialization),
      };

      let csv;
      csv = '\n' + parserWithoutHeader.parse(doctor);
      if (index === 0) {
        csv = parserWithHeader.parse(doctor);
      }
      console.log(csv);
      index++;

      yield Promise.resolve(csv);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    yield ''
  }

  console.log('personCount', personCount)
  console.log('Doctor', index)
};

const generateDoctor = async () => {
  const readable = Readable.from(getDoctors());
  await writeCSVFile({ file: './json/doctors.csv', readable });
  console.log('Successfully created', 'doctors.');
  return;
};

getDoctors();

module.exports = generateDoctor;
