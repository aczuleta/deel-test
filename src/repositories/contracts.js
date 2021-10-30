const { Contract } = require('../model');
const BaseRepository = require('./baseRepository');

class ContractRepository extends BaseRepository {
    constructor(contractModel) {
        super(contractModel);
    }

    async queryContractById(id, profileId) {
        try {
            const contract = await this.model.scope({method: ['belongsToProfile', profileId]}).findOne({
                where: {
                    id
                }
            });
            return contract;
        } catch(err) {
            throw err;
        }
    }
    
    async queryUserContracts(profileId) {
        try {
            const contracts = await this.model.scope([{method: ['belongsToProfile', profileId]}]).findAll({
                where: {
                    status: { 
                        [this.op.not]: 'terminated'
                    }
                }
            });
            return contracts;
        } catch(err) {
            throw err;
        }
    }
}

const contractRepository = new ContractRepository(Contract);

module.exports = contractRepository;