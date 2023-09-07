const fs = require('fs');

const getOneRandom = require('./getOneRandom');

const allergyhistoriesDummyJson = require('./graph database/allergyhistory.json');
const randomiseArray = require('./randomiseArray');
const getRandomNumberWithinRange = require('./getRandomNumberWithinRange');
const writeCSVFile = require('./writeCSVFile');

const getAllergyhistories = () => {
  const historiesData = JSON.parse(fs.readFileSync('./json/histories.json').toString());

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
    allergyHId: index + 1,
  }));

};

const generateAllergyHistory = async (count) => {
  const allergyhistories = getAllergyhistories(count);
  await writeCSVFile({ file: './json/allergyhistories.csv', data: allergyhistories });
  console.log(
    'Successfully created',
    allergyhistories.length,
    'allergyhistories.'
  );
  return allergyhistories.length;
};

module.exports = generateAllergyHistory;
