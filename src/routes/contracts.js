const { Router } = require('express');
const { getProfile } = require('../middleware/getProfile');
const { getContractById, getUserContracts } = require('../services/contracts');


const router = new Router();

/**
 * @api {get} /contracts/:id Returns the contract with a specific id if the contract belongs to the current user
 * @apiName GetContract
 * @apiGroup Users
 * @apiParam {Number} id Contract id
 * @apiParam  {Number} profileId Current user's id
 * @apiSuccess {Object} Contract information
 */
router.get('/:id', getProfile, async (req, res, next) => {
    try {
        const { id } = req.params
        const { id: profileId }  = req.profile;
        const contract = await getContractById(Number(id), Number(profileId));
        res.json(contract)
    } catch(err) {
        return next(err);
    } 
});

/**
 * @api {get} /contracts Returns all the contracts that belongs to the current user
 * @apiName GetContracts
 * @apiGroup Users
 * @apiParam  {Number} profileId Current user's id
 * @apiSuccess {Object[]} Contracts information
 */
router.get('/', getProfile, async (req, res, next) =>{
    try {
        const { id }  = req.profile;
        const contracts = await getUserContracts(id);
        if(!contracts) return res.status(404).end();
        res.json(contracts)
    } catch(err) {
        return next(err);
    }
});

module.exports = router;