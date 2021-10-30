const { Router } = require('express');
const { getProfile } = require('../middleware/getProfile');
const { getBestProfession, getBestClients } = require('../services/admin');



const router = new Router();

/**
 * @api {get} /admin/best-profession Returns the best profession (the one who was payed the most during the timeperiod)
 * @apiName GetBestProfession
 * @apiGroup Admins
 * @apiQuery {Date} start Start date to query from
 * @apiQuery {Date} end End date to query to
 * @apiSuccess {String} Name of the best profession based on money received.
 */
router.get('/best-profession', getProfile, async (req, res, next) => {
    try {
        const { start, end } = req.query;
        const best = await getBestProfession(start, end);
        res.json(best);
    } catch(err) {
        return next(err);
    } 
});

/**
 * @api {get} /admin/best-clients Returns best clients based on how much money they've paid in jobs
 * @apiName GetBestClients
 * @apiGroup Admins
 * @apiQuery {Date} start Start date to query from
 * @apiQuery {Date} end End date to query to
 * @apiQuery {Number} limit Top of how many clients to return
 * @apiSuccess {Object[]} List of best clients sorted by total amount of money paid in jobs.
 */
router.get('/best-clients', getProfile, async (req, res, next) =>{
    try {
        const { start, end } = req.query;
        limit = req.query.limit ? req.query.limit : 2;
        const clients = await getBestClients(start, end, limit);
        if(!clients) return res.status(404).end();
        res.json(clients);
    } catch(err) {
        return next(err);
    }
});

module.exports = router;