const StreamArray = require('stream-json/streamers/StreamArray');
const { batch } = require('stream-json/utils/Batch');

const fs = require('fs');
const { parse } = require("csv-parse/sync");

const writeDataToDB = ({ file, label, session }) => {
  const pipeline = fs.createReadStream(file).pipe(StreamArray.withParser());

  pipeline.on('data', async (data) => {
    const query = `CREATE (a: ${label} { ${Object.keys(data)
      .map((key) => `${key}: $${key}`)
      .join(',')} })`;

      console.log(query);

    await session.run(query, data);
  });
};

module.exports = writeDataToDB;
