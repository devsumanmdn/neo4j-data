const fs = require('fs');
const { parse } = require('csv-parse/sync');
const getOneRandom = require('./getOneRandom');
const personJson = require('./graph database/person.json');
const statesJson = require('./states-and-districts.json');
const randomiseWords = require('./randomiseWords');
const writeJsonToCSVFile = require('./writeJsonToCSVFile');

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

const getPerson = async (startCount, endCount) => {
  const count = endCount - startCount;
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

  const restCount =
    startCount > dummyUsers.length
      ? count
      : count - dummyUsers.length - startCount;

  //console.log({
   // restCount,
    //length: dummyUsers.length,
    //count,
  //});

  const restNewUsers = Array(restCount)
    .fill(dummyUsers.length)
    .map((_, index) => {
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
        getOneRandom([
          'gmail',
          'outlook',
          'hotmail',
          'yahoo',
          'reddif',
          'aol',
        ]) +
        '.com';

      return {
        id: index + startCount + 1,
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
    });

  return [
    ...(startCount > dummyUsers.length ? [] : dummyUsers.slice(startCount)),
    ...restNewUsers,
  ];
};

const generatePerson = async (startCount, endCount, folder) => {
  await getPerson(startCount, endCount).then(async (users) => {
    await writeJsonToCSVFile({ file: `${folder}persons.csv`, data: users });
    //console.log('Successfully created', users.length, 'users.');
  });
  return endCount;
};

module.exports = generatePerson;
