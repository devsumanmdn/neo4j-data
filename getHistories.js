const fs = require('fs')

const getOneRandom = require('./getOneRandom');
const randomiseWords = require('./randomiseWords');

const historiesDummyJson = require('./graph database/history.json');
const personsData = require('./json/persons.json');
const { loremIpsum } = require('lorem-ipsum');
const getRandomNumberWithinRange = require('./getRandomNumberWithinRange');

const getHistories = (count) =>
  Array(count)
    .fill(1)
    .map((_, index) => ({
      historyId: index,
      ptId: getOneRandom(personsData.map(({ id }) => id)),
      familyHistoryDetails: loremIpsum({ count: getRandomNumberWithinRange(3, 10) }),
      pastHistoryDetails: loremIpsum({ count: getRandomNumberWithinRange(3, 10) }),
      presentHistoryDetails: loremIpsum({ count: getRandomNumberWithinRange(3, 10) }),
      personalHistoryDetails: loremIpsum({ count: getRandomNumberWithinRange(3, 10) }),
      }));

const histories = getHistories(10000);
fs.writeFileSync('./json/histories.json', JSON.stringify(histories));
console.log('Successfully created', histories.length, 'histories.');
