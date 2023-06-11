const fs = require('fs');

const getOneRandom = require('./getOneRandom');

const visitsDummyJson = require('./graph database/visit.json');
const personsData = require('./json/persons.json');
const { loremIpsum } = require('lorem-ipsum');
const getRandomNumberWithinRange = require('./getRandomNumberWithinRange');


const getVisits = (count) =>
  Array(count)
    .fill(1)
    .map((_, index) => {
      const timeStamp = new Date(
        getRandomNumberWithinRange(1653935400000, new Date().getTime())
      );

      return {
        vId: index+1,
        ptId: getOneRandom(personsData.map(({ id }) => id)),
        complained: loremIpsum({ count: getRandomNumberWithinRange(1, 7) }),
        trtEpId: getOneRandom(personsData.map(({ id }) => id)),
        visitType: getOneRandom(visitsDummyJson[0].visitType),
        visitNumber: getRandomNumberWithinRange(1, 7),
        timeStamp,
        reason: loremIpsum({ count: getRandomNumberWithinRange(1, 3) }),
        observation: loremIpsum({ count: getRandomNumberWithinRange(1, 7) }),
        summary: loremIpsum({ count: getRandomNumberWithinRange(5, 15) }),
        diagnosisId: index,
        sysBP: getRandomNumberWithinRange(80, 150),
        disBP: getRandomNumberWithinRange(80, 150),
        pulse: getRandomNumberWithinRange(50, 150),
        temp: getRandomNumberWithinRange(96, 106),
        tempSource: getOneRandom([]),
        respirationRate: getRandomNumberWithinRange(8, 20),
        height: getRandomNumberWithinRange(100, 200),
        weight: getRandomNumberWithinRange(40, 90),
        investigationId: index,
        treatmentPlanId: index,
      };
    });


const generateVisit = (count) => {
  const visits = getVisits(count);
  fs.writeFileSync('./json/visits.json', JSON.stringify(visits));
  console.log('Successfully created', visits.length, 'visits.');
}

module.exports = generateVisit;
