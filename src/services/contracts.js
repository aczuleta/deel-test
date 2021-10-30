const contractRepository = require('../repositories/contracts');
const { NotFoundError, NotBelongError, BadRequestError } = require('../errors');

async function getContractById(id, profileId) {
    try {

        if(isNaN(id)) {
            throw new BadRequestError('Invalid contract ID');
        }

        const contract = await contractRepository.getById(id);
        if (!contract) {
            throw new NotFoundError();
        }
        if (contract.ContractorId !== profileId && contract.ClientId !== profileId) {
            throw new NotBelongError();
        }
        return contract;
    } catch(err) {
        throw err;
    }
}

async function getUserContracts(profileId) {
    try {
        const contracts = await contractRepository.queryUserContracts(profileId);
        return contracts;
    } catch(err) {
        throw err;
    }
}

module.exports = {
    getContractById,
    getUserContracts
}