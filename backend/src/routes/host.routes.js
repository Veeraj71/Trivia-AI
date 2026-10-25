const express = require('express');
const router = express.Router();
const db = require('../config/db');
const contestController = require('../controllers/contest.controller');
const problemController = require('../controllers/problem.controller');
const companyController = require('../controllers/company.controller');
const { protect, hostOrCompanyOnly } = require('../middleware/auth.middleware');

router.use(protect, hostOrCompanyOnly);

router.get('/me', async (req, res) => {
    try {
        const [rows] = await db.execute(
            'SELECT * FROM companies WHERE user_id = ?',
            [req.user.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Host profile not found' });
        }

        res.json({ success: true, ...rows[0], role: req.user.role, email: req.user.email, name: req.user.name });
    } catch (error) {
        console.error('Get host profile error:', error);
        res.status(500).json({ success: false, message: 'Failed to get host profile' });
    }
});

router.get('/company/profile', companyController.getCompanyProfile);

router.get('/contests', async (req, res) => {
    try {
        const [contests] = await db.execute(
            'SELECT * FROM contest WHERE created_by = ? ORDER BY start_time DESC',
            [req.user.id]
        );

        res.json({ success: true, contests });
    } catch (error) {
        console.error('Get host contests error:', error);
        res.status(500).json({ success: false, message: 'Failed to get host contests' });
    }
});

router.get('/contests/:id', contestController.getContest);
router.post('/contests', contestController.createContest);
router.put('/contests/:id', contestController.updateContest);

router.get('/problems', problemController.getAllProblems);
router.get('/problems/:id', problemController.getProblem);
router.post('/problems', problemController.createProblem);
router.put('/problems/:id', problemController.updateProblem);
router.delete('/problems/:id', problemController.deleteProblem);

module.exports = router;
