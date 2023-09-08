const fs = require('fs');
const { parse } = require("csv-parse/sync");

const getOneRandom = require('./getOneRandom');

const allergyhistoriesDummyJson = require('./graph database/allergyhistory.json');
const randomiseArray = require('./randomiseArray');
const getRandomNumberWithinRange = require('./getRandomNumberWithinRange');
const writeJsonToCSVFile = require('./writeJsonToCSVFile');

const getAllergyhistories = (folder, lastCount) => {
    const historiesData = parse(fs.readFileSync(`${folder}histories.csv`).toString(), { delimiter: ',', columns: true });

  const allergyhistories = [];
  historiesData.forEach((history) => {
    const numberOfAllergyhistories = getRandomNumberWithinRange(1, 15);
    allergyhistories.push(
      ...Array(numberOfAllergyhistories)
        .fill(1)
        .map((_, index) => ({
          // allergyHId: index + 1,
          ptId: history.ptId,
          allergyFrom: getOneRandom(allergyhistoriesDummyJson[0].allergyFrom),
          allergySeverity: getOneRandom(
            allergyhistoriesDummyJson[0].allergySeverity
          ),
          allergyStatus: getOneRandom(
            allergyhistoriesDummyJson[0].allergyStatus
          ),
        }))
    );
  });
  const shuffledAllergyhistories = randomiseArray(allergyhistories);
  return shuffledAllergyhistories.map((allergyhistorie, index) => ({
    ...allergyhistorie,
    allergyHId: lastCount + index + 1,
  }));

};

const generateAllergyHistory = async (folder, lastCount) => {
  const allergyhistories = getAllergyhistories(folder, lastCount);
  await writeJsonToCSVFile({ file: `${folder}allergyhistories.csv`, data: allergyhistories });
  console.log(
    'Successfully created',
    allergyhistories.length,
    'allergyhistories.'
  );
  return allergyhistories.length;
};

module.exports = generateAllergyHistory;
