const neo4j = require('neo4j-driver');
const StreamArray = require('stream-json/streamers/StreamArray');
const { Writable } = require('stream');
const path = require('path');
const fs = require('fs');

const writeToDB = ({ file, label }) => {
  const uri = 'bolt://127.0.0.1:7687';
  const driver = neo4j.driver(uri, neo4j.auth.basic('neo4j', 'Mou@2997'));
  const session = driver.session();

  const fileStream = fs.createReadStream(path.join(__dirname, file));
  const jsonStream = StreamArray.withParser();

  const runQuery = (query) =>
    session.run(query).catch((err) => {
      console.log(err);
      throw err;
    });

  let list = [];
  const processingStream = new Writable({
    write({ key, value }, encoding, callback) {
      list.push(value);

      if (list.length === 100) {
        const query = "CREATE " + list
          .map(
            (data, index) =>
              `(a${index}: ${label} { ${Object.keys(data)
                .map((key) => `${key}: "${data[key]}"`)
                .join(',')} })`
          )
          .join(',');

        runQuery(query).then(() => {
          callback();
        });
        list = [];
      } else {
        callback();
      }
    },
    //Don't skip this, as we need to operate with objects, not buffers
    objectMode: true,
  });

  //Pipe the streams as follows
  fileStream.pipe(jsonStream.input);
  jsonStream.pipe(processingStream);

  //So we're waiting for the 'finish' event when everything is done.

  return new Promise((res, rej) => {
    processingStream.on('finish', async () => {
      if (list.length) {
        const query = "create " + list
          .map(
            (data, index) =>
              `(a${index}: ${label} { ${Object.keys(data)
                .map((key) => `${key}: "${data[key]}"`)
                .join(',')} })`
          )
          .join(',');
        await runQuery(query);
      }
      await session.close();
      await driver.close();
      console.log(label, 'all done');
      res();
    });
  });
};

module.exports = writeToDB;
