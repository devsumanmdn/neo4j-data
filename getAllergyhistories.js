const fs = require('fs');

const getOneRandom = require('./getOneRandom');

const allergyhistoriesDummyJson = require('./graph database/allergyhistory.json');
const randomiseArray = require('./randomiseArray');
const getRandomNumberWithinRange = require('./getRandomNumberWithinRange');

const getAllergyhistories = () => {
  const histriesData = require('./json/histories.json');

  const allergyhistories = [];
  histriesData.forEach((history) => {
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

const generateAllergyHistory = (count) => {
  const allergyhistories = getAllergyhistories(count);
  fs.writeFileSync(
    './json/allergyhistories.json',
    JSON.stringify(allergyhistories)
  );
  console.log(
    'Successfully created',
    allergyhistories.length,
    'allergyhistories.'
  );
};

module.exports = generateAllergyHistory;
