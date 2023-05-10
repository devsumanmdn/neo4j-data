/**
 *
 * @param {number} min
 * @param {number} max
 * @returns
 */
const getRandomNumberWithinRange = (min, max) => {
  const number = min + Math.round(Math.random() * (max - min));
  return number;
}

module.exports = getRandomNumberWithinRange;
