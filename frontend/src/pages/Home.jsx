import { useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';

export default function Home() {
    const [busqueda, setBusqueda] = useState('');
    const [juegos, setJuegos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const buscarJuegos = async (e) => {
        e.preventDefault();
        if (!busqueda.trim()) return;
        setLoading(true);
        setError('');
        try {
            const res = await api.get(`/juegos/buscar?nombre=${busqueda}`);
            setJuegos(res.data.results || []);
        } catch (err) {
            setError('Error al buscar juegos');
        } finally {
            setLoading(false);
        }
    };

    const anadirABiblioteca = async (rawgId) => {
        try {
            const resJuego = await api.post(`/juegos/guardar/${rawgId}`);
            const juegoId = resJuego.data.id;
            await api.post('/biblioteca', {
                juegoId: String(juegoId),
                estado: 'pendiente'
            });
            alert('Juego añadido a tu biblioteca');
        } catch (err) {
            if (err.response?.status === 500) {
                alert('Este juego ya está en tu biblioteca');
            } else {
                alert('Error al añadir el juego');
            }
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <div className="max-w-6xl mx-auto px-6 py-10">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    Descubre juegos
                </h1>
                <p className="text-gray-500 mb-8">
                    Busca cualquier videojuego y añádelo a tu biblioteca
                </p>

                {/* Buscador */}
                <form onSubmit={buscarJuegos} className="flex gap-3 mb-10">
                    <input
                        type="text"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        placeholder="Buscar juego... (ej: Minecraft, GTA, Zelda)"
                        className="flex-1 bg-gray-100 text-gray-900 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition disabled:opacity-50"
                    >
                        {loading ? 'Buscando...' : 'Buscar'}
                    </button>
                </form>

                {error && (
                    <p className="text-red-500 mb-4">{error}</p>
                )}

                {/* Resultados */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {juegos.map((juego) => (
                        <div
                            key={juego.id}
                            className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
                        >
                            {/* Imagen */}
                            {juego.background_image ? (
                                <img
                                    src={juego.background_image}
                                    alt={juego.name}
                                    className="w-full h-40 object-cover"
                                />
                            ) : (
                                <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
                                    <svg width="48" height="34" viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect x="0" y="4" width="28" height="14" rx="5" fill="#d1d5db"/>
                                        <rect x="0" y="1" width="8" height="5" rx="2" fill="#d1d5db"/>
                                        <rect x="20" y="1" width="8" height="5" rx="2" fill="#d1d5db"/>
                                        <circle cx="8" cy="11" r="4" fill="#e5e7eb"/>
                                        <circle cx="8" cy="11" r="2" fill="#d1d5db"/>
                                        <circle cx="21" cy="8" r="2" fill="#ec4899"/>
                                        <circle cx="25" cy="12" r="2" fill="#3b82f6"/>
                                        <circle cx="21" cy="16" r="2" fill="#22c55e"/>
                                        <circle cx="17" cy="12" r="2" fill="#f59e0b"/>
                                    </svg>
                                </div>
                            )}

                            {/* Info */}
                            <div className="p-4">
                                <h3 className="text-gray-900 font-semibold text-sm mb-1 truncate">
                                    {juego.name}
                                </h3>
                                <p className="text-gray-400 text-xs mb-1">
                                    {juego.released || 'Fecha desconocida'}
                                </p>
                                <div className="flex items-center gap-1 mb-3">
                                    <span className="text-yellow-400 text-xs">⭐</span>
                                    <span className="text-gray-500 text-xs">{juego.rating}</span>
                                </div>
                                <button
                                    onClick={() => anadirABiblioteca(juego.id)}
                                    className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm py-2 rounded-lg transition"
                                >
                                    + Añadir a biblioteca
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {juegos.length === 0 && !loading && (
                    <div className="text-center text-gray-400 mt-20">
                        <div className="flex justify-center mb-4">
                            <svg width="80" height="57" viewBox="0 0 28 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="0" y="4" width="28" height="14" rx="5" fill="#d1d5db"/>
                                <rect x="0" y="1" width="8" height="5" rx="2" fill="#d1d5db"/>
                                <rect x="20" y="1" width="8" height="5" rx="2" fill="#d1d5db"/>
                                <circle cx="8" cy="11" r="4" fill="#e5e7eb"/>
                                <circle cx="8" cy="11" r="2" fill="#d1d5db"/>
                                <circle cx="21" cy="8" r="2" fill="#ec4899"/>
                                <circle cx="25" cy="12" r="2" fill="#3b82f6"/>
                                <circle cx="21" cy="16" r="2" fill="#22c55e"/>
                                <circle cx="17" cy="12" r="2" fill="#f59e0b"/>
                            </svg>
                        </div>
                        <p className="text-xl">Busca un juego para empezar</p>
                    </div>
                )}
            </div>
        </div>
    );
}