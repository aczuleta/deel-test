const jobRepository = require('../repositories/job');
const profileRepository = require('../repositories/profile');
const contractRepository = require('../repositories/contracts');
const { InsuficientFundsError, PaidJobError, NotActiveError, BadRequestError, NotFoundError } = require('../errors');

async function getUnpaidJobs(profileId) {
    try {
        const jobs = await jobRepository.queryUnpaidJobs(profileId);
        return jobs;
    } catch(err) {
        throw err;
    }
}

async function payJob(jobId, profileId) {
    const transaction = await jobRepository.sequelize.transaction();
    try {
        if(isNaN(jobId)) {
            throw new BadRequestError("Invalid job ID");
        }

        const job = await jobRepository.getById(jobId);
        
        if(!job) {
            throw new NotFoundError();
        }
        
        const client = await profileRepository.getById(profileId);
        const contract = await contractRepository.getById(job.ContractId);

        validatePayment(job, client, contract);

        const contractorId = contract.ContractorId;
        const contractor = await profileRepository.getById(contractorId);

        client.balance -= job.price;
        contractor.balance += job.price;

        await client.save({ transaction });
        await contractor.save({ transaction });

        job.paid = true;
        await job.save({ transaction })
        await transaction.commit();
    } catch(err) {
        transaction.rollback();
        throw err;
    }
}

function validatePayment(job, client, contract) {
    if (job.paid) {
        throw new PaidJobError();
    }

    if (client.balance < job.price) {
        throw new InsuficientFundsError();
    } 

    if (contract.status !== 'in_progress') {
        throw new NotActiveError();
    }
}


module.exports = {
    getUnpaidJobs,
    payJob
}