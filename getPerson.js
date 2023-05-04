const fs = require("fs")
const getOneRandom = require("./getOneRandom")
const personJson = require("./graph database/person.json")
const statesJson = require("./states-and-districts.json")

const getStateAndDistrict = () => {
    const [state, districts] = getOneRandom(statesJson.states.map(({
        state, districts
    }) => ([state, districts])))
    const district = getOneRandom(districts)

    return {
        state, district
    }
}

const getPerson = async (count) => {
    const dummyUsers =
        await fetch('https://dummyjson.com/users')
            .then(res => res.json())
            .then(({ users }) => users.map(user => ({
                id: user.id,
                name: `${user.firstName} ${user.lastName}`,
                bloodGroup: user.bloodGroup,
                dateOfBirthage: user.age,
                gender: user.gender,
                pinCode: user.address.postalCode,
                countryCode: "+91",
                contactNo: user.phone,
                cityTownVillagePoliceStation: user.address.city,
                addressLine1: user.address.address,
                state: user.address.state,
                addressLine2: user.address.city,
                addressType: getOneRandom(personJson[0].addressType),
                religion: getOneRandom(personJson[0].religion),
                occupation: getOneRandom(personJson[0].occupation),
                socioEconomicStatus: getOneRandom(personJson[0].socioEconomicStatus),
                foodHabbit: getOneRandom(personJson[0].foodHabbit),
                ...(getStateAndDistrict())
            })))

    return dummyUsers;
}

getPerson().then(users => {
    fs.writeFileSync("./json/persons.json", JSON.stringify(users))
})
