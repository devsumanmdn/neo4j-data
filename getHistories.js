const fs = require('fs');
const { parse } = require("csv-parse/sync");
const { loremIpsum } = require('lorem-ipsum');

const getRandomNumberWithinRange = require('./getRandomNumberWithinRange');
const randomiseArray = require('./randomiseArray');
const writeJsonToCSVFile = require('./writeJsonToCSVFile');

const getHistories = (folder, lastCount) => {
    const patientsData = parse(fs.readFileSync(`${folder}patients.csv`).toString(), { delimiter: ',', columns: true });

  const historys = [];
  patientsData.forEach((pateient) => {
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
    historyId: lastCount + index + 1,
  }));
};

const generateHistory = async (folder, lastCount) => {
  const histories = getHistories(folder, lastCount);
  await writeJsonToCSVFile({ file: `${folder}histories.csv`, data: histories });
  console.log('Successfully created', histories.length, 'histories.');
  return histories.length;
};

module.exports = generateHistory;
