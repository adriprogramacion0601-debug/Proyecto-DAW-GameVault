import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ListPlus, Trash2, Search, Plus, Image as ImageIcon, Lock, Globe } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

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
                toast.error('Error al cargar tus listas');
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
            toast.success('Lista creada exitosamente');
        } catch (err) {
            toast.error('Error al crear la lista');
        }
    };

    const eliminarLista = async (listaId) => {
        if (!confirm('¿Eliminar esta lista permanentemente?')) return;
        try {
            await api.delete(`/listas/${listaId}`);
            setListas(prev => prev.filter(l => l.id !== listaId));
            if (listaSeleccionada?.id === listaId) {
                setListaSeleccionada(null);
                setJuegosLista([]);
            }
            toast.info('Lista eliminada');
        } catch (err) {
            toast.error('Error al eliminar la lista');
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
            toast.error('Error al cargar los juegos de la lista');
        }
    };

    const eliminarJuegoDeLista = async (listaId, juegoId) => {
        try {
            await api.delete(`/listas/${listaId}/juegos/${juegoId}`);
            setJuegosLista(prev => prev.filter(e => e.juego.id !== juegoId));
            toast.info('Juego retirado de la lista');
        } catch (err) {
            toast.error('Error al eliminar el juego de la lista');
        }
    };

    const buscarParaLista = async (e) => {
        e.preventDefault();
        if (!busquedaLista.trim()) return;
        try {
            const res = await api.get(`/juegos/buscar?nombre=${busquedaLista}`);
            setResultadosBusqueda(res.data.results || []);
            if (res.data.results?.length === 0) toast.info('No se encontraron resultados');
        } catch (err) {
            toast.error('Error en la búsqueda');
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
            toast.success('Juego añadido a la lista');
        } catch (err) {
            toast.warning('El juego ya se encuentra en esta lista');
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/50 pb-6">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight mb-2">Mis Listas</h1>
                    <p className="text-muted-foreground text-lg">Organiza tus juegos en colecciones personalizadas</p>
                </div>
                <Button onClick={() => setMostrarForm(!mostrarForm)} className="shadow-md hover:shadow-primary/20 transition-all hover:-translate-y-0.5">
                    <ListPlus className="w-4 h-4 mr-2" />
                    Nueva Lista
                </Button>
            </div>

            <AnimatePresence>
                {mostrarForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, y: -20 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -20 }}
                        className="overflow-hidden"
                    >
                        <Card className="border-primary/30 bg-primary/5 shadow-inner">
                            <CardHeader>
                                <CardTitle>Crear nueva lista</CardTitle>
                                <CardDescription>Dale un nombre y descripción a tu nueva colección.</CardDescription>
                            </CardHeader>
                            <form onSubmit={crearLista}>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Nombre de la lista</label>
                                        <Input
                                            value={form.nombre}
                                            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                                            required
                                            placeholder="Ej: Juegos para el verano"
                                            className="bg-background"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Descripción (opcional)</label>
                                        <Input
                                            value={form.descripcion}
                                            onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                                            placeholder="Agrega detalles sobre esta lista"
                                            className="bg-background"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Visibilidad</label>
                                        <select
                                            value={form.publica}
                                            onChange={(e) => setForm({ ...form, publica: e.target.value })}
                                            className="w-full bg-background border border-input text-foreground text-sm rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                                        >
                                            <option value="true">Pública (Cualquiera puede verla)</option>
                                            <option value="false">Privada (Solo tú puedes verla)</option>
                                        </select>
                                    </div>
                                </CardContent>
                                <CardFooter className="gap-2">
                                    <Button type="submit">Guardar Lista</Button>
                                    <Button type="button" variant="ghost" onClick={() => setMostrarForm(false)}>Cancelar</Button>
                                </CardFooter>
                            </form>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {loading ? (
                <div className="flex justify-center p-12"><span className="animate-pulse text-muted-foreground text-lg">Cargando listas...</span></div>
            ) : listas.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-24 text-muted-foreground border-2 border-dashed rounded-3xl border-muted bg-card/20">
                    <ListPlus className="w-16 h-16 opacity-20 mb-4" />
                    <p className="text-2xl font-semibold text-foreground">No tienes listas</p>
                    <p className="mt-2 text-lg">Empieza creando tu primera colección</p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Sidebar de Listas */}
                    <div className="md:col-span-4 lg:col-span-3 space-y-3">
                        {listas.map((lista, idx) => (
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }} 
                                animate={{ opacity: 1, x: 0 }} 
                                transition={{ delay: idx * 0.05 }}
                                key={lista.id}
                            >
                                <Card 
                                    className={`cursor-pointer transition-all hover:border-primary/50 bg-card/60 backdrop-blur-sm ${listaSeleccionada?.id === lista.id ? 'border-primary ring-1 ring-primary shadow-md shadow-primary/10 bg-card' : ''}`}
                                    onClick={() => verJuegosLista(lista)}
                                >
                                    <CardHeader className="p-4 pb-2">
                                        <div className="flex justify-between items-start gap-2">
                                            <CardTitle className="text-base leading-tight font-semibold line-clamp-2">
                                                {lista.nombre}
                                            </CardTitle>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10 -mt-1 -mr-1"
                                                onClick={(e) => { e.stopPropagation(); eliminarLista(lista.id); }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <CardDescription className="line-clamp-2 text-xs mt-1">
                                            {lista.descripcion || 'Sin descripción'}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-4 pt-2">
                                        <span className="inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-wider bg-secondary text-secondary-foreground px-2 py-0.5 rounded-sm">
                                            {lista.publica ? <Globe className="w-3 h-3 text-primary" /> : <Lock className="w-3 h-3 text-muted-foreground" />}
                                            {lista.publica ? 'Pública' : 'Privada'}
                                        </span>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {/* Contenido de la Lista */}
                    <div className="md:col-span-8 lg:col-span-9">
                        <AnimatePresence mode="wait">
                            {listaSeleccionada ? (
                                <motion.div 
                                    key={listaSeleccionada.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                >
                                    <Card className="border-border/50 shadow-sm bg-card/50 backdrop-blur-md">
                                        <CardHeader className="border-b border-border/50 bg-muted/20 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                            <CardTitle className="text-3xl relative z-10">{listaSeleccionada.nombre}</CardTitle>
                                            <CardDescription className="text-base relative z-10">{listaSeleccionada.descripcion}</CardDescription>
                                        </CardHeader>
                                        <CardContent className="p-6 space-y-6">
                                            <form onSubmit={buscarParaLista} className="flex gap-2">
                                                <div className="relative flex-1 group">
                                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                                    <Input
                                                        value={busquedaLista}
                                                        onChange={(e) => setBusquedaLista(e.target.value)}
                                                        placeholder="Buscar juego para añadir..."
                                                        className="pl-9 bg-background focus-visible:ring-primary"
                                                    />
                                                </div>
                                                <Button type="submit">Buscar</Button>
                                            </form>

                                            {resultadosBusqueda.length > 0 && (
                                                <div className="border border-border/50 rounded-lg divide-y divide-border/50 overflow-hidden max-h-[300px] overflow-y-auto bg-card shadow-inner">
                                                    {resultadosBusqueda.map((juego) => (
                                                        <div key={juego.id} className="flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors">
                                                            {juego.background_image ? (
                                                                <img src={juego.background_image} alt={juego.name} className="w-12 h-12 object-cover rounded shadow-sm" />
                                                            ) : (
                                                                <div className="w-12 h-12 bg-muted rounded flex items-center justify-center"><ImageIcon className="w-4 h-4 opacity-50" /></div>
                                                            )}
                                                            <span className="flex-1 font-medium text-sm line-clamp-1">{juego.name}</span>
                                                            <Button size="sm" variant="secondary" onClick={() => anadirJuegoALista(juego.id)}>
                                                                <Plus className="w-4 h-4 mr-1" /> Añadir
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="pt-4">
                                                <h3 className="font-semibold text-xl mb-4 flex items-center gap-2">
                                                    Juegos en la lista <span className="text-primary text-sm font-bold bg-primary/10 px-2 py-0.5 rounded-full">{juegosLista.length}</span>
                                                </h3>
                                                
                                                {juegosLista.length === 0 ? (
                                                    <div className="text-center py-16 bg-muted/20 rounded-xl border border-dashed border-border/50">
                                                        <p className="text-muted-foreground">Esta lista está vacía.</p>
                                                    </div>
                                                ) : (
                                                    <div className="grid gap-3">
                                                        {juegosLista.map((entrada, idx) => (
                                                            <motion.div 
                                                                initial={{ opacity: 0, x: 20 }} 
                                                                animate={{ opacity: 1, x: 0 }} 
                                                                transition={{ delay: idx * 0.05 }}
                                                                key={entrada.id} 
                                                                className="flex items-center gap-4 border border-border/50 rounded-xl p-3 hover:border-primary/40 hover:shadow-sm transition-all bg-card/80 group"
                                                            >
                                                                <Link to={`/juego/${entrada.juego.rawgId}`} className="contents">
                                                                    {entrada.juego?.imagen ? (
                                                                        <img src={entrada.juego.imagen} alt={entrada.juego.titulo} className="w-16 h-16 object-cover rounded-lg shadow-sm" />
                                                                    ) : (
                                                                        <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center"><ImageIcon className="w-6 h-6 opacity-30" /></div>
                                                                    )}
                                                                    <div className="flex-1 min-w-0 cursor-pointer">
                                                                        <p className="font-semibold text-base truncate group-hover:text-primary transition-colors">{entrada.juego?.titulo}</p>
                                                                        <p className="text-sm text-muted-foreground truncate">{entrada.juego?.genero || 'Sin género'}</p>
                                                                    </div>
                                                                </Link>
                                                                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={() => eliminarJuegoDeLista(listaSeleccionada.id, entrada.juego.id)}>
                                                                    <Trash2 className="w-5 h-5" />
                                                                </Button>
                                                            </motion.div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    key="empty"
                                    initial={{ opacity: 0 }} 
                                    animate={{ opacity: 1 }} 
                                    className="h-full flex flex-col items-center justify-center py-32 text-muted-foreground border border-dashed rounded-3xl border-muted bg-card/20"
                                >
                                    <ListPlus className="w-16 h-16 opacity-20 mb-4" />
                                    <p className="text-xl">Selecciona una lista en el panel lateral</p>
                                    <p className="text-sm mt-2">Podrás añadir juegos y ver su contenido</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            )}
        </div>
    );
}