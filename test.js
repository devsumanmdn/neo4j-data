var bigJson = require("big-json")
const { Readable } = require("stream");

const getDoctors = () => {
  const readStream = fs.createReadStream('./json/persons.json');
  const parseStream = json.createParseStream();

  parseStream.on('data', function (pojo) {
    console.log(pojo);
  });

  // const personsData = JSON.parse(fs.readFileSync().toString());

  // const personIdsWhoAreDoctor = personsData
  //   .filter(({ occupation }) => occupation === 'Doctor')
  //   .map(({ id }) => id);

  // return personIdsWhoAreDoctor.map((personId, index) => ({
  //   drId: index + 1,
  //   personId: personId,
  //   organizationId: getRandomNumberWithinRange(1, 50),
  //   specialization: getOneRandom(doctorsDummyJson[0].specialization),
  // }));

  return new Promise((res, rej) => {
    parseStream.pipe(readStream);
    parseStream.on('end', res);
    parseStream.on('error', rej);
  });
};

function * gen() {
    yield "[{ \"a\": \"hi\" },";
    yield "{ \"a\": \"bye\" }]";
}

const readable = Readable.from(gen());

const parseStream = bigJson.createParseStream();
parseStream.on('data', function(pojo) {
    console.log(pojo);
});

readable.pipe(parseStream);
