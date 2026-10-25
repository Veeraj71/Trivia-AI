const db = require('../config/db');

exports.getGlobalLeaderboard = async (req, res) => {
    try {
        const { tier, page = 1, limit = 50 } = req.query;
        const safeLimit = Math.max(1, parseInt(limit, 10) || 50);
        const safeOffset = Math.max(0, ((parseInt(page, 10) || 1) - 1) * safeLimit);

        let query = `
      SELECT p.*, u.name, u.profile_picture
      FROM player p
      JOIN users u ON p.user_id = u.id
      WHERE p.status = 'ACTIVE'
    `;
        const params = [];

        if (tier) {
            query += ' AND p.tier = ?';
            params.push(tier);
        }

        query += ` ORDER BY p.xp DESC LIMIT ${safeLimit} OFFSET ${safeOffset}`;

        const [leaderboard] = await db.execute(query, params);

        // Add rank numbers
        const rankedLeaderboard = leaderboard.map((player, index) => ({
            ...player,
            rank: safeOffset + index + 1
        }));

        res.json({ success: true, leaderboard: rankedLeaderboard });
    } catch (error) {
        console.error('Get global leaderboard error:', error);
        res.status(500).json({ success: false, message: 'Failed to get leaderboard' });
    }
};

exports.getContestLeaderboard = async (req, res) => {
    try {
        const { id } = req.params;
        const { mode, page = 1, limit = 50 } = req.query;
        const safeLimit = Math.max(1, parseInt(limit, 10) || 50);
        const safeOffset = Math.max(0, ((parseInt(page, 10) || 1) - 1) * safeLimit);

        // Check if contest exists and leaderboard is not frozen
        const [contests] = await db.execute('SELECT * FROM contest WHERE id = ?', [id]);
        if (contests.length === 0) {
            return res.status(404).json({ success: false, message: 'Contest not found' });
        }

        let query = `
      SELECT cp.*, u.name, u.profile_picture, p.tier, p.sub_rank
      FROM contest_participant cp
      JOIN player p ON cp.player_id = p.id
      JOIN users u ON p.user_id = u.id
      WHERE cp.contest_id = ?
    `;
        const params = [id];

        if (mode) {
            query += ' AND cp.mode = ?';
            params.push(mode);
        }

        query += ` ORDER BY cp.final_rating DESC, cp.last_solved_at ASC LIMIT ${safeLimit} OFFSET ${safeOffset}`;

        const [leaderboard] = await db.execute(query, params);

        // Add rank numbers
        const rankedLeaderboard = leaderboard.map((entry, index) => ({
            ...entry,
            rank: safeOffset + index + 1
        }));

        res.json({
            success: true,
            leaderboard: rankedLeaderboard,
            frozen: contests[0].leaderboard_frozen
        });
    } catch (error) {
        console.error('Get contest leaderboard error:', error);
        res.status(500).json({ success: false, message: 'Failed to get leaderboard' });
    }
};