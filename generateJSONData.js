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
  generateDoctor();
  generatePatient();
  generateComplaint();
  generateHistory();
  generateAllergyHistory();
  generateTreatmentEpisode();
  generateVisit();
};

generateAllData(10000);
