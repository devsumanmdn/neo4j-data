const getRandomNumberWithinRange = require("./getRandomNumberWithinRange");

const randomiseWords = (array, minCount, maxCount) => {
  const count = getRandomNumberWithinRange(minCount, maxCount)

  return Array(count)
    .fill(1)
    .map(() => array[Math.round(Math.random() * (array.length - 1))])
    .join(' ');
};

module.exports = randomiseWords;
