const fs = require('fs');

const getOneRandom = require('./getOneRandom');

const treatmentepisodesDummyJson = require('./graph database/treatmentepisode.json');
const getRandomNumberWithinRange = require('./getRandomNumberWithinRange');
const randomiseArray = require('./randomiseArray');
const writeCSVFile = require('./writeCSVFile');

const getMSFromHours = (hours) => {
  return hours * 60 * 60 * 1000;
};

const getTreatmentepisodes = () => {
  const complaintsData = JSON.parse(fs.readFileSync('./json/complaints.json').toString());

  const treatmentEpisodes = [];
  complaintsData.forEach((complaint) => {
    const numberOfTreatmentEpisodes = getRandomNumberWithinRange(1, 5);
    treatmentEpisodes.push(
      ...Array(numberOfTreatmentEpisodes)
        .fill(1)
        .map((_) => {
          const startTime = new Date(
            getRandomNumberWithinRange(1653935400000, new Date().getTime())
          );
          const endTime = new Date(
            startTime.getTime() +
              getRandomNumberWithinRange(
                getMSFromHours(5),
                getMSFromHours(24 * 30)
              )
          );
          return {
            // treatEpId: index + 1,
            ptId: complaint.ptId,
            startTime,
            endTime,
            complaintId: complaint.complaintId,
            status: getOneRandom(treatmentepisodesDummyJson[0].status),
          };
        })
    );
  });

  const shuffledTreatmentEpisodes = randomiseArray(treatmentEpisodes);
  return shuffledTreatmentEpisodes.map((treatmentEpisode, index) => ({
    ...treatmentEpisode,
    treatEpId: index + 1,
  }));
};

const generateTreatmentEpisode = async () => {
  const treatmentepisodes = getTreatmentepisodes();
  await writeCSVFile({ file: './json/treatmentepisodes.csv', data: treatmentepisodes });
  console.log(
    'Successfully created',
    treatmentepisodes.length,
    'treatmentepisodes.'
  );
  return treatmentepisodes.length;
};

module.exports = generateTreatmentEpisode;
