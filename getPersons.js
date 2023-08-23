const fs = require('fs');
const getOneRandom = require('./getOneRandom');
const personJson = require('./graph database/person.json');
const statesJson = require('./states-and-districts.json');
const randomiseWords = require('./randomiseWords');
const writeJsonFile = require('./writeJsonFile');

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

const getPerson = async (count) => {
  const dummyUsers = await getAllUsers().then((users) => {
    return users.map((user) => ({
      id: user.id,
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
      email: user.email,
      ...getStateAndDistrict(),
    }));
  });

  console.log({
    restCount: count - dummyUsers.length,
    length: dummyUsers.length,
    count,
  });

  const restNewUsers = Array(count - dummyUsers.length)
    .fill(dummyUsers.length)
    .map((length, index) => {
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
        id: index + length + 1,
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

  return [...dummyUsers, ...restNewUsers];
};

const generatePerson = (count) => {
  return getPerson(count).then(async (users) => {
    await writeJsonFile({ file: './json/persons.json', data: users });
    console.log('Successfully created', users.length, 'users.');
  });
};

module.exports = generatePerson;
