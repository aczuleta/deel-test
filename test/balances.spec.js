const supertest = require('supertest');
const app = require('../src/app');
const seed  = require('../scripts/seedDb');
const profileRepository = require('../src/repositories/profile');

describe('Balances test suite', () => {
    let request;
    const profileId = 1;

    beforeAll(async () => {
        await seed();
    });

    beforeEach(() => {
        request = supertest.agent(app).set({ 'profile_id': profileId  })
    });

    describe('/balances/deposit/:userId', () => {
        it('Should not accept deposit if the amount is more than 25% of the total jobs to pay', async () => {
            const toId = 2;
            const amount = 90000;
            const res = await request.post(`/balances/deposit/${toId}`).send({amount});
            expect(res.statusCode).toEqual(400);
            expect(res.text).toEqual('Error 400: Deposit cannot be above 25% of total of jobs to pay');
        });

        it('Should not allow deposits from users who are not clients', async () => {
            const toId = 2;
            const amount = 2;
            request = supertest.agent(app).set({ 'profile_id': '5' })
            const res = await request.post(`/balances/deposit/${toId}`).send({amount});
            expect(res.statusCode).toEqual(400);
            expect(res.text).toEqual('Error 400: Invalid user type: Contractors cannot receive or send deposits');
        });

        it('Should not allow clients to deposit to themselves', async () => {
            const toId = 1;
            const amount = 1;
            const res = await request.post(`/balances/deposit/${toId}`).send({amount});
            expect(res.statusCode).toEqual(400);
            expect(res.text).toEqual('Error 400: Users cannot deposit to themselves');
        });

        it('Should not allow deposit if amount is not a number', async () => {
            const toId = 1;
            const amount = 'abcd12';
            const res = await request.post(`/balances/deposit/${toId}`).send({amount});
            expect(res.statusCode).toEqual(400);
            expect(res.text).toEqual('Error 400: Invalid parameters');
        });

        it('Should deposit to one user if everything is correct', async () => {
            const toId = 2;
            const amount = 10
            let fromClient = await profileRepository.getById(profileId);
            let toClient = await profileRepository.getById(toId);
            const oldFromBalance = fromClient.balance;
            const oldToBalance = toClient.balance;
            const res = await request.post(`/balances/deposit/${toId}`).send({amount});
            fromClient = await profileRepository.getById(profileId);
            toClient = await profileRepository.getById(toId);
            const newFromBalance = fromClient.balance;
            const newToBalance = toClient.balance;
            expect(res.statusCode).toEqual(200);
            expect(newFromBalance).toEqual(oldFromBalance-amount);
            expect(newToBalance).toEqual(oldToBalance+amount);
        });
  })
})