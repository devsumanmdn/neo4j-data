const generatePerson = require("./getPersons");
const generateDoctor = require("./getDoctors");
const generatePatient = require("./getPatients");
const generateComplaint = require("./getComplaints");
const generateHistory = require("./getHistories");
const generateAllergyHistory = require("./getAllergyhistories");
const generateTreatmentEpisode = require("./getTreatmentepisodes");
const generateVisit = require("./getVisits");


const generateAllData  = async (count) => {
  generatePerson(count).then(() => {
    generateDoctor(count);
    generatePatient(count);
    generateComplaint(count);
    generateHistory(count);
    generateAllergyHistory(count);
    generateTreatmentEpisode(count);
    generateVisit(count);
  });
};

generateAllData(10000);
