import { useEffect, useState } from 'react';
import { api } from '../api/axios';

const Results = () => {
    const [results, setResults] = useState<{ candidate: string, count: number }[]>([]);

    const fetchResults = async () => {
        try {
            const res = await api.get('/votes');
            // Assuming res.data is array of {candidate, count}
            setResults(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchResults();
        const interval = setInterval(fetchResults, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, []);

    const totalVotes = results.reduce((acc, curr) => acc + curr.count, 0);

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Live Results</h1>

            <div className="glass-panel" style={{ padding: '2rem' }}>
                {results.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#94a3b8' }}>No votes recorded yet.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {results.map((r) => {
                            const percentage = totalVotes ? Math.round((r.count / totalVotes) * 100) : 0;
                            return (
                                <div key={r.candidate}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <span style={{ fontWeight: 600 }}>{r.candidate}</span>
                                        <span style={{ color: '#cbd5e1' }}>{r.count} Votes ({percentage}%)</span>
                                    </div>
                                    <div style={{ width: '100%', height: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', overflow: 'hidden' }}>
                                        <div style={{
                                            width: `${percentage}%`,
                                            height: '100%',
                                            background: 'linear-gradient(90deg, #6366f1, #ec4899)',
                                            borderRadius: '6px',
                                            transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)'
                                        }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
                <div style={{ textAlign: 'center', marginTop: '2rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', color: '#64748b', fontSize: '0.85rem' }}>
                    Reads are served from the Replica Database (Slave) to ensure high availability.
                </div>
            </div>
        </div>
    );
};
export default Results;
