const fs = require('fs');
const { parse } = require("csv-parse/sync");

const getOneRandom = require('./getOneRandom');

const treatmentEpisodesDummyJson = require('./graph database/treatmentepisode.json');
const getRandomNumberWithinRange = require('./getRandomNumberWithinRange');
const randomiseArray = require('./randomiseArray');
const writeJsonToCSVFile = require('./writeJsonToCSVFile');

const getMSFromHours = (hours) => {
  return hours * 60 * 60 * 1000;
};

const getTreatmentepisodes = (folder, lastCount) => {
    const complaintsData = parse(fs.readFileSync(`${folder}complaints.csv`).toString(), { delimiter: ',', columns: true });

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
            status: getOneRandom(treatmentEpisodesDummyJson[0].status),
          };
        })
    );
  });

  const shuffledTreatmentEpisodes = randomiseArray(treatmentEpisodes);
  return shuffledTreatmentEpisodes.map((treatmentEpisode, index) => ({
    ...treatmentEpisode,
    treatEpId: lastCount + index + 1,
  }));
};

const generateTreatmentEpisode = async (folder, lastCount) => {
  const treatmentEpisodes = getTreatmentepisodes(folder, lastCount);
  await writeJsonToCSVFile({ file: `${folder}treatmentEpisodes.csv`, data: treatmentEpisodes });
  // console.log(
  //   'Successfully created',
  //   treatmentEpisodes.length,
  //   'treatmentEpisodes.'
  // );
  return treatmentEpisodes.length;
};

module.exports = generateTreatmentEpisode;
