const fs = require('fs')

const getOneRandom = require('./getOneRandom');

const allergyhistoriesDummyJson = require('./graph database/allergyhistory.json');
const personsData = require('./json/persons.json');

const getAllergyhistories = (count) =>
  Array(count)
    .fill(1)
    .map((_, index) => ({
      allergyHId: index+1,
      ptId: getOneRandom(personsData.map(({ id }) => id)),
      allergyFrom: getOneRandom(allergyhistoriesDummyJson[0].allergyFrom),
      allergySeverity: getOneRandom(allergyhistoriesDummyJson[0].allergySeverity),
      allergyStatus: getOneRandom(allergyhistoriesDummyJson[0].allergyStatus),
    }));

const generateAllergyHistory = (count) => {
  const allergyhistories = getAllergyhistories(count);
  fs.writeFileSync('./json/allergyhistories.json', JSON.stringify(allergyhistories));
  console.log('Successfully created', allergyhistories.length, 'allergyhistories.');
}

module.exports = generateAllergyHistory;
