require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

const specialties = [
  {
    type: 'cardiology',
    focus: 'heart',
    difficulty: 8,
    id: 1,
    owner_id: 1
  },
  {
    type: 'endocrinology',
    focus: 'endocrine system',
    difficulty: 6,
    id: 2,
    owner_id: 1
  },
  {
    type: 'neurology',
    focus: 'brain',
    difficulty: 7,
    id: 3,
    owner_id: 1
  },
  {
    type: 'psychology',
    focus: 'mental health',
    difficulty: 8,
    id: 4,
    owner_id: 1
  },
  {
    type: 'podiatry',
    focus: 'feet',
    difficulty: 5,
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
        difficulty: 7,
        id: 3,
        owner_id: 1
      }];

      const data = await fakeRequest(app)
        .get('/specialties/3')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });
  });
});
