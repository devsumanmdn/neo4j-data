const fs = require('fs');

const getOneRandom = require('./getOneRandom');
const { loremIpsum } = require('lorem-ipsum');
const getRandomNumberWithinRange = require('./getRandomNumberWithinRange');

const getHistories = (count) => {
  const personsData = require('./json/persons.json');

  return Array(count)
    .fill(1)
    .map((_, index) => ({
      historyId: index + 1,
      ptId: getOneRandom(personsData.map(({ id }) => id)),
      familyHistoryDetails: loremIpsum({
        count: getRandomNumberWithinRange(3, 10),
      }),
      pastHistoryDetails: loremIpsum({
        count: getRandomNumberWithinRange(3, 10),
      }),
      presentHistoryDetails: loremIpsum({
        count: getRandomNumberWithinRange(3, 10),
      }),
      personalHistoryDetails: loremIpsum({
        count: getRandomNumberWithinRange(3, 10),
      }),
    }));
};

const generateHistory = (count) => {
  const histories = getHistories(count);
  fs.writeFileSync('./json/histories.json', JSON.stringify(histories));
  console.log('Successfully created', histories.length, 'histories.');
};

module.exports = generateHistory;
