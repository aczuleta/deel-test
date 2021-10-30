const supertest = require('supertest')
const app = require('../src/app');
const seed = require('../scripts/seedDb');


describe('Admin test suite', () => {
    let request;

    beforeAll(async () => {
        await seed();
    });

    beforeEach(() => {
        request = supertest.agent(app).set({ 'profile_id': '1' })
    });

    describe('GET /admin/best-profession', () => {
        it('Should return the best profession (the most paid one) within a given time period', async () => {
            const res = await request.get('/admin/best-profession?start=2020-08-10&end=2020-08-30').send();
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual({'profession': 'Programmer'});
        });

        it('Should return error code 400 if the parameters are invalidd', async () => {
            const res = await request.get('/admin/best-profession?start=2020-08-10&end=2020-08-sas').send();
            expect(res.statusCode).toEqual(400);
            expect(res.text).toEqual('Error 400: Invalid date range');
        });
    });

    describe('GET /admin/best-clients', () => {
        let bestClients = [];
        const baseUrl = '/admin/best-clients?start=2020-08-10&end=2020-08-30';

        beforeAll(async () => {
            const res = await request.get(`${baseUrl}&limit=10`).send();
            bestClients = res.body;
        });

        it('Should return only two clients when no limit parameter is provided', async () => {
            const res = await request.get(baseUrl).send();
            expect(res.statusCode).toEqual(200)
            expect(res.body).toMatchObject(bestClients.slice(0, 2));
        });

        it('Should return error code 400 if the parameters are invalidd', async () => {
            const res = await request.get(`${baseUrl}&limit=as`).send();
            expect(res.statusCode).toEqual(400);
            expect(res.text).toEqual('Error 400: Invalid date range');
        });
    
        it('Should return the best N clients within a time range where N is equals to limit', async () => {
            const limit = 4;
            const res = await request.get(`${baseUrl}&limit=${limit}`).send();
            expect(res.body.length).toEqual(limit);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toMatchObject(bestClients.slice(0, limit+1));
        });
    });
});