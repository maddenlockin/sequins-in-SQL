require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

const specialties = [
  {
    type: 'cardiology',
    focus: 'heart',
    category_id: 3,
    id: 1,
    owner_id: 1
  },
  {
    type: 'endocrinology',
    focus: 'endocrine system',
    category_id: 1,
    id: 2,
    owner_id: 1
  },
  {
    type: 'neurology',
    focus: 'brain',
    category_id: 2,
    id: 3,
    owner_id: 1
  },
  {
    type: 'psychology',
    focus: 'mental health',
    category_id: 3,
    id: 4,
    owner_id: 1
  },
  {
    type: 'podiatry',
    focus: 'feet',
    category_id: 1,
    id: 5,
    owner_id: 1
  }
];



describe('app routes', () => {
  describe('routes', () => {
    let token;
  
    beforeAll(async done => {
      execSync('npm run setup-db');
  
      client.connect();
  
      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234'
        });
      
      token = signInData.body.token; // eslint-disable-line
  
      return done();
    });
  
    afterAll(done => {
      return client.end(done);
    });

    test('/GET specialties returns all specialties', async() => {

      const expectation = specialties;

      const data = await fakeRequest(app)
        .get('/specialties')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    test('/GET specialties/3 returns one specialty', async() => {

      const expectation = [{
        type: 'neurology',
        focus: 'brain',
        category_id: 2,
        id: 3,
        owner_id: 1
      }];

      const data = await fakeRequest(app)
        .get('/specialties/3')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });

    // test('/GET categories returns all categories', async() => {

    //   const data = await fakeRequest(app)
    //     .get('/categories')
    //     .expect('Content-Type', /json/)
    //     .expect(200);

    //   expect(data.body.length).toBeGreaterThan(0);
    // });
  });
});
