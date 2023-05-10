const fs = require('fs')

const getOneRandom = require('./getOneRandom');
const randomiseWords = require('./randomiseWords');

const complaintsDummyJson = require('./graph database/complaint.json');
const personsData = require('./json/persons.json');
const { loremIpsum } = require('lorem-ipsum');
const getRandomNumberWithinRange = require('./getRandomNumberWithinRange');

const getComplaints = (count) =>
  Array(count)
    .fill(1)
    .map((_, index) => ({
      complaintId: index,
      ptId: getOneRandom(personsData.map(({ id }) => id)),
      complaintDetails: loremIpsum({ count: getRandomNumberWithinRange(3, 10) }),
      complaintStatus: getOneRandom(complaintsDummyJson[0].complaintStatus),
    }));

const complaints = getComplaints(10000);
fs.writeFileSync('./json/complaints.json', JSON.stringify(complaints));
console.log('Successfully created', complaints.length, 'complaints.');
