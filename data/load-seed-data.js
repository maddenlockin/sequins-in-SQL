const client = require('../lib/client');
// import our seed data:
const { specialties, categories } = require('./specialties.js');
const usersData = require('./users.js');
const { getEmoji } = require('../lib/emoji.js');
const { getCategoryIdByName } = require('./utils');

run();

async function run() {

  try {
    await client.connect();

    const users = await Promise.all(
      usersData.map(user => {
        return client.query(`
                      INSERT INTO users (email, hash)
                      VALUES ($1, $2)
                      RETURNING *;
                  `,
        [user.email, user.hash]);
      })
    );
      
    const user = users[0].rows[0];
    
    const categoryResponses = await Promise.all(
      categories.map(category => {
        console.log(category);
        return client.query(`
                    INSERT INTO categories (category)
                    VALUES ($1)
                    RETURNING *;
                `,
        [category.category]);
      })
    );

    const cats = categoryResponses.map(response => {
      return response.rows[0];
    });
    console.log(cats);

    await Promise.all(
      specialties.map(specialty => {
        const categoryId = getCategoryIdByName(cats, specialty.category);
        console.log(categoryId);
        return client.query(`
                    INSERT INTO specialties (type, category_id, focus, owner_id)
                    VALUES ($1, $2, $3, $4);
                `,
        [specialty.type, categoryId, specialty.focus, user.id]);
      })
    );

    

    console.log('seed data load complete', getEmoji(), getEmoji(), getEmoji());
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
}