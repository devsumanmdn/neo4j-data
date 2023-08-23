const fs = require('fs');
const generatePerson = require('./getPersons');
const generateDoctor = require('./getDoctors');
const generatePatient = require('./getPatients');
const generateComplaint = require('./getComplaints');
const generateHistory = require('./getHistories');
const generateAllergyHistory = require('./getAllergyhistories');
const generateTreatmentEpisode = require('./getTreatmentepisodes');
const generateVisit = require('./getVisits');

const generateAllData = async (count) => {
  await generatePerson(count);
  const countDoctor = await generateDoctor();
  const countPatient = await generatePatient();
  const countComplaint = await generateComplaint();
  const countHistory = await generateHistory();
  const countAllergyHistory = await generateAllergyHistory();
  const countTreatmentEpisode = await generateTreatmentEpisode();
  const countVisit = await generateVisit();

  const allergyhistoriesStat = fs.statSync('./json/allergyhistories.json');
  const complaintsStat = fs.statSync('./json/complaints.json');
  const doctorsStat = fs.statSync('./json/doctors.json');
  const historiesStat = fs.statSync('./json/histories.json');
  const patientsStat = fs.statSync('./json/patients.json');
  const personsStat = fs.statSync('./json/persons.json');
  const treatmentepisodesStat = fs.statSync('./json/treatmentepisodes.json');
  const visitsStat = fs.statSync('./json/visits.json');

  return `${count}\t${countDoctor}\t${countPatient}\t${countHistory}\t${countAllergyHistory}\t${countComplaint}\t${countTreatmentEpisode}\t${countVisit}\t${personsStat.size/1024}\t${doctorsStat.size/1024}\t${patientsStat.size/1024}\t${historiesStat.size/1024}\t${allergyhistoriesStat.size/1024}\t${complaintsStat.size/1024}\t${treatmentepisodesStat.size/1024}\t${visitsStat.size/1024}`;
};

module.exports = generateAllData;
