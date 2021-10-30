const { Router } = require('express');
const { getProfile } = require('../middleware/getProfile');
const { getUnpaidJobs, payJob } = require('../services/job');

const router = new Router();

/**
 * @api {get} /jobs/unpaid Returns all the unpaid jobs for the current user
 * @apiName GetUnpaidJobs
 * @apiGroup Users
 * @apiParam  {Number} profileId Current user's id
 * @apiSuccess {Object[]} User's unpaid jobs information
 */
router.get('/unpaid', getProfile,async (req, res) => {
    try {
        const { id }  = req.profile;
        const jobs = await getUnpaidJobs(id);
        res.json(jobs)
    } catch(err) {
        return next(err);
    }
});

/**
 * @api {post} /jobs/:job_id/pay Pay a specific job from its ID
 * @apiName PayJob
 * @apiGroup Users
 * @apiParam  {Number} job_id ID of job to pay
 * @apiParam  {Number} profileId Current user's id
 * @apiSuccess {Boolean} 200 if the job was payed succesfully
 */
router.post('/:job_id/pay', getProfile, async (req, res, next) => {
    try {
        const { job_id: jobId } = req.params;
        const { id: profileId }  = req.profile;
        await payJob(jobId, profileId);
        return res.status(200).end();
    } catch(err) {
        return next(err);
    }
});


module.exports = router;