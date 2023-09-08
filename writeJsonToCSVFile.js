const json = require('big-json');
const { Parser } = require('@json2csv/plainjs');
const fs = require('fs');
const { promisify } = require('util');

const writeFileAsync = promisify(fs.writeFile);


const writeJsonToCSVFile = ({ data, file }) => {
  const parser = new Parser({ header: true });
  const csv = parser.parse(data);
  return writeFileAsync(file, csv);
};

module.exports = writeJsonToCSVFile;
