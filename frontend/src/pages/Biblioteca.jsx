import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';

const ESTADOS = ['jugando', 'completado', 'pendiente', 'abandonado'];

const coloresEstado = {
    jugando: 'bg-green-100 text-green-800',
    completado: 'bg-blue-100 text-blue-800',
    pendiente: 'bg-yellow-100 text-yellow-800',
    abandonado: 'bg-red-100 text-red-800',
};

export default function Biblioteca() {
    const [biblioteca, setBiblioteca] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState('todos');

    useEffect(() => {
        cargarBiblioteca();
    }, []);

    const cargarBiblioteca = async () => {
        try {
            const res = await api.get('/biblioteca');
            setBiblioteca(res.data);
        } catch (err) {
            console.error('Error al cargar biblioteca');
        } finally {
            setLoading(false);
        }
    };

    const cambiarEstado = async (juegoId, nuevoEstado) => {
        try {
            await api.put(`/biblioteca/${juegoId}`, { estado: nuevoEstado });
            cargarBiblioteca();
        } catch (err) {
            console.error('Error al cambiar estado');
        }
    };

    const eliminarJuego = async (juegoId) => {
        if (!confirm('¿Eliminar este juego de tu biblioteca?')) return;
        try {
            await api.delete(`/biblioteca/${juegoId}`);
            cargarBiblioteca();
        } catch (err) {
            console.error('Error al eliminar juego');
        }
    };

    const bibliotecaFiltrada = filtro === 'todos'
        ? biblioteca
        : biblioteca.filter(e => e.estado === filtro);

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <div className="max-w-6xl mx-auto px-6 py-10">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Mi Biblioteca</h1>
                <p className="text-gray-500 mb-8">Gestiona tu colección de videojuegos</p>

                {/* Filtros */}
                <div className="flex gap-3 mb-8 flex-wrap">
                    {['todos', ...ESTADOS].map((estado) => (
                        <button
                            key={estado}
                            onClick={() => setFiltro(estado)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition ${
                                filtro === estado
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {estado}
                        </button>
                    ))}
                </div>

                {/* Contenido */}
                {loading ? (
                    <div className="text-center text-gray-400 mt-20">Cargando...</div>
                ) : bibliotecaFiltrada.length === 0 ? (
                    <div className="text-center text-gray-400 mt-20">
                        <div className="flex justify-center mb-4">
                            <svg width="80" height="57" viewBox="0 0 28 20" fill="none">
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
                        <p className="text-xl">Tu biblioteca está vacía</p>
                        <p className="text-sm mt-2 text-gray-400">Busca juegos en la página de inicio y añádelos</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {bibliotecaFiltrada.map((entrada) => (
                            <div
                                key={entrada.id}
                                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
                            >
                                {/* Imagen */}
                                {entrada.juego?.imagen ? (
                                    <img
                                        src={entrada.juego.imagen}
                                        alt={entrada.juego.titulo}
                                        className="w-full h-40 object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
                                        <svg width="48" height="34" viewBox="0 0 28 20" fill="none">
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
                                    <h3 className="text-gray-900 font-semibold text-sm mb-2 truncate">
                                        {entrada.juego?.titulo}
                                    </h3>

                                    {/* Badge estado */}
                                    <span className={`text-xs px-2 py-1 rounded-full capitalize font-medium ${coloresEstado[entrada.estado]}`}>
                                        {entrada.estado}
                                    </span>

                                    {/* Selector de estado */}
                                    <select
                                        value={entrada.estado}
                                        onChange={(e) => cambiarEstado(entrada.juego.id, e.target.value)}
                                        className="w-full mt-3 bg-gray-100 text-gray-700 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    >
                                        {ESTADOS.map((estado) => (
                                            <option key={estado} value={estado}>{estado}</option>
                                        ))}
                                    </select>

                                    {/* Eliminar */}
                                    <button
                                        onClick={() => eliminarJuego(entrada.juego.id)}
                                        className="w-full mt-2 bg-gray-100 hover:bg-red-50 text-gray-500 hover:text-red-600 text-sm py-2 rounded-lg transition border border-gray-200 hover:border-red-200"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}