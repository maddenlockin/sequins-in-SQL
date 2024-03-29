const express = require('express');
const cors = require('cors');
const client = require('./client.js');
const app = express();
const morgan = require('morgan');
const ensureAuth = require('./auth/ensure-auth');
const createAuthRoutes = require('./auth/create-auth-routes');
const specialties = require('../data/specialties.js');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev')); // http logging

const authRoutes = createAuthRoutes();

// setup authentication routes to give user an auth token
// creates a /auth/signin and a /auth/signup POST route. 
// each requires a POST body with a .email and a .password
app.use('/auth', authRoutes);

// everything that starts with "/api" below here requires an auth token!
app.use('/api', ensureAuth);

// and now every request that has a token in the Authorization header will have a `req.userId` property for us to see who's talking
app.get('/api/test', (req, res) => {
  res.json({
    message: `in this proctected route, we get the user's id like so: ${req.userId}`
  });
});

app.get('/specialties', async(req, res) => {
  try {
    const data = await client.query('SELECT * from specialties');
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.get('/specialties/:id', async(req, res) => {
  try {
    const data = await client.query('SELECT * from specialties where id=$1', [req.params.id]);
    
    res.json(data.rows);
  } catch(e) {
    
    res.status(500).json({ error: e.message });
  }
});

app.post('/specialties', async(req, res) => {
  try {
    const data = await client.query(
      `INSERT INTO specialties (type, focus, category_id, owner_id)
      VALUES ($1, $2, $3, 1)
      RETURNING *`, [req.body.type, req.body.focus, req.body.category_id]);

    res.json(data.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.put('/specialties/:id', async(req, res) => {
  try {
    const data = await client.query(`
      update specialties
      set type=$1,
      focus=$2,
      category=$3
      where id=$4
      returning *
      `, [req.body.type, req.body.focus, req.body.category, req.params.id]);

    res.json(data.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete('/specialties/:id', async(req, res) => {
  try {
    const data = await client.query('delete from specialties where id=$1', [req.params.id]);

    res.json(data.rows[0]);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.use(require('./middleware/error'));

module.exports = app;
