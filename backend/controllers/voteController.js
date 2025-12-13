const { masterPool, slavePool } = require('../config/db');

exports.getResults = async (req, res) => {
    try {
        const [results] = await slavePool.execute('SELECT name as candidate, vote_count as count FROM candidates ORDER BY vote_count DESC');
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'DB Read Error', error: error.message });
    }
};

exports.castVote = async (req, res) => {
    const { candidate } = req.body;
    // req.user is set by verifyToken middleware
    const userId = req.user ? req.user.id : null;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    if (!candidate) return res.status(400).json({ message: 'Candidate required' });

    let connection;
    try {
        connection = await masterPool.getConnection();
        await connection.beginTransaction();

        // Check if user has already voted
        const [voters] = await connection.execute('SELECT 1 FROM voters WHERE user_id = ? FOR UPDATE', [userId]);
        if (voters.length > 0) {
            await connection.rollback();
            return res.status(403).json({ message: 'You have already voted' });
        }

        // Check if candidate exists (optional validation but good practice)
        // For now, assuming names align with candidates table.
        const [candidateCheck] = await connection.execute('SELECT id FROM candidates WHERE name = ?', [candidate]);
        if (candidateCheck.length === 0) {
            await connection.rollback();
            return res.status(400).json({ message: 'Invalid candidate' });
        }

        // Increment vote count
        await connection.execute('UPDATE candidates SET vote_count = vote_count + 1 WHERE name = ?', [candidate]);

        // Record voter
        await connection.execute('INSERT INTO voters (user_id) VALUES (?)', [userId]);

        await connection.commit();
        res.status(201).json({ message: 'Vote cast successfully' });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error(error);
        res.status(500).json({ message: 'DB Write Error', error: error.message });
    } finally {
        if (connection) connection.release();
    }
};
