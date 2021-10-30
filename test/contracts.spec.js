const supertest = require('supertest')
const app = require('../src/app');
const seed = require('../scripts/seedDb');

describe('Contracts test suite', () => {
    let request;

    const profileId = 1;

    beforeAll(async () => {
        await seed();
    });

    beforeEach(() => {
        request = supertest.agent(app).set({ 'profile_id': profileId })
    });

    describe('GET /contracts/:id', () => {
        it('Should return a status 404 Not Found when the contract does not exist', async () => {
            const res = await request.get('/contracts/0').send();
            expect(res.statusCode).toEqual(404);
        })

        it('should return a status code 401 when the contract does not belong to the user', async () => {
            const res = await request.get('/contracts/3').send();
            expect(res.statusCode).toEqual(401);
        });

        it('Should return a contract when it belongs to the current user', async () => {
            const res = await request.get('/contracts/2').send();
            const belongs = (profileId === res.body.ClientId || profileId === res.body.ContractorId);
            expect(res.statusCode).toEqual(200);
            expect(belongs).toEqual(true);
            expect(res.body).toMatchObject(
                {
                    id: 2,
                    terms: 'bla bla bla',
                    status: 'in_progress',
                    ContractorId: 6,
                    ClientId: 1
                }
            );
            
        });
    });

    describe('GET /contracts', () => {
        it('Should return all the contracts that belong to the user and are active', async () => {
            const res = await request.get('/contracts').send();
            
            const belongs = res.body.every(x => {
                return (profileId === x.ClientId || profileId === x.ContractorId);
            });

            const allActive = res.body.every(x => {
                return x.status ==='in_progress';
            });

            expect(res.statusCode).toEqual(200);
            expect(belongs).toBe(true);
            expect(allActive).toBe(true);
            expect(res.body).toMatchObject(
                [
                    {
                        id: 2,
                        terms: 'bla bla bla',
                        status: 'in_progress',
                        ContractorId: 6,
                        ClientId: 1
                    }
                ]
            );
        });
    });
})