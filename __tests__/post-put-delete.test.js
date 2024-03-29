/* eslint-disable indent */
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



describe('post put and delete routes', () => {
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

        test('/DELETE specialties deletes one', async () => {

            await fakeRequest(app)
                .delete('/specialties/5')
                .expect('Content-Type', /json/)
                .expect(200);

            const dataSpecialties = await fakeRequest(app)
                .get('/specialties')
                .expect('Content-Type', /json/)
                .expect(200);

            const newSpecialty = {
                'category': 2,
                'focus': 'new focus',
                'id': 6,
                'owner_id': 1,
                'type': 'new specialty'
            };

            expect(dataSpecialties.body).not.toContainEqual(newSpecialty);
        });

        test('/POST creates one specialty', async () => {

            const data = await fakeRequest(app)
                .post('/specialties')
                .send({
                    type: 'new specialty',
                    focus: 'some specialty',
                    category_id: 1,
                })

                .expect('Content-Type', /json/)
                .expect(200);

            const newSpecialty = {
                'type': 'new specialty',
                'focus': 'some specialty',
                'category_id': 1,
                'id': 6,
                'owner_id': 1
            };
            expect(data.body).toEqual(newSpecialty);
        });
    });
});
