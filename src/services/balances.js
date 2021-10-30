const jobRepository = require('../repositories/job');
const profileRepository = require('../repositories/profile');
const { BadRequestError, InsuficientFundsError, InvalidUserError, DepositLimitError } = require('../errors');

async function deposit(fromId, toId, amount) {
    const transaction = await jobRepository.sequelize.transaction();
    try {

        if(isNaN(fromId) || isNaN(toId) || isNaN(amount)) {
            throw new BadRequestError('Invalid parameters');
        }

        const fromClient = await profileRepository.getById(fromId);
        const toClient = await profileRepository.getById(toId);
        const totalToPay = await jobRepository.getTotalToPay(fromClient.id);
    
        validateDeposit(fromClient, toClient, amount, totalToPay);

        fromClient.balance -= amount;
        toClient.balance += amount;
        await fromClient.save({ transaction });
        await toClient.save({ transaction });
        await transaction.commit();
    } catch(err) {
        transaction.rollback();
        throw err;
    }
}

function validateDeposit(fromClient, toClient, amount, totalToPay) {
    if (fromClient.id === toClient.id) {
        throw new InvalidUserError('Users cannot deposit to themselves');
    }

    if (fromClient.type !== 'client' || toClient.type !== 'client') {
        throw new InvalidUserError('Invalid user type: Contractors cannot receive or send deposits');
    }

    if (amount > totalToPay * 0.25) {
        throw new DepositLimitError();
    }

    if (amount > fromClient.balance) {
        throw new InsuficientFundsError();
    }
}


module.exports = {
    deposit
}