const json = require('big-json');
const fs = require('fs');

const writeJsonFile = ({ data, file }) => {
  const fileWriteStream = fs.createWriteStream(file);
  json.createStringifyStream({ body: data }).pipe(fileWriteStream);

  return new Promise((res, rej) => {
    fileWriteStream.on('finish', () => {
      res();
    })
    fileWriteStream.on('error', (error) => {
      rej(error);
    })
  })
};

module.exports = writeJsonFile;
