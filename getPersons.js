const fs = require('fs');
const getOneRandom = require('./getOneRandom');
const personJson = require('./graph database/person.json');
const statesJson = require('./states-and-districts.json');
const randomiseWords = require('./randomiseWords');
const writeCSVFile = require('./writeCSVFile');
const { Parser } = require('@json2csv/plainjs');
const { Readable } = require('stream');

const parser = new Parser();
const parserWithoutHeader = new Parser({ header: false });

const getStateAndDistrict = () => {
  const [state, districts] = getOneRandom(
    statesJson.states.map(({ state, districts }) => [state, districts])
  );
  const district = getOneRandom(districts);

  return {
    state,
    district,
  };
};

const getUsersFromRmeoteSource = ({ limit, skip } = {}) =>
  fetch(
    `https://dummyjson.com/users?${new URLSearchParams({
      ...(limit ? { limit } : {}),
      ...(skip ? { skip } : {}),
    })}`
  ).then((res) => res.json());

const getAllUsers = async () => {
  const { users, total, limit } = await getUsersFromRmeoteSource();

  let allUsers = [...users];

  for (let i = limit; i < total; i += limit) {
    const { users: nextSetOfUsers } = await getUsersFromRmeoteSource({
      skip: i,
      limit,
    });

    allUsers.push(...nextSetOfUsers);
  }

  return allUsers;
};

async function* getPerson(count) {
  const dummyUsers = await getAllUsers().then((users) => {
    return users.map((user) => ({
      id: user.id,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      bloodGroup: user.bloodGroup,
      dateOfBirthage: user.age,
      gender: user.gender,
      pinCode: user.address.postalCode,
      countryCode: '+91',
      contactNo: user.phone,
      cityTownVillagePoliceStation: user.address.city,
      addressLine1: user.address.address,
      addressLine2: user.address.city,
      addressType: getOneRandom(personJson[0].addressType),
      religion: getOneRandom(personJson[0].religion),
      occupation: getOneRandom(personJson[0].occupation),
      socioEconomicStatus: getOneRandom(personJson[0].socioEconomicStatus),
      foodHabbit: getOneRandom(personJson[0].foodHabbit),
      ...getStateAndDistrict(),
    }));
  });

  console.log({
    restCount: count - dummyUsers.length,
    length: dummyUsers.length,
    count,
  });

  yield parser.parse(dummyUsers);

  for (let index = 0; index < (count - dummyUsers.length); index++) {
    const name = randomiseWords(
      dummyUsers
        .map(({ name }) => name)
        .join(' ')
        .split(' '),
      2,
      2
    );

    const email =
      name.replace(' ', '').toLowerCase() +
      '@' +
      getOneRandom(['gmail', 'outlook', 'hotmail', 'yahoo', 'reddif', 'aol']) +
      '.com';

    const user = {
      id: dummyUsers.length + index + 1,
      email: email,
      name: name,
      bloodGroup: getOneRandom(personJson[0].bloodGroup),
      dateOfBirthage: Math.round(Math.random() * 70),
      gender: getOneRandom(personJson[0].gender),
      pinCode: randomiseWords(
        dummyUsers.map(({ pinCode }) => pinCode),
        1,
        1
      ),
      countryCode: '+91',
      contactNo: randomiseWords(
        dummyUsers.map(({ contactNo }) => contactNo),
        1,
        1
      ),
      cityTownVillagePoliceStation: randomiseWords(
        dummyUsers.map(
          ({ cityTownVillagePoliceStation }) => cityTownVillagePoliceStation
        ),
        1,
        1
      ),
      addressLine1: randomiseWords(
        dummyUsers.map(
          ({ cityTownVillagePoliceStation }) => cityTownVillagePoliceStation
        ),
        1,
        1
      ),
      addressLine2: randomiseWords(
        dummyUsers.map(({ addressLine2 }) => addressLine2),
        1,
        1
      ),
      addressType: getOneRandom(personJson[0].addressType),
      religion: getOneRandom(personJson[0].religion),
      occupation: getOneRandom(personJson[0].occupation),
      socioEconomicStatus: getOneRandom(personJson[0].socioEconomicStatus),
      foodHabbit: getOneRandom(personJson[0].foodHabbit),
      ...getStateAndDistrict(),
    };

    yield '\n'+parserWithoutHeader.parse(user);
  }
}

const generatePerson = async (count) => {
  const readable = Readable.from(getPerson(count));

  await writeCSVFile({ file: './json/persons.csv', readable });
  console.log('Successfully created', 'users.');
  return count;
};

module.exports = generatePerson;
