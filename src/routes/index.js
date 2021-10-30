const contracts = require('./contracts');
const job = require('./job');
const balances = require('./balances');
const admin = require('./admin');

module.exports =  [
    {
        path: 'contracts',
        router: contracts,
    },
    {
        path: 'jobs',
        router: job,
    },
    {
        path: 'balances',
        router: balances,
    },
    {
        path: 'admin',
        router: admin
    }
];