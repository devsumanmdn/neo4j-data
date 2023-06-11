const fs = require('fs')

const getOneRandom = require('./getOneRandom');
const personsData = require('./json/persons.json');
const { loremIpsum } = require('lorem-ipsum');
const getRandomNumberWithinRange = require('./getRandomNumberWithinRange');
const { count } = require('console');

const getHistories = (count) =>
  Array(count)
    .fill(1)
    .map((_, index) => ({
      historyId: index+1,
      ptId: getOneRandom(personsData.map(({ id }) => id)),
      familyHistoryDetails: loremIpsum({ count: getRandomNumberWithinRange(3, 10) }),
      pastHistoryDetails: loremIpsum({ count: getRandomNumberWithinRange(3, 10) }),
      presentHistoryDetails: loremIpsum({ count: getRandomNumberWithinRange(3, 10) }),
      personalHistoryDetails: loremIpsum({ count: getRandomNumberWithinRange(3, 10) }),
      }));

const generateHistory = (count) => {
const histories = getHistories(count);
fs.writeFileSync('./json/histories.json', JSON.stringify(histories));
console.log('Successfully created', histories.length, 'histories.');
  }

  module.exports = generateHistory;
