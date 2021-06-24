const client = require('../lib/client');
const { getEmoji } = require('../lib/emoji.js');

// async/await needs to run in a function
run();

async function run() {

  try {
    // initiate connecting to db
    await client.connect();

    // run a query to create tables
    // Add new table definition here   
    // Connect the tables (they become dependent on each)
    await client.query(`
                CREATE TABLE users (
                    id SERIAL PRIMARY KEY,
                    email VARCHAR(256) NOT NULL,
                    hash VARCHAR(512) NOT NULL
                );     
                CREATE TABLE categories (
                    id SERIAL PRIMARY KEY,
                    category VARCHAR(512) NOT NULL
                );         
                CREATE TABLE specialties (
                    id SERIAL PRIMARY KEY NOT NULL,
                    type VARCHAR(512) NOT NULL,
                    category_id INTEGER NOT NULL REFERENCES categories(id),
                    focus VARCHAR(512) NOT NULL,
                    owner_id INTEGER NOT NULL REFERENCES users(id)
            );
        `);

    console.log('create tables complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    // problem? let's see the error...
    console.log(err);
  }
  finally {
    // success or failure, need to close the db connection
    client.end();
  }

}


