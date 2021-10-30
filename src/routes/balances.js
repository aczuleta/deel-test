const { Router } = require('express');
const { getProfile } = require('../middleware/getProfile');
const { deposit } = require('../services/balances');

const router = new Router();


/**
 * @api {post} /balances/deposit/:userId Deposits a specific amount from one client account to another.
 * @apiName Deposits
 * @apiGroup Clients
 * @apiParam  {Number} userId Destination user id 
 * @apiParam  {Number} id Source user id
 * @apiBody  {Number} amount Amount to be transferred
 * @apiSuccess {Boolean} 200 if the deposit was done succesfully
 */
router.post('/deposit/:userId', getProfile, async (req, res, next) => {
    try {
        const { userId  } = req.params
        const { id: fromId } = req.profile;
        const { amount } = req.body;
        await deposit(Number(fromId), Number(userId), amount);
        return res.status(200).end();
    } catch(err) {
        return next(err);
    }
});


module.exports = router;