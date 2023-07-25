const fs = require('fs');

const getOneRandom = require('./getOneRandom');

const complaintsDummyJson = require('./graph database/complaint.json');
const { loremIpsum } = require('lorem-ipsum');
const getRandomNumberWithinRange = require('./getRandomNumberWithinRange');
const randomiseArray = require('./randomiseArray');

const getComplaints = (count) => {
  const patientsData = require('./json/patients.json');

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
    complaintId: index + 1,
  }));
};

const generateComplaint = () => {
  const complaints = getComplaints();
  fs.writeFileSync('./json/complaints.json', JSON.stringify(complaints));
  console.log('Successfully created', complaints.length, 'complaints.');
};

module.exports = generateComplaint;
