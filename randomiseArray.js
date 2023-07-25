const randomiseArray = (array) => {
  return [...array].sort( () => .5 - Math.random() );
}

module.exports = randomiseArray;
