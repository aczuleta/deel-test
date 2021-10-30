const adminRepository = require('../repositories/admin');
const { NotFoundError, BadRequestError } = require('../errors');

async function getBestProfession(start, end) {
    try {
        const startDate = new Date(Date.parse(start));
        const endDate = new Date(Date.parse(end));
        validateDates(startDate, endDate);
        const bestProfession = await adminRepository.queryBestProfession(startDate, endDate);
        if (!bestProfession.length || !bestProfession) {
            throw new NotFoundError();
        }
        return { profession: bestProfession[0].best_profession };
    } catch(err) {
        throw err;
    }
}

async function getBestClients(start, end, limit) {
    try {
        const startDate = new Date(Date.parse(start));
        const endDate = new Date(Date.parse(end));
        validateDates(startDate, endDate, limit);
        const bestClients = await adminRepository.queryBestClients(startDate, endDate, limit);
        return bestClients;
    } catch(err) {
        throw err;
    }
}

function validateDates(startDate, endDate, limit = 2) {
    if (isNaN(startDate) || isNaN(endDate) || isNaN(limit) ) {
        throw new BadRequestError('Invalid date range')
    }
}

module.exports = {
    getBestProfession,
    getBestClients
}