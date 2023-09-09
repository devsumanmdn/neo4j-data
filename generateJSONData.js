const fs = require('fs');
const { parse } = require('csv-parse/sync');
const generatePerson = require('./getPersons');
const generateDoctor = require('./getDoctors');
const generatePatient = require('./getPatients');
const generateComplaint = require('./getComplaints');
const generateHistory = require('./getHistories');
const generateAllergyHistory = require('./getAllergyhistories');
const generateTreatmentEpisode = require('./getTreatmentepisodes');
const generateVisit = require('./getVisits');

const CHUNK_SIZE = 1000;

const getKeyAndFolder = (startCount) => {

  const key = `${startCount}-${startCount + CHUNK_SIZE}`;
  const folder = `./csv/${key}/`;

  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
  }

  return { key, folder };
};

const generateAllData = async (count) => {
  if (count > CHUNK_SIZE) {
    for (let start = 0; start < count; start += CHUNK_SIZE) {
      if (start + CHUNK_SIZE > count) {
        await generateChunk(start, count);
      } else {
        await generateChunk(start, start + CHUNK_SIZE);
      }
    }
  } else {
    await generateChunk(0, count);
  }
};

let prevKey = '';

const generateChunk = async (startCount, endCount) => {
  if (!fs.existsSync('./csv')) {
    fs.mkdirSync('./csv');
  }
  await deleteAllFilesInDir('./csv');

  const { key, folder } = getKeyAndFolder(startCount);

  const statFile = './stats.json';
  let stats = {};
  try {
    stats = JSON.parse(fs.readFileSync(statFile).toString());
  } catch (_) {
    console.log('No stats found');
  }

  await generatePerson(startCount, endCount, folder);
  const countDoctor = await generateDoctor(
    folder,
    stats[prevKey]?.doctors || 0
  );
  const countPatient = await generatePatient(
    folder,
    stats[prevKey]?.patients || 0
  );
  const countComplaint = await generateComplaint(
    folder,
    stats[prevKey]?.complaints || 0
  );
  const countHistory = await generateHistory(
    folder,
    stats[prevKey]?.histories || 0
  );
  const countAllergyHistory = await generateAllergyHistory(
    folder,
    stats[prevKey]?.allergyhistories || 0
  );
  const countTreatmentEpisode = await generateTreatmentEpisode(
    folder,
    stats[prevKey]?.treatmentepisodes || 0
  );
  const countVisit = await generateVisit(folder, stats[prevKey]?.visits || 0);

  const personsSize = fs.statSync(`${folder}persons.csv`);
  const doctorsSize = fs.statSync(`${folder}doctors.csv`);
  const patientsSize = fs.statSync(`${folder}patients.csv`);
  const complaintsSize = fs.statSync(`${folder}complaints.csv`);
  const historiesSize = fs.statSync(`${folder}histories.csv`);
  const allergyhistoriesSize = fs.statSync(`${folder}allergyhistories.csv`);
  const treatmentepisodesSize = fs.statSync(`${folder}treatmentepisodes.csv`);
  const visitsSize = fs.statSync(`${folder}visits.csv`);

  stats[key] = {
    persons: personsSize,
    doctors: doctorsSize,
    patients: patientsSize,
    complaints: complaintsSize,
    histories: historiesSize,
    allergyhistories: allergyhistoriesSize,
    treatmentepisodes: treatmentepisodesSize,
    visits: visitsSize,
  };

  fs.writeFileSync(statFile, JSON.stringify(stats));

  prevKey = key;

  return `${endCount}\t${countDoctor}\t${countPatient}\t${countHistory}\t${countAllergyHistory}\t${countComplaint}\t${countTreatmentEpisode}\t${countVisit}\t${
    personsSize.size / 1024
  }\t${doctorsSize.size / 1024}\t${patientsSize.size / 1024}\t${
    historiesSize.size / 1024
  }\t${allergyhistoriesSize.size / 1024}\t${complaintsSize.size / 1024}\t${
    treatmentepisodesSize.size / 1024
  }\t${visitsSize.size / 1024}`;
};

module.exports = { generateAllData, getKeyAndFolder, CHUNK_SIZE };
