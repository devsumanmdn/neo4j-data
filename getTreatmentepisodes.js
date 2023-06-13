const fs = require('fs');

const getOneRandom = require('./getOneRandom');

const treatmentepisodesDummyJson = require('./graph database/treatmentepisode.json');
const getRandomNumberWithinRange = require('./getRandomNumberWithinRange');

const getMSFromHours = (hours) => {
  return hours * 60 * 60 * 1000;
};

const getTreatmentepisodes = (count) => {
  const personsData = require('./json/persons.json');
  return Array(count)
    .fill(1)
    .map((_, index) => {
      const startTime = new Date(
        getRandomNumberWithinRange(1653935400000, new Date().getTime())
      );
      const endTime = new Date(
        startTime.getTime() +
          getRandomNumberWithinRange(getMSFromHours(5), getMSFromHours(24 * 30))
      );

      return {
        treatEpId: index + 1,
        ptId: getOneRandom(personsData.map(({ id }) => id)),
        startTime,
        endTime,
        complaintId: getOneRandom(personsData.map(({ id }) => id)),
        status: getOneRandom(treatmentepisodesDummyJson[0].status),
      };
    });
};

const generateTreatmentEpisode = (count) => {
  const treatmentepisodes = getTreatmentepisodes(count);
  fs.writeFileSync(
    './json/treatmentepisodes.json',
    JSON.stringify(treatmentepisodes)
  );
  console.log(
    'Successfully created',
    treatmentepisodes.length,
    'treatmentepisodes.'
  );
};

module.exports = generateTreatmentEpisode;
