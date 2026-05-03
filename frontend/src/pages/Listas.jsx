import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';

export default function Listas() {
    const [listas, setListas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mostrarForm, setMostrarForm] = useState(false);
    const [listaSeleccionada, setListaSeleccionada] = useState(null);
    const [juegosLista, setJuegosLista] = useState([]);
    const [form, setForm] = useState({ nombre: '', descripcion: '', publica: 'true' });
    const [busquedaLista, setBusquedaLista] = useState('');
    const [resultadosBusqueda, setResultadosBusqueda] = useState([]);

    useEffect(() => {
        const fetchListas = async () => {
            try {
                const res = await api.get('/listas');
                setListas(res.data);
            } catch (err) {
                console.error('Error al cargar listas');
            } finally {
                setLoading(false);
            }
        };
        fetchListas();
    }, []);

    const crearLista = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/listas', form);
            setListas(prev => [...prev, res.data]);
            setForm({ nombre: '', descripcion: '', publica: 'true' });
            setMostrarForm(false);
        } catch (err) {
            console.error('Error al crear lista');
        }
    };

    const eliminarLista = async (listaId) => {
        if (!confirm('¿Eliminar esta lista?')) return;
        try {
            await api.delete(`/listas/${listaId}`);
            setListas(prev => prev.filter(l => l.id !== listaId));
            if (listaSeleccionada?.id === listaId) {
                setListaSeleccionada(null);
                setJuegosLista([]);
            }
        } catch (err) {
            console.error('Error al eliminar lista');
        }
    };

    const verJuegosLista = async (lista) => {
        setListaSeleccionada(lista);
        setResultadosBusqueda([]);
        setBusquedaLista('');
        try {
            const res = await api.get(`/listas/${lista.id}/juegos`);
            setJuegosLista(res.data);
        } catch (err) {
            console.error('Error al cargar juegos de la lista');
        }
    };

    const eliminarJuegoDeLista = async (listaId, juegoId) => {
        try {
            await api.delete(`/listas/${listaId}/juegos/${juegoId}`);
            setJuegosLista(prev => prev.filter(e => e.juego.id !== juegoId));
        } catch (err) {
            console.error('Error al eliminar juego de la lista', err.response?.data);
            alert('Error al eliminar el juego de la lista');
        }
    };

    const buscarParaLista = async (e) => {
        e.preventDefault();
        if (!busquedaLista.trim()) return;
        try {
            const res = await api.get(`/juegos/buscar?nombre=${busquedaLista}`);
            setResultadosBusqueda(res.data.results || []);
        } catch (err) {
            console.error('Error al buscar');
        }
    };

    const anadirJuegoALista = async (rawgId) => {
        try {
            const resJuego = await api.post(`/juegos/guardar/${rawgId}`);
            const juegoId = resJuego.data.id;
            await api.post(`/listas/${listaSeleccionada.id}/juegos`, {
                juegoId: String(juegoId)
            });
            const res = await api.get(`/listas/${listaSeleccionada.id}/juegos`);
            setJuegosLista(res.data);
            setResultadosBusqueda([]);
            setBusquedaLista('');
        } catch (err) {
            alert('El juego ya está en esta lista');
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <div className="max-w-6xl mx-auto px-6 py-10">
                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-4xl font-bold text-gray-900">Mis Listas</h1>
                    <button
                        onClick={() => setMostrarForm(!mostrarForm)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                    >
                        + Nueva lista
                    </button>
                </div>
                <p className="text-gray-500 mb-8">Organiza tus juegos en listas personalizadas</p>

                {/* Formulario nueva lista */}
                {mostrarForm && (
                    <form onSubmit={crearLista} className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8">
                        <h2 className="text-gray-900 font-semibold mb-4">Nueva lista</h2>
                        <div className="flex flex-col gap-3">
                            <input
                                type="text"
                                placeholder="Nombre de la lista"
                                value={form.nombre}
                                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                                className="bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                required
                            />
                            <input
                                type="text"
                                placeholder="Descripción (opcional)"
                                value={form.descripcion}
                                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                                className="bg-white border border-gray-200 text-gray-900 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                            <select
                                value={form.publica}
                                onChange={(e) => setForm({ ...form, publica: e.target.value })}
                                className="bg-white border border-gray-200 text-gray-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="true">Pública</option>
                                <option value="false">Privada</option>
                            </select>
                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg text-sm transition"
                                >
                                    Crear lista
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMostrarForm(false)}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-6 py-2 rounded-lg text-sm transition"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    </form>
                )}

                {loading ? (
                    <div className="text-center text-gray-400 mt-20">Cargando...</div>
                ) : listas.length === 0 ? (
                    <div className="text-center text-gray-400 mt-20">
                        <p className="text-xl mb-2">No tienes listas todavía</p>
                        <p className="text-sm">Crea tu primera lista con el botón de arriba</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Panel izquierdo — listas */}
                        <div className="flex flex-col gap-3">
                            {listas.map((lista) => (
                                <div
                                    key={lista.id}
                                    className={`border rounded-xl p-4 cursor-pointer transition ${
                                        listaSeleccionada?.id === lista.id
                                            ? 'border-purple-400 bg-purple-50'
                                            : 'border-gray-200 bg-white hover:border-gray-300'
                                    }`}
                                    onClick={() => verJuegosLista(lista)}
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-gray-900 font-semibold">{lista.nombre}</h3>
                                            {lista.descripcion && (
                                                <p className="text-gray-500 text-sm mt-1">{lista.descripcion}</p>
                                            )}
                                            <span className={`text-xs mt-2 inline-block px-2 py-1 rounded-full ${
                                                lista.publica
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-100 text-gray-600'
                                            }`}>
                                                {lista.publica ? 'Pública' : 'Privada'}
                                            </span>
                                        </div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); eliminarLista(lista.id); }}
                                            className="text-gray-400 hover:text-red-500 text-sm transition"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Panel derecho — juegos de la lista */}
                        <div>
                            {listaSeleccionada ? (
                                <div>
                                    <h2 className="text-gray-900 font-semibold text-lg mb-4">
                                        {listaSeleccionada.nombre}
                                    </h2>

                                    {/* Buscador para añadir juegos */}
                                    <form onSubmit={buscarParaLista} className="flex gap-2 mb-4">
                                        <input
                                            type="text"
                                            value={busquedaLista}
                                            onChange={(e) => setBusquedaLista(e.target.value)}
                                            placeholder="Buscar juego para añadir..."
                                            className="flex-1 bg-gray-100 text-gray-900 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        />
                                        <button
                                            type="submit"
                                            className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-3 py-2 rounded-lg transition"
                                        >
                                            Buscar
                                        </button>
                                    </form>

                                    {/* Resultados búsqueda */}
                                    {resultadosBusqueda.length > 0 && (
                                        <div className="border border-gray-200 rounded-xl mb-4 max-h-48 overflow-y-auto">
                                            {resultadosBusqueda.map((juego) => (
                                                <div
                                                    key={juego.id}
                                                    className="flex items-center gap-3 p-3 hover:bg-gray-50 border-b border-gray-100 last:border-0"
                                                >
                                                    {juego.background_image ? (
                                                        <img
                                                            src={juego.background_image}
                                                            alt={juego.name}
                                                            className="w-12 h-9 object-cover rounded"
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-9 bg-gray-100 rounded" />
                                                    )}
                                                    <p className="flex-1 text-gray-900 text-sm truncate">{juego.name}</p>
                                                    <button
                                                        onClick={() => anadirJuegoALista(juego.id)}
                                                        className="text-purple-600 hover:text-purple-800 text-sm font-medium transition"
                                                    >
                                                        + Añadir
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Juegos de la lista */}
                                    {juegosLista.length === 0 ? (
                                        <p className="text-gray-400 text-sm">Esta lista no tiene juegos todavía.</p>
                                    ) : (
                                        <div className="flex flex-col gap-3">
                                            {juegosLista.map((entrada) => (
                                                <div
                                                    key={entrada.id}
                                                    className="flex items-center gap-3 border border-gray-200 rounded-xl p-3"
                                                >
                                                    {entrada.juego?.imagen ? (
                                                        <img
                                                            src={entrada.juego.imagen}
                                                            alt={entrada.juego.titulo}
                                                            className="w-16 h-12 object-cover rounded-lg"
                                                        />
                                                    ) : (
                                                        <div className="w-16 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                                            <svg width="24" height="17" viewBox="0 0 28 20" fill="none">
                                                                <rect x="0" y="4" width="28" height="14" rx="5" fill="#d1d5db"/>
                                                                <rect x="0" y="1" width="8" height="5" rx="2" fill="#d1d5db"/>
                                                                <rect x="20" y="1" width="8" height="5" rx="2" fill="#d1d5db"/>
                                                            </svg>
                                                        </div>
                                                    )}
                                                    <div className="flex-1">
                                                        <p className="text-gray-900 text-sm font-medium truncate">
                                                            {entrada.juego?.titulo}
                                                        </p>
                                                        <p className="text-gray-400 text-xs">{entrada.juego?.genero}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            console.log('listaId:', listaSeleccionada.id, 'juegoId:', entrada.juego.id);
                                                            eliminarJuegoDeLista(listaSeleccionada.id, entrada.juego.id);
                                                        }}
                                                        className="text-gray-400 hover:text-red-500 transition text-sm"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center text-gray-400 mt-10">
                                    <p className="text-sm">Selecciona una lista para ver sus juegos</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}