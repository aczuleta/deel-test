const supertest = require('supertest')
const app = require('../src/app');
const seed = require('../scripts/seedDb');

describe('Jobs test suite', () => {
    let request;

    beforeAll(async () => {
        await seed();
    });

    beforeEach(() => {
        request = supertest.agent(app).set({ 'profile_id': '1' })
    });

    describe('GET /jobs/unpaid', () => {
        it('Should return all active unpaid jobs', async () => {
            const res = await request.get('/jobs/unpaid').send();
            const allInProgress = res.body.every(x => { 
                return x.Contract.status === 'in_progress'
            });
            expect(res.statusCode).toEqual(200);
            expect(allInProgress).toEqual(true);
            expect(res.body).toMatchObject(
                [
                    {
                        id: 2,
                        description: 'work',
                        price: 201,
                        paid: null,
                        paymentDate: null,
                        ContractId: 2,
                        Contract: {
                            id: 2,
                            terms: 'bla bla bla',
                            status: 'in_progress',
                            ContractorId: 6,
                            ClientId: 1
                        }
                    }
                ]
            );
        })
    })

    describe('GET /jobs/:job_id/pay', () => {
        it('Should return 404 Not found status code when job does not exist', async () => {
            const res = await request.post('/jobs/0/pay').send();
            expect(res.statusCode).toEqual(404);
        });

        it('Should return 404 when the user does not have enough funds to pay the job', async () => {
            const res = await request.post('/jobs/5/pay').set('profile_id', '4').send();
            expect(res.statusCode).toEqual(400);
            expect(res.text).toEqual('Error 400: The user does not have enough funds to complete the payment');
        });

        it('Should return 400 error code when the job is already paid', async () => {
            const res = await request.post('/jobs/14/pay').send();
            expect(res.statusCode).toEqual(400);
            expect(res.text).toEqual('Error 400: This contract has already been payed');
        });

        it('should return 400 error code when the contract is not active', async () => {
            const res = await request.post('/jobs/1/pay').send();
            expect(res.statusCode).toEqual(400);
            expect(res.text).toEqual('Error 400: The contract is not currently active');
        });

        it('Should pay a job', async () => {
            const res = await request.post('/jobs/2/pay').send();
            expect(res.statusCode).toEqual(200);
        })

    })
})