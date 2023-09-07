const fs = require('fs');

/**
 *
 * @param {{readable: ReadableStream, file: string}} param0
 */
const writeCSVFile = ({ readable, file }) => {
  const fileWriteStream = fs.createWriteStream(file);
  readable.pipe(fileWriteStream);

  return new Promise((res, rej) => {
    fileWriteStream.on('finish', res)
    fileWriteStream.on('error', rej)
  })
};

module.exports = writeCSVFile;
