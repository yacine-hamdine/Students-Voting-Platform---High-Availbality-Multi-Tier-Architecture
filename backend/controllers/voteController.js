const { masterPool, slavePool } = require('../config/db');

exports.getResults = async (req, res) => {
    try {
        const [results] = await slavePool.execute('SELECT candidate, COUNT(*) as count FROM votes GROUP BY candidate');
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'DB Read Error' });
    }
};

exports.castVote = async (req, res) => {
    const { candidate } = req.body;
    if (!candidate) return res.status(400).json({ message: 'Candidate required' });

    try {
        await masterPool.execute('INSERT INTO votes (candidate) VALUES (?)', [candidate]);
        res.status(201).json({ message: 'Vote cast successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'DB Write Error', error: error.message });
    }
};
