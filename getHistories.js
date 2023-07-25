const fs = require('fs');
const { loremIpsum } = require('lorem-ipsum');

const getRandomNumberWithinRange = require('./getRandomNumberWithinRange');
const randomiseArray = require('./randomiseArray');

const getHistories = () => {
  const pateientsData = require('./json/patients.json');

  const historys = [];
  pateientsData.forEach((pateient) => {
    const numberOfVisits = getRandomNumberWithinRange(1, 15);
    historys.push(
      ...Array(numberOfVisits)
        .fill(1)
        .map((_, index) => ({
          // historyId: index + 1,
          ptId: pateient.ptId,
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
        }))
    );
  });
  const shuffledVisits = randomiseArray(historys);
  return shuffledVisits.map((history, index) => ({
    ...history,
    historyId: index + 1,
  }));
};

const generateHistory = () => {
  const histories = getHistories();
  fs.writeFileSync('./json/histories.json', JSON.stringify(histories));
  console.log('Successfully created', histories.length, 'histories.');
};

module.exports = generateHistory;
