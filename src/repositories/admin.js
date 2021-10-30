const BaseRepository = require('./baseRepository');

class AdminRepository extends BaseRepository {
    constructor() {
        super(null);
    }

    async queryBestProfession(start, end) {
        try {
            const replacements = [start, end];
            const query = `
            SELECT p.profession as 'best_profession' 
            FROM Profiles p
            INNER JOIN Contracts c ON (p.id = c.ContractorId)
            INNER JOIN Jobs j ON (c.id = j.ContractId)
            WHERE 
            j.paid = true 
            AND DATETIME(j.paymentDate) >= DATETIME(?)
            AND DATETIME(j.paymentDate) <= DATETIME(?)
            GROUP BY p.profession
            ORDER BY sum(j.price) DESC
            LIMIT 1`;
            const best = await this.sequelize.query(query, {
                replacements,
                type: this.sequelize.QueryTypes.SELECT,
            });
            return best;
        } catch(err) {
            throw err;
        }
    }

    async queryBestClients(start, end, limit = 2) {
        try {
            const replacements = [start, end, limit];
            const query = `
            SELECT p.id, p.firstName || ' ' || p.lastName as fullName, sum(j.price) as paid
            FROM Profiles p
            INNER JOIN Contracts c ON (p.id = c.ClientId)
            INNER JOIN Jobs j ON (c.id = j.ContractId)
            WHERE 
            j.paid = true 
            AND DATETIME(j.paymentDate) >= DATETIME(?)
            AND DATETIME(j.paymentDate) <= DATETIME(?)
            GROUP BY p.id, fullName
            ORDER BY price DESC
            LIMIT ?`;
            const best = await this.sequelize.query(query, {
                replacements,
                type: this.sequelize.QueryTypes.SELECT,
            });
            return best;
        } catch(err) {
            throw err;
        }
    }
}

const adminRepository = new AdminRepository();

module.exports = adminRepository;