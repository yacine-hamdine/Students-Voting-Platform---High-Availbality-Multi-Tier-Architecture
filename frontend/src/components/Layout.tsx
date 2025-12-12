import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
    const { auth, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="container">
            <nav className="glass-panel" style={{ padding: '1rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, background: 'linear-gradient(to right, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    VotePlatform
                </h2>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    {auth.accessToken ? (
                        <>
                            <Link to="/" style={{ color: '#e2e8f0', textDecoration: 'none', fontWeight: 500 }}>Vote</Link>
                            <Link to="/results" style={{ color: '#e2e8f0', textDecoration: 'none', fontWeight: 500 }}>Results</Link>
                            <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid #cbd5e1', color: '#cbd5e1', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer' }}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link to="/login" style={{ color: '#e2e8f0', textDecoration: 'none' }}>Login</Link>
                    )}
                </div>
            </nav>
            <Outlet />
        </div>
    );
};
export default Layout;
