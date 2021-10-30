const { Profile } = require('../model');
const BaseRepository = require('./baseRepository');

class ProfileRepository extends BaseRepository {
    constructor(profileModel) {
        super(profileModel);
    }
}

const profileRepository = new ProfileRepository(Profile);

module.exports = profileRepository;