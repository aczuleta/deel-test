const { Job } = require('../model');
const BaseRepository = require('./baseRepository');

class JobRepository extends BaseRepository {
    constructor(jobModel) {
        super(jobModel);
    }

    async queryUnpaidJobs(profileId) {
        try {
            const jobs = await this.model.scope(['activeContracts']).findAll({ 
                where: { 
                    paid: null,
                    [this.op.or]: [
                        {
                          '$Contract.ClientId$': profileId,
                        },
                        {
                          '$Contract.ContractorId$': profileId,
                        }
                      ]
                }
            });
            return jobs;
        } catch(err) {
            throw err;
        }
    }

    async getTotalToPay(fromClientId) {
        try {
            const total = await this.model.scope(['activeContracts']).sum('price', {
                where: {
                    paid: null,
                    [this.op.or]: [
                        {
                          '$Contract.ClientId$': fromClientId
                        },
                    ]
                }
            });
            return total;
        } catch(err) {
            throw err;
        }
    }
}

const jobRepository = new JobRepository(Job);

module.exports = jobRepository;