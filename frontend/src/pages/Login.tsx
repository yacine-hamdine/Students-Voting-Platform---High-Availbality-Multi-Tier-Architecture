import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { setAuth } = useAuth();
    const navigate = useNavigate();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            const endpoint = isRegistering ? '/auth/register' : '/auth/login';
            const response = await api.post(endpoint, { username: user, password: pwd });

            if (isRegistering) {
                setIsRegistering(false);
                setError('Registration successful! Please login.');
                setUser('');
                setPwd('');
            } else {
                const accessToken = response.data.accessToken;
                setAuth({ user: { username: user }, accessToken });
                navigate('/');
            }
        } catch (err: any) {
            if (!err?.response) {
                setError('No Server Response');
            } else if (err.response?.status === 400) {
                setError('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setError('Invalid Credentials');
            } else if (err.response?.status === 409) {
                setError('Username Taken');
            } else {
                setError('Action Failed');
            }
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
            <div className="glass-panel" style={{ padding: '2.5rem', width: '100%', maxWidth: '400px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}>
                    {isRegistering ? 'Join Us' : 'Welcome Back'}
                </h2>
                {error && <div style={{ background: 'rgba(236, 72, 153, 0.2)', border: '1px solid rgba(236, 72, 153, 0.5)', borderRadius: '8px', padding: '0.75rem', marginBottom: '1rem', color: '#fbcfe8', textAlign: 'center' }}>{error}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <input
                            type="text"
                            className="input-field"
                            placeholder="Student ID / Username"
                            value={user}
                            onChange={(e) => setUser(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            className="input-field"
                            placeholder="Password"
                            value={pwd}
                            onChange={(e) => setPwd(e.target.value)}
                            required
                        />
                    </div>
                    <button className="btn-primary" type="submit" style={{ marginTop: '0.5rem' }}>
                        {isRegistering ? 'Sign Up' : 'Sign In'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#94a3b8' }}>
                    {isRegistering ? 'Already have an account? ' : "Don't have an account? "}
                    <span
                        onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
                        style={{ color: '#818cf8', cursor: 'pointer', fontWeight: 600 }}
                    >
                        {isRegistering ? 'Login' : 'Register'}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Login;
