const fs = require('fs');
const { parse } = require("csv-parse/sync");

const getOneRandom = require('./getOneRandom');

const complaintsDummyJson = require('./graph database/complaint.json');
const { loremIpsum } = require('lorem-ipsum');
const getRandomNumberWithinRange = require('./getRandomNumberWithinRange');
const randomiseArray = require('./randomiseArray');
const writeJsonToCSVFile = require('./writeJsonToCSVFile');

const getComplaints = (folder, lastCount) => {
    const patientsData = parse(fs.readFileSync(`${folder}patients.csv`).toString(), { delimiter: ',', columns: true });

  const complaints = [];
  patientsData.forEach(({ ptId }) => {
    const numberOfCompaints = getRandomNumberWithinRange(1, 5);
    complaints.push(
      ...Array(numberOfCompaints)
        .fill(1)
        .map((_, index) => ({
          // complaintId: index + 1,
          ptId,
          complaintDetails: loremIpsum({
            count: getRandomNumberWithinRange(3, 10),
          }),
          complaintStatus: getOneRandom(complaintsDummyJson[0].complaintStatus),
        }))
    );

  });
  const shuffledComplaints = randomiseArray(complaints);
  return shuffledComplaints.map((complaint, index) => ({
    ...complaint,
    complaintId: lastCount + index + 1,
  }));
};

const generateComplaint = async (folder, lastCount) => {
  const complaints = getComplaints(folder, lastCount);
  await writeJsonToCSVFile({ file: `${folder}complaints.csv`, data: complaints });
  //console.log('Successfully created', complaints.length, 'complaints.');
  return complaints.length;
};

module.exports = generateComplaint;
