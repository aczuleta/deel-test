const { sequelize } = require('../model');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class BaseRepository {
    constructor(model) {
        this.model = model;
        this.op = Op;
        this.sequelize = sequelize;
        this.models = this.sequelize.models;
    }

    async getAll() {
        try {
            const elements = await this.model.findAll();
            return elements;
        } catch(err) {
            throw err;
        }  
    }

    async getById(id) {
        try {
            const element = await this.model.findOne({where: { id }})
            return element;
        } catch(err) {
            throw err;
        }  
    }
}

module.exports = BaseRepository;

