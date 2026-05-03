import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="max-w-6xl mx-auto flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-3">
                    <div className="bg-purple-600 rounded-xl p-2">
                        <svg width="28" height="20" viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="0" y="4" width="28" height="14" rx="5" fill="white"/>
                            <rect x="0" y="1" width="8" height="5" rx="2" fill="white"/>
                            <rect x="20" y="1" width="8" height="5" rx="2" fill="white"/>
                            <circle cx="8" cy="11" r="4" fill="#7C3AED"/>
                            <circle cx="8" cy="11" r="2" fill="white"/>
                            <circle cx="21" cy="8" r="2" fill="#ec4899"/>
                            <circle cx="25" cy="12" r="2" fill="#3b82f6"/>
                            <circle cx="21" cy="16" r="2" fill="#22c55e"/>
                            <circle cx="17" cy="12" r="2" fill="#f59e0b"/>
                        </svg>
                    </div>
                    <div>
                        <span className="text-lg font-bold text-gray-900 tracking-tight">Game</span>
                        <span className="text-lg font-bold text-purple-600 tracking-tight">Vault</span>
                    </div>
                </Link>

                {/* Enlaces */}
                <div className="flex items-center gap-6">
                    <Link
                        to="/"
                        className="text-gray-600 hover:text-gray-900 transition text-sm font-medium"
                    >
                        Inicio
                    </Link>
                    <Link
                        to="/biblioteca"
                        className="text-gray-600 hover:text-gray-900 transition text-sm font-medium"
                    >
                        Mi Biblioteca
                    </Link>
                    <Link
                        to="/listas"
                        className="text-gray-600 hover:text-gray-900 transition text-sm font-medium"
                    >
                        Mis Listas
                    </Link>
                    <Link
                        to="/amigos"
                        className="text-gray-600 hover:text-gray-900 transition text-sm font-medium"
                    >
                        Amigos
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600 border border-gray-200 hover:border-red-200 px-4 py-2 rounded-lg transition text-sm font-medium"
                    >
                        Cerrar sesión
                    </button>
                </div>
            </div>
        </nav>
    );
}