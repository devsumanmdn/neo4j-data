const fs = require('fs')

const getOneRandom = require('./getOneRandom');

const complaintsDummyJson = require('./graph database/complaint.json');
const personsData = require('./json/persons.json');
const { loremIpsum } = require('lorem-ipsum');
const getRandomNumberWithinRange = require('./getRandomNumberWithinRange');
const { count } = require('console');

const getComplaints = (count) =>
  Array(count)
    .fill(1)
    .map((_, index) => ({
      complaintId: index+1,
      ptId: getOneRandom(personsData.map(({ id }) => id)),
      complaintDetails: loremIpsum({ count: getRandomNumberWithinRange(3, 10) }),
      complaintStatus: getOneRandom(complaintsDummyJson[0].complaintStatus),
    }));

const generateComplaint = (count) => {
const complaints = getComplaints(count);
fs.writeFileSync('./json/complaints.json', JSON.stringify(complaints));
console.log('Successfully created', complaints.length, 'complaints.');
}

module.exports = generateComplaint;
