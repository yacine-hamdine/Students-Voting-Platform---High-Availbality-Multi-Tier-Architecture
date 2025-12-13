import { useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const [selectedCandidate, setSelectedCandidate] = useState('');
    const [loading, setLoading] = useState(false);

    const candidates = ['Candidate 1', 'Candidate 2'];

    const handleVote = async () => {
        if (!selectedCandidate) return;
        setLoading(true);
        try {
            await axiosPrivate.post('/votes', { candidate: selectedCandidate });
            navigate('/results');
        } catch (error: any) {
            console.error(error);
            if (error.response?.status === 403) {
                alert('You have already voted!');
            } else {
                alert('Failed to cast vote. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: 800, background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '1rem' }}>
                    Cast Your Vote
                </h1>
                <p style={{ color: '#94a3b8', fontSize: '1.2rem' }}>Select your representative for the student council.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                {candidates.map(candidate => (
                    <div
                        key={candidate}
                        className="glass-panel"
                        style={{
                            padding: '2.5rem',
                            cursor: 'pointer',
                            border: selectedCandidate === candidate ? '2px solid #6366f1' : '1px solid var(--glass-border)',
                            background: selectedCandidate === candidate ? 'rgba(99, 102, 241, 0.1)' : 'var(--glass-bg)',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}
                        onClick={() => setSelectedCandidate(candidate)}
                    >
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <span style={{ fontSize: '1.5rem' }}>{candidate.charAt(candidate.length - 1)}</span>
                        </div>
                        <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{candidate}</h3>
                    </div>
                ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                <button
                    className="btn-primary"
                    style={{ fontSize: '1.2rem', padding: '1rem 3rem', opacity: selectedCandidate ? 1 : 0.5, pointerEvents: selectedCandidate ? 'auto' : 'none' }}
                    disabled={!selectedCandidate || loading}
                    onClick={handleVote}
                >
                    {loading ? 'Submitting...' : 'Confirm Vote'}
                </button>
            </div>
        </div>
    );
};
export default Dashboard;
